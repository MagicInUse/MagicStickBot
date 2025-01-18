import axios from 'axios';

class TwitchClient {
    private clientId: string;
    private clientSecret: string;
    private tokenUrl: string;
    private accessToken: string | null;
    private tokenExpiration: Date | null;
    private readonly TOKEN_REFRESH_BUFFER = 60 * 60 * 1000; // 1 hour before expiry

    constructor() {
        this.clientId = process.env.TWITCH_APP_CLIENT_ID!;
        this.clientSecret = process.env.TWITCH_APP_CLIENT_SECRET!;
        this.tokenUrl = process.env.TWITCH_CLIENT_TOKEN_URI!;
        this.accessToken = process.env.TWITCH_APP_ACCESS_TOKEN || null;
        this.tokenExpiration = process.env.TWITCH_APP_TOKEN_EXPIRATION 
            ? new Date(process.env.TWITCH_APP_TOKEN_EXPIRATION) 
            : null;
    }

    private isTokenExpired(): boolean {
        if (!this.tokenExpiration) return true;
        const now = new Date();
        return now.getTime() > (this.tokenExpiration.getTime() - this.TOKEN_REFRESH_BUFFER);
    }

    async login() {
        try {
            const response = await axios.post(this.tokenUrl, null, {
                params: {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    grant_type: 'client_credentials'
                }
            });

            this.accessToken = response.data.access_token;
            // Set expiration to 1 day from now
            this.tokenExpiration = new Date(Date.now() + (24 * 60 * 60 * 1000));
            
            // Update environment variables
            process.env.TWITCH_CLIENT_APP_TOKEN = this.accessToken!;
            process.env.TWITCH_APP_TOKEN_EXPIRATION = this.tokenExpiration.toISOString();

            console.log('Twitch App Client connected successfully');
            this.scheduleTokenRefresh();
        } catch (error) {
            console.error('Failed to log in:', error);
            throw error;
        }
    }

    private scheduleTokenRefresh() {
        if (!this.tokenExpiration) return;

        const refreshTime = this.tokenExpiration.getTime() - this.TOKEN_REFRESH_BUFFER;
        const now = Date.now();
        const delay = refreshTime - now;

        if (delay > 0) {
            setTimeout(() => this.login(), delay);
        }
    }

    async getAccessToken() {
        if (!this.accessToken || this.isTokenExpired()) {
            await this.login();
        }
        return this.accessToken;
    }

    async initialize() {
        if (this.accessToken && !this.isTokenExpired()) {
            this.scheduleTokenRefresh();
        } else {
            await this.login();
        }
    }
}

export default TwitchClient;
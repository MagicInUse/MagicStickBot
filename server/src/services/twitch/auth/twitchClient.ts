import axios from 'axios';

class TwitchClient {
    private clientId: string;
    private clientSecret: string;
    private tokenUrl: string;
    private accessToken: string | null;
    private tokenExpiration: Date | null;
    private readonly TOKEN_REFRESH_BUFFER = 30 * 60 * 1000; // 30m before 24h

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
            this.tokenExpiration = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 30 days

            // Update environment variables
            process.env.TWITCH_CLIENT_APP_ACCESS_TOKEN = this.accessToken!;
            process.env.TWITCH_CLIENT_APP_TOKEN_EXPIRATION = this.tokenExpiration.toISOString();

            console.log('Twitch App Client connected successfully');
        } catch (error) {
            console.error('Failed to log in:', error);
            throw error;
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
            console.log('Using existing token from environment');
            return;
        }
        await this.login();
    }
}

export default TwitchClient;
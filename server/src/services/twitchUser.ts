import axios from 'axios';

class TwitchUserClient {
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;
    private tokenUrl: string;
    private accessToken: string | null;
    private scopes: string[] = ['user:read:email'];

    constructor() {
        this.clientId = process.env.TWITCH_APP_CLIENT_ID!;
        this.clientSecret = process.env.TWITCH_APP_CLIENT_SECRET!;
        this.redirectUri = process.env.TWITCH_REDIRECT_URI!;
        this.tokenUrl = process.env.TWITCH_CLIENT_TOKEN_URI!;
        this.accessToken = null;
    }

    getAuthorizationUrl(state: string) {
        const baseUrl = process.env.TWITCH_USER_TOKEN_URI!;
        const params = new URLSearchParams({
            client_id: this.clientId,
            force_verify: 'false',
            redirect_uri: this.redirectUri,
            response_type: 'code',
            scope: this.scopes.join(' '),
            state
        });

        return `${baseUrl}?${params.toString()}`;
    }

    async exchangeCodeForToken(code: string): Promise<string | null> {
        try {
            const response = await axios.post(this.tokenUrl, null, {
                params: {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: this.redirectUri,
                },
            });
    
            this.accessToken = response.data.access_token;
            console.log('Twitch User Client connected successfully');
            return this.accessToken || null;
        } catch (error: any) {
            console.error('Error exchanging code for token:', {
                message: (error).message,
                response: error.response?.data,
            });
            throw new Error('Failed to exchange code for token. Please try again.');
        }
    }

    async getAccessToken() {
        if (!this.accessToken) {
            throw new Error('Access token is not available. Please authenticate first.');
        }
        return this.accessToken;
    }
}

export default TwitchUserClient;
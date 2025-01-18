import axios from 'axios';
import { Request, Response } from 'express';

class TwitchUserClient {
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;
    private tokenUrl: string;
    private accessToken: string | null;
    private scopes: string[] = [
        // Declare required scopes here
        'user:read:email'
    ];

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

    async exchangeCodeForToken(code: string, res: Response): Promise<string | null> {
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
            
            // Set cookie with token
            res.cookie('user_access_token', this.accessToken, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            console.log('Twitch User Client connected successfully');
            return this.accessToken;
        } catch (error: any) {
            console.error('Error exchanging code for token:', error);
            throw error;
        }
    }

    async getAccessToken(req: Request): Promise<string> {
        const token = req.cookies.user_access_token;
        
        if (!token) {
            throw new Error('Access token not found. Please authenticate first.');
        }

        this.accessToken = token;
        return token;
    }
}

export default TwitchUserClient;
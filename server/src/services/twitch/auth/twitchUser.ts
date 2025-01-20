import axios from 'axios';
import { Request, Response } from 'express';

class TwitchUserClient {
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;
    private tokenUrl: string;
    private accessToken: string | null;
    private scopes: string[] = [
        // TODO: Declare all required scopes here
        // No, there is not a 'get all' scope
        // You should only request the scopes you need
        // Requesting unnecessary scopes can lead to your application being rejected
        // AND can lead to security vulnerabilities
        // Yes, it's annoying. Just do it.
        'user:read:email',
        'user:read:follows',
        'user:read:moderated_channels',
        'user:read:blocked_users',
        'user:write:chat',
        'user:bot',
        'channel:bot',
        'channel:edit:commercial',
        'channel:read:ads',
        'channel:read:vips',
        'channel:read:editors',
        'channel:read:charity',
        'channel:read:goals',
        'channel:read:hype_train',
        'channel:manage:ads',
        'channel:manage:broadcast',
        'channel:manage:redemptions',
        'channel:manage:polls',
        'channel:manage:predictions',
        'channel:manage:raids',
        'moderation:read',
        'moderator:read:chatters',
        'moderator:manage:chat_settings',
        'moderator:manage:announcements',
        'moderator:manage:shoutouts',
        'moderator:manage:banned_users',
        'moderator:manage:chat_messages',
        'bits:read'
    ];

    constructor() {
        this.clientId = process.env.TWITCH_APP_CLIENT_ID!;
        this.clientSecret = process.env.TWITCH_APP_CLIENT_SECRET!;
        this.redirectUri = process.env.TWITCH_REDIRECT_URI!;
        this.redirectUri = process.env.NODE_ENV === 'production' 
            ? process.env.TWITCH_REDIRECT_URI! 
            : 'https://localhost:5173/twitch/callback';
        this.tokenUrl = process.env.TWITCH_CLIENT_TOKEN_URI!;
        this.accessToken = null;
    }

    getAuthorizationUrl(state: string) {
        const baseUrl = process.env.TWITCH_USER_TOKEN_URI!;
        const params = new URLSearchParams({
            client_id: this.clientId,
            force_verify: 'true',
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
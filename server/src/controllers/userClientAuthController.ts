import crypto from 'crypto';
import { Request, Response } from 'express';
import TwitchUserClient from '../services/twitch/auth/twitchUser.js';

interface AuthState {
    state: string;
    redirectPath: string;
    timestamp: number;
}

class UserClientAuthController {
    private readonly TOKEN_COOKIE_NAME = 'user_access_token';
    private twitchUserClient: TwitchUserClient;
    private stateStore: Map<string, AuthState>;

    constructor() {
        this.twitchUserClient = new TwitchUserClient();
        this.stateStore = new Map<string, AuthState>();
    }

    private generateState(redirectPath: string = '/dashboard'): string {
        const state = crypto.randomBytes(16).toString('hex');
        this.stateStore.set(state, {
            state,
            redirectPath,
            timestamp: Date.now()
        });
        return state;
    }

    public handleLogin = (req: Request, res: Response): void => {
        const { redirect = '/dashboard' } = req.query;
        const state = this.generateState(redirect as string);
        const authorizationUrl = this.twitchUserClient.getAuthorizationUrl(state);
        res.redirect(authorizationUrl);
    };

    public handleCallback = async (req: Request, res: Response): Promise<void> => {
        const { code, state } = req.query;
        const baseURL = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'https://localhost:5173';
    
        try {
            // Validate state
            const storedState = this.stateStore.get(state as string);
            if (!storedState) {
                throw new Error('Invalid state parameter');
            }
    
            const accessToken = await this.twitchUserClient.exchangeCodeForToken(code as string, res);
            
            // Set auth cookies
            res.cookie(this.TOKEN_COOKIE_NAME, accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000
            });
    
            // Clean up state
            this.stateStore.delete(state as string);
    
            // Redirect to API endpoint, not client URL
            res.redirect('/twitch/auto-connect?session=new');
        } catch (error) {
            console.error('Auth callback error:', error);
            res.redirect(`${baseURL}/error?message=auth_failed`);
        }
    };
}

export default UserClientAuthController;
import crypto from 'crypto';
import { Request, Response } from 'express';
import TwitchUserClient from '../services/twitchUser.js';

class UserClientController {
    private twitchUserClient: TwitchUserClient;
    private stateStore: Map<string, boolean>;

    constructor() {
        this.twitchUserClient = new TwitchUserClient();
        this.stateStore = new Map<string, boolean>();
    }

    private generateState(): string {
        return crypto.randomBytes(16).toString('hex');
    }

    public handleLogin = (_req: Request, res: Response): void => {
        const state = this.generateState();
        this.stateStore.set(state, true);
        const authorizationUrl = this.twitchUserClient.getAuthorizationUrl(state);
        res.redirect(authorizationUrl);
    };

    public handleCallback = async (req: Request, res: Response): Promise<void> => {
        const baseURL = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'https://localhost:5173';
        const { code, state, error, error_description } = req.query;

        // Handle Twitch OAuth errors
        if (error) {
            console.error('Twitch OAuth error:', error, error_description);
            res.status(400).json({
                error: error,
                description: error_description
            });
            return;
        }

        // Validate required parameters
        if (!code || !state) {
            res.status(400).json({
                error: 'invalid_request',
                description: 'Missing required parameters'
            });
            return;
        }

        // Verify state
        if (!this.stateStore.has(state as string)) {
            res.status(400).json({
                error: 'invalid_state',
                description: 'State mismatch. Possible CSRF attack.'
            });
            return;
        }

        // Clean up used state
        this.stateStore.delete(state as string);

        try {
            // Exchange code for token
            const accessToken = await this.twitchUserClient.exchangeCodeForToken(code as string);

            if (!accessToken) {
                res.status(500).json({
                    error: 'token_error',
                    description: 'Failed to obtain access token'
                });
                return;
            }

            // Store the token in a cookie
            res.cookie('user_access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });
            
            res.redirect(`${baseURL}/dashboard`);
        } catch (error: any) {
            console.error('Authentication error:', error);
            res.status(500).json({
                error: 'server_error',
                description: error.message || 'An unexpected error occurred'
            });
        }
    };
}

export default UserClientController;
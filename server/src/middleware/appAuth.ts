import { Request, Response, NextFunction } from 'express';
import TwitchClient from '../services/twitch/auth/twitchClient.js';

const twitchClient = new TwitchClient();

const appAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = await twitchClient.getAccessToken();
        
        if (!token) {
            res.status(401).json({
                error: 'unauthorized',
                message: 'No valid token available'
            });
            twitchClient.login();
            appAuth;
            return;
        }

        req.headers.authorization = `Bearer ${token}`;
        req.headers.client_id = process.env.TWITCH_APP_CLIENT_ID!;
        next();
    } catch (error) {
        console.error('App authorization failed:', error);
        res.status(500).json({
            error: 'auth_error',
            message: 'Failed to authorize application'
        });
    }
};

export default appAuth;
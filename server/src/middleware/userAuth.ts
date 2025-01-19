import { Request, Response, NextFunction } from 'express';
import TwitchUserClient from '../services/twitch/auth/twitchUser.js';

const twitchUserClient = new TwitchUserClient();

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {        
        if (!req.cookies.user_access_token) {
            console.log('No token found, redirecting to login');
            res.redirect('/twitch/login');
            return;
        }

        const token = await twitchUserClient.getAccessToken(req);

        if (!token) {
            res.status(401).json({
                error: 'unauthorized',
                message: 'No valid user token available'
            });
            return;
        }

        req.twitchUserHeaders = {
            'Client-Id': process.env.TWITCH_APP_CLIENT_ID!,
            'Authorization': `Bearer ${token}`
        };
        next();
    } catch (error) {
        console.error('User authorization failed:', error);
        res.status(500).json({
            error: 'auth_error',
            message: 'Failed to authorize user'
        });
    }
};

export default userAuth;
import { Request, Response, NextFunction } from 'express';
import TwitchUserClient from '../services/twitch/auth/twitchUser.js';

const twitchUserClient = new TwitchUserClient();

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'https://localhost:5173';
    try {        
        const token = req.cookies.user_access_token;
        if (!token) {
            console.log('No token found in cookies, redirecting to login');
            res.redirect(`${BASE_URL}/twitch/login`);
            return;
        }

        const userToken = await twitchUserClient.getAccessToken(req);
        if (!userToken) {
            res.status(401).json({
                error: 'unauthorized',
                message: 'No valid user token available'
            });
            return;
        }

        req.twitchUserHeaders = {
            'Client-Id': process.env.TWITCH_APP_CLIENT_ID!,
            'Authorization': `Bearer ${userToken}`
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
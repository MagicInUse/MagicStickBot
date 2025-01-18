import { Request, Response, NextFunction } from 'express';
import TwitchUserClient from '../services/twitchUser.js';

const twitchUserClient = new TwitchUserClient();

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('Cookies:', req.cookies); // Debug cookie content
        
        if (!req.cookies.user_access_token) {
            console.log('No token found, redirecting to login');
            res.redirect('/twitch/login');
            return;
        }

        const token = await twitchUserClient.getAccessToken(req);
        console.log('Token retrieved:', !!token); // Debug token retrieval

        if (!token) {
            res.status(401).json({
                error: 'unauthorized',
                message: 'No valid user token available'
            });
            return;
        }

        req.headers.authorization = `Bearer ${token}`;
        req.headers.client_id = process.env.TWITCH_APP_CLIENT_ID!;
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
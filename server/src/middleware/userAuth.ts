import { Request, Response, NextFunction } from 'express';

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.user_access_token;
    
    if (!token) {
        // Store intended path
        const returnTo = encodeURIComponent(req.originalUrl);
        res.redirect(`/twitch/login?redirect=${returnTo}`);
        return;
    }

    try {
        req.twitchUserHeaders = {
            'Client-Id': process.env.TWITCH_APP_CLIENT_ID!,
            'Authorization': `Bearer ${token}`
        };
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.clearCookie('user_access_token');
        res.redirect('/twitch/login');
    }
};

export default userAuth;
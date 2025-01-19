import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            twitchUserHeaders?: {
                'Client-Id': string;
                'Authorization': string;
            }
            twitchAppHeaders?: {
                'Client-Id': string;
                'Authorization': string;
            }
        }
    }
}
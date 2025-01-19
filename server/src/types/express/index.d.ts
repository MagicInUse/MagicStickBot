import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            twitchHeaders?: {
                'Client-Id': string;
                'Authorization': string;
            }
            appHeaders?: {
                'Client-Id': string;
                'Authorization': string;
            }
        }
    }
}
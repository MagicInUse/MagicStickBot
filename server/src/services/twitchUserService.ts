import { Request } from 'express';
import axios from 'axios';
import TwitchUserClient from './twitchUser.js';

class UserService {
    private twitchUserClient: TwitchUserClient;
    private readonly API_BASE = 'https://api.twitch.tv/helix';

    constructor() {
        this.twitchUserClient = new TwitchUserClient();
    }

    async getLoggedInUser(req: Request): Promise<any> {
        const token = await this.twitchUserClient.getAccessToken(req);
        
        return axios.get(`${this.API_BASE}/users`, {
            headers: {
                'Client-Id': process.env.TWITCH_APP_CLIENT_ID!,
                'Authorization': `Bearer ${token}`
            }
        });
    }
}

export default UserService;
import axios from 'axios';
import TwitchClient from '../auth/twitchClient.js';

class AppService {
    private twitchClient: TwitchClient;
    private readonly API_BASE = 'https://api.twitch.tv/helix';

    constructor() {
        this.twitchClient = new TwitchClient();
    }

    async getUserByLogin(login: string): Promise<any> {
        const token = process.env.TWITCH_APP_ACCESS_TOKEN || await this.twitchClient.getAccessToken();

        return axios.get(`${this.API_BASE}/users?login=${login}`, {
            params:{
                login
            },
            headers: {
                'Client-Id': process.env.TWITCH_APP_CLIENT_ID!,
                'Authorization': `Bearer ${token}`
            }
        });
    }
}

export default AppService;
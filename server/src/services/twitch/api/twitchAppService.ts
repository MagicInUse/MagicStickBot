import axios from 'axios';
import { Request } from 'express';

class AppService {
    private readonly API_BASE = 'https://api.twitch.tv/helix';

    // This method is used to get a user by their login
    // TODO: create a duplicate method and change login to id to get a user by their id
    // An alternate method to add would be to get multiple users by their logins or ids
    // This is achieved by changing the parameter to an array of strings or
    // by using a query parameter to specify multiple logins or ids
    // eg. URL?login=login1&login=login2&etc
    async getUserByLogin(req: Request, login: string): Promise<any> {
        return axios.get(`${this.API_BASE}/users`, {
            params: { login: login! },
            headers: req.twitchAppHeaders!
        });
    }
    
    // From here on, the order of the endpoints in the documentation is the order we will follow
    // https://dev.twitch.tv/docs/api/reference
    // Any skips are User only requests

    async getCheermotes(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/bits/cheermotes`, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: req.twitchAppHeaders!
        });
    }

    async getChannelInformation(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels`, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: req.twitchAppHeaders!
        });
    }
}

export default AppService;
import { Request } from 'express';
import axios from 'axios';

class UserService {
    private readonly API_BASE = 'https://api.twitch.tv/helix';

    // This method is used to get the currently logged in user
    // Unlike the /users/:login endpoint, this endpoint does not require a login parameter
    // The endpoint will return the user that is currently logged in via the user_access_token
    async getLoggedInUser(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/users`, {
            headers: req.twitchUserHeaders!
        });
    }

    // From here on, the order of the endpoints in the documentation is the order we will follow
    // https://dev.twitch.tv/docs/api/reference
    // Any skips are App only requests

    async startCommercial(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/channels/commercial`, {
            broadcaster_id: req.body.broadcaster_id,
            length: req.body.length
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    
}

export default UserService;
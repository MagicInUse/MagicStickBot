import { Request } from 'express';
import axios from 'axios';

class UserService {
    private readonly API_BASE = 'https://api.twitch.tv/helix';

    // Requires the user:read:email scope
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

    // Requires the channel:edit:commercial scope
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

    // Requires the channel:read:ads scope
    async getAdSchedule(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels/ads`, {
            params: { broadcaster_id: req.params.broadcaster_id },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires the channel:manage:ads scope
    async snoozeNextAd(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/channels/ads/schedule/snooze`, {
            params: { broadcaster_id: req.params.broadcaster_id }
        }, {
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getExtensionAnalytics

    // Skip getGameAnalytics

    // Requires the bits:read scope
    async getBitsLeaderboard(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/bits/leaderboard`, {
            params: { 
                count: req.query.count || undefined,
                period: req.query.period || undefined,
                started_at: req.query.started_at || undefined,
                user_id: req.query.user_id || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getCheermotes for user. Find in twitchAppService

    // Skip getExtensionTransactions

    // No required scope
    async getChannelInformation(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels`, {
            params: { broadcaster_id: req.params.broadcaster_id },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires the channel:manage:broadcast scope
    async modifyChannelInformation(req: Request): Promise<any> {
        return axios.patch(`${this.API_BASE}/channels`, {
            game_id: req.body.game_id || undefined,
            broadcaster_language: req.body.broadcaster_language || undefined,
            title: req.body.title || undefined,
            delay: req.body.delay || undefined,
            tags: req.body.tags || undefined,
            content_classification_labels: req.body.content_classification_labels || undefined,
            id: req.body.id || undefined,
            is_enabled: req.body.is_enabled || undefined,
            is_branded_content: req.body.is_branded_content || undefined
        }, {
            params: { broadcaster_id: req.params.broadcaster_id },
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires the channel:read:editors scope
    async getChannelEditors(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels/editors`, {
            params: { broadcaster_id: req.params.broadcaster_id },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires user:read:follows scope
    async getFollowedChannels(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels/followed`, {
            params: { 
                user_id: req.query.user_id,
                broadcaster_id: req.query.broadcaster_id || undefined,
                after: req.query.after || undefined,
                first: req.query.first || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    
}

export default UserService;
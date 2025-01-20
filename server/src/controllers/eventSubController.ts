import { Request, Response } from 'express';
import { EventSubService } from '../services/twitch/websocket/eventSubService.js';
import UserService from '../services/twitch/api/twitchUserService.js';

export default class EventSubController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.handleConnection = this.handleConnection.bind(this);
    }

    async handleConnection(req: Request, res: Response): Promise<void> {
        try {
            const userAccessToken = req.cookies.user_access_token;
            if (!userAccessToken) {
                res.status(401).json({ error: 'No access token found' });
                return;
            }
    
            // Set the headers for user service call
            req.twitchUserHeaders = {
                'Client-Id': process.env.TWITCH_APP_CLIENT_ID!,
                'Authorization': `Bearer ${userAccessToken}`
            };
    
            // Get logged in user data
            const userData = await this.userService.getLoggedInUser(req);
            const channelUserId = userData.data.data[0].id;
    
            const eventSubService = new EventSubService(userAccessToken);
            await eventSubService.initialize(
                channelUserId,
                process.env.TWITCH_CHATBOT_USER_ID!
            );
    
            res.status(200).json({ message: 'WebSocket connection established' });
        } catch (error) {
            console.error('Failed to establish WebSocket connection:', error);
            res.status(500).json({ error: 'Failed to establish WebSocket connection' });
        }
    }
}
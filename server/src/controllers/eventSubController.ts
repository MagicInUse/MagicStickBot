import { Request, Response } from 'express';
import { EventSubService } from '../services/twitch/websocket/eventSubService.js';
import UserService from '../services/twitch/api/twitchUserService.js';

export default class EventSubController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.handleConnection = this.handleConnection.bind(this);
    }

    private async validateUser(userId: string, headers: any): Promise<boolean> {
        try {
            const response = await fetch(`https://api.twitch.tv/helix/users?id=${userId}`, {
                headers: headers
            });
            const data = await response.json();
            return data.data && data.data.length > 0;
        } catch (error) {
            return false;
        }
    }

    async handleConnection(req: Request, res: Response): Promise<void> {
        try {
            const userAccessToken = req.cookies.user_access_token;
            if (!userAccessToken) {
                res.status(401).json({ error: 'No access token found' });
                return;
            }
    
            const headers = {
                'Client-Id': process.env.TWITCH_APP_CLIENT_ID!,
                'Authorization': `Bearer ${userAccessToken}`
            };
            req.twitchUserHeaders = headers;
    
            // Get logged in user data
            const userData = await this.userService.getLoggedInUser(req);
            const channelUserId = userData.data.data[0].id;
    
            // Validate chatbot user exists
            const isChatbotValid = await this.validateUser(process.env.TWITCH_CHATBOT_USER_ID!, headers);
            if (!isChatbotValid) {
                res.status(400).json({ error: 'Chatbot user ID invalid' });
                return;
            }
    
            const eventSubService = new EventSubService(
                userAccessToken,
                channelUserId,
                process.env.TWITCH_CHATBOT_USER_ID!
            );
            
            await eventSubService.initialize();
    
            res.status(200).json({ message: 'WebSocket connection established' });
        } catch (error) {
            console.error('Failed to establish WebSocket connection:', error);
            res.status(500).json({ error: 'Failed to establish WebSocket connection' });
        }
    }
}
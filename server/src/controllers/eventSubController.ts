import { Request, Response } from 'express';
import TwitchEventSubService from '../services/twitch/websocket/eventSubService.js';
import UserService from '../services/twitch/api/twitchUserService.js';

class EventSubController {
    private eventSubService: TwitchEventSubService;

    constructor() {
        const userService = new UserService();
        this.eventSubService = new TwitchEventSubService(userService);
    }

    public handleConnection = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.body.userId;
            if (!this.eventSubService.isConnected(userId)) {
                await this.eventSubService.connect(req);
            }
            
            res.json({
                status: 'connected',
                sessionId: this.eventSubService.getSessionId(userId)
            });
        } catch (error) {
            res.status(500).json({
                error: 'connection_failed',
                message: 'Failed to establish EventSub connection'
            });
        }
    };
}

export default EventSubController;
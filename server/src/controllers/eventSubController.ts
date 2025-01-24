import { Request, Response } from 'express';
import TwitchEventSubService from '../services/twitch/websocket/eventSubService.js';
import UserService from '../services/twitch/api/twitchUserService.js';

class EventSubController {
    private eventSubService: TwitchEventSubService;
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.eventSubService = new TwitchEventSubService(this.userService);
        this.closeConnection = this.closeConnection.bind(this);
        this.handleConnection = this.handleConnection.bind(this);
        this.handleDisconnection = this.handleDisconnection.bind(this);
    }

    public handleConnection = async (req: Request, res: Response): Promise<void> => {
        try {
            // Get user data from the authenticated request instead of body
            const userResponse = await this.userService.getLoggedInUser(req);
            const userId = userResponse.data[0].id;
            
            if (!this.eventSubService.isConnected(userId)) {
                await this.eventSubService.connect(req);
            }
            
            res.json({
                status: 'connected',
                sessionId: this.eventSubService.getSessionId(userId)
            });
        } catch (error) {
            console.error('Connection error:', error);
            res.status(500).json({
                error: 'connection_failed',
                message: 'Failed to establish EventSub connection'
            });
        }
    };

    public isConnected(userId: string): boolean {
        return this.eventSubService.isConnected(userId);
    }

    public handleAutoConnect = async (req: Request, res: Response): Promise<void> => {
        const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'https://localhost:5173';
        const { session } = req.query;
    
        try {
            if (session === 'new') {
                // Connect without sending response
                await this.eventSubService.connect(req);
            }
            
            // Single redirect to dashboard
            res.redirect(`${baseUrl}/dashboard`);
        } catch (error) {
            console.error('Auto-connect error:', error);
            res.redirect(`${baseUrl}/error?message=connection_failed`);
        }
    };

    public handleConnectionStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const userResponse = await this.userService.getLoggedInUser(req);
            const userId = userResponse.data[0]?.id;

            if (!userId) {
                res.status(401).json({ error: 'user_not_found' });
                return;
            }

            const isConnected = this.isConnected(userId);
            res.json({ connected: isConnected, userId });
        } catch (error) {
            console.error('Connection status check error:', error);
            res.status(500).json({ 
                error: 'status_check_failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    public handleDisconnection = async (req: Request, res: Response): Promise<void> => {
        try {
            const userResponse = await this.userService.getLoggedInUser(req);
            const userId = userResponse.data[0].id;
            
            if (!userId) {
                throw new Error('User ID not found');
            }

            if (this.eventSubService.isConnected(userId)) {
                await this.closeConnection(userId);
                res.json({
                    status: 'disconnected',
                    message: 'Successfully disconnected from EventSub'
                });
            } else {
                res.status(400).json({
                    error: 'not_connected',
                    message: 'No active connection found'
                });
            }
        } catch (error) {
            console.error('Disconnection error:', error);
            res.status(500).json({
                error: 'disconnection_failed',
                message: 'Failed to disconnect from EventSub'
            });
        }
    };

    public async closeConnection(userId: string): Promise<void> {
        try {
            // First clear any session data
            await this.eventSubService.clearUserSession(userId);
            
            // Then close the WebSocket connection
            this.eventSubService.closeConnection(userId);
            
            console.log(`Successfully closed connection for user ${userId}`);
        } catch (error) {
            console.error(`Failed to close connection for user ${userId}:`, error);
            throw error;
        }
    }
}

export default EventSubController;
import { Request, Response } from 'express';
import AppService from '../services/twitch/api/twitchAppService.js';

class AppResponseController {
    private appService: AppService;

    constructor() {
        this.appService = new AppService();
    }

    getUserByLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            const { login } = req.params;
            const response = await this.appService.getUserByLogin(req, login);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    };

    getCheermotes = async (req: Request, res: Response): Promise<void> => {
        try {
            const { broadcasterId } = req.params;
            req.query.broadcaster_id = broadcasterId;
            const response = await this.appService.getCheermotes(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    };

    getChannelInformation = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.appService.getChannelInformation(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    };

    getChannelEmotes = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.appService.getChannelEmotes(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    };

    getChannelChatBadges = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.appService.getChannelChatBadges(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    };

    getChatSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.appService.getChatSettings(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    };

    sendChatMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.appService.sendChatMessage(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    };

    getClips = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.appService.getClips(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    };

    getChannelStreamSchedule = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.appService.getChannelStreamSchedule(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    };

    getChannelTeams = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.appService.getChannelTeams(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    };

    private handleError(error: any, res: Response): void {
        console.error('API Error:', error);
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        
        res.status(status).json({
            error: 'api_error',
            message: message
        });
    }
}

export default AppResponseController;
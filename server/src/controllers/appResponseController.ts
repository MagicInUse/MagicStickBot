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
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };
}

export default AppResponseController;
import { Request, Response } from 'express';
import UserService from '../services/twitchUserService.js';

class UserResponseController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getLoggedInUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getLoggedInUser(req);
            res.json(response.data);
        } catch (error: any) {
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };
}

export default UserResponseController;
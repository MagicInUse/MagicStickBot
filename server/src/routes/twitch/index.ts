import express from 'express';
import UserClientController from '../../controllers/userClientAuthController.js';

const twitchRouter = express.Router();
const userClientController = new UserClientController();

twitchRouter.get('/login', userClientController.handleLogin);
twitchRouter.get('/callback', userClientController.handleCallback);

export default twitchRouter;
import express from 'express';
import UserClientAuthController from '../../controllers/userClientAuthController.js';
import twitchAppAPIRouter from './app.js';
import twitchUserAPIRouter from './user.js';


const twitchRouter = express.Router();
const userClientAuthController = new UserClientAuthController();

// ${BASE_URL}/twitch/app
twitchRouter.get('/app', twitchAppAPIRouter);

// ${BASE_URL}/twitch/user
twitchRouter.get('/user', twitchUserAPIRouter);

// ${BASE_URL}/twitch/login
twitchRouter.get('/login', userClientAuthController.handleLogin);

// ${BASE_URL}/twitch/callback
twitchRouter.get('/callback', userClientAuthController.handleCallback);

export default twitchRouter;
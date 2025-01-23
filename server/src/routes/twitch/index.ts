import express from 'express';
import UserClientAuthController from '../../controllers/userClientAuthController.js';
import EventSubController from '../../controllers/eventSubController.js';
import userAuth from '../../middleware/userAuth.js';
import twitchAppAPIRouter from './app.js';
import twitchUserAPIRouter from './user.js';


const twitchRouter = express.Router();
const userClientAuthController = new UserClientAuthController();
const eventSubController = new EventSubController();

// ${BASE_URL}/twitch/app
twitchRouter.use('/app', twitchAppAPIRouter);

// ${BASE_URL}/twitch/user
twitchRouter.use('/user', twitchUserAPIRouter);

// ${BASE_URL}/twitch/login
twitchRouter.get('/login', userClientAuthController.handleLogin);

// ${BASE_URL}/twitch/callback
twitchRouter.get('/callback', userClientAuthController.handleCallback);

// ${BASE_URL}/twitch/connect
twitchRouter.get('/connect', userAuth, (req, res) => eventSubController.handleConnection(req, res));

export default twitchRouter;
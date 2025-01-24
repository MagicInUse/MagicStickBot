import express from 'express';
import UserClientAuthController from '../../controllers/userClientAuthController.js';
import EventSubController from '../../controllers/eventSubController.js';
import userAuth from '../../middleware/userAuth.js';
import twitchAppAPIRouter from './app.js';
import twitchUserAPIRouter from './user.js';

const twitchRouter = express.Router();
const userClientAuthController = new UserClientAuthController();
const eventSubController = new EventSubController();

// API Routes
twitchRouter.use('/app', userAuth, twitchAppAPIRouter);
twitchRouter.use('/user', userAuth, twitchUserAPIRouter);

// Auth Routes
twitchRouter.get('/login', userClientAuthController.handleLogin);
twitchRouter.get('/callback', userClientAuthController.handleCallback);

// Connection Routes
twitchRouter.get('/connect', userAuth, eventSubController.handleConnection);
twitchRouter.get('/disconnect', userAuth, eventSubController.handleDisconnection);
twitchRouter.get('/auto-connect', userAuth, eventSubController.handleAutoConnect);
twitchRouter.get('/connection-status', userAuth, eventSubController.handleConnectionStatus);

export default twitchRouter;
import express from 'express';
import UserResponseController from '../../controllers/userResponseController.js';
import userAuth from '../../middleware/userAuth.js';

const twitchUserAPIRouter = express.Router();

const userResponseController = new UserResponseController();

// TODO: Implement routes
// ${BASE_URL}/twitch/user/me
twitchUserAPIRouter.get('/me', userAuth, userResponseController.getLoggedInUser);

export default twitchUserAPIRouter;
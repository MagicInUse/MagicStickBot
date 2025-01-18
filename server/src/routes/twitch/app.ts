import express from 'express';
import AppResponseController from '../../controllers/appResponseController.js';
import appAuth from '../../middleware/appAuth.js';

const twitchAppAPIRouter = express.Router();

const appResponseController = new AppResponseController();

// TODO: Implement routes
// ${BASE_URL}/twitch/app/users/:login
twitchAppAPIRouter.get('/users/:login', appAuth, appResponseController.getUserByLogin);


export default twitchAppAPIRouter;
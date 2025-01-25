import express from 'express';
import AppResponseController from '../../controllers/appResponseController.js';
import appAuth from '../../middleware/appAuth.js';

const twitchAppAPIRouter = express.Router();
const appResponseController = new AppResponseController();

// User Information
twitchAppAPIRouter.get('/users/:login', appAuth, appResponseController.getUserByLogin);

// Channel Information
twitchAppAPIRouter.get('/channels/:broadcaster_id', appAuth, appResponseController.getChannelInformation);
twitchAppAPIRouter.get('/channels/:broadcaster_id/teams', appAuth, appResponseController.getChannelTeams);

// Chat Features
twitchAppAPIRouter.get('/chat/:broadcaster_id/badges', appAuth, appResponseController.getChannelChatBadges);
twitchAppAPIRouter.get('/chat/:broadcaster_id/settings', appAuth, appResponseController.getChatSettings);
twitchAppAPIRouter.post('/chat/:broadcaster_id/messages', appAuth, appResponseController.sendChatMessage);
twitchAppAPIRouter.get('/chat/:broadcaster_id/emotes', appAuth, appResponseController.getChannelEmotes);

// Channel Features
twitchAppAPIRouter.get('/bits/:broadcaster_id/cheermotes', appAuth, appResponseController.getCheermotes);
twitchAppAPIRouter.get('/clips/:broadcaster_id', appAuth, appResponseController.getClips);
twitchAppAPIRouter.get('/schedule/:broadcaster_id', appAuth, appResponseController.getChannelStreamSchedule);

export default twitchAppAPIRouter;
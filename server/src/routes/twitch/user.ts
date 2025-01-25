import express from 'express';
import UserResponseController from '../../controllers/userResponseController.js';
import userAuth from '../../middleware/userAuth.js';

const twitchUserAPIRouter = express.Router();
const userResponseController = new UserResponseController();

// User Information
twitchUserAPIRouter.get('/me', userAuth, userResponseController.getLoggedInUser);
twitchUserAPIRouter.get('/blocked/:broadcaster_id', userAuth, userResponseController.getBlockedUsers);
twitchUserAPIRouter.put('/block/:user_id', userAuth, userResponseController.blockUser);
twitchUserAPIRouter.delete('/block/:user_id', userAuth, userResponseController.unblockUser);

// Channel Management
twitchUserAPIRouter.post('/commercial', userAuth, userResponseController.startCommercial);
twitchUserAPIRouter.get('/ad-schedule', userAuth, userResponseController.getAdSchedule);
twitchUserAPIRouter.post('/ad-schedule/snooze', userAuth, userResponseController.snoozeNextAd);
twitchUserAPIRouter.get('/bits/leaderboard', userAuth, userResponseController.getBitsLeaderboard);

// Channel Information
twitchUserAPIRouter.get('/channels/:broadcaster_id', userAuth, userResponseController.getChannelInformation);
twitchUserAPIRouter.patch('/channels/:broadcaster_id', userAuth, userResponseController.modifyChannelInformation);
twitchUserAPIRouter.get('/channels/:broadcaster_id/editors', userAuth, userResponseController.getChannelEditors);
twitchUserAPIRouter.get('/channels/:broadcaster_id/:user_id/followed', userAuth, userResponseController.getFollowedChannels);
twitchUserAPIRouter.get('/channels/:broadcaster_id/followers', userAuth, userResponseController.getChannelFollowers);

// Channel Points
twitchUserAPIRouter.post('/channel-points/:broadcaster_id/rewards', userAuth, userResponseController.createCustomRewards);
twitchUserAPIRouter.delete('/channel-points/:broadcaster_id/rewards/:id', userAuth, userResponseController.deleteCustomReward);
twitchUserAPIRouter.get('/channel-points/:broadcaster_id/rewards', userAuth, userResponseController.getCustomReward);
twitchUserAPIRouter.patch('/channel-points/:broadcaster_id/rewards/:id', userAuth, userResponseController.updateCustomReward);
twitchUserAPIRouter.patch('/channel-points/:broadcaster_id/redemptions', userAuth, userResponseController.updateRedemptionStatus);

// Charity
twitchUserAPIRouter.get('/charity/:broadcaster_id/campaigns', userAuth, userResponseController.getCharityCampaign);
twitchUserAPIRouter.get('/charity/:broadcaster_id/donations', userAuth, userResponseController.getCharityCampaignDonations);

// Chat
twitchUserAPIRouter.get('/chat/:broadcaster_id/:moderator_id/chatters', userAuth, userResponseController.getChatters);
twitchUserAPIRouter.put('/chat/:broadcaster_id/settings', userAuth, userResponseController.updateChatSettings);
twitchUserAPIRouter.post('/chat/:broadcaster_id/announcements', userAuth, userResponseController.sendChatAnnouncement);
twitchUserAPIRouter.post('/chat/:broadcaster_id/shoutouts', userAuth, userResponseController.sendShoutout);
twitchUserAPIRouter.post('/chat/:broadcaster_id/messages', userAuth, userResponseController.sendChatMessage);
twitchUserAPIRouter.delete('/chat/:broadcaster_id/messages', userAuth, userResponseController.deleteChatMessages);

// Clips
twitchUserAPIRouter.post('/clips', userAuth, userResponseController.createClip);
twitchUserAPIRouter.get('/clips/:broadcaster_id', userAuth, userResponseController.getClips);

// EventSub
twitchUserAPIRouter.post('/eventsub', userAuth, userResponseController.createEventSubSubscription);
twitchUserAPIRouter.delete('/eventsub/:id', userAuth, userResponseController.deleteEventSubSubscription);
twitchUserAPIRouter.get('/eventsub', userAuth, userResponseController.getEventSubSubscriptions);

// Channel Features
twitchUserAPIRouter.get('/goals/:broadcaster_id', userAuth, userResponseController.getCreatorGoals);
twitchUserAPIRouter.get('/hype-train/:broadcaster_id', userAuth, userResponseController.getHypeTrainEvents);

// Moderation
twitchUserAPIRouter.get('/moderation/:broadcaster_id/banned', userAuth, userResponseController.getBannedUsers);
twitchUserAPIRouter.post('/moderation/bans', userAuth, userResponseController.banUser);
twitchUserAPIRouter.delete('/moderation/bans', userAuth, userResponseController.unbanUser);
twitchUserAPIRouter.get('/moderation/:user_id/channels', userAuth, userResponseController.getModeratedChannels);
twitchUserAPIRouter.get('/moderation/:broadcaster_id/moderators', userAuth, userResponseController.getModerators);
twitchUserAPIRouter.get('/moderation/:broadcaster_id/vips', userAuth, userResponseController.getVIPs);

// Polls
twitchUserAPIRouter.get('/polls/:broadcaster_id', userAuth, userResponseController.getPolls);
twitchUserAPIRouter.post('/polls', userAuth, userResponseController.createPoll);
twitchUserAPIRouter.patch('/polls/:id', userAuth, userResponseController.endPoll);

// Predictions
twitchUserAPIRouter.get('/predictions/:broadcaster_id', userAuth, userResponseController.getPredictions);
twitchUserAPIRouter.post('/predictions', userAuth, userResponseController.createPrediction);
twitchUserAPIRouter.patch('/predictions/:id', userAuth, userResponseController.endPrediction);

// Raids
twitchUserAPIRouter.post('/raids', userAuth, userResponseController.startRaid);
twitchUserAPIRouter.delete('/raids', userAuth, userResponseController.cancelRaid);

// Stream
twitchUserAPIRouter.get('/schedule/:broadcaster_id', userAuth, userResponseController.getChannelStreamSchedule);
twitchUserAPIRouter.get('/streams/:user_id/followed', userAuth, userResponseController.getFollowedStreams);
twitchUserAPIRouter.post('/streams/markers', userAuth, userResponseController.createStreamMarker);

// Subscriptions
twitchUserAPIRouter.get('/subscriptions/broadcaster/:broadcaster_id', userAuth, userResponseController.getBroadcasterSubscriptions);
twitchUserAPIRouter.get('/subscriptions/user/:broadcaster_id/:user_id', userAuth, userResponseController.checkUserSubscription);

export default twitchUserAPIRouter;
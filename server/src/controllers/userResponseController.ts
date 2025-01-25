import { Request, Response } from 'express';
import UserService from '../services/twitch/api/twitchUserService.js';

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

    startCommercial = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.startCommercial(req);
            res.json(response.data);
        } catch (error: any) {
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };

    getAdSchedule = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getAdSchedule(req);
            res.json(response.data);
        } catch (error: any) {
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };

    snoozeNextAd = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.snoozeNextAd(req);
            res.json(response.data);
        } catch (error: any) {
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };

    getBitsLeaderboard = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getBitsLeaderboard(req);
            res.json(response.data);
        } catch (error: any) {
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };

    getChannelInformation = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getChannelInformation(req);
            res.json(response.data);
        } catch (error: any) {
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };

    modifyChannelInformation = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.modifyChannelInformation(req);
            res.status(204).send(response.data); // Successfully modified
        } catch (error: any) {
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };

    getChannelEditors = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getChannelEditors(req);
            res.json(response.data);
        } catch (error: any) {
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };

    getFollowedChannels = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getFollowedChannels(req);
            res.json(response.data);
        } catch (error: any) {
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };

    getChannelFollowers = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getChannelFollowers(req);
            res.json(response.data);
        } catch (error: any) {
            res.status(500).json({
                error: 'server_error',
                message: error.message
            });
        }
    };

    createCustomRewards = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.createCustomRewards(req);
            res.status(201).json(response.data); // Successfully created
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    deleteCustomReward = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.deleteCustomReward(req);
            res.status(204).send(response.data); // Successfully deleted
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getCustomReward = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getCustomReward(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    updateCustomReward = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.updateCustomReward(req);
            res.status(204).send(response.data); // Successfully updated
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    updateRedemptionStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.updateRedemptionStatus(req);
            res.status(204).send(response.data); // Successfully updated
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getCharityCampaign = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getCharityCampaign(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getCharityCampaignDonations = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getCharityCampaignDonations(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getChatters = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getChatters(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    updateChatSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.updateChatSettings(req);
            res.status(204).send(response.data); // Successfully updated
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    sendChatAnnouncement = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.sendChatAnnouncement(req);
            res.status(204).send(response.data); // Successfully sent
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    sendShoutout = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.sendShoutout(req);
            res.status(204).send(response.data); // Successfully sent
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    sendChatMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.sendChatMessage(req);
            res.status(204).send(response.data); // Successfully sent
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    createClip = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.createClip(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getClips = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getClips(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    createEventSubSubscription = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.createEventSubSubscription(req);
            res.status(201).json(response.data); // Successfully created
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    deleteEventSubSubscription = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.deleteEventSubSubscription(req);
            res.status(204).send(response.data); // Successfully deleted
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getEventSubSubscriptions = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getEventSubSubscriptions(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getCreatorGoals = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getCreatorGoals(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getHypeTrainEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getHypeTrainEvents(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getBannedUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getBannedUsers(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    banUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.banUser(req);
            res.status(204).send(response.data); // Successfully banned
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    unbanUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.unbanUser(req);
            res.status(204).send(response.data); // Successfully unbanned
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    deleteChatMessages = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.deleteChatMessages(req);
            res.status(204).send(response.data); // Successfully deleted
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getModeratedChannels = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getModeratedChannels(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getModerators = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getModerators(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getVIPs = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getVIPs(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getPolls = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getPolls(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    createPoll = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.createPoll(req);
            res.status(201).json(response.data); // Successfully created
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    endPoll = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.endPoll(req);
            res.status(204).send(response.data); // Successfully ended
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getPredictions = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getPredictions(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    createPrediction = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.createPrediction(req);
            res.status(201).json(response.data); // Successfully created
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    endPrediction = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.endPrediction(req);
            res.status(204).send(response.data); // Successfully ended
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    startRaid = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.startRaid(req);
            res.status(204).send(response.data); // Successfully started
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    cancelRaid = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.cancelRaid(req);
            res.status(204).send(response.data); // Successfully cancelled
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getChannelStreamSchedule = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getChannelStreamSchedule(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getFollowedStreams = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getFollowedStreams(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    createStreamMarker = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.createStreamMarker(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getBroadcasterSubscriptions = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getBroadcasterSubscriptions(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    checkUserSubscription = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.checkUserSubscription(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    getBlockedUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.getBlockedUsers(req);
            res.json(response.data);
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    blockUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.blockUser(req);
            res.status(204).send(response.data); // Successfully blocked
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    unblockUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.userService.unblockUser(req);
            res.status(204).send(response.data); // Successfully unblocked
        } catch (error: any) {
            this.handleError(error, res);
        }
    }

    handleError(error: any, res: Response): void {
        console.error('API Error:', error);
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        
        res.status(status).json({
            error: 'api_error',
            message: message
        });
    }
}

export default UserResponseController;
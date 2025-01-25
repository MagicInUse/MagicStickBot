import { Request } from 'express';
import axios from 'axios';

class UserService {
    private readonly API_BASE = 'https://api.twitch.tv/helix';

    // Requires the user:read:email scope
    // Unlike the /users/:login endpoint, this endpoint does not require a login parameter
    // The endpoint will return the user that is currently logged in via the user_access_token
    async getLoggedInUser(req: Request): Promise<any> {
        try {
            if (!req.twitchUserHeaders) {
                throw new Error('No auth headers present');
            }
    
            const response = await axios.get(`${this.API_BASE}/users`, {
                headers: req.twitchUserHeaders
            });

            return response.data;
        } catch (error) {
            console.error('Failed to get user:', error);
            throw error;
        }
    }

    // From here on, the order of the endpoints in the documentation is the order we will follow
    // https://dev.twitch.tv/docs/api/reference
    // Any skips are App only requests

    // Requires channel:edit:commercial scope
    async startCommercial(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/channels/commercial`, {
            broadcaster_id: req.body.broadcaster_id!,
            length: req.body.length!
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires channel:read:ads scope
    async getAdSchedule(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels/ads`, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:manage:ads scope
    async snoozeNextAd(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/channels/ads/schedule/snooze`, {
            params: { broadcaster_id: req.params.broadcaster_id! }
        }, {
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getExtensionAnalytics

    // Skip getGameAnalytics

    // Requires bits:read scope
    async getBitsLeaderboard(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/bits/leaderboard`, {
            params: { 
                count: req.query.count || undefined,
                period: req.query.period || undefined,
                started_at: req.query.started_at || undefined,
                user_id: req.query.user_id || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getCheermotes for User. Find in twitchAppService

    // Skip getExtensionTransactions

    // No required scope
    async getChannelInformation(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels`, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:manage:broadcast scope
    async modifyChannelInformation(req: Request): Promise<any> {
        return axios.patch(`${this.API_BASE}/channels`, {
            game_id: req.body.game_id || undefined,
            broadcaster_language: req.body.broadcaster_language || undefined,
            title: req.body.title || undefined,
            delay: req.body.delay || undefined,
            tags: req.body.tags || undefined,
            content_classification_labels: req.body.content_classification_labels || undefined,
            id: req.body.id || undefined,
            is_enabled: req.body.is_enabled || undefined,
            is_branded_content: req.body.is_branded_content || undefined
        }, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires channel:read:editors scope
    async getChannelEditors(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels/editors`, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires user:read:follows scope
    async getFollowedChannels(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels/followed`, {
            params: { 
                user_id: req.params.user_id!,
                broadcaster_id: req.params.broadcaster_id || undefined,
                after: req.query.after || undefined,
                first: req.query.first || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires moderator:read:followers scope
    async getChannelFollowers(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels/followers`, {
            params: { 
                broadcaster_id: req.params.broadcaster_id!,
                user_id: req.query.user_id || undefined,
                after: req.query.after || undefined,
                first: req.query.first || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:manage:redemptions scope
    async createCustomRewards(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/channel_points/custom_rewards`, {
            title: req.body.title!,
            cost: req.body.cost!,
            prompt: req.body.prompt || undefined,
            is_enabled: req.body.is_enabled || undefined,
            background_color: req.body.background_color || undefined,
            is_user_input_required: req.body.is_user_input_required || undefined,
            is_max_per_stream_enabled: req.body.is_max_per_stream_enabled || undefined,
            max_per_stream: req.body.max_per_stream || undefined,
            is_max_per_user_per_stream_enabled: req.body.is_max_per_user_per_stream_enabled || undefined,
            max_per_user_per_stream: req.body.max_per_user_per_stream || undefined,
            is_global_cooldown_enabled: req.body.is_global_cooldown_enabled || undefined,
            global_cooldown_seconds: req.body.global_cooldown_seconds || undefined,
            should_redemptions_skip_request_queue: req.body.should_redemptions_skip_request_queue || undefined
        }, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires channel:manage:redemptions scope
    async deleteCustomReward(req: Request): Promise<any> {
        return axios.delete(`${this.API_BASE}/channel_points/custom_rewards`, {
            params: { 
                broadcaster_id: req.params.broadcaster_id!,
                 id: req.params.id! 
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:read:redemptions
    // OR channel:manage:redemptions scope
    // depending on context.
    async getCustomReward(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channel_points/custom_rewards`, {
            params: { 
                broadcaster_id: req.params.broadcaster_id!,
                id: req.params.id || undefined,
                only_manageable_rewards: req.query.only_manageable_rewards || undefined,
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:manage:redemptions scope
    async updateCustomReward(req: Request): Promise<any> {
        return axios.patch(`${this.API_BASE}/channel_points/custom_rewards`, {
            title: req.body.title || undefined,
            cost: req.body.cost || undefined,
            prompt: req.body.prompt || undefined,
            is_enabled: req.body.is_enabled || undefined,
            background_color: req.body.background_color || undefined,
            is_user_input_required: req.body.is_user_input_required || undefined,
            is_max_per_stream_enabled: req.body.is_max_per_stream_enabled || undefined,
            max_per_stream: req.body.max_per_stream || undefined,
            is_max_per_user_per_stream_enabled: req.body.is_max_per_user_per_stream_enabled || undefined,
            max_per_user_per_stream: req.body.max_per_user_per_stream || undefined,
            is_global_cooldown_enabled: req.body.is_global_cooldown_enabled || undefined,
            global_cooldown_seconds: req.body.global_cooldown_seconds || undefined,
            is_paused: req.body.is_paused || undefined,
            should_redemptions_skip_request_queue: req.body.should_redemptions_skip_request_queue || undefined
        }, {
            params: { 
                broadcaster_id: req.params.broadcaster_id!,
                id: req.params.id!
            },
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires channel:manage:redemptions scope
    async updateRedemptionStatus(req: Request): Promise<any> {
        return axios.patch(`${this.API_BASE}/channel_points/custom_rewards/redemptions`, {
            status: req.body.status!,
            id: req.body.id!
        }, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires channel:read:charity scope
    async getCharityCampaign(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/charity/campaigns`, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:read:charity scope
    //*******************************************************************/
    // This is a one time request endpoint!
    // To receive events as donations occur,
    // subscribe to the channel.charity_campaign.donate subscription type.
    //*******************************************************************/
    async getCharityCampaignDonations(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/charity/donations`, {
            params: { 
                broadcaster_id: req.params.broadcaster_id!,
                first: req.query.first || undefined,
                after: req.query.after || undefined,
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires moderator:read:chatters scope
    async getChatters(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/chat/chatters`, {
            params: { 
                broadcaster_id: req.params.broadcaster_id!,
                moderator_id: req.params.moderator_id || undefined,
                first: req.query.first || undefined,
                after: req.query.after || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getChannelEmotes for User. Find in twitchAppService

    // Skip getGlobalEmotes

    // Skip getEmoteSets

    // Skip getChannelChatBadges for User. Find in twitchAppService

    // Skip getGlobalChatBadges

    // Skip getChatSettings for User. Find in twitchAppService

    // Skip getSharedChatSession

    // Skip getUserEmotes

    // Requires moderator:manage:chat_settings scope
    async updateChatSettings(req: Request): Promise<any> {
        return axios.put(`${this.API_BASE}/chat/settings`, {
            broadcaster_id: req.params.broadcaster_id!,
            moderator_id: req.params.moderator_id!,
            emote_mode: req.body.emote_mode || undefined,
            follower_mode: req.body.follower_mode || undefined,
            follower_mode_duration: req.body.follower_mode_duration || undefined,
            non_moderator_chat_delay: req.body.non_moderator_chat_delay || undefined,
            non_moderator_chat_delay_duration: req.body.non_moderator_chat_delay_duration || undefined,
            slow_mode: req.body.slow_mode || undefined,
            slow_mode_wait_time: req.body.slow_mode_wait_time || undefined,
            subscriber_mode: req.body.subscriber_mode || undefined,
            unique_chat_mode: req.body.unique_chat_mode || undefined
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires moderator:manage:announcements scope
    async sendChatAnnouncement(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/chat/announcements`, {
            broadcaster_id: req.params.broadcaster_id!,
            moderator_id: req.params.moderator_id!,
            message: req.body.message!,
            color: req.body.color || undefined
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires moderator:manage:shoutouts scope
    async sendShoutout(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/chat/shoutouts`, {
            from_broadcaster_id: req.params.from_broadcaster_id!,
            to_broadcaster_id: req.params.to_broadcaster_id!,
            moderator_id: req.params.moderator_id!
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires user:write:chat scope
    // Additionally, requires user:bot scope from chatting user
    // and either channel:bot scope from broadcaster or moderator status.
    async sendChatMessage(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/chat/messages`, {
            broadcaster_id: req.params.broadcaster_id!,
            sender_id: req.params.sender_id!,
            message: req.body.message!,
            reply_parent_message_id: req.body.reply_parent_message_id || undefined
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Skip getUserChatColor

    // Skip updateUserChatColor

    // Requires clips:edit scope
    // Creating a clip is an asynchronous process that can take a short amount of time to complete.
    // To determine whether the clip was successfully created,
    // call Get Clips using the clip ID that this request returned.
    // If Get Clips returns the clip, the clip was successfully created.
    // If after 15 seconds Get Clips hasn’t returned the clip, assume it failed.
    async createClip(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/clips`, {
            broadcaster_id: req.params.broadcaster_id!,
            has_delay: req.body.has_delay || undefined
        }, {
            headers: req.twitchUserHeaders!
        });
    }

    // Requires no specific scope
    async getClips(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/clips`, {
            params: { 
                broadcaster_id: req.params.broadcaster_id!,
                game_id: req.query.game_id!,
                id: req.query.id!,
                after: req.query.after || undefined,
                before: req.query.before || undefined,
                ended_at: req.query.ended_at || undefined,
                first: req.query.first || undefined,
                started_at: req.query.started_at || undefined,
                is_featured: req.query.is_featured || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getContentClassificationLabels

    // Skip getDropsEntitlements,
    //      updateDropsEntitlements

    // Skip getExtensionConfigurationSegment,
    //      setExtensionConfigurationSegment,
    //      getExtensionRequiredConfiguration,
    //      sendExtensionPubSubMessage,
    //      getExtensionLiveChannels,
    //      getExtensionSecrets,
    //      createExtensionSecret,
    //      sendExtensionChatMessage,
    //      getExtensions,
    //      getReleasedExtensions,
    //      getExtensionBitsProducts,
    //      updateExtensionBitsProduct

    // TODO: Research webhooks for EventSub Subscription
    // EventSubs require the scope of the subscription type
    async createEventSubSubscription(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/eventsub/subscriptions`, {
            type: req.body.type!,
            version: req.body.version!,
            condition: req.body.condition!,
            transport: req.body.transport!
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    async deleteEventSubSubscription(req: Request): Promise<any> {
        return axios.delete(`${this.API_BASE}/eventsub/subscriptions`, {
            params: { id: req.params.id! },
            headers: req.twitchUserHeaders!
        });
    }

    async getEventSubSubscriptions(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/eventsub/subscriptions`, {
            params: {
                status: req.query.status || undefined,
                type: req.query.type || undefined,
                after: req.query.after || undefined,
                user_id: req.query.user_id || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getTopGames,
    //      getGames

    // Requires channel:read:goals scope
    async getCreatorGoals(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/goals`, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: req.twitchUserHeaders!
        });
    }

    // These endpoints are currently in beta [ Jan 19 2025 ]
    // Skip getChannelGuestStarSettings,
    //      updateChannelGuestStarSettings,
    //      getGuestStarSession,
    //      createGuestStarSession,
    //      endGuestStarSession,
    //      getGuestStarInvites,
    //      sendGuestStarInvite,
    //      deleteGuestStarInvite,
    //      assignGuestStarSlot,
    //      updateGuestStarSlot,
    //      deleteGuestStarSlot,
    //      updateGuestStarSlotSettings

    // Requires channel:read:hypre_train scope
    //*******************************************************************/
    // This is a one time request endpoint!
    // To receive events as donations occur,
    // subscribe to the Hype Train Events (Begin, Progress, End)
    //*******************************************************************/
    async getHypeTrainEvents(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/hypetrain/events`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                first: req.query.first || undefined,
                after: req.query.after || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip checkAutoModStatus,
    //      manageHeldAutoModMessages,
    //      getAutoModSettings,
    //      updateAutoModSettings

    // Requires moderation:read
    // OR the more defined:
    // moderator:manage:banned_users scope
    async getBannedUsers(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/moderation/banned`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                user_id: req.query.user_id || undefined,
                after: req.query.after || undefined,
                first: req.query.first || undefined,
                before: req.query.before || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires moderator:manage:banned_users scope
    async banUser(req: Request): Promise<any> {
        return axios.put(`${this.API_BASE}/moderation/bans`, {
            broadcaster_id: req.params.broadcaster_id!,
            moderator_id: req.params.moderator_id!,
            data: {
                user_id: req.body.user_id!,
                reason: req.body.reason || undefined,
                duration: req.body.duration || undefined
            }
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires moderator:manage:banned_users scope
    async unbanUser(req: Request): Promise<any> {
        return axios.delete(`${this.API_BASE}/moderation/bans`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                moderator_id: req.params.moderator_id!,
                user_id: req.params.user_id!
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getUnbanRequests,
    //      resolveUnbanRequests

    // Skip getBlockedTerms,
    //      addBlockedTerm,
    //      removeBlockedTerm

    // Requires moderator:manage:chat_messages scope
    async deleteChatMessages(req: Request): Promise<any> {
        return axios.delete(`${this.API_BASE}/moderation/chat`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                moderator_id: req.params.moderator_id!,
                message_id: req.params.message_id!
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires user:read:moderated_channels scope
    async getModeratedChannels(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/moderation/channels`, {
            params: {
                user_id: req.params.user_id!,
                after: req.query.after || undefined,
                first: req.query.first || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires moderation:read scope
    async getModerators(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/moderation/moderators`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                user_id: req.query.user_id || undefined,
                after: req.query.after || undefined,
                first: req.query.first || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip addChannelModerator,
    //      removeChannelModerator

    // Requires channel:read:vips scope
    async getVIPs(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/channels/vips`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                user_id: req.query.user_id || undefined,
                after: req.query.after || undefined,
                first: req.query.first || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip addChannelVIP,
    //      removeChannelVIP

    // Skip updateShieldModeStatus,
    //     getShieldModeStatus

    // Skip warnChatUser

    // Requires channel:read:polls
    // OR the more defined:
    // channel:manage:polls scope
    async getPolls(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/polls`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                id: req.query.id || undefined,
                after: req.query.after || undefined,
                first: req.query.first || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:manage:polls scope
    async createPoll(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/polls`, {
            broadcaster_id: req.params.broadcaster_id!,
            title: req.body.title!,
            choices: req.body.choices!,
            duration: req.body.duration!,
            bits_voting_enabled: req.body.bits_voting_enabled || undefined,
            bits_per_vote: req.body.bits_per_vote || undefined,
            channel_points_voting_enabled: req.body.channel_points_voting_enabled || undefined,
            channel_points_per_vote: req.body.channel_points_per_vote || undefined
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires channel:manage:polls scope
    async endPoll(req: Request): Promise<any> {
        return axios.delete(`${this.API_BASE}/polls`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                id: req.params.id!,
                status: req.body.status!
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:read:predictions
    // OR the more defined:
    // channel:manage:predictions scope
    async getPredictions(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/predictions`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                id: req.query.id || undefined,
                after: req.query.after || undefined,
                first: req.query.first || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:manage:predictions scope
    async createPrediction(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/predictions`, {
            broadcaster_id: req.params.broadcaster_id!,
            title: req.body.title!,
            outcomes: req.body.outcomes!,
            prediction_window: req.body.prediction_window!
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires channel:manage:predictions scope
    async endPrediction(req: Request): Promise<any> {
        return axios.delete(`${this.API_BASE}/predictions`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                id: req.params.id!,
                status: req.body.status!,
                winning_outcome_id: req.body.winning_outcome_id || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:manage:raids scope
    async startRaid(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/raids`, {
            from_broadcaster_id: req.params.from_broadcaster_id!,
            to_broadcaster_id: req.params.to_broadcaster_id!,
        }, {
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:manage:raids scope
    async cancelRaid(req: Request): Promise<any> {
        return axios.delete(`${this.API_BASE}/raids`, {
            params: { broadcaster_id: req.params.broadcaster_id! },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires no specific scope
    async getChannelStreamSchedule(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/schedule`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                id: req.query.id || undefined,
                start_time: req.query.start_time || undefined,
                utc_offset: req.query.utc_offset || undefined, // Not supported [ Jan 19 2025 ]
                first: req.query.first || undefined,
                after: req.query.after || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getiCalendar

    // Skip updateChannelStreamSchedule,
    //      updateChannelStreamScheduleSegment,
    //      createChannelStreamScheduleSegment,
    //      updateChannelStreamScheduleSegment,
    //      deleteChannelStreamScheduleSegment

    // Skip searchCategories,
    //      searchChannels

    // Skip getStreamKey

    // Skip getStreams

    // Requires user:read:follows scope
    async getFollowedStreams(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/streams/followed`, {
            params: {
                user_id: req.params.user_id!,
                after: req.query.after || undefined,
                first: req.query.first || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires channel:manage:broadcast scope
    async createStreamMarker(req: Request): Promise<any> {
        return axios.post(`${this.API_BASE}/streams/markers`, {
            user_id: req.params.user_id!,
            description: req.body.description || undefined
        }, {
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getStreamMarkers

    // Requires channel:read:subscriptions scope
    async getBroadcasterSubscriptions(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/subscriptions`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                user_id: req.query.user_id || undefined,
                first: req.query.first || undefined,
                after: req.query.after || undefined,
                before: req.query.before || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires user:read:subscriptions scope
    async checkUserSubscription(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/subscriptions/user`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                user_id: req.params.user_id!
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getAllStreamTags,
    //      getStreamTags
    // Both deprecated and return empty array as of [ July 13, 2023 ]

    // Skip getChannelTeams for User. Find in twitchAppService

    // Skip getTeams

    // getUsers at top of document

    // Skip updateUser

    // Requires user:read:blocked_users scope
    async getBlockedUsers(req: Request): Promise<any> {
        return axios.get(`${this.API_BASE}/users/blocks`, {
            params: {
                broadcaster_id: req.params.broadcaster_id!,
                after: req.query.after || undefined,
                first: req.query.first || undefined
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Requires user:manage:blocked_users scope
    async blockUser(req: Request): Promise<any> {
        return axios.put(`${this.API_BASE}/users/blocks`, {
            target_user_id: req.body.target_user_id!,
            source_context: req.body.source_context || undefined,
            reason: req.body.reason || undefined
        }, {
            headers: {
            ...req.twitchUserHeaders!,
            'Content-Type': 'application/json'
            }
        });
    }

    // Requires user:manage:blocked_users scope
    async unblockUser(req: Request): Promise<any> {
        return axios.delete(`${this.API_BASE}/users/blocks`, {
            params: {
                target_user_id: req.params.target_user_id!
            },
            headers: req.twitchUserHeaders!
        });
    }

    // Skip getUserExtensions,
    //      getUserActiveExtensions,
    //      updateUserExtensions

    // Skip getVideos,
    //      deleteVideos

    // Skip sendWhisper
}

export default UserService;
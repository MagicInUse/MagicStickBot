import WebSocket from 'ws';
import UserService from '../api/twitchUserService.js';

export class EventSubService {
    private readonly EVENTSUB_WEBSOCKET_URL = 'wss://eventsub.wss.twitch.tv/ws';
    private websocketSessionId: string | null = null;
    private websocketClient: WebSocket | null = null;
    private userAccessToken: string;
    private channelId: string;
    private botUserId: string;
    private userService: UserService;

    constructor(accessToken: string, channelId: string, botUserId: string) {
        this.userAccessToken = accessToken;
        this.channelId = channelId;
        this.botUserId = botUserId;
        this.userService = new UserService();
    }

    public async initialize(): Promise<void> {
        try {
            await this.validateAuth();
            this.startWebSocketClient();
        } catch (error) {
            throw error;
        }
    }

    private async validateAuth() {
        try {
            const response = await fetch('https://id.twitch.tv/oauth2/validate', {
                headers: {
                    'Authorization': `Bearer ${this.userAccessToken}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`Token validation failed: ${response.statusText}`);
            }
    
            console.log('Token validated');
        } catch (error) {
            throw error;
        }
    }

    private startWebSocketClient() {
        this.websocketClient = new WebSocket(this.EVENTSUB_WEBSOCKET_URL);

        this.websocketClient.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.websocketClient.on('open', () => {
            console.log('WebSocket connection opened');
        });

        this.websocketClient.on('message', (data) => {
            this.handleWebSocketMessage(JSON.parse(data.toString()));
        });

        this.websocketClient.on('close', () => {
            console.log('WebSocket connection closed');
            // Implement reconnection logic here
            setTimeout(() => this.startWebSocketClient(), 5000);
        });
    }

    private async registerEventSubListeners() {
        try {
            const subscriptionData = {
                type: 'channel.chat.message',
                version: '1',
                condition: {
                    broadcaster_user_id: this.channelId,
                    user_id: this.botUserId
                },
                transport: {
                    method: 'websocket',
                    session_id: this.websocketSessionId
                }
            };

            const mockRequest = {
                body: subscriptionData,
                twitchUserHeaders: {
                    'Authorization': `Bearer ${this.userAccessToken}`,
                    'Client-Id': process.env.TWITCH_APP_CLIENT_ID!
                }
            } as any;

            await this.userService.createEventSubSubscription(mockRequest);
            console.log('Successfully registered EventSub subscription');
        } catch (error) {
            console.error('Failed to register EventSub subscription:', error);
            throw error;
        }
    }

    private async handleWebSocketMessage(data: any) {
        switch (data.metadata.message_type) {
            case 'session_welcome':
                this.websocketSessionId = data.payload.session.id;
                await this.registerEventSubListeners();
                break;

            case 'notification':
                await this.handleNotification(data);
                break;

            case 'reconnect':
                // Handle reconnect message
                this.websocketClient?.close();
                this.startWebSocketClient();
                break;
        }
    }

    private async handleNotification(data: any) {
        switch (data.metadata.subscription_type) {
            case 'channel.chat.message':
                await this.handleChatMessage(data.payload.event);
                break;
            // Add more event types as needed
        }
    }

    private async handleChatMessage(event: any) {
        console.log(`Chat message from ${event.chatter_user_login}: ${event.message.text}`);
        // Implement your chat message handling logic here
    }
}
import WebSocket from 'ws';

export class EventSubService {
    private readonly EVENTSUB_WEBSOCKET_URL = 'wss://eventsub.wss.twitch.tv/ws';
    private websocketSessionId: string | null = null;
    private websocketClient: WebSocket | null = null;
    private userAccessToken: string;

    constructor(accessToken: string) {
        this.userAccessToken = accessToken;
    }

    public async initialize(botUserId: string, channelId: string) {
        try {
            await this.validateAuth();
            this.startWebSocketClient();
            
            // Store IDs for later use
            process.env.TWITCH_BOT_USER_ID = botUserId;
            process.env.TWITCH_CHANNEL_USER_ID = channelId;
        } catch (error) {
            console.error('Failed to initialize EventSub service:', error);
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
        } catch (error) {
            console.error('Auth validation failed:', error);
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

    private async registerEventSubListeners() {
        try {
            const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.userAccessToken}`,
                    'Client-Id': process.env.TWITCH_APP_CLIENT_ID!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'channel.chat.message',
                    version: '1',
                    condition: {
                        broadcaster_user_id: process.env.TWITCH_CHANNEL_USER_ID,
                        user_id: process.env.TWITCH_BOT_USER_ID
                    },
                    transport: {
                        method: 'websocket',
                        session_id: this.websocketSessionId
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to register EventSub listener: ${response.statusText}`);
            }

            console.log('Successfully registered EventSub listener');
        } catch (error) {
            console.error('Failed to register EventSub listener:', error);
            throw error;
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
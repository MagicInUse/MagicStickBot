import WebSocket from 'ws';
import UserService from '../api/twitchUserService.js';
import TwitchClient from '../auth/twitchClient.js';
import { Request } from 'express';

interface EventSubMessage {
    metadata: {
        message_type: string;
        subscription_type: string;
    };
    payload: {
        session: {
            id: string;
        };
        event?: {
            broadcaster_user_login: string;
            user_login: string;
            chatter_user_login: string;
            chatter_user_name: string;
            message: {
                text: string;
            };
        };
    };
}

class TwitchEventSubService {
    private ws?: WebSocket;
    private readonly EVENTSUB_URL = 'wss://eventsub.wss.twitch.tv/ws';
    private sessionId: string | null;
    private reconnectAttempts: number;
    private readonly MAX_RECONNECT_ATTEMPTS = 5;
    private readonly botUserId: string;
    private readonly clientId: string;
    private  channelId: string;
    private userService: UserService;
    private twitchClient: TwitchClient;
    private userAccessToken: string;

    constructor(userService: UserService) {
        this.sessionId = null;
        this.reconnectAttempts = 0;
        this.botUserId = process.env.TWITCH_CHATBOT_USER_ID!;
        this.clientId = process.env.TWITCH_APP_CLIENT_ID!;
        this.channelId = '';
        this.userService = userService;
        this.twitchClient = new TwitchClient();
        this.userAccessToken = '';
    }

    public async connect(req: Request): Promise<void> {
        try {
            if (!req.twitchUserHeaders) {
                throw new Error('No auth headers present');
            }
    
            // Extract token from Authorization header
            this.userAccessToken = req.twitchUserHeaders.Authorization.split(' ')[1];
    
            const userResponse = await this.userService.getLoggedInUser(req);
    
            if (!userResponse?.data?.[0]?.id) {
                throw new Error('Invalid user response: missing user ID');
            }
    
            this.channelId = userResponse.data[0].id;
            
            this.ws = new WebSocket(this.EVENTSUB_URL);
            this.setupWebSocketHandlers(req);
        } catch (error) {
            console.error('Failed to connect:', error);
            await this.handleReconnect(req);
        }
    }

    private setupWebSocketHandlers(req: Request): void {
        if (!this.ws) return;

        this.ws.on('open', this.handleOpen.bind(this));
        this.ws.on('message', this.handleMessage.bind(this));
        this.ws.on('error', this.handleError.bind(this));
        this.ws.on('close', () => this.handleClose(req));
    }

    private handleOpen(): void {
        console.log('Connected to Twitch EventSub WebSocket');
        this.reconnectAttempts = 0;
    }

    private handleMessage(data: WebSocket.RawData): void {
        try {
            const message: EventSubMessage = JSON.parse(data.toString());
            this.processMessage(message);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    private processMessage(message: EventSubMessage): void {
        switch (message.metadata.message_type) {
            case 'session_welcome':
                this.sessionId = message.payload.session.id;
                console.log('Session established:', this.sessionId);
                this.subscribeToEvents();
                break;
            case 'notification':
                this.handleNotification(message);
                break;
            case 'session_keepalive':
                // Optional: Log keepalive
                break;
            case 'revocation':
                console.log('Subscription revoked:', message.payload);
                break;
        }
    }

    private handleError(error: Error): void {
        console.error('WebSocket error:', error);
    }

    private async handleClose(req: Request): Promise<void> {
        console.log('WebSocket connection closed');
        await this.handleReconnect(req);
    }

    private async handleReconnect(req: Request): Promise<void> {
        if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        
        console.log(`Attempting to reconnect in ${delay}ms`);
        setTimeout(() => this.connect(req), delay);
    }

    private async subscribeToEvents(): Promise<void> {
        try {
            if (!this.channelId || !this.sessionId || !this.userAccessToken) {
                throw new Error('Missing required subscription parameters');
            }
    
            // Subscription types setup, similar to user scopes
            // They define what events the bot will listen to
            const subscriptionTypes = [
                {
                    type: 'channel.chat.message',
                    version: '1',
                    condition: {
                        broadcaster_user_id: this.channelId,
                        user_id: this.channelId
                    }
                },
                {
                    type: 'channel.follow',
                    version: '2',
                    condition: {
                        broadcaster_user_id: this.channelId,
                        moderator_user_id: this.channelId
                    }
                }
            ];
    
            for (const subscription of subscriptionTypes) {
                const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
                    method: 'POST',
                    headers: {
                        'Client-Id': this.clientId,
                        'Authorization': `Bearer ${this.userAccessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...subscription,
                        transport: {
                            method: 'websocket',
                            session_id: this.sessionId
                        }
                    })
                });
    
                const data = await response.json();
                
                if (!response.ok) {
                    console.error(`Subscription failed for ${subscription.type}:`, {
                        status: response.status,
                        data: data
                    });
                    continue;
                }
    
                console.log(`Successfully subscribed to ${subscription.type}`);
            }
        } catch (error) {
            console.error('Error subscribing to events:', error);
            this.ws?.close();
        }
    }

    private async handleNotification(message: EventSubMessage): Promise<void> {
        // Chat message event
        if (message.metadata.subscription_type === 'channel.chat.message' && message.payload.event) {
            const event = message.payload.event;
            console.log(`MSG #${event.broadcaster_user_login} <${event.chatter_user_login}> ${event.message.text}`);

            if (event.chatter_user_login !== process.env.TWITCH_BOT_USER_LOGIN) { // Make sure the bot doesn't respond to itself
                // TODO: Make dynamic way to get different bot text responses from front-end GUI options
                if (event.message.text.trim().toLowerCase().startsWith('why')) {
                    await this.sendChatMessage('Why not?');
                }
                const firstWord = event.message.text.trim().split(' ')[0].toLowerCase();
                if (firstWord === 'hello') {
                    await this.sendChatMessage(`imGlitch Bonjour, @${event.chatter_user_name}!`);
                }
            }
        }
        // Follow event
        if (message.metadata.subscription_type === 'channel.follow' && message.payload.event) {
            const event = message.payload.event;
            console.log(`FOLLOW #${event.broadcaster_user_login} <${event.user_login}>`);
        }
    }

    private async sendChatMessage(message: string): Promise<void> {
        try {
            const token = await this.twitchClient.getAccessToken();
            const response = await fetch('https://api.twitch.tv/helix/chat/messages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Client-Id': this.clientId,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    broadcaster_id: this.channelId,
                    sender_id: this.botUserId,
                    message: message
                })
            });

            if (response.status !== 200) {
                const data = await response.json();
                console.error('Failed to send chat message:', data);
                return;
            }

            console.log('Sent chat message:', message);
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    }

    public isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    public getSessionId(): string | null {
        return this.sessionId;
    }
}

export default TwitchEventSubService;
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
            broadcaster_user_id: string;
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
    private connections: Map<string, WebSocket>;
    private ws?: WebSocket;
    private readonly EVENTSUB_URL = 'wss://eventsub.wss.twitch.tv/ws';
    private sessionId: string | null;
    private reconnectAttempts: number;
    private readonly MAX_RECONNECT_ATTEMPTS = 5;
    private readonly botUserId: string;
    private readonly clientId: string;
    private channelId: string;
    private userService: UserService;
    private twitchClient: TwitchClient;
    private userAccessToken: string;
    private userSessions: Map<string, string>;
    private intentionalClosures: Set<string>;

    constructor(userService: UserService) {
        this.connections = new Map();
        this.sessionId = null;
        this.reconnectAttempts = 0;
        this.botUserId = process.env.TWITCH_CHATBOT_USER_ID!;
        this.clientId = process.env.TWITCH_APP_CLIENT_ID!;
        this.channelId = '';
        this.userService = userService;
        this.twitchClient = new TwitchClient();
        this.userAccessToken = '';
        this.userSessions = new Map();
        this.intentionalClosures = new Set();
    }

    public async connect(req: Request): Promise<void> {
        let userId: string | undefined;
        try {
            if (!req.twitchUserHeaders) {
                throw new Error('No auth headers present');
            }

            const userResponse = await this.userService.getLoggedInUser(req);
            userId = userResponse.data[0].id;

            // Check if connection already exists
            if (this.connections.has(userId!)) {
                return;
            }

            this.channelId = userId!;
            this.userAccessToken = req.twitchUserHeaders.Authorization.split(' ')[1];
            
            const ws = new WebSocket(this.EVENTSUB_URL);
            this.setupWebSocketHandlers(ws, req, userId!);
            this.connections.set(userId!, ws);

        } catch (error) {
            console.error('Failed to connect:', error);
            if (userId) {
                await this.handleReconnect(req, userId);
            }
        }
    }

    private setupWebSocketHandlers(ws: WebSocket, req: Request, userId: string): void {
        ws.on('open', () => this.handleOpen(userId));
        ws.on('message', (data) => this.handleMessage(data, userId));
        ws.on('error', (error) => this.handleError(error, userId));
        ws.on('close', () => this.handleClose(req, userId));
    }

    private handleOpen(userId: string): void {
        console.log(`Connected to Twitch EventSub WebSocket for user ${userId}`);
        this.reconnectAttempts = 0;
    }

    private handleMessage(data: WebSocket.RawData, userId: string): void {
        try {
            const message: EventSubMessage = JSON.parse(data.toString());
            this.processMessage(message, userId);
        } catch (error) {
            console.error(`Error processing message for user ${userId}:`, error);
        }
    }

    private processMessage(message: EventSubMessage, userId: string): void {
        switch (message.metadata.message_type) {
            case 'session_welcome':
                this.sessionId = message.payload.session.id;
                this.userSessions.set(userId, this.sessionId);
                console.log(`Session established for user ${userId}:`, this.sessionId);
                this.subscribeToEvents();
                break;
            case 'notification':
                this.handleNotification(message);
                break;
            case 'session_keepalive':
                // Optional: Log keepalive
                break;
            case 'revocation':
                console.log(`Subscription revoked for user ${userId}:`, message.payload);
                break;
        }
    }

    private handleError(error: Error, userId: string): void {
        console.error(`WebSocket error for user ${userId}:`, error);
    }

    private async handleClose(req: Request, userId: string): Promise<void> {
        console.log(`WebSocket connection closed for user ${userId}`);
        
        // Check if this was an intentional closure
        if (this.intentionalClosures.has(userId)) {
            this.intentionalClosures.delete(userId);
            return; // Don't reconnect for intentional closures
        }

        // Only attempt reconnection for unexpected closures
        await this.handleReconnect(req, userId);
    }

    private async handleReconnect(req: Request, userId: string): Promise<void> {
        if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            console.error(`Max reconnection attempts reached for user ${userId}`);
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        
        console.log(`Attempting to reconnect for user ${userId} in ${delay}ms`);
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
                // TODO: Make dynamic way to get different bot text responses from front-end GUI options & local storage
                if (event.message.text.trim().toLowerCase().startsWith('why')) {
                    await this.sendChatMessage('Why not?', event.broadcaster_user_id);
                }
                if (event.message.text.trim().split(' ')[0].toLowerCase() === 'hello') {
                    await this.sendChatMessage(`imGlitch Bonjour, @${event.chatter_user_name}!`, event.broadcaster_user_id);
                }
            }
        }
        // Follow event
        if (message.metadata.subscription_type === 'channel.follow' && message.payload.event) {
            const event = message.payload.event;
            console.log(`FOLLOW #${event.broadcaster_user_login} <${event.user_login}>`);
        }
    }

    private async sendChatMessage(message: string, broadcasterId: string): Promise<void> {
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
                    broadcaster_id: broadcasterId,
                    sender_id: this.botUserId,
                    message: message
                })
            });

            if (!response.ok) {
                const data = await response.json();
                console.error(`Failed to send chat message (${response.status}):`, data);
                return;
            }

            console.log(`Successfully sent chat message in channel ${broadcasterId}: ${message}`);
            return;

        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    }

    public async clearUserSession(userId: string): Promise<void> {
        this.intentionalClosures.delete(userId);
        this.userSessions.delete(userId);
        this.connections.delete(userId);
    }

    public closeConnection(userId: string): void {
        const ws = this.connections.get(userId);
        if (ws) {
            // Mark this as an intentional closure
            this.intentionalClosures.add(userId);
            ws.close(1000, 'User initiated disconnect');
            this.connections.delete(userId);
        }
    }

    public isConnected(userId: string): boolean {
        const ws = this.connections.get(userId);
        return ws?.readyState === WebSocket.OPEN;
    }

    public getSessionId(userId: string): string | null {
        return this.userSessions.get(userId) || null;
    }
}

export default TwitchEventSubService;
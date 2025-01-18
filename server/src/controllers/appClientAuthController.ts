import TwitchClient from '../services/twitchClient.js';

class AppClientController {
    private twitchClient: TwitchClient;

    constructor() {
        this.twitchClient = new TwitchClient();
    }

    public initialize = async (): Promise<void> => {
        await this.twitchClient.getAccessToken();
    };
}

export default AppClientController;
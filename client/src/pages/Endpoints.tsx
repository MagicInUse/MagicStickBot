import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Endpoints = () => {
    const [apiResponse, setApiResponse] = useState<any>(null);
    const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'https://localhost:5173';
    const user_id = '183568422';
    const [broadcaster_id, setBroadcasterId] = useState<string>('');
    const [broadcaster_login, setBroadcasterLogin] = useState<string>('');
    const fetchUserData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/twitch/user/me`);
            const data = await response.json();
            if (data) {
                setBroadcasterId(data[0].id);
                setBroadcasterLogin(data[0].login);
            }
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleEndpointClick = async (endpoint: string) => {
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            setApiResponse(data);
        } catch (error) {
            setApiResponse({ error: 'Failed to fetch data' });
        }
    };

    return (
        <>
            <h1 style={{ margin: '0', padding: '0' }}>API Endpoints</h1>
            <h4 style={{ margin: '3px', padding: '0' }}>for those who would like to see some behind-the-scenes</h4>
            <Link to="/dashboard" style={{ marginTop: 0, padding: 0 }}>Back to Dashboard</Link>
            <div style={{ display: 'flex'}}>
                <div style={{ flex: 1, minWidth: '269px' }}>
                    <h2>APP Endpoints</h2>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/users/${broadcaster_login}`)} title={`${BASE_URL}/twitch/app/users/:broadcaster_login`}>Get User By Login</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/channels/${broadcaster_id}`)} title={`${BASE_URL}/twitch/app/channels/:broadcaster_id`}>Get Channel Information</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/channels/${broadcaster_id}/teams`)} title={`${BASE_URL}/twitch/app/channels/:broadcaster_id/teams`}>Get Channel Teams</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/chat/${broadcaster_id}/badges`)} title={`${BASE_URL}/twitch/app/chat/:broadcaster_id/badges`}>Get Channel Chat Badges</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/chat/${broadcaster_id}/settings`)} title={`${BASE_URL}/twitch/app/chat/:broadcaster_id/settings`}>Get Chat Settings</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/chat/${broadcaster_id}/emotes`)} title={`${BASE_URL}/twitch/app/chat/:broadcaster_id/emotes`}>Get Channel Emotes</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/bits/${broadcaster_id}/cheermotes`)} title={`${BASE_URL}/twitch/app/bits/:broadcaster_id/cheermotes`}>Get Cheermotes</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/clips/${broadcaster_id}`)} title={`${BASE_URL}/twitch/app/clips/:broadcaster_id/`}>Get Clips</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/schedule/${broadcaster_id}`)} title={`${BASE_URL}/twitch/app/schedule/:broadcaster_id/`}>Get Schedule</a>
                    <h2>USER Endpoints</h2>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/me`)} title={`${BASE_URL}/twitch/user/me`}>Get Logged In User</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/blocked/${broadcaster_id}`)} title={`${BASE_URL}/twitch/user/blocked/:broadcaster_id`}>Get Blocked Users</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/ad-schedule`)} title={`${BASE_URL}/twitch/user/ad-schedule`}>Get Ad Schedule</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/bits/leaderboard`)} title={`${BASE_URL}/twitch/user/bits/leaderboard`}>Get Bits Leaderboard</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/channels/${broadcaster_id}`)} title={`${BASE_URL}/twitch/user/channels/:broadcaster_id`}>Get Channel Information</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/channels/${broadcaster_id}/editors`)} title={`${BASE_URL}/twitch/user/channels/:broadcaster_id/editors`}>Get Channel Editors</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/channels/${broadcaster_id}/${user_id}/followed`)} title={`${BASE_URL}/twitch/user/channels/:broadcaster_id/:user_id/followed`}>Get Channel Follow Age</a> {/* TODO: Fix this */}
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/channels/${broadcaster_id}/followers`)} title={`${BASE_URL}/twitch/user/channels/:broadcaster_id/followers`}>Get Channel Followers</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/channel-points/${broadcaster_id}/rewards`)} title={`${BASE_URL}/twitch/user/channel-points/:broadcaster_id/rewards`}>Get Custom Rewards</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/charity/${broadcaster_id}/campaigns`)} title={`${BASE_URL}/twitch/user/charity/:broadcaster_id/campaigns`}>Get Charity Campaign</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/charity/${broadcaster_id}/donations`)} title={`${BASE_URL}/twitch/user/charity/:broadcaster_id/donations`}>Get Charity Donations</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/chat/${broadcaster_id}/${broadcaster_id}/chatters`)} title={`${BASE_URL}/twitch/user/chat/:broadcaster_id/:moderator_id/chatters`}>Get Chatters</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/clips/${broadcaster_id}`)} title={`${BASE_URL}/twitch/user/clips/:broadcaster_id`}>Get Clips</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/eventsub`)} title={`${BASE_URL}/twitch/user/eventsub`}>Get EventSub Subscriptions</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/goals/${broadcaster_id}`)} title={`${BASE_URL}/twitch/user/goals/:broadcaster_id`}>Get Creator Goals</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/hype-train/${broadcaster_id}`)} title={`${BASE_URL}/twitch/user/hype-train/:broadcaster_id`}>Get Hype Train Events</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/moderation/${broadcaster_id}/banned`)} title={`${BASE_URL}/twitch/user/moderation/:broadcaster_id/banned`}>Get Banned Users</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/moderation/${broadcaster_id}/moderators`)} title={`${BASE_URL}/twitch/user/moderation/:broadcaster_id/moderators`}>Get Moderators</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/moderation/${broadcaster_id}/vips`)} title={`${BASE_URL}/twitch/user/moderation/:broadcaster_id/vips`}>Get VIPs</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/polls/${broadcaster_id}`)} title={`${BASE_URL}/twitch/user/polls/:broadcaster_id`}>Get Polls</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/predictions/${broadcaster_id}`)} title={`${BASE_URL}/twitch/user/predictions/:broadcaster_id`}>Get Predictions</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/schedule/${broadcaster_id}`)} title={`${BASE_URL}/twitch/user/schedule/:broadcaster_id`}>Get Channel Schedule</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/subscriptions/broadcaster/${broadcaster_id}`)} title={`${BASE_URL}/twitch/user/subscriptions/broadcaster/:broadcaster_id`}>Get Broadcaster Subscriptions</a>

                </div>
                <div style={{ flex: 1, paddingLeft: '20px', minHeight: '200px', minWidth: '1000px' }}>
                    {apiResponse ? (
                        <pre style={{ background: '#191919', padding: '10px', borderRadius: '15px', overflow: 'auto', textAlign: 'left'}}>
                            {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                    ) : (
                        <pre style={{ background: '#191919', padding: '10px', borderRadius: '15px', overflow: 'auto', textAlign: 'left'}}>
                            Select an endpoint to see the response
                        </pre>
                        
                    )}
                </div>
            </div>
        </>
    );
}

export default Endpoints;
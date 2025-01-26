import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Endpoints = () => {
    const [apiResponse, setApiResponse] = useState<any>(null);
    const user_id = '183568422';
    const [broadcaster_id, setBroadcasterId] = useState<string>('');
    const [broadcaster_login, setBroadcasterLogin] = useState<string>('');
    const fetchUserData = async () => {
        try {
            const response = await fetch(`/twitch/user/me`);
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
                <p style={{ margin: '3px', padding: '0', width: '300px'}}>These API endpoints are how the application functions! When you authorize the app by logging in to your Twitch account, this is the information you are allowing the app to access.</p>
                    <h2>APP Endpoints</h2>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/app/users/${broadcaster_login}`)} title={`/twitch/app/users/:broadcaster_login`}>Get User By Login</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/app/channels/${broadcaster_id}`)} title={`/twitch/app/channels/:broadcaster_id`}>Get Channel Information</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/app/channels/${broadcaster_id}/teams`)} title={`/twitch/app/channels/:broadcaster_id/teams`}>Get Channel Teams</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/app/chat/${broadcaster_id}/badges`)} title={`/twitch/app/chat/:broadcaster_id/badges`}>Get Channel Chat Badges</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/app/chat/${broadcaster_id}/settings`)} title={`/twitch/app/chat/:broadcaster_id/settings`}>Get Chat Settings</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/app/chat/${broadcaster_id}/emotes`)} title={`/twitch/app/chat/:broadcaster_id/emotes`}>Get Channel Emotes</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/app/bits/${broadcaster_id}/cheermotes`)} title={`/twitch/app/bits/:broadcaster_id/cheermotes`}>Get Cheermotes</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/app/clips/${broadcaster_id}`)} title={`/twitch/app/clips/:broadcaster_id/`}>Get Clips</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/app/schedule/${broadcaster_id}`)} title={`/twitch/app/schedule/:broadcaster_id/`}>Get Schedule</a>
                    <h2>USER Endpoints</h2>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/me`)} title={`/twitch/user/me`}>Get Logged In User</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/blocked/${broadcaster_id}`)} title={`/twitch/user/blocked/:broadcaster_id`}>Get Blocked Users</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/ad-schedule`)} title={`/twitch/user/ad-schedule`}>Get Ad Schedule</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/bits/leaderboard`)} title={`/twitch/user/bits/leaderboard`}>Get Bits Leaderboard</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/channels/${broadcaster_id}`)} title={`/twitch/user/channels/:broadcaster_id`}>Get Channel Information</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/channels/${broadcaster_id}/editors`)} title={`/twitch/user/channels/:broadcaster_id/editors`}>Get Channel Editors</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/channels/${broadcaster_id}/${user_id}/followed`)} title={`/twitch/user/channels/:broadcaster_id/:user_id/followed`}><span style={{ textDecoration: 'line-through' }}>Get Channel Follow Age</span></a><span style={{ color: 'red' }}>{`<BROKEN>`}</span>{/* TODO: Fix this */}
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/channels/${broadcaster_id}/followers`)} title={`/twitch/user/channels/:broadcaster_id/followers`}>Get Channel Followers</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/channel-points/${broadcaster_id}/rewards`)} title={`/twitch/user/channel-points/:broadcaster_id/rewards`}>Get Custom Rewards</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/charity/${broadcaster_id}/campaigns`)} title={`/twitch/user/charity/:broadcaster_id/campaigns`}>Get Charity Campaign</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/charity/${broadcaster_id}/donations`)} title={`/twitch/user/charity/:broadcaster_id/donations`}>Get Charity Donations</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/chat/${broadcaster_id}/${broadcaster_id}/chatters`)} title={`/twitch/user/chat/:broadcaster_id/:moderator_id/chatters`}>Get Chatters</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/clips/${broadcaster_id}`)} title={`/twitch/user/clips/:broadcaster_id`}>Get Clips</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/eventsub`)} title={`/twitch/user/eventsub`}>Get EventSub Subscriptions</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/goals/${broadcaster_id}`)} title={`/twitch/user/goals/:broadcaster_id`}>Get Creator Goals</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/hype-train/${broadcaster_id}`)} title={`/twitch/user/hype-train/:broadcaster_id`}>Get Hype Train Events</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/moderation/${broadcaster_id}/banned`)} title={`/twitch/user/moderation/:broadcaster_id/banned`}>Get Banned Users</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/moderation/${broadcaster_id}/moderators`)} title={`/twitch/user/moderation/:broadcaster_id/moderators`}>Get Moderators</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/moderation/${broadcaster_id}/vips`)} title={`/twitch/user/moderation/:broadcaster_id/vips`}>Get VIPs</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/polls/${broadcaster_id}`)} title={`/twitch/user/polls/:broadcaster_id`}>Get Polls</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/predictions/${broadcaster_id}`)} title={`/twitch/user/predictions/:broadcaster_id`}>Get Predictions</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/schedule/${broadcaster_id}`)} title={`/twitch/user/schedule/:broadcaster_id`}>Get Channel Schedule</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`/twitch/user/subscriptions/broadcaster/${broadcaster_id}`)} title={`/twitch/user/subscriptions/broadcaster/:broadcaster_id`}>Get Broadcaster Subscriptions</a>

                </div>
                <div style={{ flex: 1, paddingLeft: '20px', minHeight: '200px', minWidth: '931px', maxWidth: '931px' }}>
                    {apiResponse ? (
                        <pre style={{ background: '#191919', padding: '10px', borderRadius: '15px', overflow: 'auto', textAlign: 'left'}}>
                            {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                    ) : (
                        <pre style={{ background: '#191919', padding: '10px', borderRadius: '15px', overflow: 'auto'}}>
                            Select an endpoint to see the response
                        </pre>
                        
                    )}
                </div>
            </div>
        </>
    );
}

export default Endpoints;
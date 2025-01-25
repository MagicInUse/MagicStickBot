//*********************************************//
// This component is for testing purposes only //
// Broadcaster ID: 36178420                    //
// Moderator ID: 183568422                     //
//*********************************************//

import { useState } from 'react';
import { Link } from 'react-router-dom';

const broadcaster_id = '36178420';
const moderator_id = '183568422';
const broadcaster_login = 'magicinuse';
const moderator_login = 'magicstickbot';

const Endpoints = () => {
    const [apiResponse, setApiResponse] = useState<any>(null);
    const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'https://localhost:5173';

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
            <div style={{ display: 'flex'}}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <h2>APP Endpoints</h2>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/users/${broadcaster_login}`)} title={`${BASE_URL}/twitch/app/users/:broadcaster_login`}>Get User By Login</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/channels/${broadcaster_id}`)} title={`${BASE_URL}/twitch/app/channels/:broadcaster_id`}>Get Channel Information</a>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/channels/${broadcaster_id}/teams`)} title={`${BASE_URL}/twitch/app/channels/:broadcaster_id/teams`}>Get Channel Teams</a>
                    <h2>USER Endpoints</h2>
                    <a className='Endpoints' onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/me`)} title={`${BASE_URL}/twitch/app/users/me`}>Get Logged In User</a>
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
            <Link to="/dashboard">Back to Dashboard</Link>
        </>
    );
}

export default Endpoints;
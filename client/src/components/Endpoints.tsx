//*********************************************//
// This component is for testing purposes only //
// Broadcaster ID: 36178420                    //
// Moderator ID: 183568422                     //
//*********************************************//

import { useState } from 'react';

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
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <h2>APP Endpoints</h2>
                    <a onClick={() => handleEndpointClick(`${BASE_URL}/twitch/app/users/magicinuse`)}>Get User By Login</a>
                    <h2>USER Endpoints</h2>
                    <a onClick={() => handleEndpointClick(`${BASE_URL}/twitch/user/me`)}>Get Logged In User</a>
                </div>
                <div style={{ flex: 1, paddingLeft: '20px', minHeight: '200px', minWidth: '1200px' }}>
                    {apiResponse ? (
                        <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '15px', overflow: 'auto', textAlign: 'left'}}>
                            {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                    ) : (
                        <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '15px', overflow: 'auto', textAlign: 'left'}}>
                            Select an endpoint to see the response
                        </pre>
                        
                    )}
                </div>
            </div>
        </>
    );
}

export default Endpoints;
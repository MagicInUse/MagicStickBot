import './App.css'
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const checkConnection = async () => {
      const status = await fetch('/twitch/connection-status');
      if (!status.ok) {
        // Redirect to connect if not connected
        window.location.href = '/twitch/login';
      }
    };
    checkConnection();
  }, []);

  return (
    <>
      <h1>MagicStickBot</h1>
      <button onClick={() => window.location.href='/twitch/login'}>Log in with Twitch</button>
    </>
  )
}

export default App

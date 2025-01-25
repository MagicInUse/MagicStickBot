import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const status = await fetch('/twitch/connection-status');
        if (!status.ok) {
          navigate('/');
        }
      } catch (error) {
        navigate('/');
      }
    };
    checkConnection();
  }, [navigate]);

  return (
    <>
      <h1>MagicStickBot</h1>
      <h4>by MagicApps</h4>
      <br />
      <h2>Dashboard</h2>

      <Link to="/endpoints">Go to Endpoints</Link>
    </>
  )
}

export default Dashboard;
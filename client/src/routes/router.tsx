import { createBrowserRouter, redirect } from 'react-router-dom';
import App from '../App';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';

// Loader function to check auth and handle connection
async function rootLoader() {
  try {
    // Check if user has auth token by making request to connection status endpoint
    const status = await fetch('/twitch/connection-status');
    
    if (status.ok) {
      // User is authenticated, connect websocket
      await fetch('/twitch/connect');
      // Redirect to dashboard
      return redirect('/dashboard');
    }

    // No valid auth, stay on root page
    return null;

  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: rootLoader
  },
  {
    path: '/dashboard', 
    element: <Dashboard />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);
import { createBrowserRouter, redirect } from 'react-router-dom';
import App from '../App';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Endpoints from '../pages/Endpoints';
import NotFound from '../pages/NotFound';

const BASE_URL = import.meta.env.DEV ? 'https://localhost:5173' : '';

// Loader function to check auth and handle connection
async function rootLoader() {
  try {
    // Check if user has auth token by making request to connection status endpoint
    const status = await fetch(`${BASE_URL}/twitch/connection-status`, {
      credentials: 'include'
    });
    
    if (status.ok) {
      // User is authenticated, connect websocket
      await fetch(`${BASE_URL}/twitch/connect`, {
        credentials: 'include'
      });
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

async function protectedLoader() {
  try {
    const response = await fetch(`${BASE_URL}/twitch/user/me`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      return redirect('/');
    }
    return null;
  } catch (error) {
    console.error('Protected route auth check failed:', error);
    return redirect('/');
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
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    loader: protectedLoader
  },
  {
    path: '/endpoints', 
    element: <ProtectedRoute><Endpoints /></ProtectedRoute>,
    loader: protectedLoader
  },
  {
    path: '*',
    element: <NotFound />
  }
]);
import { createBrowserRouter, redirect } from 'react-router-dom';
import App from '../App';
import Dashboard from '../pages/Dashboard';
import Endpoints from '../pages/Endpoints';
import NotFound from '../pages/NotFound';

// Loader function to check auth and handle connection
async function rootLoader() {
  try {
    // Check connection status
    const response = await fetch('/twitch/connection-status', {
      credentials: 'include', // Important for cookies
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      // User is authenticated, redirect to dashboard
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
    loader: rootLoader,
    errorElement: <div>Something went wrong!</div>,
    hydrateFallbackElement: <div>Loading...</div>
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/endpoints', 
    element: <Endpoints />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);
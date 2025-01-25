import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const isAuthed = await checkAuth();
      if (!isAuthed) {
        navigate('/');
      }
    };
    verify();
  }, []);

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
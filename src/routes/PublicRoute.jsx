import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { storage } from '../utils/storage';

export function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const token = storage.getToken();

  if (isAuthenticated || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

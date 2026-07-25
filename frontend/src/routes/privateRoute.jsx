import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// guards authenticated-only pages — reads reactive context state (not a one-off
// localStorage check) so a session expiring mid-page redirects immediately,
// rather than waiting for the next navigation to notice the token is gone
export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../services/api';
import { ROUTES } from './index';

// guards the Dashboard and other main-app screens behind onboarding completion —
// checked against the backend on every mount so it holds regardless of how the
// user got here (back button, direct URL entry, stale local state, etc.)
export default function OnboardingRoute() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'complete' | 'incomplete'

  useEffect(() => {
    api
      .get('/api/auth/profile/')
      .then(({ data }) => setStatus(data.onboarding_complete ? 'complete' : 'incomplete'))
      // fail open on a transient network error — this is a UX guard, not a security
      // boundary, so we don't want a flaky connection locking a real user out
      .catch(() => setStatus('complete'));
  }, []);

  if (status === 'loading') return null;
  if (status === 'incomplete') return <Navigate to={ROUTES.MOTHERHOOD_STAGE} replace />;
  return <Outlet />;
}

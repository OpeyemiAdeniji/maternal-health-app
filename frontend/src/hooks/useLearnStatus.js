import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import useEpdsPrompt from './useEpdsPrompt';

export default function useLearnStatus() {
  const location = useLocation();
  const { isEpdsPromptOpen } = useEpdsPrompt();
  const [hasNewContent, setHasNewContent] = useState(false);
  const [showCoachmark, setShowCoachmark] = useState(false);

  useEffect(() => {
    api
      .get('/api/auth/profile/')
      .then(({ data }) => {
        setHasNewContent(!!data.has_new_learn_content);
        setShowCoachmark(!data.learn_coachmark_dismissed);
      })
      .catch(() => {});
  }, []);

  // Header/Sidebar persist across client-side route changes, so once the user is on
  // /learn, clear the indicators immediately instead of waiting for a full reload —
  // the Learn page's own mount effect handles persisting this to the backend.
  useEffect(() => {
    if (location.pathname.startsWith('/learn')) {
      setHasNewContent(false);
      setShowCoachmark(false);
    }
  }, [location.pathname]);

  const dismissCoachmark = () => {
    setShowCoachmark(false);
    api.patch('/api/auth/profile/', { learn_coachmark_dismissed: true }).catch(() => {});
  };

  // suppressed while the EPDS prompt is open so the two don't compete for attention —
  // this only hides it, it doesn't mark it as seen, so it can still appear afterward
  return { hasNewContent, showCoachmark: showCoachmark && !isEpdsPromptOpen, dismissCoachmark };
}

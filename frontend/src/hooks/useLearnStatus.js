import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import useEpdsPrompt from './useEpdsPrompt';
import useTour from './useTour';

export default function useLearnStatus() {
  const location = useLocation();
  const { isEpdsPromptOpen } = useEpdsPrompt();
  const { isTourActive } = useTour();
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

  // Header/Sidebar persist across route changes, so clear the indicators as soon as the user hits /learn instead of waiting for the page's own mount effect to persist it to the backend
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

  // hidden while the EPDS prompt or guided tour is open, this only hides it and doesn't mark it seen, so it can still show up after
  return {
    hasNewContent,
    showCoachmark: showCoachmark && !isEpdsPromptOpen && !isTourActive,
    dismissCoachmark,
  };
}

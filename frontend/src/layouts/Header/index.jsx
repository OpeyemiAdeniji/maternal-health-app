import { Book, Notification } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearnCoachmark from '../../components/common/LearnCoachmark';
import Logo from '../../components/common/Logo';
import useLearnStatus from '../../hooks/useLearnStatus';
import api from '../../services/api';

export default function Header() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const { hasNewContent, showCoachmark, dismissCoachmark } = useLearnStatus();

  useEffect(() => {
    api
      .get('/api/notifications/')
      .then(({ data }) => setUnreadCount(data.filter((n) => !n.is_read).length))
      .catch(() => setUnreadCount(0));
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 lg:hidden">
      <Logo size="sm" />

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => navigate('/learn')}
            aria-label="Learn"
            data-tour-target="learn"
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-colors hover:bg-primary-200"
          >
            <Book variant="Linear" color="currentColor" className="h-5 w-5" />
            {hasNewContent && (
              <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-primary-600 ring-2 ring-white" />
            )}
          </button>
          {showCoachmark && <LearnCoachmark onDismiss={dismissCoachmark} />}
        </div>

        <button
          type="button"
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-colors hover:bg-primary-200"
        >
          <Notification variant="Linear" color="currentColor" className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold leading-none text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

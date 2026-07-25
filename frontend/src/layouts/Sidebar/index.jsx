import { Book, Book1, Chart, Heart, Home2, Notification, Profile2User } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import LearnCoachmark from '../../components/common/LearnCoachmark';
import Logo from '../../components/common/Logo';
import useAuth from '../../hooks/useAuth';
import useLearnStatus from '../../hooks/useLearnStatus';
import api from '../../services/api';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', Icon: Home2 },
  { to: '/journal', label: 'Journal', Icon: Book1 },
  { to: '/support', label: 'Support', Icon: Heart },
  { to: '/insights', label: 'Insight', Icon: Chart },
  { to: '/profile', label: 'You', Icon: Profile2User },
];

function getInitials(name) {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function Sidebar({ userName }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const { hasNewContent, showCoachmark, dismissCoachmark } = useLearnStatus();

  useEffect(() => {
    api
      .get('/api/notifications/')
      .then(({ data }) => setUnreadCount(data.filter((n) => !n.is_read).length))
      .catch(() => setUnreadCount(0));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:h-screen lg:w-60 lg:flex-col lg:border-r lg:border-gray-100 lg:bg-white">
      <div className="flex items-center justify-between px-6 py-6">
        <Logo size="md" />
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => navigate('/learn')}
              aria-label="Learn"
              className="relative z-50 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-colors hover:bg-primary-200"
            >
              <Book variant="Linear" color="currentColor" className="h-4 w-4" />
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
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-colors hover:bg-primary-200"
          >
            <Notification variant="Linear" color="currentColor" className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold leading-none text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-pill px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-600 text-white' : 'text-muted hover:bg-primary-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  variant="Linear"
                  color="currentColor"
                  className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
            {getInitials(userName)}
          </span>
          <span className="truncate text-sm font-medium text-ink">{userName}</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 w-full px-2 text-left text-xs font-semibold text-red-500 transition-colors hover:text-red-600"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

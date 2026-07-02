import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ChevronRightIcon, PersonIcon } from '../../components/common/icons';

const SETTINGS_ITEMS = [
  { label: 'My Healthcare Contact', to: '/healthcare-contact' },
  { label: 'Notifications' },
  { label: 'Privacy' },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-1 flex-col gap-6 bg-primary-50 px-6 py-8">
      <div className="rounded-card bg-white p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <PersonIcon className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-ink">{user?.full_name || 'Your profile'}</h1>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-card bg-white shadow-soft">
        {SETTINGS_ITEMS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={item.to ? () => navigate(item.to) : undefined}
            disabled={!item.to}
            className={`flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-ink transition-colors ${
              item.to ? 'hover:bg-primary-50' : 'cursor-default'
            } ${index !== SETTINGS_ITEMS.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            {item.label}
            <ChevronRightIcon className="h-4 w-4 text-muted" />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-pill bg-red-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
}

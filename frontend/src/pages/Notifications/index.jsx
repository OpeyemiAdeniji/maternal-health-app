import { ArrowLeft2, Chart, Heart, Notification } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '../../components/common/icons';
import api from '../../services/api';

const TYPE_ICON = {
  love_note: Heart,
  affirmation: Notification,
  mood_alert: Chart,
  epds_reminder: Chart,
};

const TYPE_STYLE = {
  love_note: 'bg-primary-100 text-primary-600',
  affirmation: 'bg-blue-100 text-blue-600',
  mood_alert: 'bg-pink-100 text-pink-600',
  epds_reminder: 'bg-pink-100 text-pink-600',
};

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round((startOfToday - startOfDate) / 86400000);

  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7) return `${dayDiff} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api
      .get('/api/notifications/')
      .then(({ data }) => setNotifications(data))
      .catch(() => setNotifications([]))
      .finally(() => setLoaded(true));
  }, []);

  const markRead = (notification) => {
    if (notification.is_read) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
    );
    api.patch(`/api/notifications/${notification.id}/read/`).catch(() => {});
  };

  const handleToggle = (notification) => {
    const expanding = expandedId !== notification.id;
    setExpandedId(expanding ? notification.id : null);
    if (expanding) markRead(notification);
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="border-b border-gray-100 px-4 py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-1 text-sm font-medium text-primary-600"
        >
          <ArrowLeft2 variant="Linear" color="currentColor" className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-ink">Notifications</h1>
      </div>

      <div className="flex-1 px-4 py-6">
        {!loaded ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-muted">
            No notifications yet. We will let you know when something important happens.
          </p>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = TYPE_ICON[notification.notification_type] || Notification;
              const iconStyle = TYPE_STYLE[notification.notification_type] || 'bg-primary-100 text-primary-600';
              const expanded = expandedId === notification.id;
              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleToggle(notification)}
                  className="flex w-full items-start gap-3 rounded-card bg-white p-4 text-left shadow-soft"
                >
                  <span className="mt-1.5 w-2 shrink-0">
                    {!notification.is_read && <span className="block h-2 w-2 rounded-full bg-primary-600" />}
                  </span>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconStyle}`}>
                    <Icon variant="Linear" color="currentColor" className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{notification.title}</span>
                    <span className="mt-0.5 block truncate text-sm text-muted">{notification.message}</span>
                    {expanded && (
                      <span className="mt-2 block whitespace-pre-wrap border-l-2 border-primary-100 pl-3 text-sm text-ink">
                        {notification.message}
                      </span>
                    )}
                    <span className="mt-1 block text-xs text-gray-400">{timeAgo(notification.created_at)}</span>
                  </span>
                  <ChevronRightIcon
                    className={`mt-1.5 h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                      expanded ? '-rotate-90' : 'rotate-90'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { NavLink } from 'react-router-dom';
import {
  BookIcon,
  ChatBubbleIcon,
  ClipboardCheckIcon,
  HeartIcon,
  HomeIcon,
  PhoneIcon,
} from '../../components/common/icons';

const TABS = [
  { to: '/dashboard', label: 'Home', Icon: HomeIcon },
  { to: '/checkin', label: 'Check-in', Icon: HeartIcon },
  { to: '/journal', label: 'Journal', Icon: BookIcon },
  { to: '/chat', label: 'Chat', Icon: ChatBubbleIcon },
  { to: '/epds', label: 'EPDS', Icon: ClipboardCheckIcon },
  { to: '/support', label: 'Support', Icon: PhoneIcon },
];

export default function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-gray-100 bg-white px-2 py-2 shadow-[0_-4px_20px_rgba(107,78,255,0.06)] lg:hidden">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition-colors ${
              isActive ? 'text-primary-600' : 'text-muted'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  isActive ? 'bg-primary-100' : ''
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </footer>
  );
}

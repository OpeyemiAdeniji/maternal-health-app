import { Book1, Chart, Heart, Home2, Profile2User } from 'iconsax-react';
import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/dashboard', label: 'Home', Icon: Home2 },
  { to: '/journal', label: 'Journal', Icon: Book1, tourKey: 'journal' },
  { to: '/support', label: 'Support', Icon: Heart, tourKey: 'support' },
  { to: '/insights', label: 'Insight', Icon: Chart, tourKey: 'insights' },
  { to: '/profile', label: 'You', Icon: Profile2User },
];

export default function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-gray-100 bg-white px-2 py-2 shadow-[0_-4px_20px_rgba(176,15,168,0.06)] lg:hidden">
      {TABS.map(({ to, label, Icon, tourKey }) => (
        <NavLink
          key={to}
          to={to}
          data-tour-target={tourKey}
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
                <Icon
                  variant="Linear"
                  color="currentColor"
                  className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`}
                />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </footer>
  );
}

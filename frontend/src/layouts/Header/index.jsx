import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import { PersonIcon } from '../../components/common/icons';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
      <Logo size="sm" />

      <button
        type="button"
        onClick={() => navigate('/profile')}
        aria-label="Profile"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-colors hover:bg-primary-200"
      >
        <PersonIcon className="h-5 w-5" />
      </button>
    </header>
  );
}

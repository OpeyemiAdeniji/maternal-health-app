import { AppleIcon, GoogleIcon } from '../../../components/common/icons';

// icon-only social buttons, OAuth isn't wired up yet, these are visual placeholders
export default function SocialButtons() {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        aria-label="Continue with Google"
        className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[#b5b4b4] bg-white"
      >
        <GoogleIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Continue with Apple"
        className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[#b5b4b4] bg-white text-text-primary"
      >
        <AppleIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

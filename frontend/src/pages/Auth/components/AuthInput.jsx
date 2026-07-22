import { Eye, EyeSlash } from 'iconsax-react';
import { useState } from 'react';

// underline-only input matching the magenta Figma onboarding design
export default function AuthInput({
  label,
  optional = false,
  icon,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  helperText,
  error,
}) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (revealed ? 'text' : 'password') : type;

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-1 text-sm font-medium text-text-primary">
        {label}
        {optional && <span className="text-xs font-normal text-text-secondary">(Optional)</span>}
      </span>
      <div className={`flex items-center gap-3 border-b ${error ? 'border-red-400' : 'border-[#c5c5c5] focus-within:border-brand'}`}>
        {icon && <span className="h-6 w-6 shrink-0 text-[#bebebe]">{icon}</span>}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-[46px] w-full bg-transparent text-base text-text-primary placeholder-[#bebebe] outline-none"
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setRevealed((v) => !v)}
            className="shrink-0 text-[#bebebe] hover:text-text-secondary"
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? (
              <EyeSlash variant="Linear" color="currentColor" className="h-5 w-5" />
            ) : (
              <Eye variant="Linear" color="currentColor" className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {(helperText || error) && (
        <span className={`mt-1 block text-xs ${error ? 'text-red-500' : 'text-text-secondary'}`}>
          {error || helperText}
        </span>
      )}
    </label>
  );
}

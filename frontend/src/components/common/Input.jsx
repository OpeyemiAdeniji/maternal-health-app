import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './icons';

export default function Input({
  label,
  optional = false,
  helperText,
  error,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
}) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (revealed ? 'text' : 'password') : type;

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-1 text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">(Optional)</span>}
      </span>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-input border px-4 py-3 text-base text-ink placeholder-gray-400 outline-none transition-colors focus:border-primary-500 focus:ring-4 focus:ring-primary-100 ${
            error ? 'border-red-400' : 'border-gray-200'
          } ${isPassword ? 'pr-11' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setRevealed((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-primary-600"
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        )}
      </div>
      {(helperText || error) && (
        <span className={`mt-1 block text-xs ${error ? 'text-red-500' : 'text-muted'}`}>
          {error || helperText}
        </span>
      )}
    </label>
  );
}

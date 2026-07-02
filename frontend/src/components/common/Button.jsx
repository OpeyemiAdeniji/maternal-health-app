const VARIANTS = {
  primary: 'bg-primary-600 text-white shadow-soft hover:bg-primary-700 disabled:bg-primary-200 disabled:shadow-none',
  secondary: 'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50',
  ghost: 'bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50',
  text: 'bg-transparent text-primary-600 hover:text-primary-700',
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  fullWidth = true,
  disabled = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-pill px-6 py-3 text-base font-semibold transition-all duration-200 disabled:cursor-not-allowed ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

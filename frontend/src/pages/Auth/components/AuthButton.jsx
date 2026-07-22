const VARIANTS = {
  primary: 'bg-brand text-white disabled:bg-brand/40',
  secondary: 'bg-white text-text-primary border border-[#b5b4b4]',
};

export default function AuthButton({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`h-11 w-full rounded-xl text-base font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

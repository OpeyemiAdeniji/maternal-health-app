const SIZES = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export default function Logo({ size = 'md', className = '' }) {
  return (
    <span className={`font-bold uppercase tracking-[4px] text-primary-600 ${SIZES[size]} ${className}`}>
      Modacare
    </span>
  );
}

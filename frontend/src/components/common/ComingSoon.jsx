import { SparkleIcon } from './icons';

export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-primary-50 px-6 py-16 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-primary-600">
        <SparkleIcon className="h-10 w-10" />
      </span>
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      <p className="text-sm font-medium text-muted">Coming soon</p>
      <p className="max-w-xs text-sm text-muted">
        We're working on something lovely for you here. Thank you for your patience.
      </p>
    </div>
  );
}

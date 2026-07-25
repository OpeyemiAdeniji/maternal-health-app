import { CloseCircle } from 'iconsax-react';

export default function LearnCoachmark({ onDismiss }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onDismiss} />
      <div className="absolute right-0 top-full z-50 mt-3 w-56 rounded-xl border border-gray-100 bg-white p-3 shadow-soft">
        <span className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 border-l border-t border-gray-100 bg-white" />
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute right-2 top-2 text-gray-400 hover:text-ink"
        >
          <CloseCircle variant="Linear" color="currentColor" className="h-4 w-4" />
        </button>
        <p className="pr-5 text-xs font-medium leading-snug text-ink">
          New: Explore articles for your stage.
        </p>
      </div>
    </>
  );
}

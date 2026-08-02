import { useEffect, useState } from 'react';

const SPOTLIGHT_PADDING = 8;
const CAPTION_WIDTH = 280;

// Header/Sidebar/Footer carry the same data-tour-target key on both mobile and desktop variants, only one is visible at a time, so pick whichever one actually renders
function getVisibleTourTarget(key) {
  const candidates = document.querySelectorAll(`[data-tour-target="${key}"]`);
  for (const el of candidates) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return el;
  }
  return null;
}

export default function GuidedTour({ steps, onFinish }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  useEffect(() => {
    const target = getVisibleTourTarget(step.key);
    if (!target) {
      // nothing to highlight on this viewport, so move on rather than stalling on a step that can't render
      if (isLast) {
        onFinish();
      } else {
        setStepIndex((i) => i + 1);
      }
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const updateRect = () => setRect(target.getBoundingClientRect());
    updateRect();
    // scrollIntoView animates, so the rect settles a moment after the initial read
    const settleTimer = setTimeout(updateRect, 350);

    window.addEventListener('resize', updateRect);
    return () => {
      clearTimeout(settleTimer);
      window.removeEventListener('resize', updateRect);
    };
  }, [stepIndex]);

  if (!rect) return null;

  const spotlightTop = rect.top - SPOTLIGHT_PADDING;
  const spotlightLeft = rect.left - SPOTLIGHT_PADDING;
  const spotlightWidth = rect.width + SPOTLIGHT_PADDING * 2;
  const spotlightHeight = rect.height + SPOTLIGHT_PADDING * 2;

  const targetInTopHalf = rect.top < window.innerHeight / 2;
  const captionLeft = Math.min(
    Math.max(rect.left + rect.width / 2 - CAPTION_WIDTH / 2, 16),
    window.innerWidth - CAPTION_WIDTH - 16
  );

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setRect(null);
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="absolute rounded-2xl border-2 border-white transition-all duration-300"
        style={{
          top: spotlightTop,
          left: spotlightLeft,
          width: spotlightWidth,
          height: spotlightHeight,
          boxShadow: '0 0 0 9999px rgba(17, 17, 17, 0.72)',
        }}
      />

      <div
        className="absolute rounded-card bg-white p-4 shadow-soft"
        style={{
          width: CAPTION_WIDTH,
          left: captionLeft,
          top: targetInTopHalf ? spotlightTop + spotlightHeight + 12 : undefined,
          bottom: targetInTopHalf ? undefined : window.innerHeight - spotlightTop + 12,
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">{step.title}</p>
        <p className="mt-1.5 text-sm text-ink">{step.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <button type="button" onClick={onFinish} className="text-xs font-medium text-muted">
            Skip tour
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">
              {stepIndex + 1}/{steps.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-pill bg-primary-600 px-4 py-2 text-xs font-semibold text-white"
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

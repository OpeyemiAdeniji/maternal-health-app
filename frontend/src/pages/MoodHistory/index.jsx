import { ArrowLeft2 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const MOOD_OPTIONS = [
  { value: 1, emoji: '😔', label: 'Rough' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
];

const SLEEP_OPTIONS = [
  { value: 1, emoji: '😴', label: 'Poor' },
  { value: 2, emoji: '😪', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😌', label: 'Good' },
  { value: 5, emoji: '✨', label: 'Great' },
];

function formatCheckinDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function MoodHistory() {
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get('/api/checkins/')
      .then(({ data }) => {
        // already ordered newest-first, but sort defensively in case that ever changes
        const sorted = [...data].sort((a, b) => (a.date < b.date ? 1 : -1));
        setCheckins(sorted);
      })
      .catch(() => setCheckins([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="border-b border-gray-100 px-4 py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-1 text-sm font-medium text-primary-600"
        >
          <ArrowLeft2 variant="Linear" color="currentColor" className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-ink">Mood History</h1>
        <p className="mt-1 text-xs text-muted">Every check-in you've logged, newest first.</p>
      </div>

      <div className="flex-1 px-4 py-6">
        {!loaded ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : checkins.length === 0 ? (
          <p className="text-sm text-muted">No check-ins yet.</p>
        ) : (
          <div className="space-y-2">
            {checkins.map((checkin) => (
              <div key={checkin.id} className="rounded-card bg-white p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs font-medium text-muted">
                    {formatCheckinDate(checkin.date)}
                  </span>
                  <span className="text-xl" title={MOOD_OPTIONS[checkin.mood_score - 1]?.label}>
                    {MOOD_OPTIONS[checkin.mood_score - 1]?.emoji}
                  </span>
                  <span className="text-xl" title={SLEEP_OPTIONS[checkin.sleep_score - 1]?.label}>
                    {SLEEP_OPTIONS[checkin.sleep_score - 1]?.emoji}
                  </span>
                </div>
                {checkin.trigger_note && (
                  <p className="mt-2 border-l-2 border-primary-100 pl-3 text-sm text-muted">
                    {checkin.trigger_note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { ArrowRight2 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Learn() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/api/learn/')
      .then(({ data }) => setTopics(data))
      .catch(() => setError("We couldn't load Learn content right now. Please try again later."))
      .finally(() => setLoading(false));

    // opening this page is what actually clears the new-content dot on the Learn icon
    api
      .patch('/api/auth/profile/', {
        last_visited_learn_at: new Date().toISOString(),
        learn_coachmark_dismissed: true,
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6 bg-white px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Learn</h1>
        <p className="mt-1 text-sm text-muted">Articles picked for where you are right now.</p>
      </div>

      {loading && <p className="text-sm text-muted">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        topics.length > 0 ? (
          <div className="space-y-3">
            {topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => navigate(`/learn/${topic.id}`)}
                className="flex w-full items-center justify-between gap-3 rounded-card bg-white p-5 text-left shadow-soft"
              >
                <div>
                  {topic.category && (
                    <span className="mb-1 inline-block rounded-pill bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                      {topic.category}
                    </span>
                  )}
                  <h3 className="text-base font-semibold text-ink">{topic.title}</h3>
                  <p className="mt-1 text-sm text-muted">{topic.summary}</p>
                </div>
                <ArrowRight2 variant="Linear" color="currentColor" className="h-4 w-4 shrink-0 text-primary-600" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No topics available yet — check back soon.</p>
        )
      )}
    </div>
  );
}

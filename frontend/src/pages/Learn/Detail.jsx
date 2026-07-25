import { ArrowLeft2, Link1 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function formatReviewedDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function LearnDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/api/learn/${id}/`)
      .then(({ data }) => setTopic(data))
      .catch(() => setError("We couldn't find that article."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex flex-1 flex-col bg-white px-6 py-8">
      <button
        type="button"
        onClick={() => navigate('/learn')}
        className="flex items-center gap-1 text-sm font-medium text-primary-600"
      >
        <ArrowLeft2 variant="Linear" color="currentColor" className="h-4 w-4" />
        Back to Learn
      </button>

      {loading && <p className="mt-6 text-sm text-muted">Loading…</p>}
      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      {!loading && !error && topic && (
        <div className="mt-6 mx-auto w-full max-w-md">
          {topic.category && (
            <span className="mb-2 inline-block rounded-pill bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
              {topic.category}
            </span>
          )}
          <h1 className="text-xl font-semibold text-ink">{topic.title}</h1>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink">
            {topic.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {topic.source_name && (
            <div className="mt-6 rounded-card border border-gray-100 bg-[#fafafa] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Source</p>
              <p className="mt-1.5 text-sm text-ink">{topic.attribution_note}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {topic.source_url && (
                  <a
                    href={topic.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-primary-600"
                  >
                    <Link1 variant="Linear" color="currentColor" className="h-3.5 w-3.5" />
                    View source ({topic.source_name})
                  </a>
                )}
                {topic.last_reviewed_at && (
                  <span className="text-xs text-muted">
                    Last reviewed {formatReviewedDate(topic.last_reviewed_at)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { PersonIcon, PhoneIcon } from '../../components/common/icons';
import api from '../../services/api';

function accentFor(name) {
  if (name.includes('HSE')) return 'border-l-blue-400';
  if (name.includes('Nurture')) return 'border-l-green-400';
  if (name.includes('Samaritans')) return 'border-l-orange-400';
  return 'border-l-primary-400';
}

export default function Support() {
  const [personalContact, setPersonalContact] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/api/support/')
      .then(({ data }) => {
        setPersonalContact(data.personal_contact || null);
        setResources(data.resources || []);
      })
      .catch(() => setError("We couldn't load your support resources. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6 bg-primary-50 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">You are not alone. Help is here.</h1>
        <p className="mt-1 text-sm text-muted">
          People and services you can reach out to whenever you need to.
        </p>
      </div>

      {loading && <p className="text-sm text-muted">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {personalContact && (
            <div className="rounded-card bg-gradient-to-br from-primary-100 via-primary-50 to-white p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                  <PersonIcon className="h-6 w-6" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                    Your contact
                  </span>
                  <h2 className="text-lg font-semibold text-ink">{personalContact.name}</h2>
                </div>
              </div>
              <a
                href={`tel:${personalContact.phone}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-pill bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-700"
              >
                <PhoneIcon className="h-4 w-4" />
                Call {personalContact.phone}
              </a>
            </div>
          )}

          {resources.map((resource) => (
            <div
              key={resource.name}
              className={`rounded-card border-l-4 bg-white p-5 shadow-soft ${accentFor(resource.name)}`}
            >
              <h2 className="text-lg font-semibold text-ink">{resource.name}</h2>
              <p className="mt-1 text-sm text-muted">{resource.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-primary-600">
                <a href={`tel:${resource.phone}`} className="flex items-center gap-1.5">
                  <PhoneIcon className="h-4 w-4" />
                  {resource.phone}
                </a>
                <a href={resource.url} target="_blank" rel="noreferrer">
                  Visit website
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

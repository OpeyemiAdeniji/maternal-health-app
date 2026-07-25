import { Call, Headphone, Hospital, Profile2User } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const RELATIONSHIP_LABELS = {
  partner: 'Partner',
  friend: 'Best Friend',
  family: 'Family',
  gp: 'GP',
  midwife: 'Midwife',
};

const PERSONAL_TYPES = ['partner', 'friend', 'family'];
const PROFESSIONAL_TYPES = ['gp', 'midwife'];

function ContactCard({ contact }) {
  return (
    <div className="rounded-card bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">{contact.name}</h3>
        <span className="shrink-0 rounded-pill bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
          {RELATIONSHIP_LABELS[contact.relationship_type] || contact.relationship_type}
        </span>
      </div>
      <a
        href={`tel:${contact.phone}`}
        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary-600"
      >
        <Call variant="Linear" color="currentColor" className="h-4 w-4" />
        {contact.phone}
      </a>
    </div>
  );
}

function CardEyebrowIcon({ icon, label, colorClass }) {
  return (
    <h2 className={`mb-2 flex items-center gap-1 text-[13px] font-medium ${colorClass}`}>
      {icon}
      <span>{label}</span>
    </h2>
  );
}

export default function Support() {
  const [contacts, setContacts] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/api/contacts/')
      .then(({ data }) => setContacts(data))
      .catch(() => setContacts([]));

    api
      .get('/api/support/')
      .then(({ data }) => setResources(data.resources || []))
      .catch(() => setError("We couldn't load your support resources. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const personalContacts = contacts.filter((c) => PERSONAL_TYPES.includes(c.relationship_type));
  const professionalContacts = contacts.filter((c) => PROFESSIONAL_TYPES.includes(c.relationship_type));

  return (
    <div className="flex flex-1 flex-col gap-6 bg-white px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">You are not alone. Help is here.</h1>
        <p className="mt-1 text-sm text-muted">
          People and services you can reach out to whenever you need to.
        </p>
      </div>

      {loading && <p className="text-sm text-muted">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <section>
            <CardEyebrowIcon
              icon={<Profile2User variant="Linear" color="currentColor" className="h-4 w-4" />}
              label="YOUR PERSONAL SUPPORT"
              colorClass="text-[#0187e6]"
            />
            {personalContacts.length > 0 ? (
              <div className="space-y-3">
                {personalContacts.map((contact) => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">
                No personal contacts added yet. Add one from your{' '}
                <Link to="/profile" className="font-semibold text-brand">
                  profile
                </Link>
                .
              </p>
            )}
          </section>

          <section>
            <CardEyebrowIcon
              icon={<Hospital variant="Linear" color="currentColor" className="h-4 w-4" />}
              label="PROFESSIONAL SUPPORT"
              colorClass="text-[#28a668]"
            />
            {professionalContacts.length > 0 ? (
              <div className="space-y-3">
                {professionalContacts.map((contact) => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No GP or midwife added yet.</p>
            )}
          </section>

          <section>
            <CardEyebrowIcon
              icon={<Headphone variant="Linear" color="currentColor" className="h-4 w-4" />}
              label="HELPLINES"
              colorClass="text-[#f48b41]"
            />
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.name}
                  className="rounded-card border-l-4 border-l-primary-600 bg-white p-5 shadow-soft"
                >
                  <h3 className="text-lg font-semibold text-ink">{resource.name}</h3>
                  <p className="mt-1 text-sm text-muted">{resource.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-primary-600">
                    <a href={`tel:${resource.phone}`} className="flex items-center gap-1.5">
                      <Call variant="Linear" color="currentColor" className="h-4 w-4" />
                      {resource.phone}
                    </a>
                    <a href={resource.url} target="_blank" rel="noreferrer">
                      Visit website
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

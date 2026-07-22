import { ArrowLeft2 } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'What we collect',
    body: "We collect the information you choose to share with Modacare — your mood scores, sleep scores, journal entries, EPDS screening results, healthcare contact details, and your device's push notification token.",
  },
  {
    title: 'How we store it',
    body: 'Your data is stored in a PostgreSQL database hosted on Supabase in Ireland, within the EU, and is handled in line with GDPR.',
  },
  {
    title: 'Who can see it',
    body: 'Only you can see your data. We never share, sell, or otherwise disclose it to third parties.',
  },
  {
    title: 'Your rights',
    body: 'You can request deletion of your account and all associated data at any time by contacting us.',
  },
  {
    title: 'Safe messaging',
    body: 'Modacare is a support tool, not a clinical service. It does not diagnose or treat any condition — always speak to a healthcare professional about medical concerns.',
  },
];

export default function Privacy() {
  const navigate = useNavigate();

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
        <h1 className="text-2xl font-bold text-ink">Privacy Policy</h1>
        <p className="mt-1 text-xs text-muted">Last updated July 2026</p>
      </div>

      <div className="flex-1 space-y-8 px-4 py-6">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-semibold text-ink">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="border-t border-gray-100 px-4 py-6 text-center text-xs text-muted">
        Modacare is built as part of an academic project at National College of Ireland.
      </div>
    </div>
  );
}

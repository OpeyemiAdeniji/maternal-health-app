import { ArrowLeft2 } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'What Modacare is',
    body: 'Modacare is a student capstone project, built for the Higher Diploma in Computing (Software Development) at National College of Ireland. It is not a certified medical product, and it has not been reviewed or approved by any medical or regulatory body. Using it does not create a clinical relationship with anyone.',
  },
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
    body: 'Only you can see your data. We never share, sell, or otherwise disclose it to third parties. A Safety Net contact you choose to add can see a limited, deliberately gentle summary via their own private link — never your full data.',
  },
  {
    title: 'Your rights',
    body: 'You can request access to a copy of your data, or its deletion, at any time by contacting us.',
  },
  {
    title: 'Acceptable use',
    body: "By creating an account, you agree to use Modacare respectfully, keep your login details secure, and use it for your own personal wellbeing tracking — please don't use it to store information about someone else without their consent.",
  },
  {
    title: 'Not a substitute for medical care',
    body: "Modacare is a support tool, not a clinical service — it does not diagnose or treat any condition, and it's provided as-is, as an academic project, without any guarantee of accuracy or availability. Always speak to a healthcare professional about medical concerns. If you're ever in crisis or concerned about your safety, please contact emergency services, your GP or midwife, or a helpline immediately — don't rely on this app.",
  },
];

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="border-b border-gray-100 px-4 py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-1 text-sm font-medium text-primary-600"
        >
          <ArrowLeft2 variant="Linear" color="currentColor" className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-ink">Terms &amp; Conditions and Privacy Policy</h1>
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

import { ArrowLeft2, Heart } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';

const BUILT_WITH = ['Django REST Framework', 'React PWA', 'PostgreSQL on Supabase', 'Firebase Cloud Messaging'];

export default function About() {
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
      </div>

      <div className="flex-1 space-y-8 px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <p className="mt-2 text-sm font-medium text-muted">Your maternal wellbeing companion</p>
          <p className="mt-1 text-xs text-muted">Version 1.0.0</p>
        </div>

        <p className="text-sm leading-relaxed text-ink">
          Modacare is a maternal mental health companion app designed to support pregnant and
          postpartum women with daily mood tracking, journaling, EPDS screening, pattern analysis,
          and personalised wellbeing insights.
        </p>

        <section>
          <h2 className="text-base font-semibold text-ink">Built with care</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-muted">
            {BUILT_WITH.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-card border border-yellow-200 bg-yellow-50 p-4">
          <h2 className="text-base font-semibold text-ink">Important notice</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Modacare is a support tool and not a substitute for professional medical advice. If
            you are in crisis, please contact your GP, midwife, or call Samaritans Ireland on{' '}
            <span className="font-semibold text-ink">116 123</span>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Academic project</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Built as a final year project for the Higher Diploma in Computing (Software
            Development) at National College of Ireland, 2026.
          </p>
        </section>
      </div>

      <div className="flex items-center justify-center gap-1.5 border-t border-gray-100 px-4 py-6 text-xs text-muted">
        <Heart variant="Linear" color="currentColor" className="h-3.5 w-3.5 text-pink-400" />
        Made with care for mothers everywhere
      </div>
    </div>
  );
}

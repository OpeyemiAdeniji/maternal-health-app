import { ArrowLeft2, Heart } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';

const HOW_IT_HELPS = [
  'Daily mood and sleep check-ins, so patterns are easier to notice before they feel overwhelming',
  "A private journal, a space that's just yours, for whatever you need to put into words",
  'A gentle chat companion, there to talk things through whenever you need it',
  "Regular wellbeing check-ins (EPDS), so changes in how you're feeling don't go unnoticed",
  'A Safety Net that quietly keeps the people who care about you in the loop, without you having to be the one to reach out',
];

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
          <p className="mt-2 text-sm font-medium text-muted">
            Your companion through pregnancy, motherhood, and beyond
          </p>
          <p className="mt-1 text-xs text-muted">Version 1.0.0</p>
        </div>

        <p className="text-sm leading-relaxed text-ink">
          Motherhood doesn't happen in one moment, it's a journey that stretches from the earliest
          weeks of pregnancy, through the newborn haze, and into all the years that follow. Modacare
          walks alongside you through that whole journey, giving you a private, caring space to
          check in with yourself, whenever you need it.
        </p>

        <section>
          <h2 className="text-base font-semibold text-ink">Who it's for</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Whether you're newly pregnant, adjusting to life with a new baby, further down the road
            as a seasoned mother, or simply someone who loves and supports a mother through it all,
            Modacare is built for you.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">How Modacare helps</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-muted">
            {HOW_IT_HELPS.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
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

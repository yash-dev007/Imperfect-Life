import Reveal from './Reveal';
import stairsImage from '../assets/G2.png';

const features = [
  {
    title: '1:1 mentorship',
    body: 'Matched with founders and operators who have built before.',
  },
  {
    title: 'Hands-on workshops',
    body: 'Product, go-to-market, and finance — learn by building.',
  },
  {
    title: 'Pitch preparation',
    body: 'Deck reviews and mock rounds until the story lands.',
  },
  {
    title: 'Investor access',
    body: 'Demo day in front of angels and funds, plus warm connects.',
  },
];

/**
 * FounderToolkit — full-bleed editorial section under AutonomousExecution.
 * Eyebrow, two-tone headline, supporting copy, 2x2 feature grid on the
 * left; the mossy-stairs asset (G2.png) bleeds to the right edge.
 * Copy is aligned to the E-Cell program (idea → funded).
 */
export default function FounderToolkit() {
  return (
    <section aria-label="Founder toolkit" className="relative overflow-hidden bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ---- Copy ---- */}
        <div className="px-6 py-14 sm:px-10 sm:py-16 lg:px-20 lg:py-24">
          <Reveal>
            <p className="font-mono text-[13px] tracking-widest text-white/40">
              <span aria-hidden="true" className="mr-3 inline-block h-px w-8 translate-y-[-4px] bg-white/30" />
              Founder toolkit
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 className="mt-8 font-['Inter'] text-[3.25rem] font-medium leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl lg:text-[5.5rem] xl:text-[6.75rem]">
              Bring your idea.
              <span className="block text-white/40">Leave with a startup.</span>
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md font-body text-[15px] font-light leading-[1.7] text-white/45">
              One track from registration to funding. Structured mentorship,
              hands-on workshops, and investor access — built for student
              founders at every stage.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={0.05 * i}>
                <p className="font-body text-[15px] font-medium text-white/90">
                  {feature.title}
                </p>
                <p className="mt-1.5 font-body text-[13px] font-light leading-relaxed text-white/40">
                  {feature.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ---- Visual ---- */}
        <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-full">
          <img
            src={stairsImage}
            alt="Moss-covered stone steps rising into the dark"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* melt the image edge into the black copy side */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent sm:w-40 lg:w-56"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/50 to-transparent lg:h-48"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent lg:h-64"
          />
        </div>
      </div>
    </section>
  );
}

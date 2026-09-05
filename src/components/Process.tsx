import Reveal from './Reveal';

const steps = [
  {
    n: '01',
    title: 'Apply',
    body: 'Fill the registration form in five minutes. Idea-stage teams are welcome.',
  },
  {
    n: '02',
    title: 'Screen',
    body: 'A quick call to understand your team, traction, and what you need most.',
  },
  {
    n: '03',
    title: 'Mentor',
    body: 'Get a matched 1:1 mentor plus workshops across product, GTM, and finance.',
  },
  {
    n: '04',
    title: 'Pitch & Fund',
    body: 'Demo day in front of investors, with warm connects to angels and funds.',
  },
];

export default function Process() {
  return (
    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, i) => (
        <Reveal key={step.n} delay={i * 0.1}>
          <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[200px] md:min-h-[240px] flex flex-col gap-6 h-full">
            <div className="font-heading italic text-5xl tracking-[-2px] leading-none text-white/90">
              {step.n}
            </div>
            <div className="flex-1" />
            <h3 className="font-heading italic text-2xl md:text-3xl tracking-[-1px] leading-none text-white">
              {step.title}
            </h3>
            <p className="mt-3 text-sm text-white/80 font-body font-light leading-snug">
              {step.body}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

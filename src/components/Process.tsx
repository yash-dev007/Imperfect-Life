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
    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {steps.map((step, i) => (
        <Reveal key={step.n} delay={i * 0.1} className="h-full">
          <div className="rounded-none border border-white/10 bg-black p-6 sm:p-7 min-h-[260px] md:min-h-[300px] flex flex-col h-full">
            <div className="font-heading italic text-[2.5rem] leading-none tracking-tight text-white">
              {step.n}
            </div>
            <div className="flex-1 min-h-16" />
            <h3 className="font-heading italic text-2xl tracking-tight leading-none text-white">
              {step.title}
            </h3>
            <p className="mt-3 text-[13px] text-white/55 font-body font-light leading-relaxed">
              {step.body}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

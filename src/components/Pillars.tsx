import { RocketIcon, UsersIcon, TrendUpIcon } from './icons';

const pillars = [
  {
    title: 'Register',
    Icon: RocketIcon,
    tags: ['Idea Stage', 'MVP', 'Revenue', 'Students & Alumni'],
    body: 'Tell us what you are building in five minutes. Every stage is welcome — from a napkin sketch to early revenue — and every application gets a response.',
  },
  {
    title: 'Mentorship',
    Icon: UsersIcon,
    tags: ['1:1 Mentors', 'Workshops', 'Go-to-Market', 'Tech & Design'],
    body: 'Get matched with founders and operators who have done it before. Structured guidance across product, growth, and finance — not generic gyaan.',
  },
  {
    title: 'Funding',
    Icon: TrendUpIcon,
    tags: ['Pitch Prep', 'Investor Connects', 'Demo Day', 'Grants'],
    body: 'Become funding-ready with pitch reviews and mock rounds, then meet angels and funds at demo day — plus guidance on grants and schemes.',
  },
];

export default function Pillars() {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      {pillars.map(({ title, Icon, tags, body }) => (
        <div
          key={title}
          className="liquid-glass rounded-[1.25rem] p-6 min-h-[280px] md:min-h-[360px] flex flex-col gap-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 items-center justify-center shrink-0 rounded-none border border-white/10 bg-black">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="glass-pill rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1" />

          <div>
            <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none text-white">
              {title}
            </h3>
            <p className="mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
              {body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

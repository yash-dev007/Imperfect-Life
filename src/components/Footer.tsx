import footerImage from '../assets/G1.png';

const columns: { heading: string; links: { label: string; href: string; badge?: string }[] }[] = [
  {
    heading: 'Program',
    links: [
      { label: 'Apply now', href: '#register', badge: 'Open' },
      { label: 'How it works', href: '#process' },
      { label: 'Mentorship', href: '#pillars' },
      { label: 'Demo day', href: '#process' },
    ],
  },
  {
    heading: 'Track',
    links: [
      { label: 'Register', href: '#register' },
      { label: 'Get mentored', href: '#pillars' },
      { label: 'Get funded', href: '#pillars' },
      { label: 'Timeline', href: '#process' },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { label: 'X', href: '#top' },
      { label: 'Instagram', href: '#top' },
      { label: 'LinkedIn', href: '#top' },
      { label: 'Email', href: 'mailto:hello@ecell.example.com' },
    ],
  },
  {
    heading: 'Info',
    links: [
      { label: 'About', href: '#top' },
      { label: 'Contact', href: '#contact' },
      { label: 'Back to top', href: '#top' },
    ],
  },
];

/**
 * Footer — full-bleed G1.png flower-hill banner dissolving into black,
 * brand + tagline + socials, four E-Cell-aligned link columns, and a
 * bottom bar with copyright + live status.
 */
export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-black pt-16 sm:pt-20 lg:pt-24">
      {/* ---- Full-bleed banner, no side spacing ---- */}
      <div className="relative h-[280px] w-full overflow-hidden sm:h-[360px] lg:h-[440px]">
        <img
          src={footerImage}
          alt="Glowing flower-covered hill at night"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent lg:h-56"
        />
      </div>

      {/* ---- Link grid ---- */}
      <div className="px-6 pb-8 pt-14 sm:px-10 lg:px-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <p className="font-body text-lg font-medium uppercase tracking-[0.18em] text-white">
              E-Cell
            </p>
            <p className="mt-6 max-w-[32ch] font-body text-sm font-light leading-relaxed text-white/45">
              The student initiative turning campus ideas into funded startups.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {['X', 'Instagram', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="#top"
                  aria-label={`${social} (placeholder)`}
                  className="font-body text-sm font-light text-white/45 transition-colors duration-200 hover:text-white"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="font-body text-sm font-medium text-white">{col.heading}</p>
              <ul className="mt-6 flex flex-col gap-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 font-body text-sm font-light text-white/45 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-black">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-body text-xs font-light text-white/35">
            © 2026 E-Cell — Ideas in. Startups out.
          </span>
          <span className="inline-flex items-center gap-2 font-body text-xs font-light text-white/45">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Registrations open
          </span>
        </div>
      </div>
    </footer>
  );
}

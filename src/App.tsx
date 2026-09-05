import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import FadingVideo from './components/FadingVideo';
import BlurText from './components/BlurText';
import Reveal from './components/Reveal';
import LithosSection from './components/LithosSection';
import Pillars from './components/Pillars';
import Process from './components/Process';
import RegisterForm from './components/RegisterForm';
import {
  ArrowUpRight,
  RocketIcon,
  UsersIcon,
  CheckIcon,
  MenuIcon,
  CloseIcon,
} from './components/icons';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Program', href: '#top' },
  { label: 'Pillars', href: '#pillars' },
  { label: 'Process', href: '#process' },
  { label: 'Register', href: '#register' },
  { label: 'Contact', href: '#contact' },
];
const trackSteps = ['Register', 'Mentor', 'Fund'];

const nextSteps = [
  'Five-minute application — idea stage welcome',
  'Screening call within days of applying',
  'Mentor match, workshops, then demo day',
];

const socials = ['X', 'Instagram', 'LinkedIn'];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);
  useEffect(() => {
    // Scroll-spy: highlight the nav link of the section in view.
    // Runs under reduced motion too — position awareness aids comprehension.
    const spyLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'nav[aria-label="Primary"] a[href^="#"]:not(.bg-white)',
      ),
    );
    const spyTriggers = ['#top', '#pillars', '#process', '#register', '#contact'].map(
      (id) =>
        ScrollTrigger.create({
          trigger: id,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (!self.isActive) return;
            spyLinks.forEach((link) =>
              link.classList.toggle('nav-active', link.getAttribute('href') === id),
            );
          },
        }),
    );
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return () => {
        spyTriggers.forEach((trigger) => trigger.kill());
      };
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      window.removeEventListener('load', refresh);
      spyTriggers.forEach((trigger) => trigger.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-black text-white font-body">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-white focus:text-black focus:px-5 focus:py-2.5 focus:rounded-full focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      {/* ---------- Section 1: Hero ---------- */}
      <section id="top" className="min-h-[100dvh] lg:h-screen overflow-hidden bg-black relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-0 h-[62vh] overflow-hidden sm:left-1/2 sm:h-[120%] sm:w-[120%] sm:-translate-x-1/2"
        >
          <FadingVideo
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-black sm:hidden" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-48 bg-gradient-to-b from-transparent to-black"
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Navbar */}
          <nav aria-label="Primary" className="fixed top-4 left-0 right-0 z-50 flex justify-between items-center px-8 lg:px-16">
            <div className="liquid-glass h-12 w-12 rounded-full flex items-center justify-center">
              <span className="font-heading italic text-2xl text-white">e</span>
            </div>

            <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1.5 items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-white/90 font-body transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#register"
                className="ml-1 flex items-center gap-1 bg-white text-black rounded-full px-4 py-2 text-sm font-medium font-body lift hover:shadow-lg hover:shadow-white/20"
              >
                Register Now
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div aria-hidden="true" className="h-12 w-12 hidden md:block" />

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
              className="md:hidden liquid-glass h-12 w-12 rounded-full flex items-center justify-center text-white"
            >
              {menuOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </nav>

          {menuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden fixed top-20 left-4 right-4 z-50 liquid-glass-strong rounded-[1.5rem] p-3"
            >
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-base font-medium font-body text-white/90 rounded-2xl transition-colors duration-200 hover:text-white hover:bg-white/10"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#register"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 flex items-center justify-center gap-1 bg-white text-black rounded-full px-4 py-3 text-sm font-medium font-body"
                >
                  Register Now
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}

          {/* Main content */}
          <div id="main" className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center min-h-0 py-8">
            <Reveal delay={0.4}>
              <div className="liquid-glass rounded-full flex items-center justify-center gap-2 py-1.5 pl-1.5 pr-4 max-w-full flex-wrap">
                <span className="bg-white text-black rounded-full px-2.5 py-0.5 text-xs font-medium font-body shrink-0">
                  Open
                </span>
                <span className="text-xs sm:text-sm text-white/90 font-body text-center">
                  Registrations open — idea to revenue, all welcome
                </span>
              </div>
            </Reveal>

            <div className="mt-6 max-w-3xl">
              <BlurText
                as="h1"
                delay={0.2}
                text="Ideas In. Startups Out."
                className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] tracking-[-4px]"
              />
            </div>

            <Reveal delay={0.8}>
              <p className="mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight">
                The E-Cell initiative that takes student startups from
                registration to funding — structured mentorship, operator
                guidance, and investor access, all in one track.
              </p>
            </Reveal>

            <Reveal delay={1.1}>
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                <a
                  href="#register"
                  className="liquid-glass-strong rounded-full px-5 py-2.5 flex items-center justify-center gap-2 text-sm font-medium font-body text-white lift"
                >
                  Register Your Startup
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="#process"
                  className="flex items-center justify-center gap-2 text-sm font-medium font-body text-white transition-colors duration-300 hover:text-white/70"
                >
                  See how it works
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={1.3}>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left">
                  <RocketIcon className="h-6 w-6 text-white" />
                  <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4 text-white">
                    3-Step
                  </div>
                  <div className="mt-2 text-xs text-white/80 font-body font-light leading-snug">
                    Register → Mentor → Fund In One Track
                  </div>
                </div>
                <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left">
                  <UsersIcon className="h-6 w-6 text-white" />
                  <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4 text-white">
                    1:1
                  </div>
                  <div className="mt-2 text-xs text-white/80 font-body font-light leading-snug">
                    Mentorship With Founders & Operators
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bottom track bar */}
          <Reveal delay={1.4} className="hidden lg:flex flex-col items-center gap-4 pb-8">
            <div className="liquid-glass rounded-full px-5 py-2">
              <span className="text-xs md:text-sm text-white/80 font-body">
                One track, end to end
              </span>
            </div>
            <div className="flex flex-row flex-wrap justify-center px-4 gap-12 md:gap-16">
              {trackSteps.map((step) => (
                <span
                  key={step}
                  className="font-heading italic text-2xl md:text-3xl tracking-tight text-white"
                >
                  {step}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Section 2: Pillars ---------- */}
      <section id="pillars" className="min-h-screen overflow-hidden bg-black relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-0 h-[62vh] overflow-hidden sm:inset-0 sm:h-full"
        >
          <FadingVideo
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-black sm:hidden" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-48 bg-gradient-to-b from-black to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-48 bg-gradient-to-b from-transparent to-black"
        />

        <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col min-h-screen">
          <div className="mb-auto">
            <p className="text-sm font-body text-white/80 mb-6">
              {'// What you get'}
            </p>
            <BlurText
              as="h2"
              justify="left"
              text={'Register. Get mentored.\nGet funded.'}
              className="font-heading italic text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px] text-white"
            />
          </div>

          <Pillars />
        </div>
      </section>

      {/* ---------- Section 3: Process ---------- */}
      <section id="process" className="overflow-hidden bg-black relative">
        <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-16 flex flex-col">
          <p className="text-sm font-body text-white/80 mb-6">
            {'// How it works'}
          </p>
          <BlurText
            as="h2"
            justify="left"
            text={'From application\nto funded.'}
            className="font-heading italic text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px] text-white"
          />
          <Process />
        </div>
      </section>

      {/* ---------- Section 4: Register ---------- */}
      <section id="register" className="overflow-hidden bg-black relative">
        <div className="relative z-10 px-8 md:px-16 lg:px-20 py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-sm font-body text-white/80 mb-6">
              {'// Register'}
            </p>
            <BlurText
              as="h2"
              justify="left"
              text="Get your startup in."
              className="font-heading italic text-6xl md:text-7xl leading-[0.9] tracking-[-3px] text-white"
            />
            <p className="mt-5 text-sm md:text-base text-white/80 max-w-xl font-body font-light leading-relaxed">
              Five minutes, no deck required. Tell us what you are building
              and where you are stuck — we take it from there.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {nextSteps.map((step) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="liquid-glass h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-sm font-body text-white/85">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <RegisterForm />
        </div>
      </section>

      {/* ---------- Section 5: Lithos ---------- */}
      <LithosSection />

      <footer id="contact" className="relative overflow-hidden bg-black">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent"
        />
        <div className="relative px-5 sm:px-8 lg:px-12 pt-10 md:pt-12 pb-8">
          {/* CTA panel */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07),transparent_70%)]"
            />
            <div className="relative liquid-glass rounded-[1.5rem] p-8 md:p-12 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            <div className="flex-1">
              <p className="text-sm font-body text-white/80 mb-4">
                {'// Get funded'}
              </p>
              <p className="font-heading italic text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-[-2px] text-white">
                Have a startup? Let&apos;s build it.
              </p>
              <p className="mt-4 text-sm md:text-base text-white/75 max-w-lg font-body font-light leading-relaxed">
                Registration takes five minutes. Mentorship, guidance, and
                investor access follow — all in one student-run track.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0">
              <a
                href="#register"
                className="flex items-center justify-center gap-1 bg-white text-black rounded-full px-7 py-3 text-sm font-medium font-body lift hover:shadow-lg hover:shadow-white/20 whitespace-nowrap"
              >
                Register Your Startup
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@ecell.example.com"
                className="flex items-center justify-center gap-1 liquid-glass-strong rounded-full px-7 py-3 text-sm font-medium font-body text-white lift whitespace-nowrap"
              >
                Talk to us
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="mt-10 md:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <span className="liquid-glass h-10 w-10 rounded-full flex items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="font-heading italic text-xl text-white"
                  >
                    e
                  </span>
                </span>
                <span className="font-heading italic text-2xl text-white">
                  E-Cell
                </span>
              </div>
              <p className="mt-4 text-sm font-body font-light text-white/60 leading-relaxed max-w-[28ch]">
                The student initiative turning campus ideas into funded
                startups.
              </p>
            </div>
            <nav aria-label="Program">
              <p className="text-xs font-medium font-body uppercase tracking-[0.14em] text-white/50">
                Program
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-body text-white/75 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Track">
              <p className="text-xs font-medium font-body uppercase tracking-[0.14em] text-white/50">
                Track
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  { label: 'Apply now', href: '#register' },
                  { label: 'Mentorship', href: '#pillars' },
                  { label: 'Funding', href: '#pillars' },
                  { label: 'Demo day', href: '#process' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-body text-white/75 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="text-xs font-medium font-body uppercase tracking-[0.14em] text-white/50">
                Connect
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a
                    href="mailto:hello@ecell.example.com"
                    className="text-sm font-body text-white/75 transition-colors duration-200 hover:text-white break-all"
                  >
                    hello@ecell.example.com
                  </a>
                </li>
                {socials.map((social) => (
                  <li key={social}>
                    <a
                      href="#top"
                      aria-label={`${social} (placeholder)`}
                      className="group inline-flex items-center gap-1 text-sm font-body text-white/75 transition-colors duration-200 hover:text-white"
                    >
                      {social}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/50 font-body text-center sm:text-left">
              © 2026 E-Cell — Ideas in. Startups out.
            </span>
            <a
              href="#top"
              className="flex items-center gap-1 text-sm font-medium font-body text-white/70 transition-colors duration-200 hover:text-white"
            >
              Back to top
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

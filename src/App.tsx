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
import AutonomousExecution from './components/AutonomousExecution';
import FounderToolkit from './components/FounderToolkit';
import Footer from './components/Footer';
import RegisterForm from './components/RegisterForm';
import {
  ArrowUpRight,
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

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    // Auto-close if the viewport grows to desktop while the menu is open.
    const mq = window.matchMedia('(min-width: 768px)');
    const onViewport = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onViewport);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onViewport);
    };
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
          className="absolute inset-x-0 bottom-0 z-0 h-[40vh] overflow-hidden sm:bottom-auto sm:left-1/2 sm:top-0 sm:h-[120%] sm:w-[120%] sm:-translate-x-1/2"
        >
          <FadingVideo
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4"
            className="h-full w-full object-cover object-center sm:object-top"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent sm:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-black sm:hidden" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-48 bg-gradient-to-b from-transparent to-black"
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Navbar */}
          <nav aria-label="Primary" className="fixed top-4 left-4 right-4 z-50 flex justify-end md:justify-center items-center">
            <div className="hidden md:flex glass-pill rounded-full px-1.5 py-1.5 items-center gap-1">
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

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
              className="md:hidden glass-pill h-12 w-12 rounded-full flex items-center justify-center text-white touch-manipulation select-none cursor-pointer transition-transform duration-150 active:scale-95 shrink-0 mr-3"
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
              className="md:hidden fixed top-20 left-4 right-4 z-50 liquid-glass rounded-[1.5rem] p-3 menu-panel"
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
          <div id="main" className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center min-h-0 pb-[24vh] sm:py-8 sm:pt-24 lg:-translate-y-16">
            <Reveal delay={0.4}>
              <div className="glass-pill rounded-full flex items-center justify-center gap-2 py-1.5 pl-1.5 pr-4 max-w-full flex-wrap">
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
          </div>

          {/* Bottom track bar */}
          <Reveal delay={1.4} className="hidden lg:flex flex-col items-center gap-4 pb-8">
            <div className="glass-pill rounded-full px-5 py-2">
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
          <Reveal className="mt-14">
            <AutonomousExecution />
          </Reveal>
        </div>
      </section>

      {/* ---------- Section 3b: Founder toolkit ---------- */}
      <FounderToolkit />

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
                  <span className="glass-pill h-8 w-8 rounded-full flex items-center justify-center shrink-0">
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

      <Footer />
    </div>
  );
}

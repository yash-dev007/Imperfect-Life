import { useEffect, useRef } from 'react';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85';
const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85';

const SPOTLIGHT_R = 260;

function maskFor(x: number, y: number) {
  return `radial-gradient(circle ${SPOTLIGHT_R}px at ${x}px ${y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, transparent 100%)`;
}

export default function LithosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const smooth = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const reveal = revealRef.current;
    const hint = hintRef.current;
    if (!section || !reveal) return;

    // Reduced motion: keep the legible base image, skip the trailing spotlight.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal.style.opacity = '0';
      if (hint) hint.style.display = 'none';
      return;
    }

    // Start hidden until the pointer first enters.
    reveal.style.opacity = '0';

    const toLocal = (clientX: number, clientY: number) => {
      const rect = section.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const p = toLocal(clientX, clientY);
      mouse.current.x = p.x;
      mouse.current.y = p.y;
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        smooth.current.x = p.x;
        smooth.current.y = p.y;
        reveal.style.opacity = '1';
        if (hint) hint.classList.add('is-hidden');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleLeave = () => {
      // Glide the spotlight off-screen so the reveal melts away.
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    section.addEventListener('mousemove', handleMouseMove, { passive: true });
    section.addEventListener('touchmove', handleTouchMove, { passive: true });
    section.addEventListener('mouseleave', handleLeave);

    const revealAtCenter = () => {
      const rect = section.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      mouse.current.x = cx;
      mouse.current.y = cy;
      smooth.current.x = cx;
      smooth.current.y = cy;
      hasMovedRef.current = true;
      reveal.style.opacity = '1';
      if (hint) hint.classList.add('is-hidden');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 48;
      let dx = 0;
      let dy = 0;
      if (e.key === 'ArrowLeft') dx = -step;
      else if (e.key === 'ArrowRight') dx = step;
      else if (e.key === 'ArrowUp') dy = -step;
      else if (e.key === 'ArrowDown') dy = step;
      else return;
      e.preventDefault();
      const rect = section.getBoundingClientRect();
      if (!hasMovedRef.current) {
        revealAtCenter();
        return;
      }
      // Keyboard input snaps: discrete commands get an immediate,
      // disambiguated response instead of the pointer's trailing glide.
      const nx = Math.min(Math.max(mouse.current.x + dx, 0), rect.width);
      const ny = Math.min(Math.max(mouse.current.y + dy, 0), rect.height);
      mouse.current.x = nx;
      mouse.current.y = ny;
      smooth.current.x = nx;
      smooth.current.y = ny;
    };
    section.addEventListener('keydown', handleKeyDown);

    const observer = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0 },
    );
    observer.observe(section);

    let lastX = Infinity;
    let lastY = Infinity;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (!visibleRef.current || !hasMovedRef.current) return;

      // Eased trailing — direct DOM writes, zero React re-renders.
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.14;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.14;

      const x = smooth.current.x;
      const y = smooth.current.y;
      if (Math.abs(x - lastX) < 0.05 && Math.abs(y - lastY) < 0.05) return;
      lastX = x;
      lastY = y;

      // Fully off-screen → keep layer hidden without mask cost.
      if (x < -2000 || y < -2000) {
        if (reveal.style.opacity !== '0') reveal.style.opacity = '0';
        return;
      }
      if (reveal.style.opacity !== '1') reveal.style.opacity = '1';

      const mask = maskFor(x, y);
      reveal.style.maskImage = mask;
      reveal.style.webkitMaskImage = mask;
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('touchmove', handleTouchMove);
      section.removeEventListener('mouseleave', handleLeave);
      section.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      id="lithos"
      className="min-h-screen bg-black tracking-[-0.02em] lithos-scope"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <section
        ref={sectionRef}
        tabIndex={0}
        aria-label="Lithos geology hero. Focus and use arrow keys to move the spotlight."
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
      >
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        <div
          ref={revealRef}
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
          style={{
            backgroundImage: `url(${BG_IMAGE_2})`,
            opacity: 0,
            transform: 'translateZ(0)',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-40 h-48 bg-gradient-to-b from-black to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-72 bg-gradient-to-b from-transparent via-black/50 to-black/90"
        />

        <div className="absolute top-[12%] sm:top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="text-white leading-[0.95] [text-shadow:0_2px_40px_rgba(0,0,0,0.9)]">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              Layers hold
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
            >
              tales of time
            </span>
          </h1>
        </div>

        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/85 leading-relaxed [text-shadow:0_1px_16px_rgba(0,0,0,0.9)]">
            Every layer of sediment records a chapter of our planet, from
            ancient seabeds to drifting ash, layered across millions of years
            beneath us.
          </p>
        </div>

        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed [text-shadow:0_1px_16px_rgba(0,0,0,0.9)]">
            Our interactive maps let you peel back the crust to trace how
            stones, fossils, and deep time combine to shape the ground beneath
            your feet.
          </p>
          <button
            type="button"
            className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full lift hover:shadow-lg hover:shadow-[#e8702a]/30"
          >
            Start Digging
          </button>
        </div>

        <div
          ref={hintRef}
          aria-hidden="true"
          className="spotlight-hint glass-pill rounded-full px-4 py-2 absolute left-1/2 bottom-64 sm:bottom-40 z-40 pointer-events-none"
        >
          <span className="text-[11px] tracking-wide text-white/85 whitespace-nowrap">
            Move to reveal hidden strata
          </span>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import featureImage from '../assets/g5.png';

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  phase: number;
  twinkleSpeed: number;
};

/**
 * AutonomousExecution — bordered feature card with a drifting circle-particle
 * field on the left and the glowing cliff asset (g5.png) on the right.
 * Matches the "01 / Autonomous Execution / 99.7% task completion" reference.
 */
export default function AutonomousExecution() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;

    const seed = () => {
      const count = Math.max(28, Math.min(90, Math.floor((w * h) / 16000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        // bias density toward the text side so dots fade out under the image
        y: Math.random() * h,
        r: 1.2 + Math.random() * 2.6,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -0.06 - Math.random() * 0.24,
        baseAlpha: 0.14 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.4 + Math.random() * 1.2,
      }));
      // push a few particles left so the right edge near the image stays airy
      particles.forEach((p) => {
        if (Math.random() < 0.6) p.x = Math.random() * w * 0.72;
      });
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const tw = 0.55 + 0.45 * Math.sin(p.phase + t * 0.001 * p.twinkleSpeed);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(p.baseAlpha * tw).toFixed(3)})`;
        ctx.fill();
      }
    };

    const step = (t: number) => {
      raf = requestAnimationFrame(step);
      if (!visible) return;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -6) {
          p.y = h + 6;
          p.x = Math.random() * w;
        }
        if (p.x < -6) p.x = w + 6;
        else if (p.x > w + 6) p.x = -6;
      }
      draw(t);
    };

    resize();
    if (reduced) {
      draw(1200);
    } else {
      raf = requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    observer.observe(wrap);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden border border-white/10 bg-black"
    >
      {/* circle particle field */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
      />

      <div className="relative z-[2] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ---- Copy ---- */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-16">
          <p className="font-mono text-xs tracking-widest text-white/40">01</p>
          <h3 className="mt-5 font-body text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
            Autonomous Execution
          </h3>
          <p className="mt-5 max-w-md font-body text-sm font-light leading-relaxed text-white/55 sm:text-base">
            Deploy AI agents that work independently. They analyze, decide, and
            execute complex multi-step tasks without human intervention.
          </p>
          <p className="mt-10 font-body text-5xl font-light tracking-tight text-white sm:text-6xl">
            99.7%
          </p>
          <p className="mt-2 font-mono text-xs tracking-wider text-white/45">
            task completion
          </p>
        </div>

        {/* ---- Visual ---- */}
        <div className="relative min-h-[240px] overflow-hidden sm:min-h-[320px] md:min-h-[380px] lg:min-h-[440px]">
          <img
            src={featureImage}
            alt="Glowing autonomous terrain with hanging vines"
            loading="lazy"
            className="absolute inset-0 h-full w-full -scale-x-100 object-cover object-center"
          />
          {/* melt the image edge into the black panel */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent sm:w-40 lg:w-48"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent lg:hidden"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent lg:hidden"
          />
        </div>
      </div>
    </div>
  );
}

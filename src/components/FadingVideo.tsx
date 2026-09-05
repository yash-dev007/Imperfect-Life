import { useEffect, useRef, useState } from 'react';

type FadingVideoProps = {
  src: string | string[];
  className?: string;
  style?: React.CSSProperties;
};

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function animateOpacity(
  el: HTMLVideoElement,
  from: number,
  to: number,
  durationMs: number,
  rafRef: React.MutableRefObject<number | null>,
) {
  if (rafRef.current !== null) {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }
  let start: number | null = null;
  const step = (ts: number) => {
    if (start === null) start = ts;
    const elapsed = ts - start;
    const t = Math.min(elapsed / durationMs, 1);
    const value = from + (to - from) * t;
    el.style.opacity = String(value);
    if (t < 1) {
      rafRef.current = requestAnimationFrame(step);
    } else {
      rafRef.current = null;
    }
  };
  rafRef.current = requestAnimationFrame(step);
}

export default function FadingVideo({ src, className, style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const fadeLatch = useRef(false);
  const [index, setIndex] = useState(0);

  const sources = Array.isArray(src) ? src : [src];
  const currentSrc = sources[index % sources.length];
  const isSingle = sources.length === 1;

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Pause offscreen video: no continuously animated offscreen content.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reset opacity when source changes, then fade in on loadeddata
  useEffect(() => {
    const el = videoRef.current;
    fadeLatch.current = false;
    if (el) el.style.opacity = '0';
  }, [currentSrc]);

  const handleLoadedData = () => {
    const el = videoRef.current;
    if (!el) return;
    fadeLatch.current = false;
    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      return;
    }
    const current = parseFloat(el.style.opacity || '0');
    animateOpacity(el, isNaN(current) ? 0 : current, 1, 500, rafRef);
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration || isNaN(el.duration)) return;
    if (prefersReducedMotion()) return;
    const remaining = el.duration - el.currentTime;
    if (remaining <= 0.55) {
      // Latched: one fade-out per loop, not one per timeupdate tick.
      if (fadeLatch.current) return;
      const current = parseFloat(el.style.opacity || '1');
      if (current > 0.01) {
        fadeLatch.current = true;
        animateOpacity(el, isNaN(current) ? 1 : current, 0, 550, rafRef);
      }
    } else {
      fadeLatch.current = false;
    }
  };

  const handleEnded = () => {
    const el = videoRef.current;
    if (!el) return;
    if (isSingle) {
      el.currentTime = 0;
      el.play().catch(() => {});
      if (prefersReducedMotion()) {
        el.style.opacity = '1';
        return;
      }
      animateOpacity(el, 0, 1, 500, rafRef);
    } else {
      setIndex((i) => (i + 1) % sources.length);
    }
  };

  return (
    <video
      ref={videoRef}
      src={currentSrc}
      className={className}
      style={{ opacity: 0, ...style }}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
}

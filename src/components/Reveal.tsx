import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, sequenced by the parent section. */
  delay?: number;
};

/**
 * Single-shot blur-rise entrance. Renders fully visible by default so the
 * static first frame is complete without JavaScript; GSAP `fromTo` only
 * enhances when motion is allowed.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(
      el,
      { filter: 'blur(10px)', opacity: 0, y: 20 },
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        // expo.out pairs with --ease-expo (index.css): one expo, two systems.
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 94%', once: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

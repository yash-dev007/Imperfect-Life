import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type BlurTextProps = {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'div';
  justify?: 'center' | 'left';
  delay?: number;
};

/**
 * Word-by-word blur-rise heading. Ships as plain readable text (the
 * accessible name); JavaScript progressively enhances it into
 * screen-reader-hidden word spans with the full text as aria-label.
 * Without JS, playback, or motion, the heading stays complete.
 */
export default function BlurText({
  text,
  className,
  as = 'div',
  justify = 'center',
  delay = 0,
}: BlurTextProps) {
  const ref = useRef<HTMLDivElement | HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lines = text.split('\n');

    el.setAttribute('aria-label', text.replace(/\n/g, ' '));
    el.innerHTML = '';
    const frag = document.createDocumentFragment();
    const wordEls: HTMLElement[] = [];
    lines.forEach((line) => {
      const lineEl = document.createElement('span');
      lineEl.setAttribute('aria-hidden', 'true');
      lineEl.style.display = 'block';
      lineEl.style.flexBasis = '100%';
      line
        .split(' ')
        .filter(Boolean)
        .forEach((word) => {
          const w = document.createElement('span');
          w.setAttribute('data-word', '');
          w.style.display = 'inline-block';
          w.style.marginRight = '0.28em';
          w.textContent = word;
          lineEl.appendChild(w);
          wordEls.push(w);
        });
      frag.appendChild(lineEl);
    });
    el.appendChild(frag);

    if (reduce) {
      gsap.set(wordEls, { filter: 'blur(0px)', opacity: 1, y: 0 });
      return;
    }
    const tween = gsap.fromTo(
      wordEls,
      { filter: 'blur(10px)', opacity: 0, y: 50 },
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay,
        stagger: 0.1,
        // expo.out pairs with --ease-expo (index.css): one expo, two systems.
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text, delay]);

  const Tag = as as 'div';

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: justify === 'left' ? 'flex-start' : 'center',
        rowGap: '0.1em',
      }}
    >
      {text}
    </Tag>
  );
}

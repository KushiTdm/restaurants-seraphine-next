'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────
   <Reveal>  — fade + translate-up on enter
   ───────────────────────────────────────────── */
interface RevealProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  /** When set, children direct elements are revealed with stagger */
  stagger?: number | false;
  /** Selector inside the container for staggered children */
  staggerSelector?: string;
  /** ScrollTrigger start, default 'top 85%' */
  start?: string;
}

export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 28,
  duration = 0.9,
  className,
  style,
  stagger,
  staggerSelector,
  start = 'top 85%',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets: HTMLElement[] = stagger
        ? (staggerSelector
            ? Array.from(el.querySelectorAll<HTMLElement>(staggerSelector))
            : (Array.from(el.children) as HTMLElement[]))
        : [el];

      // Set initial state explicitly so it survives strict-mode double-mount
      gsap.set(targets, { y, opacity: 0 });

      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration,
        ease: 'power3.out',
        ...(stagger ? { stagger } : {}),
        delay,
        scrollTrigger: { trigger: el, start, once: true },
        onComplete: () => {
          // Clear inline transform so it doesn't pin the element after animation
          gsap.set(targets, { clearProps: 'transform,opacity' });
        },
      });

      // Safety: if ScrollTrigger somehow never fires, reveal after a beat
      const safetyId = window.setTimeout(() => {
        gsap.to(targets, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
      }, 1500);

      return () => window.clearTimeout(safetyId);
    }, el);

    return () => ctx.revert();
  }, [delay, y, duration, stagger, staggerSelector, start]);

  // @ts-expect-error ref typing on dynamic element
  return <Tag ref={ref} className={className} style={style}>{children}</Tag>;
}

/* ─────────────────────────────────────────────
   <Parallax>  — translateY based on scroll
   ───────────────────────────────────────────── */
interface ParallaxProps {
  children: React.ReactNode;
  /** Distance in px the inner content moves over the scroll range. */
  amount?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Parallax({
  children,
  amount = 80,
  className,
  style,
}: ParallaxProps) {
  const outer = useRef<HTMLDivElement | null>(null);
  const inner = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        i,
        { y: amount / 2 },
        {
          y: -amount / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: o,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, o);

    return () => ctx.revert();
  }, [amount]);

  return (
    <div
      ref={outer}
      className={className}
      style={{ overflow: 'hidden', position: 'relative', ...style }}
    >
      <div
        ref={inner}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `-${amount / 2}px`,
          bottom: `-${amount / 2}px`,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   <CountUp>  — number that counts up when in view
   ───────────────────────────────────────────── */
interface CountUpProps {
  to: number;
  duration?: number;
  suffix?: string;
  style?: React.CSSProperties;
  className?: string;
}
export function CountUp({ to, duration = 1.4, suffix = '', style, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${to}${suffix}`;
      return;
    }
    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: to,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${Math.round(obj.v)}${suffix}`;
        },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [to, duration, suffix]);

  return <span ref={ref} className={className} style={style}>0{suffix}</span>;
}

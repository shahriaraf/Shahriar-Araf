"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Extend window so other components (e.g. RadialMenu) can drive the same
// Lenis instance instead of fighting it with native window.scrollTo(), which
// causes the jumpy / broken-feeling navigation.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Respect reduced-motion preference for accessibility + battery/perf.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    window.__lenis = lenis;

    // Keep Lenis and ScrollTrigger in sync
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Re-measure all ScrollTrigger positions after layout
    const t = setTimeout(() => ScrollTrigger.refresh(), 500);

    // Make every in-page hash link (e.g. "#projects") scroll smoothly
    // through Lenis instead of the browser's native jump/scroll, so the
    // radial menu and any other anchor links stay perfectly in sync.
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.3 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      clearTimeout(t);
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}

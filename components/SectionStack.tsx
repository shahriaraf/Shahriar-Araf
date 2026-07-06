"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface PanelConfig {
  id: string;
  element: React.ReactNode;
  bgColor?: string;
  /**
   * Multiplier for panel height in viewports.
   * - 1 (default) = exactly 100vh, gets pinned
   * - >1 = tall panel (e.g. 3 = 300vh), NOT pinned, scrolls naturally,
   *        use CSS `sticky` inside for pinned visuals
   */
  heightVh?: number;
}

export function SectionStack({ panels }: { panels: PanelConfig[] }) {
  const total = panels.length;
  const panelRefs = useRef<(HTMLDivElement | null)[]>(Array(total).fill(null));

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Keeps pinned transforms on their own GPU layer instead of repainting.
    gsap.config({ force3D: true });
    const triggers: ScrollTrigger[] = [];

    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const isLast = i === total - 1;
      const config = panels[i];
      const isTall = (config.heightVh ?? 1) > 1;

      // Skip pinning for:
      //   - the last panel (nothing to reveal after it)
      //   - tall panels (they scroll naturally, use CSS sticky inside)
      if (isLast || isTall) return;

      const st = ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });

      triggers.push(st);
    });

    const refresh = () => ScrollTrigger.refresh();
    const t1 = setTimeout(refresh, 300);
    const t2 = setTimeout(refresh, 1000);
    const t3 = setTimeout(refresh, 2000);
    window.addEventListener("load", refresh);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("load", refresh);
      triggers.forEach((t) => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => ScrollTrigger.refresh();
    window.addEventListener("projects-tab-changed", handler);
    return () => window.removeEventListener("projects-tab-changed", handler);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {panels.map((panel, i) => {
        const vh = panel.heightVh ?? 1;
        const isTall = vh > 1;

        return (
          <div
            key={panel.id}
            id={panel.id}
            ref={(el) => { panelRefs.current[i] = el; }}
            style={{
              position: "relative",
              zIndex: i + 1,                              // later on top
              height: isTall ? `${vh * 100}vh` : "100vh", // tall = N × 100vh
              background: panel.bgColor ?? "#151515",
              overflow: isTall ? "visible" : "hidden",    // tall needs to be visible
              // Tall panels don't clip their sticky child, others clip strictly
            }}
          >
            {panel.element}
          </div>
        );
      })}
    </div>
  );
}

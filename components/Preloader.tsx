"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const C = {
  bg: "#0a0a0a",
};

// Only plays once per browser session. sessionStorage persists across
// page navigations and refreshes within the same tab/session but clears
// when the tab is closed — so a first-time visitor still gets the full
// dramatic intro, but clicking around the site (or hitting refresh) won't
// replay it every time. A fresh Lighthouse audit always runs with empty
// storage, so this doesn't change what the cold-load performance test
// sees — it's purely a repeat-visit UX improvement.
const SEEN_KEY = "araf-preloader-seen";

export default function Preloader() {
  // Default to true so server-rendered HTML and the very first client
  // render match (no hydration mismatch). The sessionStorage check below
  // runs in a layout effect, which fires before the browser paints —
  // so a returning visitor's browser never actually shows a flash of
  // the preloader before it's dismissed.
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setIsLoading(false);
    }
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  // Auto-hide after ~3s, then remember it's been shown this session.
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem(SEEN_KEY, "1");
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pt-[32vh]"
          style={{ backgroundColor: C.bg }}
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 1.3,
            ease: [0.87, 0, 0.13, 1],
          }}
        >
          {/* Subtle radial glow behind image */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 40% 55% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
            }}
          />

          {/* Grain texture — makes it feel premium (static opacity, no blend-mode compositing cost) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* WELCOME IMAGE — dramatic entrance (transform + opacity only — GPU-composited, no blur/3D repaint cost) */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.85,
              y: -40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              ease: [0.19, 1, 0.22, 1], // expo-out — dramatic settle
            }}
            className="relative h-[85vh] w-auto"
            style={{
              willChange: "transform, opacity",
            }}
          >
            <Image
              src="/welcome.png"
              alt="Welcome"
              width={600}
              height={900}
              priority
              className="h-full w-auto object-contain"
              style={{
                filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

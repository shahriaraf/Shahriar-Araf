"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const C = {
  bg: "#0a0a0a",
};

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

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

  // Auto-hide after ~3s
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
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

          {/* Grain texture — makes it feel premium */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* WELCOME IMAGE — dramatic entrance */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
              y: -80,
              filter: "blur(30px)",
              rotateX: -25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
              rotateX: 0,
            }}
            transition={{
              duration: 1.6,
              ease: [0.19, 1, 0.22, 1], // expo-out — dramatic settle
            }}
            className="relative h-[85vh] w-auto"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
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

          {/* Subtle floating motion after entrance */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
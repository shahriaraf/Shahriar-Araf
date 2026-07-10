"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaHome, FaUser, FaCode, FaBriefcase, FaEnvelope } from "react-icons/fa";

// ─── Palette — matches the rest of the site (warm monochrome dark luxury) ────
const C = {
  bg: "#151515",
  surface: "#1c1b19",
  border: "#2a2723",
  muted: "#8a8578",
  text: "#e5e0d4",
  emphasis: "#f4f0e8",
};

const navLinks = [
  { id: "contact", label: "Contact", icon: FaEnvelope },
  { id: "projects", label: "Work", icon: FaBriefcase },
  { id: "skills", label: "Skills", icon: FaCode },
  { id: "about", label: "About", icon: FaUser },
  { id: "home", label: "Home", icon: FaHome },
];

export default function RadialMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [radius, setRadius] = useState(100);
  const rafRef = useRef<number | null>(null);

  // Smaller fan radius on narrow screens so items never fall off-screen.
  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      setRadius(w < 380 ? 74 : w < 640 ? 86 : 100);
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const lenis = window.__lenis;

    if (lenis) {
      // Sections are GSAP-pinned with pinSpacing:false (see SectionStack),
      // which pulls a panel out of document flow WHILE it's pinned —
      // shifting every panel below it up by that panel's height until the
      // pin releases. Asking Lenis to scroll to `element` directly reads
      // getBoundingClientRect() at the instant of the click, which can be
      // off by up to one panel's height if a pin happens to be mid-transition
      // right then — landing on the wrong section, inconsistently.
      // Fix: sum each preceding panel's intrinsic offsetHeight (unaffected
      // by pin/unpin — it's the element's own box size, not its flow
      // position) to get a stable absolute target regardless of which pin
      // is currently active.
      const container = element.parentElement;
      let target: number;
      if (container) {
        target = 0;
        for (const child of Array.from(container.children)) {
          if (child === element) break;
          target += (child as HTMLElement).offsetHeight;
        }
      } else {
        target = element.getBoundingClientRect().top + window.scrollY;
      }
      lenis.scrollTo(target, { duration: 1.3 });
    } else {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  }, []);

  // Determine the active section from actual scroll position rather than
  // IntersectionObserver, since the sections are GSAP-pinned full-height
  // panels: a pinned (but visually covered) panel can still report
  // isIntersecting = true, which made the old observer-based logic flicker
  // between sections unpredictably. Comparing viewport-center against each
  // section's real bounding box is reliable regardless of pinning.
  useEffect(() => {
    const rawSections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);

    // navLinks is in MENU DISPLAY order (reversed, for the fan layout) —
    // not page order. During a pin transition, the incoming panel (later
    // in real DOM order) sits at a HIGHER z-index and visually covers the
    // outgoing one, even though the outgoing one's rect can still
    // "technically" contain the viewport center while it's pinned. So we
    // need the true top-to-bottom DOM order here, independent of however
    // the menu happens to be arranged, and prefer whichever match comes
    // LAST in that real order (i.e. whichever is actually on top).
    const sections = [...rawSections].sort((a, b) => {
      const pos = a.compareDocumentPosition(b);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });

    const updateActive = () => {
      const centerY = window.innerHeight / 2;
      let current = sections[0];
      let matched = false;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= centerY && rect.bottom >= centerY) {
          current = section;
          matched = true;
          // no break — keep going so a later (higher z-index) section
          // that also matches overrides an earlier one still pinned
          // underneath it
        }
      }

      if (!matched) {
        let smallestDistance = Infinity;
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          const distance = Math.min(
            Math.abs(rect.top - centerY),
            Math.abs(rect.bottom - centerY)
          );
          if (distance < smallestDistance) {
            smallestDistance = distance;
            current = section;
          }
        }
      }

      if (current?.id) setActiveSection(current.id);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updateActive();
        rafRef.current = null;
      });
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Lenis drives scroll via transforms, not the native scroll event on
    // some setups — also listen to its own scroll callback if present.
    window.__lenis?.on("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.__lenis?.off("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Close on Escape for accessibility.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex items-center justify-center">
      {/* --- MENU ITEMS (THE FAN) --- */}
      <div className="absolute">
        {navLinks.map((link, index) => {
          const angle = index * 22.5 + 180;
          const radians = (angle * Math.PI) / 180;
          const x = Math.cos(radians) * radius;
          const y = Math.sin(radians) * radius;
          const isActive = activeSection === link.id;

          return (
            <motion.button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={
                isOpen
                  ? { x, y, scale: 1, opacity: 1 }
                  : { x: 0, y: 0, scale: 0, opacity: 0 }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                delay: isOpen ? index * 0.045 : 0,
              }}
              className="absolute w-10 h-10 rounded-full flex items-center justify-center border shadow-xl group"
              style={{
                top: -20,
                left: -20,
                pointerEvents: isOpen ? "auto" : "none",
                backgroundColor: isActive ? C.emphasis : "rgba(21,21,21,0.92)",
                borderColor: isActive ? C.emphasis : C.border,
                color: isActive ? C.bg : C.muted,
                boxShadow: isActive
                  ? `0 0 18px ${C.emphasis}55`
                  : "0 4px 14px rgba(0,0,0,0.35)",
                transition:
                  "background-color .25s ease, color .25s ease, border-color .25s ease",
              }}
              title={link.label}
              aria-label={link.label}
            >
              <link.icon size={15} />
              {/* Tooltip */}
              <span
                className="absolute right-full mr-3 px-2 py-1 rounded text-[10px] uppercase font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none hidden sm:block"
                style={{
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  letterSpacing: ".08em",
                }}
              >
                {link.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* --- MAIN TOGGLE BUTTON --- */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center z-10 hover:scale-110 active:scale-95 transition-transform duration-200 border-2"
        style={{
          backgroundColor: C.emphasis,
          color: C.bg,
          borderColor: C.emphasis,
          boxShadow: `0 0 30px ${C.emphasis}4d`,
        }}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <FaPlus size={20} />
        </motion.div>
      </button>

      {/* --- BACKGROUND DIMMER --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 backdrop-blur-sm -z-10"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

// ─── Warm Monochrome Palette (Dark Luxury) ────────────────────────────────────
const C = {
  cursor:       "#f4f0e8",              // cream white (main cursor color)
  cursorDim:    "rgba(244,240,232,0.4)", // dim cream for idle ring
  cursorGlow:   "rgba(244,240,232,0.12)", // soft glow
  cursorGlowHover: "rgba(244,240,232,0.18)", // brighter glow on hover
  cursorShadow: "rgba(244,240,232,0.5)",  // dot shadow
};

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const pos  = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  // Starts false on both server and client so the very first client render
  // matches the server-rendered output (both produce null below). The
  // previous lazy useState initializer ran `typeof window !== "undefined"`
  // directly during render — that's false on the server (no window) but
  // true on the client's first render, so the two disagreed on whether to
  // render null or the full cursor markup, causing a hydration mismatch.
  // Deferring the actual check to an effect (which never runs on the
  // server) fixes this: both environments agree on the first paint, and
  // the client swaps in the real value right after mount.
  const [isVisible, setIsVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    setIsVisible(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Dot snaps instantly — transform only, no layout cost
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Cheap, layout-free hover check — no getComputedStyle (that call forces
      // a synchronous style/layout recalc on every mousemove, which is
      // expensive enough on its own to visibly stutter scroll/GSAP animations
      // since mousemove keeps firing while the user scrolls).
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a, button, [data-cursor-pointer]") !== null;

      setHovering((prev) => (prev === isClickable ? prev : isClickable));
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    // Smooth lagging ring
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;

      const x = ring.current.x;
      const y = ring.current.y;
      const t = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      if (ringRef.current) ringRef.current.style.transform = t;
      if (glowRef.current) glowRef.current.style.transform = t;

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* ── Dot: snaps to cursor position ── */}
      <div
        ref={dotRef}
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          width:           clicking ? "4px" : "6px",
          height:          clicking ? "4px" : "6px",
          borderRadius:    "50%",
          backgroundColor: C.cursor,
          pointerEvents:   "none",
          zIndex:          99999,
          transition:      "width 0.12s ease, height 0.12s ease",
          willChange:      "transform",
          boxShadow:       `0 0 8px 1px ${C.cursorShadow}`,
          mixBlendMode:    "difference",
        }}
      />

      {/* ── Ring: lags smoothly behind ── */}
      <div
        ref={ringRef}
        style={{
          position:     "fixed",
          top:          0,
          left:         0,
          width:        clicking ? "22px" : hovering ? "56px" : "34px",
          height:       clicking ? "22px" : hovering ? "56px" : "34px",
          borderRadius: "50%",
          border:       `1px solid ${hovering ? C.cursor : C.cursorDim}`,
          pointerEvents:"none",
          zIndex:       99998,
          transition:   [
            "width 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
            "height 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
            "border-color 0.25s ease",
          ].join(", "),
          willChange:   "transform",
          mixBlendMode: "difference",
        }}
      />

      {/* ── Glow: soft radial behind ring ── */}
      <div
        ref={glowRef}
        style={{
          position:     "fixed",
          top:          0,
          left:         0,
          width:        hovering ? "90px" : "56px",
          height:       hovering ? "90px" : "56px",
          borderRadius: "50%",
          background:   `radial-gradient(circle, ${hovering ? C.cursorGlowHover : C.cursorGlow} 0%, transparent 70%)`,
          pointerEvents:"none",
          zIndex:       99997,
          transition:   "width 0.4s ease, height 0.4s ease, background 0.3s ease",
          willChange:   "transform",
        }}
      />
    </>
  );
}

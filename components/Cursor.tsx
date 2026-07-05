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

      // Dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }

      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer";

      setHovering(isClickable);
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    // Smooth lagging ring
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;

      const x = ring.current.x;
      const y = ring.current.y;

      if (ringRef.current) {
        ringRef.current.style.left = `${x}px`;
        ringRef.current.style.top  = `${y}px`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${x}px`;
        glowRef.current.style.top  = `${y}px`;
      }

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
          width:           clicking ? "4px" : "6px",
          height:          clicking ? "4px" : "6px",
          borderRadius:    "50%",
          backgroundColor: C.cursor,
          pointerEvents:   "none",
          zIndex:          99999,
          transform:       "translate(-50%, -50%)",
          transition:      "width 0.12s ease, height 0.12s ease",
          willChange:      "left, top",
          boxShadow:       `0 0 8px 1px ${C.cursorShadow}`,
          mixBlendMode:    "difference",
        }}
      />

      {/* ── Ring: lags smoothly behind ── */}
      <div
        ref={ringRef}
        style={{
          position:     "fixed",
          width:        clicking ? "22px" : hovering ? "56px" : "34px",
          height:       clicking ? "22px" : hovering ? "56px" : "34px",
          borderRadius: "50%",
          border:       `1px solid ${hovering ? C.cursor : C.cursorDim}`,
          pointerEvents:"none",
          zIndex:       99998,
          transform:    "translate(-50%, -50%)",
          transition:   [
            "width 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
            "height 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
            "border-color 0.25s ease",
          ].join(", "),
          willChange:   "left, top",
          mixBlendMode: "difference",
        }}
      />

      {/* ── Glow: soft radial behind ring ── */}
      <div
        ref={glowRef}
        style={{
          position:     "fixed",
          width:        hovering ? "90px" : "56px",
          height:       hovering ? "90px" : "56px",
          borderRadius: "50%",
          background:   `radial-gradient(circle, ${hovering ? C.cursorGlowHover : C.cursorGlow} 0%, transparent 70%)`,
          pointerEvents:"none",
          zIndex:       99997,
          transform:    "translate(-50%, -50%)",
          transition:   "width 0.4s ease, height 0.4s ease, background 0.3s ease",
          willChange:   "left, top",
        }}
      />
    </>
  );
}
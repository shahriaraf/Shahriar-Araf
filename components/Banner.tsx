"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import headshot from "../public/araf headshot.png";

// ─── Premium Typography Stack ─────────────────────────────────────────────────
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// ─── Warm Monochrome Palette (Dark Luxury) ────────────────────────────────────
const C = {
  bg: "#101010",
  surface: "#1c1b19",
  surfaceHover: "#252320",
  border: "#2a2723",
  borderStrong: "#3d3833",
  muted: "#8a8578",
  text: "#e5e0d4",
  emphasis: "#f4f0e8",
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    let iter = 0;
    const iv = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((_, i) =>
            i < iter
              ? text[i]
              : CHARS[Math.floor(Math.random() * CHARS.length)],
          )
          .join(""),
      );
      if (iter >= text.length) clearInterval(iv);
      iter += 0.5;
    }, 45);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{display}</span>;
}

const ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Web Designer",
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/shahriaraf",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shoumo-shahriar-araf",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/shahriar.araf.3",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

export default function Banner() {
  const [roleIdx, setRoleIdx] = useState(0);
  const cyanRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);
  const dotIRef = useRef<HTMLSpanElement>(null);
  const dotArafRef = useRef<HTMLSpanElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const dotIAnchorRef = useRef<HTMLSpanElement>(null);
  const dotArafAnchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const iv = setInterval(
      () => setRoleIdx((p) => (p + 1) % ROLES.length),
      3000,
    );
    return () => clearInterval(iv);
  }, []);

  // ── Hologram glitch engine ──
  useEffect(() => {
    const cyan = cyanRef.current;
    const red = redRef.current;
    if (!cyan || !red) return;

    const randomClip = () => {
      const a = Math.random() * 80;
      const b = Math.random() * (100 - a - 5) + a + 5;
      return `inset(${a.toFixed(1)}% 0 ${(100 - b).toFixed(1)}% 0)`;
    };

    let timeoutId: ReturnType<typeof setTimeout>;

    const glitchBurst = () => {
      const frames = 2 + Math.floor(Math.random() * 4);
      let f = 0;

      const frame = () => {
        if (f >= frames) {
          cyan.style.opacity = "0";
          red.style.opacity = "0";
          cyan.style.transform = "translate(0,0)";
          red.style.transform = "translate(0,0)";
          cyan.style.clipPath = "none";
          red.style.clipPath = "none";
          timeoutId = setTimeout(glitchBurst, 1200 + Math.random() * 3000);
          return;
        }

        const cxOff = (Math.random() - 0.5) * 18;
        const rxOff = (Math.random() - 0.5) * 18;
        const cyOff = (Math.random() - 0.5) * 4;
        const ryOff = (Math.random() - 0.5) * 4;

        cyan.style.opacity = (0.5 + Math.random() * 0.4).toString();
        red.style.opacity = (0.45 + Math.random() * 0.35).toString();
        cyan.style.transform = `translate(${cxOff}px, ${cyOff}px)`;
        red.style.transform = `translate(${rxOff}px, ${ryOff}px)`;
        cyan.style.clipPath = randomClip();
        red.style.clipPath = randomClip();

        f++;
        timeoutId = setTimeout(frame, 60 + Math.random() * 80);
      };

      frame();
    };

    timeoutId = setTimeout(glitchBurst, 800);
    return () => clearTimeout(timeoutId);
  }, []);

  // ── Dot swap animation (GSAP) ──
  useEffect(() => {
    const h1 = h1Ref.current;
    const dotI = dotIRef.current;
    const dotAraf = dotArafRef.current;
    const anchorI = dotIAnchorRef.current;
    const anchorAraf = dotArafAnchorRef.current;
    if (!h1 || !dotI || !dotAraf || !anchorI || !anchorAraf) return;

    let posA_small = { x: 0, y: 0 };
    let posA_big = { x: 0, y: 0 };
    let posB_small = { x: 0, y: 0 };
    let posB_big = { x: 0, y: 0 };
    let swapped = false;

    const measure = () => {
      const h1Rect = h1.getBoundingClientRect();
      const anchorIRect = anchorI.getBoundingClientRect();
      const anchorArafRect = anchorAraf.getBoundingClientRect();
      const dotIRect = dotI.getBoundingClientRect();
      const dotArafRect = dotAraf.getBoundingClientRect();

      const iCenterX = anchorIRect.left - h1Rect.left + anchorIRect.width / 2;
      const iTopY = anchorIRect.top - h1Rect.top;
      const arafX = anchorArafRect.left - h1Rect.left;
      const arafTopY = anchorArafRect.top - h1Rect.top;

      const SMALL_AT_I_Y = 0.06;
      const SMALL_AT_ARAF_Y = 0.72;
      const BIG_AT_ARAF_Y = 0.01;
      const BIG_AT_I_Y = -0.7;

      posA_small = {
        x: iCenterX - dotIRect.width / 2,
        y: iTopY + anchorIRect.height * SMALL_AT_I_Y,
      };
      posB_small = {
        x: arafX,
        y: arafTopY + anchorArafRect.height * SMALL_AT_ARAF_Y,
      };
      posB_big = {
        x: arafX,
        y: arafTopY + anchorArafRect.height * BIG_AT_ARAF_Y,
      };
      posA_big = {
        x: iCenterX - dotArafRect.width / 2,
        y: iTopY + anchorIRect.height * BIG_AT_I_Y,
      };

      gsap.set(dotI, {
        x: posA_small.x,
        y: posA_small.y,
        backgroundColor: C.muted,
        opacity: 1,
      });
      gsap.set(dotAraf, {
        x: posB_big.x,
        y: posB_big.y,
        color: C.muted,
        opacity: 1,
      });
    };

    const swap = () => {
      if (!swapped) {
        gsap.to(dotI, {
          x: posB_small.x,
          y: posB_small.y,
          backgroundColor: C.muted,
          duration: 0.8,
          ease: "power3.inOut",
        });
        gsap.to(dotAraf, {
          x: posA_big.x,
          y: posA_big.y,
          color: C.emphasis,
          duration: 0.8,
          ease: "power3.inOut",
        });
      } else {
        gsap.to(dotI, {
          x: posA_small.x,
          y: posA_small.y,
          backgroundColor: C.muted,
          duration: 0.8,
          ease: "power3.inOut",
        });
        gsap.to(dotAraf, {
          x: posB_big.x,
          y: posB_big.y,
          color: C.muted,
          duration: 0.8,
          ease: "power3.inOut",
        });
      }
      swapped = !swapped;
    };

    const init = async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      measure();
    };

    init();

    const intervalId = setTimeout(function tick() {
      swap();
      (tick as unknown as { id: ReturnType<typeof setTimeout> }).id = setTimeout(tick, 2500);
    }, 1500);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        gsap.killTweensOf([dotI, dotAraf]);
        swapped = false;
        measure();
      }, 200);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(intervalId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf([dotI, dotAraf]);
    };
  }, []);

  return (
    <main
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      style={{
        height: "100vh",
        background: C.bg,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
        color: C.text,
      }}
    >
      <style>{`
        .photo-container {
          position: relative;
          overflow: hidden;
        }

        /* ── HOLOGRAM GLITCH LAYERS — fixed for PNG images ── */
        .glitch-layer {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-image: url("${headshot.src}");
          background-repeat: no-repeat;
          background-position: center 30%;
          background-size: cover;
          opacity: 0;
          pointer-events: none;
          z-index: 15;
          padding: 0; margin: 0;
          will-change: transform, clip-path, opacity;
          transition: none;
          image-rendering: -webkit-optimize-contrast;
        }
        .glitch-layer.light {
          filter: grayscale(1) contrast(1.6) brightness(1.5);
          mix-blend-mode: screen;
        }
        .glitch-layer.ghost {
          filter: grayscale(1) contrast(1.6) brightness(1.2) invert(0.15);
          mix-blend-mode: difference;
        }

        .cursor-blink {
          display:inline-block; width:2px; height:0.9em;
          background:${C.emphasis}; margin-left:4px; vertical-align:middle;
          animation:cblink .65s step-end infinite;
        }
        @keyframes cblink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* ── Social buttons ── */
        .social-btn {
          color:${C.muted};
          display:flex; align-items:center; justify-content:center;
          transition: all .35s cubic-bezier(.23,1,.32,1);
          width:40px; height:40px; border-radius:50%;
          border:1px solid ${C.border};
          background: ${C.surface};
        }
        .social-btn:hover {
          color:${C.bg};
          background: ${C.emphasis};
          border-color: ${C.emphasis};
          transform: translateY(-3px);
        }

        /* ── LUXURY PRIMARY BUTTON ── */
        .cta-primary {
          position:relative;
          display:inline-flex; align-items:center; gap:14px;
          padding:18px 34px;
          background: ${C.emphasis};
          color: ${C.bg};
          font-family: var(--font-inter), sans-serif;
          font-size:12px; font-weight:500;
          letter-spacing:.16em; text-transform:uppercase;
          text-decoration:none;
          border-radius:2px;
          border:1px solid ${C.emphasis};
          cursor:pointer;
          overflow:hidden;
          transition: all .4s cubic-bezier(.23,1,.32,1);
        }
        .cta-primary::before {
          content:''; position:absolute; inset:0;
          background: ${C.bg};
          transform: translateY(100%);
          transition: transform .5s cubic-bezier(.23,1,.32,1);
          z-index:0;
        }
        .cta-primary:hover {
          color: ${C.emphasis};
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(244,240,232,.12);
        }
        .cta-primary:hover::before {
          transform: translateY(0);
        }
        .cta-primary > * { position:relative; z-index:1; }
        .cta-primary .arrow-icon {
          transition: transform .4s cubic-bezier(.23,1,.32,1);
        }
        .cta-primary:hover .arrow-icon {
          transform: translateX(4px);
        }

        /* ── LUXURY SECONDARY BUTTON ── */
        .cta-secondary {
          position:relative;
          display:inline-flex; align-items:center; gap:14px;
          padding:18px 34px;
          background:transparent;
          color:${C.emphasis};
          font-family: var(--font-inter), sans-serif;
          font-size:12px; font-weight:500;
          letter-spacing:.16em; text-transform:uppercase;
          text-decoration:none;
          border:1px solid ${C.borderStrong};
          border-radius:2px; cursor:pointer;
          overflow:hidden;
          transition: all .4s cubic-bezier(.23,1,.32,1);
        }
        .cta-secondary::before {
          content:''; position:absolute; inset:0;
          background: ${C.emphasis};
          transform: translateY(100%);
          transition: transform .5s cubic-bezier(.23,1,.32,1);
          z-index:0;
        }
        .cta-secondary:hover {
          border-color:${C.emphasis};
          color:${C.bg};
          transform: translateY(-2px);
        }
        .cta-secondary:hover::before {
          transform: translateY(0);
        }
        .cta-secondary > * { position:relative; z-index:1; }
        .cta-secondary .download-icon {
          transition: transform .4s cubic-bezier(.23,1,.32,1);
        }
        .cta-secondary:hover .download-icon {
          transform: translateY(3px);
        }

        /* ── Social rail lines ── */
        .social-rail {
          display:flex; flex-direction:column; align-items:center; gap:14px;
        }
        .social-rail::before, .social-rail::after {
          content:''; display:block; width:1px; height:60px;
        }
        .social-rail::before { background:linear-gradient(to bottom,transparent,${C.borderStrong}); }
        .social-rail::after  { background:linear-gradient(to top,transparent,${C.borderStrong}); }

        /* ── Swap dot base styling ── */
        .swap-dot {
          will-change: transform;
        }

        /* ── Logo hover ── */
        .logo-link {
          display: inline-flex;
          align-items: center;
          transition: opacity 0.35s cubic-bezier(.23,1,.32,1);
        }
        .logo-link:hover {
          opacity: 0.75;
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          .hero-content {
            padding: 0 28px 0 56px !important;
            max-width: 480px !important;
          }
          .photo-container {
            width: 54% !important;
          }
        }

        @media(max-width:768px){
          .left-social,.right-indicator{display:none!important;}
          .hero-content{padding:20px 20px 20px 20px!important;text-align:center; align-items:center; max-width:100% !important;}
          /* Let the photo cover the full width behind the centered text on
             mobile (it was still 60%-wide from desktop, which pushed the
             photo off-center) and raise its visibility so the face reads
             clearly, since it's now a full-bleed background behind
             centered text rather than a side-by-side split. */
          .photo-container{width:100%!important; opacity:0.9!important;}

          /* The left-right fade made sense for desktop's side-by-side
             layout but hid too much of the face once the photo goes
             full-width. Switch it to a top fade instead, so the nav/name
             area stays legible while the face stays visible lower down. */
          .photo-gradient-left{
            background: linear-gradient(
              to bottom,
              ${C.bg} 0%,
              ${C.bg}cc 12%,
              ${C.bg}55 30%,
              transparent 55%
            ) !important;
          }

          .hero-nav{padding:16px 20px!important;}

          /* CTA row: force a single row on mobile instead of wrapping to
             two lines. Buttons share the row evenly via flex:1 so they
             stay side-by-side at any mobile width. */
          .cta-row{
            flex-wrap: nowrap !important;
            gap: 10px !important;
            width: 100%;
          }
          .cta-primary, .cta-secondary{
            flex: 1 1 0 !important;
            padding: 14px 16px !important;
            font-size: 10.5px !important;
            gap: 8px !important;
            justify-content: center !important;
          }
        }
      `}</style>

      {/* ── Right scroll indicator ── */}
      <div
        className="right-indicator"
        style={{
          position: "fixed",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          width: 1,
          height: 80,
          background: C.borderStrong,
          zIndex: 50,
        }}
      />

      {/* ── Left social rail ── */}
      <div
        className="left-social social-rail"
        style={{
          position: "fixed",
          left: 22,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
        }}
      >
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            title={s.label}
          >
            {s.icon}
          </a>
        ))}
      </div>

      {/* ── Full-bleed photo ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* Left gradient — fade to bg (becomes a top fade on mobile via .photo-gradient-left) */}
        <div
          className="photo-gradient-left"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            background: `linear-gradient(to right, ${C.bg} 0%, ${C.bg} 26%, ${C.bg}b8 48%, ${C.bg}26 68%, transparent 100%)`,
          }}
        />
        {/* Bottom gradient */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            zIndex: 4,
            background: `linear-gradient(to top, ${C.bg}, transparent)`,
          }}
        />

        {/* Photo container */}
        <div
          className="photo-container"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "60%",
            height: "100%",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          {/* Base image — natural tone */}
          <Image
            src={headshot}
            alt="Shahriar Araf"
            fill
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, 75vw"
            style={{
              objectFit: "cover",
              objectPosition: "center 30%",
              imageRendering:
                "-webkit-optimize-contrast" as React.CSSProperties["imageRendering"],
              WebkitFontSmoothing:
                "antialiased" as React.CSSProperties["WebkitFontSmoothing"],
              transform: "translateZ(0)",
              filter: "grayscale(1) contrast(1.02)",
            }}
          />

          {/* Glitch layers — monochrome hologram effect */}
          <div ref={cyanRef} className="glitch-layer light" />
          <div ref={redRef} className="glitch-layer ghost" />

          {/* Film grain overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 25,
              pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              opacity: 0.06,
              mixBlendMode: "overlay",
            }}
          />
        </div>
      </div>

      {/* ── Nav (logo image only) ── */}
      <nav
        className="hero-nav"
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          padding: "22px 42px",
          flexShrink: 0,
        }}
      >
        <Link href="/" className="logo-link" aria-label="Home">
          <Image
            src="/logo.png"
            alt="Araf"
            width={120}
            height={50}
            priority
            style={{
              height: "auto",
              width: "clamp(70px, 6vw, 100px)",
              objectFit: "contain",
              display: "block",
              mixBlendMode: "screen",
            }}
          />
        </Link>
      </nav>

      {/* ── Hero content ── */}
      <section
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 5,
          flexGrow: 1,
          padding: "0 40px 0 100px",
          maxWidth: 680,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {/* Role */}
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
            color: C.muted,
            letterSpacing: ".14em",
            margin: 0,
          }}
        >
          <span style={{ color: C.emphasis, fontWeight: 500 }}>
            <ScrambleText text={ROLES[roleIdx]} />
          </span>
          <span className="cursor-blink" />
        </p>

        {/* Name — Instrument Serif, editorial premium */}
        <h1
          ref={h1Ref}
          style={{
            fontFamily:
              "var(--font-instrument-serif), 'Times New Roman', serif",
            fontSize: "clamp(56px, 8.5vw, 110px)",
            lineHeight: 0.9,
            fontWeight: 400,
            letterSpacing: "-0.03em",
            color: C.emphasis,
            margin: 0,
            position: "relative",
          }}
        >
          <span style={{ display: "block" }}>
            Shahr
            {/* Dotless "ı" with an invisible placeholder for the dot */}
            <span
              ref={dotIAnchorRef}
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              ı
            </span>
            ar
          </span>
          <span style={{ fontStyle: "italic" }}>
            Araf
            {/* Invisible placeholder for the Araf dot */}
            <span
              ref={dotArafAnchorRef}
              style={{
                display: "inline-block",
                color: "transparent",
                fontStyle: "normal",
              }}
            >
              .
            </span>
          </span>

          {/* ═══ Both dots are absolutely positioned inside the h1 ═══ */}
          <span
            ref={dotIRef}
            className="swap-dot"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "0.14em",
              height: "0.14em",
              borderRadius: "50%",
              backgroundColor: C.muted,
              pointerEvents: "none",
              opacity: 0,
            }}
          />
          <span
            ref={dotArafRef}
            className="swap-dot"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              color: C.muted,
              fontStyle: "normal",
              pointerEvents: "none",
              lineHeight: 0.9,
              opacity: 0,
            }}
          >
            .
          </span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
            color: C.text,
            maxWidth: 400,
            fontWeight: 400,
            margin: 0,
            letterSpacing: "-.005em",
          }}
        >
          Building scalable, pixel-perfect digital experiences — turning complex
          problems into elegant, high-performance code.
        </p>

        {/* CTAs */}
        <div
          className="cta-row"
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}
        >
          <a href="#projects" className="cta-primary">
            <span>View Projects</span>
            <svg
              className="arrow-icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a
            href="/assets/Araf-Full-Stack-Resume.pdf"
            download
            className="cta-secondary"
          >
            <span>Resume</span>
            <svg
              className="download-icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
}
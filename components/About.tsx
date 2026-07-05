"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { FaDownload, FaCoffee, FaCode, FaGlobeAsia } from "react-icons/fa";
import type { AboutData } from "@/sanity/queries";
import { urlFor } from "@/sanity/client";

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

type AboutProps = {
  about: AboutData | null;
};

export default function About({ about }: AboutProps) {
  const stats = [
    {
      label: "Years Experience",
      value: about?.yearsExperience ?? "03+",
      icon: FaCode,
    },
    {
      label: "Projects Completed",
      value: about?.projectsCompleted ?? "25+",
      icon: FaGlobeAsia,
    },
    {
      label: "Coffee Consumed",
      value: "∞",
      icon: FaCoffee,
    },
  ];

  const aboutImageUrl = about?.aboutImage
    ? urlFor(about.aboutImage).width(900).height(1350).url()
    : "/araf about image.png";

  const cvUrl = about?.cv?.asset?.url ?? "/assets/Araf-Full-Stack-Resume.pdf";

  const bio =
    about?.bio ??
    "I am a Full Stack Developer based in Bangladesh, with a passion for building digital services/stuff I want. I have a knack for all things launching products, from planning and designing all the way to solving real-life problems with code.";

  const bio2 =
    about?.bio2 ??
    "When I am not coding, I am likely hanging out with my camera, playing video games, or exploring new technologies to keep my skills sharp.";

  return (
    <section
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} relative w-full h-[100dvh] overflow-hidden`}
      style={{
        backgroundColor: C.bg,
        fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
      }}
    >
      <style jsx>{`
        .cv-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 26px;
          background: ${C.emphasis};
          color: ${C.bg};
          font-family: var(--font-inter), sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid ${C.emphasis};
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cv-button::before {
          content: "";
          position: absolute;
          inset: 0;
          background: ${C.bg};
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          z-index: 0;
        }
        .cv-button:hover {
          color: ${C.emphasis};
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(244, 240, 232, 0.12);
        }
        .cv-button:hover::before {
          transform: translateY(0);
        }
        .cv-button > * {
          position: relative;
          z-index: 1;
        }
        .cv-button .download-icon {
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cv-button:hover .download-icon {
          transform: translateY(3px);
        }

        /* ── Hire Me button — outline twin of cv-button, mobile-only ── */
        .hire-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 26px;
          background: transparent;
          color: ${C.emphasis};
          font-family: var(--font-inter), sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid ${C.borderStrong};
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .hire-button::before {
          content: "";
          position: absolute;
          inset: 0;
          background: ${C.emphasis};
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          z-index: 0;
        }
        .hire-button:hover {
          border-color: ${C.emphasis};
          color: ${C.bg};
          transform: translateY(-2px);
        }
        .hire-button:hover::before {
          transform: translateY(0);
        }
        .hire-button > * {
          position: relative;
          z-index: 1;
        }

        /* ── Photo wrapper — grounds figure into bg ── */
        .photo-figure {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .photo-figure :global(img) {
          filter: grayscale(1) contrast(1.05) brightness(0.98);
          object-fit: cover !important;
        }
        /* Fade bottom into section bg — hero-style anchoring */
        .photo-figure::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 35%;
          background: linear-gradient(
            to top,
            ${C.bg} 0%,
            ${C.bg} 18%,
            rgba(21, 21, 21, 0.85) 40%,
            rgba(21, 21, 21, 0.45) 70%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        /* ── Mobile-only overrides ──
           1) The photo block was fully hidden below lg, leaving the empty
              gap at the top of the section (the grid row was stretched/
              centered with nothing in it). Showing it at a fixed, modest
              height fills that gap instead of growing the section.
           2) Its object-position ("center 90%") was tuned for the tall
              desktop crop; on the short mobile box that framing cuts off
              the face, so it's shifted up. The "!important" is required
              here because Next/Image sets object-position as an inline
              style, which normally beats an external stylesheet rule. */
        @media (max-width: 1023px) {
          .photo-figure :global(img) {
            object-position: center 40% !important;
          }
        }
      `}</style>

      {/* Ambient warm glow */}
      <div
        className="absolute top-1/4 right-0 w-[220px] sm:w-[320px] md:w-[420px] h-[220px] sm:h-[320px] md:h-[420px] rounded-full pointer-events-none"
        style={{
          backgroundColor: C.emphasis,
          opacity: 0.03,
          filter: "blur(120px)",
        }}
      />

      <div
        className="relative z-10 max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] items-stretch py-4 sm:py-6 md:py-8 gap-4 lg:gap-8 [align-content:start] lg:[align-content:normal]"
      >
        {/* Left: Photo — BIG, B&W, blends into bg.
            Previously "hidden lg:flex" hid this entirely below 1024px,
            which is what left the empty gap at the top of the section on
            mobile (the row was still reserved by the stretched grid, just
            empty). Now visible at all sizes, with a compact fixed height
            on mobile that fills that gap instead of the full-height
            desktop treatment. */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative flex h-72 sm:h-96 lg:h-full items-end justify-center mb-2 sm:mb-3 lg:mb-0 rounded-sm overflow-hidden"
        >
          <div className="photo-figure relative w-full h-full">
            <Image
              src={aboutImageUrl}
              alt="Shahriar Araf"
              fill
              priority
              className="object-cover"
              style={{ objectPosition: "center 90%" }}
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>

          {/* Cream accent line on left edge — desktop only, matches the
              original full-height photo treatment */}
          <div
            className="hidden lg:block absolute top-[10%] left-2 xl:left-4 w-[2px] rounded-full h-28 z-20"
            style={{ backgroundColor: C.emphasis, opacity: 0.5 }}
          />
        </motion.div>

        {/* Right: Content */}
        <div className="flex flex-col justify-center max-w-xl relative z-10">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-3 mb-2 sm:mb-3"
          >
            <span
              className="h-px w-8"
              style={{ backgroundColor: C.borderStrong }}
            />
            <span
              className="tracking-widest uppercase text-[10px] sm:text-[11px]"
              style={{
                color: C.muted,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                letterSpacing: ".18em",
              }}
            >
              Who I am
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mb-3 sm:mb-4"
            style={{
              fontFamily:
                "var(--font-instrument-serif), 'Times New Roman', serif",
              fontSize: "clamp(28px, 3.8vw, 44px)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: C.emphasis,
              margin: 0,
            }}
          >
            Building{" "}
            <span style={{ fontStyle: "italic" }}>digital products</span>,
            brands, and experiences.
          </motion.h2>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="text-[13px] sm:text-sm leading-relaxed mb-4 sm:mb-5 space-y-2.5"
            style={{
              color: C.muted,
              fontFamily: "var(--font-inter), sans-serif",
              letterSpacing: "-0.005em",
            }}
          >
            <p>
              <strong style={{ color: C.text, fontWeight: 500 }}>
                Full Stack Developer
              </strong>{" "}
              {bio}
            </p>
            {bio2 && <p>{bio2}</p>}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="grid grid-cols-3 gap-2 mb-4 sm:mb-5"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-2.5 sm:p-3 rounded-sm flex flex-col items-center text-center transition-all duration-300"
                style={{
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = C.borderStrong;
                  el.style.backgroundColor = C.surfaceHover;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = C.border;
                  el.style.backgroundColor = C.surface;
                }}
              >
                <stat.icon
                  className="text-sm sm:text-base mb-1 sm:mb-1.5"
                  style={{ color: C.muted }}
                />
                <h4
                  style={{
                    fontFamily: "var(--font-instrument-serif), serif",
                    fontSize: "clamp(18px, 2.2vw, 26px)",
                    fontWeight: 400,
                    color: C.emphasis,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {stat.value}
                </h4>
                <span
                  className="text-[7px] sm:text-[9px] uppercase leading-tight mt-1"
                  style={{
                    color: C.muted,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    letterSpacing: ".15em",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Download CV + Hire Me buttons.
              On mobile both sit in one row (flex-1 each, so they split the
              width evenly). "Hire Me" only exists below the lg breakpoint —
              desktop keeps the original single-button layout untouched. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="flex flex-row items-stretch gap-3"
          >
            <a
              href={cvUrl}
              download="Shahriar_Araf_Resume.pdf"
              className="cv-button flex-1 lg:flex-none justify-center"
            >
              <span>Download CV</span>
              <FaDownload className="download-icon" size={12} />
            </a>

            <a
              href="#contact"
              className="hire-button flex-1 justify-center lg:hidden"
            >
              <span>Hire Me</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
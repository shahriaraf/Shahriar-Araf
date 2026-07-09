"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { FaGithub, FaAndroid } from "react-icons/fa";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { WebProject, AppProject, Project } from "@/sanity/queries";
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

type ProjectsProps = {
  webProjects: WebProject[];
  appProjects: AppProject[];
};

// ─── Warm Monochrome Palette (Dark Luxury) ────────────────────────────────────
const C = {
  bg:            "#101010",
  surface:       "#1c1b19",
  surfaceHover:  "#252320",
  cardDeep:      "#0e0e0d",
  border:        "#2a2723",
  borderStrong:  "#3d3833",
  muted:         "#8a8578",
  text:          "#e5e0d4",
  emphasis:      "#f4f0e8",
};

// ─── Portable Text renderer — matches the luxury monochrome palette ──────────
// Bold jumps to the cream 'emphasis' color so key phrases catch the eye,
// headings render as small uppercase mono labels (matching "SELECTED WORK" /
// "MY ARSENAL" style), and bullets use a minimalist horizontal dash instead
// of a fat dot — keeps the editorial dark-luxury feel intact.
const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        style={{
          color: C.muted,
          fontSize: "12px",
          lineHeight: 1.65,
          letterSpacing: "-0.005em",
          margin: "0 0 8px 0",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {children}
      </p>
    ),
    h4: ({ children }) => (
      <h4
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: C.emphasis,
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          margin: "12px 0 6px 0",
        }}
      >
        {children}
      </h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul
        style={{
          margin: "4px 0 8px 0",
          padding: 0,
          listStyle: "none",
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        style={{
          margin: "4px 0 8px 0",
          paddingLeft: "18px",
          color: C.muted,
          fontSize: "12px",
          lineHeight: 1.6,
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li
        style={{
          color: C.muted,
          fontSize: "12px",
          lineHeight: 1.6,
          margin: "3px 0",
          paddingLeft: "14px",
          position: "relative",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "0.68em",
            width: 6,
            height: 1,
            backgroundColor: C.borderStrong,
          }}
        />
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li
        style={{
          color: C.muted,
          fontSize: "12px",
          lineHeight: 1.6,
          margin: "3px 0",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong style={{ color: C.emphasis, fontWeight: 600 }}>
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em style={{ color: C.text, fontStyle: "italic" }}>{children}</em>
    ),
    code: ({ children }) => (
      <code
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "10.5px",
          padding: "1px 5px",
          borderRadius: 2,
          backgroundColor: C.surface,
          color: C.emphasis,
          border: `1px solid ${C.border}`,
        }}
      >
        {children}
      </code>
    ),
  },
};

// ─── Details Panel ────────────────────────────────────────────────────────────
function DetailsPanel({ project, index, total }: { project: Project; index: number; total: number }) {
  const number = String(index + 1).padStart(2, "0");
  const liveLink = "liveLink" in project ? project.liveLink : null;
  const apkLink = "apkLink" in project ? project.apkLink : null;
  const githubLink = project.githubLink ?? null;
  const tags = project.technologies ?? [];

  return (
    <div
      className="flex flex-col justify-between h-full p-4 md:p-5 xl:p-7 overflow-hidden"
      style={{ backgroundColor: C.bg }}
    >
      <div className="min-h-0 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <span
            className="text-[9px] tracking-widest uppercase"
            style={{
              color: C.muted,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              letterSpacing: ".18em",
            }}
          >
            {number} / {String(total).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2.5">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:opacity-100"
                style={{ color: C.muted }}
                title="Source code"
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.emphasis)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.muted)}
              >
                <FaGithub size={20} />
              </a>
            )}
            {apkLink && (
              <a
                href={apkLink}
                className="transition-colors"
                style={{ color: C.muted }}
                title="Download APK"
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.emphasis)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.muted)}
              >
                <FaAndroid size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Project Name — Instrument Serif for editorial feel */}
        <h3
          className="leading-tight mb-2 shrink-0"
          style={{
            fontFamily: "var(--font-instrument-serif), 'Times New Roman', serif",
            fontSize: "clamp(18px, 2vw, 28px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: C.emphasis,
            margin: 0,
          }}
        >
          {project.name}
        </h3>

        {/*
          Rich-text description — renders Portable Text from Sanity so editors
          can add bold, headings, and lists that actually catch the eye
          (instead of a plain flat wall of text). Scrolls internally when
          content is long so the CTA stays anchored at the bottom of the card
          regardless of how much content lives inside.
        */}
        <div
          data-lenis-prevent
          className="mb-3 flex-1 min-h-0 overflow-y-auto pr-1 project-description-scroll"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${C.borderStrong} transparent`,
          }}
        >
          {Array.isArray(project.description) ? (
            <PortableText
              value={project.description}
              components={portableComponents}
            />
          ) : (
            // Graceful fallback for any legacy plain-string descriptions
            // still sitting in Sanity before the schema migration.
            <p
              style={{
                color: C.muted,
                fontSize: "12px",
                lineHeight: 1.65,
                letterSpacing: "-0.005em",
                margin: 0,
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {String(project.description ?? "")}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1 shrink-0 max-h-12 overflow-y-auto pr-1" data-lenis-prevent>
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-[1px] text-[8px] rounded-sm leading-tight"
              style={{
                backgroundColor: C.surface,
                color: C.text,
                border: `1px solid ${C.border}`,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontWeight: 500,
                letterSpacing: ".06em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA link */}
      <div className="mt-3 pt-3 shrink-0" style={{ borderTop: `1px solid ${C.border}` }}>
        {(liveLink || apkLink) && (
          <a
            href={(liveLink || apkLink) ?? "#"}
            target={liveLink ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 text-xs transition-colors"
            style={{
              color: C.emphasis,
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              letterSpacing: ".02em",
            }}
          >
            <span>{liveLink ? "View Live Project" : "Download APK"}</span>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1"
              style={{ border: `1px solid ${C.borderStrong}` }}
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </a>
        )}
      </div>

      {/* Custom webkit scrollbar for description overflow */}
      <style jsx>{`
        .project-description-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .project-description-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .project-description-scroll::-webkit-scrollbar-thumb {
          background: ${C.borderStrong};
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}

// ─── Image Panel ─────────────────────────────────────────────────────────────
function ImagePanel({ project, index, imageRight }: { project: Project; index: number; imageRight: boolean }) {
  const number = String(index + 1).padStart(2, "0");
  const imageUrl = project.image ? urlFor(project.image).width(900).height(700).url() : null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Edge fade toward details */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: imageRight
            ? `linear-gradient(to left, transparent 70%, ${C.bg}55)`
            : `linear-gradient(to right, transparent 70%, ${C.bg}55)`,
        }}
      />
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: C.surface }}
        >
          <span
            className="text-sm"
            style={{
              color: C.muted,
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
          >
            No image
          </span>
        </div>
      )}

      {/* Ghost number watermark */}
      <span
        className="absolute bottom-2 right-3 z-20 select-none leading-none pointer-events-none"
        style={{
          fontFamily: "var(--font-instrument-serif), serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(56px, 7vw, 100px)",
          color: `${C.emphasis}18`,
          letterSpacing: "-0.02em",
        }}
      >
        {number}
      </span>
    </div>
  );
}

// ─── Single Project Card ─────────────────────────────────────────────────────
function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const imageRight = index % 2 === 0;

  return (
    <div
      className="project-card absolute inset-0 w-full h-full rounded-sm overflow-hidden"
      style={{
        zIndex: total - index,
        transformOrigin: "center center",
        boxShadow: "0 24px 50px -12px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top edge accent */}
      <div
        className="absolute top-0 left-0 right-0 z-30"
        style={{ height: "1px", backgroundColor: C.borderStrong }}
      />

      <style jsx>{`
        /* Below lg, the fixed side-by-side "1fr 1px 1fr" grid squeezed the
           image and text into two unreadably narrow columns on tablets and
           phones. Below lg we stack image on top, details below, and let
           the details panel scroll internally if content is long — large
           screens are completely untouched. */
        .project-grid {
          display: flex;
          flex-direction: column;
        }
        .project-grid > :global(.details-panel) {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }
        .project-grid > :global(.image-panel) {
          flex: 0 0 42%;
          min-height: 0;
        }
        .project-grid > .grid-divider {
          width: 100%;
          height: 1px;
          margin: 0 !important;
        }
        @media (min-width: 1024px) {
          .project-grid {
            display: grid;
            grid-template-columns: 1fr 1px 1fr;
          }
          .project-grid > :global(.details-panel),
          .project-grid > :global(.image-panel) {
            flex: initial;
            overflow: hidden;
          }
          .project-grid > .grid-divider {
            width: 1px;
            height: auto;
            margin: 0.75rem 0 !important;
          }
        }
      `}</style>

      <div
        className="project-grid w-full h-full rounded-sm overflow-hidden"
        style={{
          backgroundColor: C.bg,
          border: `1px solid ${C.border}`,
        }}
      >
        {imageRight ? (
          <>
            <div className="details-panel">
              <DetailsPanel project={project} index={index} total={total} />
            </div>
            <div className="grid-divider" style={{ backgroundColor: C.border }} />
            <div className="image-panel">
              <ImagePanel project={project} index={index} imageRight={imageRight} />
            </div>
          </>
        ) : (
          <>
            <div className="image-panel">
              <ImagePanel project={project} index={index} imageRight={imageRight} />
            </div>
            <div className="grid-divider" style={{ backgroundColor: C.border }} />
            <div className="details-panel">
              <DetailsPanel project={project} index={index} total={total} />
            </div>
          </>
        )}
      </div>

      {/* Scroll hint on first card */}
      {index === 0 && (
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 pointer-events-none"
          style={{ opacity: 0.5 }}
        >
          <span
            className="text-[8px] tracking-widest uppercase"
            style={{
              color: C.muted,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              letterSpacing: ".18em",
            }}
          >
            Scroll to flip
          </span>
          <div
            className="w-px h-4 animate-bounce"
            style={{ background: `linear-gradient(to bottom, ${C.muted}, transparent)` }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Stacked Cards using CSS sticky + ScrollTrigger ───────────────────────────
function StackedCardsSection({ projects, headerHeight }: { projects: Project[]; headerHeight: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const total = projects.length;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card || i === total - 1) return;
        const direction = i % 2 === 0 ? -1 : 1;

        // NOTE: ScrollTrigger's "%" in start/end is a percentage of the
        // TRIGGER ELEMENT'S OWN HEIGHT — not one viewport. sectionRef's
        // height is `total * 100vh` (SectionStack's heightVh), so
        // `top+=100%` means "100% of the whole multi-card section" i.e.
        // the very end of the scrollable range, not "one card's worth of
        // scroll". That's why only the first swap ever looked right and
        // everything after it collapsed into the last few pixels of
        // scroll, spilling into the next section. Fix: express start/end
        // as a fraction of the TOTAL section height (i/total, (i+1)/total)
        // so each card gets an equal, correct slice no matter how many
        // projects there are.
        gsap.fromTo(
          card,
          { x: 0, rotate: 0, opacity: 1 },
          {
            x: `${direction * 115}%`,
            rotate: direction * (8 + Math.random() * 6),
            opacity: 0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${(i / total) * 100}% top`,
              end: `top+=${((i + 1) / total) * 100}% top`,
              scrub: 1.2,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  if (projects.length === 0) {
    return (
      <div
        className="sticky flex items-center justify-center"
        style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}
      >
        <p
          className="text-sm"
          style={{
            color: C.muted,
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          No projects yet — add some in Sanity Studio.
        </p>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative h-full">
      <div
        className="sticky flex items-center justify-center overflow-hidden px-4 md:px-6"
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
        }}
      >
        {/* Reduced card container — smaller max-width, tighter height, capped smaller */}
        <div
          className="relative w-full max-w-5xl"
          style={{
            height: `calc(100vh - ${headerHeight + 100}px)`,
            maxHeight: 560,
          }}
        >
          {/* Depth shadow cards */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              backgroundColor: C.cardDeep,
              border: `1px solid ${C.border}`,
              transform: "translateY(12px) scale(0.94)",
              zIndex: 0,
              opacity: 0.6,
            }}
          />
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              backgroundColor: C.cardDeep,
              border: `1px solid ${C.border}`,
              transform: "translateY(6px) scale(0.97)",
              zIndex: 0,
              opacity: 0.8,
            }}
          />

          {projects.map((project, i) => (
            <div
              key={project._id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="absolute inset-0"
              style={{ zIndex: projects.length - i }}
            >
              <ProjectCard project={project} index={i} total={projects.length} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab Button ──────────────────────────────────────────────────────────────
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 text-[11px] rounded-full transition-all duration-300"
      style={{
        backgroundColor: active ? C.emphasis : "transparent",
        color: active ? C.bg : C.muted,
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontWeight: 500,
        letterSpacing: ".14em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </button>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function Projects({ webProjects, appProjects }: ProjectsProps) {
  const [activeTab, setActiveTab] = useState<"web" | "app">("web");
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(56);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setHeaderHeight(e.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const projects: Project[] = activeTab === "web" ? webProjects : appProjects;

  return (
    <div
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      style={{
        backgroundColor: C.bg,
        height: "100%",
        fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
      }}
    >
      {/* Sticky header */}
      <div
        ref={headerRef}
        className="sticky top-0 z-50 backdrop-blur-sm"
        style={{
          backgroundColor: `${C.bg}ee`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-3 flex flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="h-px w-6"
                style={{ backgroundColor: C.borderStrong }}
              />
              <p
                className="text-[10px] tracking-widest uppercase"
                style={{
                  color: C.muted,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  letterSpacing: ".18em",
                }}
              >
                Selected Work
              </p>
            </div>
            <h2
              className="leading-tight"
              style={{
                fontFamily: "var(--font-instrument-serif), 'Times New Roman', serif",
                fontSize: "clamp(20px, 2.2vw, 28px)",
                fontWeight: 400,
                color: C.emphasis,
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              <span style={{ fontStyle: "italic" }}>Projects</span>
            </h2>
          </div>

          <div
            className="inline-flex items-center gap-1 rounded-full p-1"
            style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
            }}
          >
            <TabButton
              active={activeTab === "web"}
              onClick={() => {
                setActiveTab("web");
                setTimeout(() => window.dispatchEvent(new Event("projects-tab-changed")), 150);
              }}
            >
              Web
            </TabButton>
            <TabButton
              active={activeTab === "app"}
              onClick={() => {
                setActiveTab("app");
                setTimeout(() => window.dispatchEvent(new Event("projects-tab-changed")), 150);
              }}
            >
              Mobile
            </TabButton>
          </div>
        </div>
      </div>

      <StackedCardsSection key={activeTab} projects={projects} headerHeight={headerHeight} />
    </div>
  );
}
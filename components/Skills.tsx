"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import type { Skill } from "@/sanity/queries";
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

// ─── Types ────────────────────────────────────────────────────────────────────
type SkillsProps = { skills: Skill[] };

// ─── Warm Monochrome Palette (Dark Luxury) ────────────────────────────────────
const C = {
  bg: "#151515",
  surface: "#1c1b19",
  surfaceHover: "#252320",
  border: "#2a2723",
  borderStrong: "#3d3833",
  muted: "#8a8578",
  text: "#e5e0d4",
  emphasis: "#f4f0e8",
};

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "frontend", label: "Frontend", color: "#ffffff" },
  { id: "backend", label: "Backend", color: "#ffffff" },
  { id: "devops", label: "DevOps & Tools", color: "#ffffff" },
];

const GRID = 40;
const HUB_W = 260;
const HUB_H = 68;

// On large/tablet screens the hub keeps its original fixed size (unchanged
// desktop look). Below ~640px wide, the fixed 260px hub could get close to
// or wider than the available canvas, so it scales down proportionally to
// guarantee it (and the connector lines anchored to its edges) always fits.
function hubDims(canvasW: number) {
  if (canvasW >= 640) return { w: HUB_W, h: HUB_H };
  const scale = Math.max(0.58, canvasW / 640);
  return { w: HUB_W * scale, h: HUB_H * scale };
}

// Spacing between adjacent connector exit points along a hub edge.
// This is the key fix: previously each line's exit point was calculated
// independently by clamping to the target position, which caused several
// lines (whenever nodes shared a side of the hub) to land on the exact
// same point and draw on top of one another. Now every node on a given
// edge gets its own evenly-spaced exit point, sorted by target position,
// so no two lines can ever overlap at the source.
const EXIT_STEP = 22;

// Generates N branch anchor points evenly spaced in a ring around the hub,
// starting at the top and going clockwise — so adding a new skill in Sanity
// always gets its own dedicated branch instead of being capped or having to
// share/overwrite an existing slot. Works for any count (1, 10, 25...).
const CENTER_COL = 8;
const CENTER_ROW = 7.5;
const COL_RADIUS = 7; // reaches col 1 and col 15 at the widest points
const ROW_RADIUS = 5.5; // reaches row 2 and row 13 at the widest points

function generateScatter(count: number): { col: number; row: number }[] {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
    return {
      col: CENTER_COL + Math.cos(angle) * COL_RADIUS,
      row: CENTER_ROW + Math.sin(angle) * ROW_RADIUS,
    };
  });
}

// On narrow screens the branches are pulled proportionally closer to the
// hub (rather than singling out one specific row like the old fixed
// 10-point layout did), so any number of generated branch points stays
// within the canvas instead of running off-screen.
const MOBILE_BREAKPOINT = 640;
const MOBILE_RADIUS_SCALE = 0.72;

function getScatterForViewport(
  scatter: { col: number; row: number }[],
  isMobile: boolean
) {
  if (!isMobile) return scatter;
  return scatter.map((cell) => ({
    col: CENTER_COL + (cell.col - CENTER_COL) * MOBILE_RADIUS_SCALE,
    row: CENTER_ROW + (cell.row - CENTER_ROW) * MOBILE_RADIUS_SCALE,
  }));
}

function snap(v: number) {
  return Math.round(v / GRID) * GRID;
}

// Base distance of the innermost lane's elbow from the hub edge, and the
// spacing between each further-out lane.
const LANE_BASE = 16;
const LANE_STEP = 14;

// ─── Compute a unique, non-overlapping exit point + lane per node ────────────
// Groups nodes by which edge of the hub they naturally belong to (left,
// right, top, bottom), then:
//   1. Spreads their exit points evenly along that edge (ordered by target
//      position), so every line starts from its own distinct point.
//   2. Assigns each node its own "lane" — the distance its elbow sits from
//      the hub edge — ordered by how far the node's target is from the
//      hub's centerline. Nodes with a short trip get a tight, close-in
//      elbow; nodes with a long trip (e.g. reaching a far top/bottom row)
//      get pushed to an outer lane. This guarantees that even when two
//      lines' vertical runs cover overlapping y-ranges, they sit at
//      different x-coordinates and can never be drawn on top of each other.
function computeExitPoints(
  positions: { x: number; y: number }[],
  cw: number,
  ch: number
) {
  const cx = cw / 2;
  const cy = ch / 2;
  const { w: hubW, h: hubH } = hubDims(cw);
  const hw = hubW / 2;
  const hh = hubH / 2;

  type Side = "left" | "right" | "top" | "bottom";
  const withSide = positions.map((p, i) => {
    const gx = snap(p.x);
    const gy = snap(p.y);
    const dx = gx - cx;
    const dy = gy - cy;
    const side: Side =
      Math.abs(dx) / hw >= Math.abs(dy) / hh
        ? dx >= 0
          ? "right"
          : "left"
        : dy >= 0
        ? "bottom"
        : "top";
    return { i, gx, gy, side };
  });

  const groups: Record<Side, typeof withSide> = {
    left: [],
    right: [],
    top: [],
    bottom: [],
  };
  withSide.forEach((n) => groups[n.side].push(n));

  const exitPoints: { sx: number; sy: number; lane: number; side: Side }[] =
    new Array(positions.length);

  (["left", "right"] as Side[]).forEach((side) => {
    const arr = [...groups[side]].sort((a, b) => a.gy - b.gy);
    const count = arr.length;
    arr.forEach((n, idx) => {
      const offset = (idx - (count - 1) / 2) * EXIT_STEP;
      exitPoints[n.i] = {
        sx: side === "left" ? cx - hw : cx + hw,
        sy: cy + offset,
        lane: 0,
        side,
      };
    });

    // Assign lanes by travel distance from the hub's centerline, so lines
    // with overlapping y-ranges never share an elbow x-coordinate.
    const byTravel = [...arr].sort(
      (a, b) => Math.abs(a.gy - cy) - Math.abs(b.gy - cy)
    );
    byTravel.forEach((n, rank) => {
      exitPoints[n.i].lane = rank;
    });
  });

  (["top", "bottom"] as Side[]).forEach((side) => {
    const arr = [...groups[side]].sort((a, b) => a.gx - b.gx);
    const count = arr.length;
    arr.forEach((n, idx) => {
      const offset = (idx - (count - 1) / 2) * EXIT_STEP;
      exitPoints[n.i] = {
        sx: cx + offset,
        sy: side === "top" ? cy - hh : cy + hh,
        lane: 0,
        side,
      };
    });

    const byTravel = [...arr].sort(
      (a, b) => Math.abs(a.gx - cx) - Math.abs(b.gx - cx)
    );
    byTravel.forEach((n, rank) => {
      exitPoints[n.i].lane = rank;
    });
  });

  return exitPoints;
}

// ─── L-shaped connector path ──────────────────────────────────────────────────
// `side` tells us which hub edge this line exits from, so we know whether
// the elbow bends into a vertical run (left/right exits) or a horizontal
// run (top/bottom exits). `lane` (from computeExitPoints) sets how far that
// elbow sits from the hub — each node gets its own lane so no two lines'
// straight runs ever land on the same coordinate.
function buildPath(
  nx: number,
  ny: number,
  exitPoint: { sx: number; sy: number; lane: number; side: "left" | "right" | "top" | "bottom" }
) {
  const gx = snap(nx);
  const gy = snap(ny);
  const { sx, sy, lane, side } = exitPoint;

  const dx = gx - sx;
  const dy = gy - sy;
  const OFFSET = LANE_BASE + lane * LANE_STEP;

  if (side === "left" || side === "right") {
    const elbowX = dx >= 0 ? sx + OFFSET : sx - OFFSET;
    return {
      d: `M ${sx} ${sy} L ${elbowX} ${sy} L ${elbowX} ${gy} L ${gx} ${gy}`,
      sx,
      sy,
    };
  } else {
    const elbowY = dy >= 0 ? sy + OFFSET : sy - OFFSET;
    return {
      d: `M ${sx} ${sy} L ${sx} ${elbowY} L ${gx} ${elbowY} L ${gx} ${gy}`,
      sx,
      sy,
    };
  }
}

// ─── SVG connector lines ─────────────────────────────────────────────────────
function NeonLines({
  positions,
  color,
  cw,
  ch,
  visible,
}: {
  positions: { x: number; y: number }[];
  color: string;
  cw: number;
  ch: number;
  visible: boolean;
}) {
  const cx = cw / 2;
  const cy = ch / 2;
  const { w: hubW, h: hubH } = hubDims(cw);
  const hw = hubW / 2;
  const hh = hubH / 2;
  const STUB = 32;

  const exitPoints = computeExitPoints(positions, cw, ch);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={cw}
      height={ch}
      style={{ zIndex: 5 }}
    >
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {positions.map((pos, i) => {
        const exitPoint = exitPoints[i];
        const { d, sx, sy } = buildPath(pos.x, pos.y, exitPoint);
        const gx = snap(pos.x),
          gy = snap(pos.y);
        const delay = visible ? i * 0.08 : 0;

        const lineGradId = `lineGrad-${i}-${color.replace("#", "")}`;
        const stubGradId = `stubGrad-${i}-${color.replace("#", "")}`;

        const onLeft = Math.abs(sx - (cx - hw)) < 1;
        const onRight = Math.abs(sx - (cx + hw)) < 1;
        const onTop = Math.abs(sy - (cy - hh)) < 1;
        const onBottom = Math.abs(sy - (cy + hh)) < 1;

        let stubX1 = sx,
          stubY1 = sy,
          stubX2 = sx,
          stubY2 = sy;
        if (onLeft || onRight) {
          stubX1 = sx;
          stubY1 = sy - STUB;
          stubX2 = sx;
          stubY2 = sy + STUB;
        } else if (onTop || onBottom) {
          stubX1 = sx - STUB;
          stubY1 = sy;
          stubX2 = sx + STUB;
          stubY2 = sy;
        }

        return (
          <g key={i}>
            <defs>
              <linearGradient
                id={lineGradId}
                x1={sx}
                y1={sy}
                x2={gx}
                y2={gy}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={color} stopOpacity="1" />
                <stop offset="18%" stopColor={color} stopOpacity="1" />
                <stop offset="45%" stopColor={color} stopOpacity="0.75" />
                <stop offset="92%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id={stubGradId}
                x1={stubX1}
                y1={stubY1}
                x2={stubX2}
                y2={stubY2}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="35%" stopColor={color} stopOpacity="0.4" />
                <stop offset="50%" stopColor={color} stopOpacity="1" />
                <stop offset="65%" stopColor={color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>

            <motion.line
              x1={stubX1}
              y1={stubY1}
              x2={stubX2}
              y2={stubY2}
              stroke={`url(#${stubGradId})`}
              strokeWidth={1}
              strokeLinecap="butt"
              initial={{ opacity: 0 }}
              animate={{ opacity: visible ? 1 : 0 }}
              transition={{ duration: 0.35, delay: delay + 0.05 }}
            />

            <motion.path
              d={d}
              stroke={`url(#${lineGradId})`}
              strokeWidth={1.2}
              fill="none"
              strokeLinecap="square"
              strokeLinejoin="miter"
              filter="url(#neon-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: visible ? 1 : 0 }}
              transition={{ duration: 0.55, delay, ease: "easeOut" }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Skill node ───────────────────────────────────────────────────────────────
function SkillNode({
  skill,
  x,
  y,
  index,
  visible,
}: {
  skill: Skill;
  x: number;
  y: number;
  index: number;
  visible: boolean;
}) {
  const [hov, setHov] = useState(false);
  const imgUrl = skill.logo
    ? urlFor(skill.logo).width(80).height(80).url()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{
        delay: visible ? index * 0.08 + 0.45 : 0,
        duration: visible ? 0.3 : 0.1,
        type: "spring",
        stiffness: 300,
        damping: 22,
      }}
      className="absolute flex flex-col items-center cursor-default z-20"
      style={{ left: snap(x) - 22, top: snap(y) - 22 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 44, height: 44 }}>
        {imgUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={imgUrl}
              alt={skill.name}
              fill
              className="object-contain"
              sizes="44px"
            />
          </div>
        ) : (
          <div
            style={{
              width: 44,
              height: 44,
              background: C.emphasis,
              borderRadius: 4,
            }}
          />
        )}
      </div>

      {/* Tooltip label — only shows on hover */}
      <AnimatePresence>
        {hov && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute",
              top: "100%",
              marginTop: 6,
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.emphasis,
              textAlign: "center",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              pointerEvents: "none",
            }}
          >
            {skill.name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Central hub ─────────────────────────────────────────────────────────────
function Hub({
  label,
  color,
  width = HUB_W,
  height = HUB_H,
}: {
  label: string;
  color: string;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className="absolute z-10"
      style={{
        width,
        height,
        top: "50%",
        left: "50%",
        marginTop: -height / 2,
        marginLeft: -width / 2,
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              whiteSpace: "nowrap",
            }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{ width: 10, height: 10 }}
            >
              <motion.div
                animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: color,
                  opacity: 0.35,
                }}
              />
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}88`,
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-instrument-serif), serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 22,
                letterSpacing: "-0.01em",
                color: C.emphasis,
                lineHeight: 1,
              }}
            >
              {label}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Skills({ skills }: SkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 720, h: 400 });
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      const h = e.contentRect.height;
      setCanvasSize({ w: snap(w), h: snap(h) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    skills: (cat.id === "devops"
      ? skills.filter((s) => s.category === "devops")
      : skills.filter((s) => s.category === cat.id)
    ).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }));

  const activeCat = grouped[activeCatIdx];
  const isMobile = canvasSize.w > 0 && canvasSize.w < MOBILE_BREAKPOINT;
  const scatter = getScatterForViewport(
    generateScatter(activeCat.skills.length),
    isMobile
  );

  const PAD_X = 40;
  const PAD_Y = 40;
  const usableW = Math.max(canvasSize.w - PAD_X * 2, 1);
  const usableH = Math.max(canvasSize.h - PAD_Y * 2, 1);

  const MIN_COL = 1,
    MAX_COL = 15;
  const MIN_ROW = 2,
    MAX_ROW = 13;
  const colSpan = MAX_COL - MIN_COL;
  const rowSpan = MAX_ROW - MIN_ROW;

  const nodePositions = activeCat.skills.map((_, i) => {
    const cell = scatter[i];
    const nx = PAD_X + ((cell.col - MIN_COL) / colSpan) * usableW;
    const ny = PAD_Y + ((cell.row - MIN_ROW) / rowSpan) * usableH;
    return { x: snap(nx), y: snap(ny) };
  });

  useEffect(() => {
    if (!isAutoPlay) return;
    const t1 = setTimeout(() => setVisible(false), 3800);
    const t2 = setTimeout(() => {
      setActiveCatIdx((p) => (p + 1) % CATEGORIES.length);
      setVisible(true);
    }, 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeCatIdx, isAutoPlay]);

  const switchTo = (idx: number) => {
    if (idx === activeCatIdx) return;
    setIsAutoPlay(false);
    setVisible(false);
    setTimeout(() => {
      setActiveCatIdx(idx);
      setVisible(true);
    }, 280);
  };

  return (
    <section
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} relative w-full h-[100dvh] flex flex-col overflow-hidden`}
      style={{
        backgroundColor: C.bg,
        fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
      }}
    >
      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C.emphasis}05 0%, transparent 70%)`,
          transition: "background 0.6s ease",
        }}
      />

      {/* ── Header ── */}
      <div className="relative z-30 max-w-7xl w-full mx-auto px-6 md:px-12 pt-6 sm:pt-8 pb-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className="h-px w-10"
              style={{ backgroundColor: C.borderStrong }}
            />
            <span
              className="text-[10px] sm:text-xs tracking-widest uppercase"
              style={{
                color: C.muted,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                letterSpacing: ".18em",
              }}
            >
              My Arsenal
            </span>
          </div>
          <h2
            className="leading-none"
            style={{
              fontFamily:
                "var(--font-instrument-serif), 'Times New Roman', serif",
              fontSize: "clamp(32px, 4.5vw, 60px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: C.emphasis,
              margin: 0,
            }}
          >
            Skills <span style={{ color: C.muted }}>&amp;</span>{" "}
            <span style={{ fontStyle: "italic" }}>Tech</span>
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => switchTo(i)}
              className="relative px-4 py-1.5 text-[10px] tracking-widest uppercase transition-all duration-300"
              style={{
                borderRadius: 2,
                border: `1px solid ${activeCatIdx === i ? C.emphasis : C.border}`,
                color: activeCatIdx === i ? C.emphasis : C.muted,
                background: activeCatIdx === i ? C.surfaceHover : "transparent",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontWeight: 500,
                letterSpacing: ".16em",
              }}
            >
              {cat.label}
              {activeCatIdx === i && (
                <motion.div
                  layoutId="cat-underline"
                  className="absolute bottom-0 left-3 right-3"
                  style={{
                    height: 1,
                    backgroundColor: C.emphasis,
                    borderRadius: 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-8">
        <div
          ref={containerRef}
          className="relative mx-auto max-w-5xl w-full"
          style={{ height: "min(100%, 60vh)" }}
        >
          <NeonLines
            positions={nodePositions}
            color={activeCat.color}
            cw={canvasSize.w}
            ch={canvasSize.h}
            visible={visible}
          />

          <Hub
            label={activeCat.label}
            color={activeCat.color}
            width={hubDims(canvasSize.w).w}
            height={hubDims(canvasSize.w).h}
          />

          {activeCat.skills.map((skill, i) => (
            <SkillNode
              key={`${activeCat.id}-${skill._id}`}
              skill={skill}
              x={nodePositions[i]?.x ?? 0}
              y={nodePositions[i]?.y ?? 0}
              index={i}
              visible={visible}
            />
          ))}

          {activeCat.skills.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="text-xs"
                style={{
                  color: C.muted,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                }}
              >
                No skills yet — add some in Sanity Studio.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom controls ── */}
      <div className="relative z-30 py-3 sm:py-4 flex flex-col items-center gap-2 px-6 shrink-0">
        <div className="flex sm:hidden items-center gap-2">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => switchTo(i)}
              className="px-3 py-1 text-[8px] tracking-widest uppercase transition-all"
              style={{
                borderRadius: 2,
                border: `1px solid ${activeCatIdx === i ? C.emphasis : C.border}`,
                color: activeCatIdx === i ? C.emphasis : C.muted,
                background: activeCatIdx === i ? C.surfaceHover : "transparent",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontWeight: 500,
                letterSpacing: ".16em",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isAutoPlay && (
          <div className="flex items-center gap-3">
            {CATEGORIES.map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{ width: 32, height: 1, backgroundColor: C.border }}
              >
                {activeCatIdx === i && (
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: C.emphasis }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4.2, ease: "linear" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {!isAutoPlay && (
          <div className="flex items-center gap-2">
            {CATEGORIES.map((_, i) => (
              <button
                key={i}
                onClick={() => switchTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeCatIdx === i ? 20 : 5,
                  height: 5,
                  backgroundColor:
                    activeCatIdx === i ? C.emphasis : C.borderStrong,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
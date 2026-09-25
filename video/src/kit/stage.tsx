import React from "react";
import { AbsoluteFill, Freeze, interpolate, Sequence, useCurrentFrame } from "remotion";
import { brand } from "../../../brand/brand";
import { cap, departure, move, slam, travel } from "./motion";

// Stage primitives: the moving background, scene exits, popouts and the cursor.

/** Warm paper background with two slow-drifting color fields. `tint` shifts per scene. */
export function Field({ tint }: { tint?: string }) {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: brand.colors.background }}>
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          left: -620 + Math.sin(f / 40) * 60,
          top: -640 + Math.cos(f / 55) * 40,
          background: `radial-gradient(ellipse, color-mix(in oklch, ${brand.colors.accent} 26%, transparent), transparent 66%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          right: -700,
          bottom: -500 + Math.sin(f / 50) * 60,
          background: `radial-gradient(ellipse, ${tint ?? `color-mix(in oklch, ${brand.colors.accentSoft} 70%, transparent)`}, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
}

// Lifted design markup often carries its own absolute placement; neutralize it so a
// <Pop> can place it. Applies to children of .kit-html.
const htmlReset = `.kit-html>div{position:relative!important;left:auto!important;top:auto!important;right:auto!important;transform:none!important;margin:0!important;max-width:none!important}`;

/** A scene that exits by accelerating up and away with a little blur at `exitAt`. */
export function Scene({ exitAt, children, css = "" }: { exitAt?: number; children: React.ReactNode; css?: string }) {
  const f = useCurrentFrame();
  const out = exitAt === undefined ? 0 : move(f, exitAt, exitAt + 12, 0, 1, departure);
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${-out * 320}px) scale(${1 + out * 0.08})`,
        opacity: 1 - out,
        filter: out > 0 ? `blur(${out * 10}px)` : undefined,
      }}
    >
      <style>{htmlReset + css}</style>
      {children}
    </AbsoluteFill>
  );
}

/**
 * A product surface slammed into frame: arrives from `from`, rotates from rot[0] to rot[1],
 * overshoots slightly, then holds. Pass React children (cards built with ui.tsx) or `html`
 * (markup lifted from a design export by scripts/extract-design.mjs). Positioned by its center.
 */
export function Pop({
  html,
  children,
  width,
  x,
  y,
  scale = 1,
  delay,
  from = [0, 160],
  rot = [5, -1.5],
  shadow = false,
  radius = 18,
  className,
}: {
  html?: string;
  children?: React.ReactNode;
  width?: number | string;
  x: number;
  y: number;
  scale?: number;
  delay: number;
  from?: [number, number];
  rot?: [number, number];
  shadow?: boolean;
  radius?: number;
  /** Scope for per-frame CSS targeting elements inside `html`. */
  className?: string;
}) {
  const f = useCurrentFrame();
  const t = move(f, delay, delay + 16);
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        opacity: move(f, delay, delay + 5),
        transform: `translate(-50%,-50%) translate(${(1 - t) * from[0]}px,${(1 - t) * from[1]}px) rotate(${interpolate(t, [0, 1], rot)}deg) scale(${scale * slam(f, delay)})`,
        borderRadius: radius,
        boxShadow: shadow ? "0 26px 50px -18px rgba(20,16,10,.35)" : undefined,
      }}
    >
      {html ? <div className="kit-html" dangerouslySetInnerHTML={{ __html: html }} /> : null}
      {children}
    </div>
  );
}

/** A "You" cursor that glides to (left, top) from the lower right and taps at `press`. */
export function Cursor({
  left,
  top,
  delay,
  press,
  label = "You",
  scale = 1,
}: {
  left: number;
  top: number;
  delay: number;
  press: number;
  label?: string;
  scale?: number;
}) {
  const f = useCurrentFrame();
  const t = move(f, delay, delay + 16, 0, 1, travel);
  return (
    <div
      style={{
        position: "absolute",
        left: left + (1 - t) * 90,
        top: top + (1 - t) * 70,
        opacity: move(f, delay, delay + 5),
        transform: `scale(${scale * interpolate(f, [press, press + 3, press + 7], [1, 0.84, 1], cap)})`,
        transformOrigin: "top left",
        filter: "drop-shadow(0 4px 5px #0003)",
        zIndex: 5,
      }}
    >
      <svg width="20" height="24" viewBox="0 0 36 42">
        <path d="M3 2L31 25L18 26L12 38Z" fill={brand.colors.foreground} stroke="white" strokeWidth="2.5" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 13,
          top: 18,
          borderRadius: 20,
          padding: "3px 8px",
          font: `600 10px ${brand.typography.body}`,
          background: brand.colors.foreground,
          color: "white",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/** Frames of settled opening shown before a typed video starts typing. */
export const POSTER_LEAD = 2;

/**
 * Prepends `frames` frames of the opening in its settled state (`settledAt`), so the very
 * first frame of an autoplaying preview reads as the complete line, not a half-typed one.
 */
export function PosterLead({
  frames,
  settledAt,
  poster,
  children,
}: {
  frames: number;
  settledAt: number;
  poster: React.ReactNode;
  children: React.ReactNode;
}) {
  if (!frames) return <>{children}</>;
  return (
    <>
      <Sequence durationInFrames={frames} layout="none">
        <Freeze frame={settledAt}>{poster}</Freeze>
      </Sequence>
      <Sequence from={frames} layout="none">
        {children}
      </Sequence>
    </>
  );
}

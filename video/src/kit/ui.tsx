import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand } from "../../../brand/brand";
import { cap, move } from "./motion";

// Product-surface building blocks, styled from brand tokens and authored at "app size"
// (roughly iPhone points). Put them inside a <Pop scale={2.2–2.6}> to blow them up into
// hero popouts. Rebuild your real screens with these, copying labels and data from the
// actual product (see brand/product.md); never invent features a surface doesn't have.

const c = brand.colors;
const body = brand.typography.body;
const tone = (i: number) => c.palette?.[i % (c.palette?.length || 1)] ?? { soft: c.accentSoft, strong: c.accent };

export function Card({ children, width = 340, padding = 14, style }: { children: React.ReactNode; width?: number; padding?: number; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width,
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 18,
        padding,
        fontFamily: body,
        color: c.foreground,
        boxShadow: "0 30px 70px -14px rgba(20,16,10,.30)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Rounded initials square, e.g. an agent, teammate or integration. */
export function Badge({ label, i = 0, size = 28 }: { label: string; i?: number; size?: number }) {
  const t = tone(i);
  return (
    <span
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: size * 0.32,
        background: t.soft,
        color: t.strong,
        display: "grid",
        placeItems: "center",
        font: `600 ${size * 0.36}px ${body}`,
      }}
    >
      {label}
    </span>
  );
}

/** "<actor> did / <title>" with a Done badge that stamps in at `doneAt`, plus key/value rows. */
export function ActionCard({
  actor,
  badge,
  i = 0,
  title,
  rows = [],
  doneAt,
  doneLabel = "Done",
}: {
  actor: string;
  badge: string;
  i?: number;
  title: string;
  rows?: [string, string][];
  doneAt?: number;
  doneLabel?: string;
}) {
  const f = useCurrentFrame();
  const stamp = doneAt === undefined ? 1 : f < doneAt ? 0 : interpolate(f, [doneAt, doneAt + 4, doneAt + 10], [1.9, 0.92, 1], cap);
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Badge label={badge} i={i} size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, color: c.muted }}>{actor} did</div>
          <div style={{ fontSize: 15.5, fontWeight: 600 }}>{title}</div>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#2c7a4b",
            background: "#e2f3e8",
            padding: "4px 9px",
            borderRadius: 999,
            transform: `scale(${stamp})`,
            opacity: Math.min(1, stamp),
          }}
        >
          {doneLabel}
        </span>
      </div>
      {rows.length ? (
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "56px 1fr", rowGap: 6, fontSize: 13 }}>
          {rows.map(([k, v]) => (
            <React.Fragment key={k}>
              <span style={{ color: c.muted }}>{k}</span>
              <span>{v}</span>
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

/** Status pill, e.g. "Scheduler joined — sorting who covers what". */
export function EventPill({ badge, i = 0, text }: { badge: string; i?: number; text: string }) {
  const t = tone(i);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, background: t.soft, borderRadius: 999, padding: "7px 14px 7px 8px", whiteSpace: "nowrap", fontFamily: body }}>
      <span style={{ width: 20, height: 20, borderRadius: 7, background: "#fff", display: "grid", placeItems: "center", font: `600 9px ${body}`, color: t.strong }}>{badge}</span>
      <span style={{ font: `500 13px ${body}`, color: t.strong }}>{text}</span>
    </div>
  );
}

/** Dark pill for a one-line result, e.g. "3 things done while you slept". */
export function ResultPill({ badges, text }: { badges: string[]; text: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#1d1b17", color: "#fff", borderRadius: 999, padding: "9px 18px 9px 9px", fontFamily: body, whiteSpace: "nowrap", boxShadow: "0 20px 40px -12px rgba(20,16,10,.4)" }}>
      <span style={{ display: "flex" }}>
        {badges.map((b, k) => (
          <span key={b} style={{ marginLeft: k ? -7 : 0, border: "2px solid #1d1b17", borderRadius: 10 }}>
            <Badge label={b} i={k} size={26} />
          </span>
        ))}
      </span>
      <span style={{ font: `600 14.5px ${body}` }}>{text}</span>
    </div>
  );
}

/** Chat bubble. `side="user"` sits right in the accent tint. */
export function Bubble({ text, side = "user", width = 300 }: { text: string; side?: "user" | "agent"; width?: number }) {
  return (
    <div style={{ width, background: side === "user" ? c.accentSoft : c.surface, border: side === "agent" ? `1px solid ${c.border}` : undefined, borderRadius: 18, padding: "12px 15px", font: `400 15px/1.5 ${body}`, color: c.foreground }}>
      {text}
    </div>
  );
}

/** Header whose avatar stack and "N in" count grow as members join at `joinedAt` frames. */
export function StackHeader({ title, badges, joinedAt, noun = "helper", empty }: { title: string; badges: string[]; joinedAt: number[]; noun?: string; empty?: string }) {
  const f = useCurrentFrame();
  const n = joinedAt.filter((at) => f >= at).length;
  return (
    <Card width={300} padding={12} style={{ display: "flex", alignItems: "center", gap: 12, boxShadow: "none" }}>
      <div style={{ flex: 1 }}>
        <div style={{ font: `600 15.5px ${body}` }}>{title}</div>
        <div style={{ marginTop: 3, font: `400 12.5px ${body}`, color: c.muted }}>{n === 0 ? (empty ?? "Just started") : `${n} ${noun}${n > 1 ? "s" : ""} in`}</div>
      </div>
      <div style={{ display: "flex" }}>
        {badges.map((b, k) => {
          const p = interpolate(f, [joinedAt[k], joinedAt[k] + 4, joinedAt[k] + 9], [0, 1.25, 1], cap);
          return (
            <span key={b} style={{ marginLeft: k ? -8 : 0, border: "2px solid #fff", borderRadius: 10, transform: `scale(${p})`, opacity: Math.min(1, p) }}>
              <Badge label={b} i={k} size={28} />
            </span>
          );
        })}
      </div>
    </Card>
  );
}

/** Checklist whose items tick at `ticks` (frames), with a progress bar and an optional action button. */
export function Checklist({
  title,
  items,
  preChecked = 0,
  ticks = [],
  action,
}: {
  title: string;
  items: string[];
  preChecked?: number;
  ticks?: number[];
  action?: { label: string; doneLabel: string; pressAt: number };
}) {
  const f = useCurrentFrame();
  const checked = preChecked + ticks.filter((t) => f >= t).length;
  const pct = interpolate(f, [ticks[0] ?? 0, (ticks[ticks.length - 1] ?? 0) + 6], [preChecked, preChecked + ticks.length], cap) / items.length;
  const press = action ? interpolate(f, [action.pressAt, action.pressAt + 3, action.pressAt + 8], [1, 0.93, 1], cap) : 1;
  const t = tone(1);
  return (
    <Card width={290}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ flex: 1, font: `600 15px ${body}` }}>{title}</span>
        <span style={{ fontSize: 13, color: c.muted }}>
          {checked}/{items.length}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 5, background: c.border, margin: "8px 0 10px" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", borderRadius: 5, background: t.strong }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((label, k) => {
          const done = k < checked;
          const at = ticks[k - preChecked];
          const pop = at !== undefined && done ? interpolate(f, [at, at + 3, at + 8], [0.5, 1.2, 1], cap) : 1;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
              <span style={{ width: 18, height: 18, borderRadius: 6, display: "grid", placeItems: "center", background: done ? t.strong : "transparent", border: done ? "none" : `1.5px solid ${c.border}`, transform: `scale(${pop})` }}>
                {done ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                ) : null}
              </span>
              <span style={{ color: done ? c.muted : c.foreground, textDecoration: done ? "line-through" : "none" }}>{label}</span>
            </div>
          );
        })}
      </div>
      {action ? (
        <div style={{ marginTop: 12, height: 40, borderRadius: 999, background: c.accent, color: "#fff", display: "grid", placeItems: "center", font: `600 14px ${body}`, transform: `scale(${press})` }}>
          {f >= action.pressAt + 4 ? `✓  ${action.doneLabel}` : action.label}
        </div>
      ) : null}
    </Card>
  );
}

/** iOS-style notification banner. */
export function Notification({ app, title, body: text, time = "now" }: { app: string; title: string; body: string; time?: string }) {
  return (
    <div style={{ width: 360, background: "rgba(255,255,255,.92)", borderRadius: 22, padding: "12px 14px", display: "flex", gap: 11, fontFamily: body, boxShadow: "0 30px 70px -14px rgba(20,16,10,.30)" }}>
      {brand.assets.icon ? <Img src={staticFile(brand.assets.icon)} style={{ width: 38, height: 38, borderRadius: 9 }} /> : <Badge label={brand.name.slice(0, 2)} size={38} />}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", fontSize: 13 }}>
          <b style={{ flex: 1, fontWeight: 600 }}>{app}</b>
          <span style={{ color: c.muted, fontSize: 12 }}>{time}</span>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.35 }}>{text}</div>
      </div>
    </div>
  );
}

/** A real product screenshot (in video/public or brand/assets) as a floating card or in a phone frame. */
export function Screenshot({ src, width = 390, device = false, radius = 18 }: { src: string; width?: number; device?: boolean; radius?: number }) {
  const img = <Img src={staticFile(src)} style={{ display: "block", width: "100%", borderRadius: device ? 42 : radius }} />;
  if (!device) return <div style={{ width, borderRadius: radius, overflow: "hidden", boxShadow: "0 30px 70px -14px rgba(20,16,10,.30)" }}>{img}</div>;
  return <div style={{ width, padding: 10, background: "#1c1c1e", borderRadius: 52, boxShadow: "0 40px 80px -12px rgba(28,22,14,.35)" }}>{img}</div>;
}

/** Stacked benefit rows that slide in and check at `at + i * gap`. */
export function BenefitList({ items, at, gap = 8, width = 746 }: { items: string[]; at: number; gap?: number; width?: number }) {
  const f = useCurrentFrame();
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 22 }}>
      {items.map((label, i) => {
        const s = at + i * gap;
        const t = move(f, s, s + 14);
        const check = interpolate(f, [s + 6, s + 9, s + 14], [0, 1.25, 1], cap);
        const tn = tone(i);
        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "24px 28px",
              borderRadius: 28,
              background: c.surface,
              border: `1.5px solid ${c.border}`,
              boxShadow: "0 22px 44px -24px rgba(20,16,10,.35)",
              opacity: move(f, s, s + 5),
              transform: `translateX(${(1 - t) * (i % 2 ? 260 : -260)}px) rotate(${(1 - t) * (i % 2 ? 4 : -4)}deg)`,
            }}
          >
            <span style={{ width: 58, height: 58, flexShrink: 0, borderRadius: 18, background: tn.soft, display: "grid", placeItems: "center" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={tn.strong} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `scale(${check})` }}>
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <span style={{ font: `600 36px/1.2 ${body}`, letterSpacing: "-0.015em", color: c.foreground }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

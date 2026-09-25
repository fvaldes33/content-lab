import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "../../../brand/brand";
import { move, travel } from "./motion";
import type { TypeSpec } from "./timing";

// Headline typography. Lines reveal through a mask (default) or, inside
// <TypedMode.Provider value>, type in with a caret. Emphasis words use the display
// face in italic + accent; <Marked> draws a marker underline or an oval around them.

/** Turns every <Headline> below it into the typed variant. */
export const TypedMode = React.createContext(false);

export function MaskLine({
  children,
  delay = 0,
  size = 140,
  color,
  italic = false,
}: {
  children: React.ReactNode;
  /** Frame the line starts revealing. Negative = already on screen (and never typed). */
  delay?: number;
  size?: number;
  color?: string;
  italic?: boolean;
}) {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        overflow: "hidden",
        padding: "0 .1em .12em",
        margin: "0 -.1em -.12em",
        fontFamily: brand.typography.display,
        fontWeight: brand.typography.displayWeight,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: brand.typography.displayTracking ?? "-.04em",
        wordSpacing: brand.typography.displayWordSpacing ?? "normal",
        color: color ?? brand.colors.foreground,
      }}
    >
      <div
        style={{
          transform: `translateY(${move(f, delay, delay + 16, 110, 0)}%)`,
          opacity: move(f, delay, delay + 5),
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Accent-colored emphasis (italic when the brand's display face supports it). */
export const Emph: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => {
  return (
    <span style={{ color: color ?? brand.colors.accent, fontStyle: brand.typography.italicEmphasis ? "italic" : "normal" }}>
      {children}
    </span>
  );
};

function Sweep({ delay = 0, oval = false, color }: { delay?: number; oval?: boolean; color: string }) {
  const f = useCurrentFrame();
  return (
    <span
      style={{
        position: "absolute",
        inset: oval ? "4% -6% 0" : "auto -3% 4%",
        height: oval ? "96%" : "20%",
        border: oval ? `4px solid ${color}` : undefined,
        borderRadius: oval ? "50%" : 4,
        background: oval ? undefined : color,
        zIndex: -1,
        clipPath: `inset(0 ${move(f, delay, delay + 14, 100, 0)}% 0 0)`,
        transform: "rotate(-2deg)",
      }}
    />
  );
}

/** Marker underline (default) or drawn oval around its children, drawn in at `delay`. */
export const Marked: React.FC<{ children: React.ReactNode; delay: number; oval?: boolean; color?: string }> = ({
  children,
  delay,
  oval,
  color,
}) => {
  return (
    <span style={{ position: "relative", display: "inline-block", zIndex: 0 }}>
      {children}
      <Sweep delay={delay} oval={oval} color={color ?? (oval ? brand.colors.accent : brand.colors.accentSoft)} />
    </span>
  );
};

const charTimes = (spec: TypeSpec) => {
  let t = spec.at;
  return [...spec.text].map((ch) => {
    const at = Math.floor(t);
    t += ch === "\n" ? 3 : spec.fpc;
    return { ch, at };
  });
};

const Caret: React.FC<{ on: boolean; color: string }> = ({ on, color }) => (
  <span style={{ position: "relative", display: "inline-block", width: 0 }}>
    <span
      style={{
        position: "absolute",
        left: "0.01em",
        top: "-0.78em",
        width: "0.055em",
        height: "0.86em",
        borderRadius: 2,
        background: color,
        opacity: on ? 1 : 0,
      }}
    />
  </span>
);

// Walks the headline JSX, typing its text per the TypeSpec. Layout never shifts:
// untyped characters are laid out but hidden. Marked highlights draw once their text is typed.
function typeLines(lines: React.ReactNode, spec: TypeSpec, f: number, blinkBefore: boolean, caretColor: string) {
  const times = charTimes(spec);
  const next = times.filter((c) => c.at <= f).length;
  const end = times[times.length - 1].at;
  const before = next < times.length && times[next].ch !== "\n" ? next : -1;
  const after = before === -1 ? next - 1 : -1;
  const caretOn =
    f <= end
      ? f >= times[0].at || (blinkBefore && Math.floor(f / 8) % 2 === 0)
      : f < end + 18 && Math.floor((f - end) / 8) % 2 === 1;
  let i = 0;
  let firstTyped = true;
  const walk = (node: React.ReactNode, pre: boolean): React.ReactNode => {
    if (Array.isArray(node)) return node.map((n, k) => <React.Fragment key={k}>{walk(n, pre)}</React.Fragment>);
    if (typeof node === "string") {
      if (pre) return node;
      const start = i;
      i += node.length;
      if (times.slice(start, i).map((c) => c.ch).join("") !== node) {
        throw new Error(`typing text does not match headline at "${node}" (expected "${spec.text}")`);
      }
      const shown = times.slice(start, i).filter((c) => c.at <= f).length;
      const caretAt =
        before >= start && before < i ? before - start : after >= start && after < i ? after - start + 1 : -1;
      return (
        <>
          {node.slice(0, shown)}
          {caretAt === shown ? <Caret on={caretOn} color={caretColor} /> : null}
          <span style={{ visibility: "hidden" }}>{node.slice(shown)}</span>
        </>
      );
    }
    if (!React.isValidElement<{ children?: React.ReactNode; delay?: number }>(node)) return node;
    const kids = node.props.children;
    if (node.type === MaskLine) {
      const isPre = (node.props.delay ?? 0) < 0;
      if (!isPre) {
        if (!firstTyped) {
          if (times[i]?.ch !== "\n") throw new Error(`typing text "${spec.text}" is missing a \\n between lines`);
          i += 1;
        }
        firstTyped = false;
      }
      return React.cloneElement(node, { delay: -99 }, walk(kids, isPre));
    }
    const walked = React.Children.map(kids, (k) => walk(k, pre));
    if (node.type === Marked && !pre) return React.cloneElement(node, { delay: times[i - 1].at + 1 }, walked);
    return React.cloneElement(node, {}, walked);
  };
  const out = walk(<>{lines}</>, false);
  if (i !== times.length) throw new Error(`typing text "${spec.text}" is longer than the headline`);
  return out;
}

/**
 * A headline that lands full-frame, then (at `dockAt`) travels up and shrinks into a
 * header so product proof can take the frame. Children are <MaskLine>s.
 */
export function Headline({
  lines,
  typing,
  top = 600,
  dockAt = 9999,
  dockTop = 92,
  dockScale = 0.5,
  blinkBeforeTyping = false,
}: {
  lines: React.ReactNode;
  /** Used in typed mode; text must match the lines exactly. */
  typing?: TypeSpec;
  top?: number;
  dockAt?: number;
  dockTop?: number;
  dockScale?: number;
  /** Blink the caret before typing starts. Only on the opening scene: elsewhere the
   * previous scene is still exiting and a blinking caret lands on top of it. */
  blinkBeforeTyping?: boolean;
}) {
  const f = useCurrentFrame();
  const typed = React.useContext(TypedMode) && Boolean(typing);
  const t = move(f, dockAt, dockAt + 14, 0, 1, travel);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: interpolate(t, [0, 1], [top, dockTop]),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transform: `scale(${interpolate(t, [0, 1], [1, dockScale])})`,
        transformOrigin: "top center",
      }}
    >
      {typed && typing ? typeLines(lines, typing, f, blinkBeforeTyping, brand.colors.accent) : lines}
    </div>
  );
}

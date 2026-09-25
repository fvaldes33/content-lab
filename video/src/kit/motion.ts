import { Easing, interpolate } from "remotion";

// Motion language: things arrive fast and decelerate into a readable hold (arrival),
// leave by accelerating away (departure), and move between two rest states with
// ease-in-out (travel). Timing is native frames; never speed up a whole clock to
// "make it faster", give beats less hold instead.
export const cap = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const arrival = Easing.bezier(0.16, 1, 0.3, 1);
export const departure = Easing.bezier(0.65, 0, 0.85, 0.2);
export const travel = Easing.bezier(0.65, 0, 0.25, 1);

/** Tween from x to y between frames a and b (clamped). */
export const move = (f: number, a: number, b: number, x = 0, y = 1, ease = arrival) =>
  interpolate(f, [a, b], [x, y], { ...cap, easing: ease });

/** Small overshoot used by popouts and stamps: 0.7 → 1.03 → 1. */
export const slam = (f: number, at: number, from = 0.7) =>
  interpolate(f, [at, at + 10, at + 18], [from, 1.03, 1], cap);

// timing.json is the single source of timing for a campaign: the composition reads
// scene placement and cues from it, and scripts/score.py reads the same file to place
// music hits, UI sounds and typing texture. Retime there, and picture and sound move together.

export type TypeSpec = {
  /** Local frame (within the scene) the first character appears. */
  at: number;
  /** Frames per character. 1.5 reads as brisk typing at 30fps. */
  fpc: number;
  /** Exactly the typed text; "\n" between headline lines (a 3-frame pause). */
  text: string;
};

export type SceneTiming = {
  from: number;
  dur: number;
  cues: Record<string, number>;
};

export type SoundEvent = {
  scene: string;
  /** Cue name in that scene, or omit for the scene start. */
  cue?: string;
  plus?: number;
  kind: "pop" | "tick" | "hit" | "chime";
  /** Hz for pop/chime. */
  pitch?: number;
};

export type Timing = {
  fps: number;
  scenes: Record<string, SceneTiming>;
  typing: Record<string, TypeSpec>;
  sound?: {
    bpm?: number;
    /** Scene + cue where the full groove kicks in. */
    grooveAt?: { scene: string; cue?: string };
    events?: SoundEvent[];
  };
};

export const totalFrames = (t: Timing) =>
  Math.max(...Object.values(t.scenes).map((s) => s.from + s.dur));

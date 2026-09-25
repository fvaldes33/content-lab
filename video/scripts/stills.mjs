#!/usr/bin/env node
// Render still frames (and a contact sheet) for review before any full render.
//   npm run stills -- <CompositionId> <frame> [frame...]
//   npm run stills -- LaunchDemoAppStore 30 120 300 480 640
// Output: out/stills/<CompositionId>/fNNNN.png and out/stills/<CompositionId>/sheet.png
// (the sheet needs ffmpeg). Bundles once, so a dozen stills take seconds, not minutes.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const [id, ...frameArgs] = process.argv.slice(2);
if (!id || !frameArgs.length) {
  console.error("usage: npm run stills -- <CompositionId> <frame> [frame...]");
  process.exit(1);
}
const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "out/stills", id);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const composition = await selectComposition({ serveUrl, id });
const frames = frameArgs.map(Number).filter((f) => f >= 0 && f < composition.durationInFrames);
for (const frame of frames) {
  const output = path.join(outDir, `f${String(frame).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output });
  console.log(path.relative(root, output));
}
if (frames.length > 1) {
  try {
    const cols = Math.min(frames.length, 6);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-pattern_type", "glob", "-i", path.join(outDir, "f*.png"), "-vf", `scale=-2:960,tile=${cols}x${Math.ceil(frames.length / cols)}:padding=8:color=gray`, "-frames:v", "1", path.join(outDir, "sheet.png")]);
    console.log(path.relative(root, path.join(outDir, "sheet.png")));
  } catch {
    console.log("(install ffmpeg for a contact sheet)");
  }
}

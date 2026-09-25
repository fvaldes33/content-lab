#!/usr/bin/env node
// Render an App Store app preview that meets Apple's spec, plus a 2x master.
//   npm run deliver:appstore -- <CompositionId>        e.g. LaunchDemoAppStore
// Output (out/deliver/):
//   <id>-master-2x.mp4   1772×3840 native re-render (vectors, not AI upscaling) for social/ads
//   <id>-appstore.mp4    886×1920, supersampled from the 2x master: H.264 High, 30fps,
//                        ≤12 Mbps, stereo AAC 256k (a silent track is added if there's no score)
// Apple's rules this checks: 15–30s duration and the 886×1920 size (6.9" iPhone slot).
// Set the poster frame in App Store Connect after any poster lead (around 1.3s works).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const id = process.argv[2];
if (!id) {
  console.error("usage: npm run deliver:appstore -- <CompositionId>");
  process.exit(1);
}
const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "out", "deliver");
fs.mkdirSync(out, { recursive: true });
const master = path.join(out, `${id}-master-2x.mp4`);
const store = path.join(out, `${id}-appstore.mp4`);
const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit", cwd: root });
const probe = (file, entries) =>
  execFileSync("ffprobe", ["-v", "error", "-show_entries", entries, "-of", "json", file], { encoding: "utf8" });

run("npx", ["remotion", "render", "src/index.ts", id, master, "--scale=2", "--codec", "h264", "--video-bitrate", "45M", "--pixel-format", "yuv420p", "--audio-codec", "aac", "--audio-bitrate", "320k"]);

const hasAudio = JSON.parse(probe(master, "stream=codec_type")).streams.some((s) => s.codec_type === "audio");
run("ffmpeg", [
  "-loglevel", "error", "-y", "-i", master,
  ...(hasAudio ? [] : ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]),
  "-vf", "scale=886:1920:flags=lanczos+accurate_rnd+full_chroma_int",
  "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-b:v", "11M", "-maxrate", "12M", "-bufsize", "24M",
  "-pix_fmt", "yuv420p", "-r", "30",
  "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-ac", "2",
  ...(hasAudio ? [] : ["-shortest"]),
  "-movflags", "+faststart", store,
]);

const info = JSON.parse(probe(store, "stream=codec_type,width,height:format=duration"));
const v = info.streams.find((s) => s.codec_type === "video");
const secs = Number(info.format.duration);
const problems = [];
if (v.width !== 886 || v.height !== 1920) problems.push(`size ${v.width}×${v.height}, expected 886×1920`);
if (secs < 15 || secs > 30) problems.push(`duration ${secs.toFixed(2)}s, Apple needs 15–30s`);
execFileSync("ffmpeg", ["-v", "error", "-i", store, "-f", "null", "-"]);
console.log(`\n${path.relative(root, store)}  ${v.width}×${v.height}  ${secs.toFixed(2)}s  ${hasAudio ? "with score" : "silent track"}`);
console.log(`${path.relative(root, master)}  1772×3840 master`);
console.log(problems.length ? `NOT READY: ${problems.join("; ")}` : "Meets the App Store preview checks above. Full decode passed.");

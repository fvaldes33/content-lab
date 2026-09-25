#!/usr/bin/env node
// Start a campaign from the worked example and register it.
//   npm run campaign:new -- <slug>          e.g. npm run campaign:new -- spring-launch
// Creates campaigns/<slug>/ (component, timing.json, brief.md) and adds
// <Pascal>AppStore / <Pascal>Vertical / <Pascal>Masked compositions to src/Root.tsx.
import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("usage: npm run campaign:new -- <slug>   (lowercase letters, digits, hyphens)");
  process.exit(1);
}
const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "campaigns", slug);
if (fs.existsSync(dir)) {
  console.error(`campaigns/${slug} already exists`);
  process.exit(1);
}
const Pascal = slug.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const camel = Pascal[0].toLowerCase() + Pascal.slice(1);
const src = path.join(root, "campaigns", "launch-demo");
fs.mkdirSync(dir, { recursive: true });

const component = fs
  .readFileSync(path.join(src, "LaunchDemo.tsx"), "utf8")
  .replaceAll("campaigns/launch-demo/score.wav", `campaigns/${slug}/score.wav`)
  .replaceAll("launchDemoFrames", `${camel}Frames`)
  .replaceAll("LaunchDemo", Pascal)
  .replace(/\/\/ Worked example:[\s\S]*?\n\n/, `// ${Pascal}. Started from the launch-demo example; brief in ./brief.md, timing in ./timing.json.\n\n`);
fs.writeFileSync(path.join(dir, `${Pascal}.tsx`), component);
fs.copyFileSync(path.join(src, "timing.json"), path.join(dir, "timing.json"));
fs.copyFileSync(path.join(root, "..", "templates", "video-campaign", "brief.md"), path.join(dir, "brief.md"));
fs.mkdirSync(path.join(root, "public", "campaigns", slug), { recursive: true });

const rootFile = path.join(root, "src", "Root.tsx");
let rootSrc = fs.readFileSync(rootFile, "utf8");
rootSrc = rootSrc.replace(
  "// campaign-imports",
  `import { ${Pascal}, ${camel}Frames } from "../campaigns/${slug}/${Pascal}";\n// campaign-imports`,
);
rootSrc = rootSrc.replace(
  "    {/* campaign-compositions",
  `    <Folder name="${slug}">
      <Composition id="${Pascal}AppStore" component={${Pascal}} durationInFrames={${camel}Frames + POSTER_LEAD} fps={30} width={886} height={1920} defaultProps={{ typed: true, posterLead: true }} />
      <Composition id="${Pascal}Vertical" component={${Pascal}} durationInFrames={${camel}Frames} fps={30} width={1080} height={1920} defaultProps={{ typed: true }} />
      <Composition id="${Pascal}Masked" component={${Pascal}} durationInFrames={${camel}Frames} fps={30} width={1080} height={1920} defaultProps={{ typed: false }} />
    </Folder>
    {/* campaign-compositions`,
);
fs.writeFileSync(rootFile, rootSrc);
console.log(`campaigns/${slug}/ created (${Pascal}.tsx, timing.json, brief.md)`);
console.log(`registered ${Pascal}AppStore, ${Pascal}Vertical, ${Pascal}Masked in src/Root.tsx`);

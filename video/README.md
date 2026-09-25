# Video studio

Remotion-driven brand videos: App Store previews, launch demos, social cuts. Everything
renders in your brand (`../brand/`), and every product surface is built from your real UI.

Run the **`/create-brand-video`** skill and it does all of this for you. The commands
below are what it runs.

## Setup (once)

```bash
cd video
npm install            # Remotion, fonts, renderer (downloads a headless Chrome on first render)
```

Also needed: `ffmpeg` (contact sheets, delivery) and `python3` with `numpy` (the score).
macOS: `brew install ffmpeg` and `pip3 install numpy`.

## Commands

```bash
npm run studio                                   # live preview in the browser
npm run stills -- LaunchDemoAppStore 30 120 300  # review frames + contact sheet in out/stills/
npm run score -- launch-demo                     # original score, unique per brand + campaign
npm run score -- launch-demo --seed take-2       # reroll; pin the printed settings in timing.json
npm run render -- LaunchDemoVertical out/launch-demo.mp4
npm run deliver:appstore -- LaunchDemoAppStore   # App Store-ready file + 2x master in out/deliver/
npm run campaign:new -- spring-launch            # new campaign from the example, registered
node scripts/extract-design.mjs <export.html> <campaign> name=<selector>  # lift design components
npm run lint                                     # eslint + typecheck
```

## Layout

```
src/kit/          Motion kit: headlines (masked/typed), highlights, popouts, cursor,
                  scene exits, product-surface building blocks, fonts, layout
src/Root.tsx      Every composition (campaign:new registers new ones)
src/BrandCheck    One-frame check that fonts, colors and logo load right
campaigns/<slug>/ One folder per video: component, timing.json, brief.md, design.ts
public/brand      → ../brand/assets (symlink)
public/campaigns/ Per-campaign media and the generated score.wav
references/       craft.md (what works and why), delivery-specs.md
```

`campaigns/launch-demo/` is a complete worked example. Read it with `references/craft.md`
before building your own.

Windows: `public/brand` is a symlink; enable symlinks in git (`git config core.symlinks true`)
or copy `brand/assets` there.

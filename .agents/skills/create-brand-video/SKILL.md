---
name: create-brand-video
description: Produce a polished, Remotion-rendered brand video (App Store app preview, launch demo, product walkthrough, or vertical social cut) from the brand pack and the product's real UI. Use when the creator asks for a product video, app preview, launch video, demo reel, or motion ad. Do not use for talking-head or filmed-footage posts (use produce-content-package) or before the brand pack exists.
---

# Create Brand Video

Build a launch-demo style video: big type that docks into a header while real product
surfaces pop out and carry the story, a synthesized score, delivered to spec. The creator
is the taste layer: they approve stills before any full render and decide what ships.

Work in `video/`. Read `video/references/craft.md` before designing and
`video/references/delivery-specs.md` before delivering. Study `video/campaigns/launch-demo/`,
the worked example this skill builds from.

## 0. Preconditions

1. `brand/brand.ts` must describe the real product. If its `source` is `"fictional example"`
   (the Acme placeholder), stop and run `onboard` with **brand assets for a business** (Track B) first. Never make a
   video in placeholder branding.
2. Read `brand/product.md` (claim boundary), `brand/voice.md`, `brand/visual-language.md`,
   and `context/profile.md` (who approves, channels, never-show list) and the asset plan in
   `content/STRATEGY.md` if present.
3. Setup: `cd video && npm install` if `node_modules` is missing. Check `ffmpeg` and
   `python3 -c "import numpy"`; tell the creator how to install anything missing.
4. Render `npm run stills -- BrandCheck 0` and look at it: the brand fonts (not a fallback),
   colors and logo must be right before any campaign work.

## 1. Brief

Ask only what you can't infer (one batch):

- Where it runs: App Store preview (886×1920, 15–30 s, no price/trial wording), social
  vertical (1080×1920), or both. Default: both from one campaign.
- The one belief a viewer should leave with, and the 3–4 product moments that prove it.
- Source material for the UI: live product, screenshots, a design export (e.g. an HTML
  export from Claude Design), or the product repo. Real surfaces beat invented ones.
- The **money shot**: the single scene that shows what's unique. It gets the most time.

Then `npm run campaign:new -- <slug>` and fill `campaigns/<slug>/brief.md`: viewer, promise,
beats table, CTA, and the claim table mapping every on-screen line and surface to its source.

## 2. Build the surfaces

For each product moment, in order of preference:

1. **Design export with inline styles** → `node scripts/extract-design.mjs <file> <slug> name=<selector>`,
   then `<Pop html={parts.name.html} width={parts.name.width} …>`. Pixel-exact.
2. **Rebuild** with `src/kit/ui.tsx` (ActionCard, EventPill, ResultPill, Bubble, StackHeader,
   Checklist, Notification, BenefitList) using the product's exact labels and realistic
   demo data. Add a new component in the campaign folder when the product has a surface
   the kit lacks; match the real UI.
3. **Screenshots** in `public/campaigns/<slug>/` via `<Screenshot src=… device />`.

Never invent features, metrics, integrations or customers. When you write plausible demo
copy (names, what a helper is doing), ground it in `product.md` and list those lines for
the creator. Demo data never includes real customers' names or data.

## 3. Choreograph

Edit `campaigns/<slug>/<Pascal>.tsx` scene by scene, keeping the example's shape (hook →
docked header + popouts → money shot → benefits close → CTA). All frame numbers live in
`timing.json` (scenes, cues, typing text, sound events); components read cues from it.
Typing `text` must match the headline lines exactly ("\n" between lines); a mismatch throws
with a clear message.

Defaults from craft.md: ~1 s+ holds on every readable surface, ≈0.8 s between items the
viewer must read, typing starts ~6 frames into a scene, headline sizes 130–200 px on the
886-wide canvas, keep content inside x 40–846 and above y≈1620.

## 4. Stills first

`npm run stills -- <Pascal>AppStore <frames…>` covering every beat: frame 0, each headline
typed, each popout landed, the money shot fully built, close, CTA. Inspect every still
yourself for overflow, wraps, clipped cards, edge contact, fallback fonts and dead space;
fix and re-render before showing anything. Then show the creator the contact sheet
(`out/stills/<Id>/sheet.png`) and get approval. Do not full-render as a feedback loop.

## 5. Sound, render, verify

1. `npm run score -- <slug>` (edit `sound.events` in timing.json first: pops for popouts,
   ticks for checks and taps, hits on scene landings, `step` 0–9 for in-key pitch with
   rising steps for sequences; keep the close and CTA clean). The score is unique per brand
   and campaign; if the creator dislikes it, reroll with `--seed <anything>`, and once they
   like one, pin the printed settings into timing.json `sound` so re-renders keep it.
2. Full render: `npm run render -- <Pascal>Vertical out/<slug>-vertical.mp4` and/or
   `npm run deliver:appstore -- <Pascal>AppStore`.
3. Verify the *exported file*: contact sheet with
   `ffmpeg -i <file> -vf "fps=1,scale=222:480,tile=12x2" -frames:v 1 out/<slug>-sheet.png`,
   full decode, loudness (`-af ebur128`). Look for overlapping exits and stray carets at
   scene boundaries. Report specs plainly.

## 6. Iterate

Feedback usually lands as pacing ("too fast"), density ("too much at once") or copy. Pacing:
change holds and spacing in `timing.json`, never the clock. Density: land the dense surface
clean, hold, then dim/blur it as popouts take focus. Keep every prior render; name new ones
`-v2`, `-v3`. Log each round in the brief's review log.

## Boundaries

- The agent never uploads to App Store Connect or posts anywhere. It delivers files.
- App Store media: no price, trial or terms; flag that recreated UI (vs. screen captures)
  carries some App Review risk.
- Privacy rules from AGENTS.md apply to demo data and screenshots: no real customer data,
  no children's details.

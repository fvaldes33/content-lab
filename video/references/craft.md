# Brand video craft

What made the launch-demo style work, learned over several review rounds on a real
App Store preview. Treat these as defaults with reasons, not laws.

## The shape

1. **Hook, full frame.** A 2–4 word headline in the display face, one emphasis word in
   italic accent with a marker underline. Frame 0 must read on its own (autoplay shows it
   first); typed variants prepend 2 frames of the finished line (`PosterLead`).
2. **Headline docks, proof pops.** The headline travels up into a small header and the
   product surfaces take the frame: real cards, pills, lists, notifications, blown up
   2.2–2.6×, arriving from alternating sides with a slight rotation that settles.
3. **One money shot.** The scene that shows the product's core idea gets the most time and
   the richest build (e.g. a thread header whose avatar count grows as each helper joins).
4. **Close on benefits, end on the CTA.** Don't repeat the opening line at the end.

## Motion

- Arrivals decelerate (`arrival`), exits accelerate away with a little blur (`Scene`),
  moves between rest states ease in-out (`travel`).
- Pace comes from **holds**, not clock speed. "Too fast" → longer holds and more spacing
  between arrivals (≈0.8s between items someone must read). Never speed up or slow down a
  whole timeline; it reads as fast-forward or slow motion.
- Every UI beat holds long enough to read (≈1s+). Dense screens: land clean, hold, then
  dim/blur them so the popout that matters becomes the focus.
- Typing at ~1.5 frames/char reads brisk. Start a scene's typing ~6 frames in so it never
  overlaps the previous scene's exit, and don't blink a caret before typing except on the
  opening.

## Sound

- Every score is original and generated per campaign: the brand's `sound.mood` sets the
  family (tempo range, instrument, drum feel) so a brand sounds consistent, and a seed picks
  the key, mode, progression and patterns so campaigns don't sound identical. Reroll with
  `--seed`, then pin the printed settings in `timing.json` once the creator likes one.
- Pick the energy on purpose: `warm`/`bright`/`driving`/`calm` sit under the product (App Store
  previews, walkthroughs); `hype` (140–152 BPM, sidechained stabs, risers and impacts into
  every scene) and `euphoric` (festival anthem with a lead hook) are for launch and hype cuts.
  A campaign can override the brand's mood in `timing.json` `sound.mood`. `sound.break` names a
  scene (a flash or transition beat) where the drums drop out and a riser builds back in.
- A music bed with a groove that kicks in when the product appears.
- Sparse UI sounds: a pop per popout, a tick per check/stamp/tap, a low hit on scene
  landings. Rising pitches for a sequence (helpers joining) feel good.
- Things reviewers rejected: whooshes on scene cuts (cheap), effects on the closing and CTA
  scenes (clash with the music), one click per typed character (a rattle). The typing
  texture is loose and low instead.
- App Store previews autoplay muted: the picture must work silent.

## Copy and claims

- Every on-screen line and surface traces to `brand/product.md`, a real screen or an
  approved design. When you invent plausible copy (e.g. what a helper is doing), ground it
  in the product's real description and tell the creator which lines are yours.
- Match the product's own UI strings exactly, punctuation and casing included.

## Review loop

- Stills first: render key frames of every beat (`npm run stills`) and get approval before
  any full render. Check every still for overflow, clipped cards, fallback fonts and
  anything touching the frame edge.
- One full render per approved change. Then check a contact sheet of the *exported* file:
  transitions hide bugs that stills miss (overlapping exits, stray carets).

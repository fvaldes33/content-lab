# Delivery specs

## App Store app preview (iPhone 6.9" slot)

- 886×1920 portrait, 30 fps, **15–30 s**, H.264, stereo AAC (a silent track if no music).
- `npm run deliver:appstore -- <Id>AppStore` renders a 2× master, supersamples it down and
  checks size and duration.
- Set the poster frame in App Store Connect after any poster lead (≈1.3 s).
- **No price, trial or terms** in preview media (App Review 2.3.7). End on the product and a
  plain line; the Get button is right there. Trial CTAs belong in social/ad cuts.
- Apple's guidelines say previews should show footage captured from the app. Faithful
  recreated UI is common but can be flagged in review; screen captures are the safe route.
- Previews autoplay muted in search results; the first frame and the first 3 seconds do
  most of the work.

## Reels / TikTok / Shorts

- 1080×1920, 30 fps. Use the `<Id>Vertical` composition (same layout, wider background).
- Keep key content out of the platform chrome: roughly the top 100 px, the bottom 300 px,
  the left 60 px and the right 120 px; for the profile grid's 3:4 crop, keep the hook above
  y≈1440.
- Sound on is common here; the score matters more than on the App Store.

## Hi-res master

- `out/deliver/<Id>-master-2x.mp4` (1772×3840) is a native re-render, not AI upscaling.
  Crop and reframe from it for ads.

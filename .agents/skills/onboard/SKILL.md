---
name: onboard
description: First-run interview that builds the creator's profile, content strategy, boundaries, and (for anyone with a product or company) the brand pack. Run once before any other skill, or again when positioning or the product changes. Produces context/profile.md, content/STRATEGY.md, the creator's additions to the operating rules, and brand/ (tokens, voice, product truth, assets). The brand batch can run on its own, e.g. before a first brand video. Do not run content tasks for a creator who has no profile.
---

# Onboard

Interview the creator, then write the three files everything else depends on. This is a conversation, not a form: ask in small batches (use the ask-user tooling when available, otherwise plain questions), adapt follow-ups to their answers, skip what they've already told you, and push back once — gently — when an answer is vague, because vague inputs produce generic content.

## Interview map (~10–14 questions across 4 batches)

**Batch 1 — Identity and receipts.** What do you actually do, and for how long? What have you shipped, built, run, or survived that a stranger could verify or that you can show on camera? What are you credibly expert in versus merely interested in?
*Why it matters: credibility rules come from real history. The system will refuse claims that outrun these receipts.*

**Batch 2 — Audience and anti-positioning.** Who do you want to reach (be specific: role, situation, question they're asking)? Where are they (platforms, current follower counts per platform — real numbers, including zero)? And the load-bearing one: **what accounts do you refuse to become?** Name the genre that would make you cringe if your smartest friend saw it.
*Why it matters: the refuse-list prevents drift toward whatever the feed rewards this month. It gets written into the operating rules verbatim.*

**Batch 3 — Voice and production reality.** How do you talk (formal/casual, humor, profanity, jargon tolerance)? Are you willing to be on camera? Voice only? Screen recordings? How much time per post, per week, honestly? What can you record with (phone, mic, screen)?
*Why it matters: strategy that ignores production reality produces a dead account in three weeks.*

**Batch 4 — Boundaries and intent.** What is off-limits: family, kids, employer, clients, health, money specifics? Is this audience-building for its own sake, lead generation, or a product someday — or undecided (a legitimate answer)? Any disclosure obligations (job, sponsorships, licenses)?
*Why it matters: boundaries become hard rules the agent enforces even when the creator forgets; intent calibrates CTAs (an audience-building account earns trust with zero-ask posts; a lead-gen account may use honest comment-gates).*

**Batch 5 — Brand and product** (for a product, app or company; skip for a purely personal brand). Where does the product live: live site/app URL, local repo path, design files or exports, App Store listing? What does it actually do today (not the roadmap)? Which features and UI surfaces are you proudest of? What must never be claimed (unreleased features, numbers you can't back, pricing specifics)? Who is the buyer vs. the user?
*Why it matters: every brand video and product post renders in these tokens and stays inside this claim boundary. It's extracted from the real product, not invented.*

This batch can run alone ("onboard the brand"): the creator may want a brand video before the social side. It still needs a light version of Batch 4's boundaries.

## Write the files

1. **`context/profile.md`** — identity, receipts, expertise vs. interests, voice notes (with 2–3 verbatim phrases from the interview so drafts can sound like them), production constraints, platforms and real baselines, disclosure obligations.
2. **`content/STRATEGY.md`** — positioning statement, audience hypotheses (framed as hypotheses to test, not facts), 3–5 content pillars derived from receipts + audience (each with an example post idea), tone rules, metrics that will define success in phase one (learning, not follower targets), posting cadence matched to their time budget (3–5/week is the researched sweet spot; never prescribe more than their honest budget).
3. **Append to `AGENTS.md`**: their personal refuse-list (add a "What this system refuses to produce" section if it's missing) and their boundaries to the privacy section as hard rules.
4. **`brand/`** (Batch 5). Extract, don't invent. Inspect the real source before writing:
   global CSS and design tokens, font declarations and files, light and dark logos, app icon,
   marketing headlines, real feature names and UI labels, and screenshots. Separate observed
   facts from interpretation.
   - `brand/brand.ts`: fill every field of `brand/schema.ts`. Colors from the product's real
     tokens (background, surface, foreground, muted, accent, accentSoft, border, plus a 4-color
     palette for color-coding). Fonts: `source: "google"` if the family is on Google Fonts,
     otherwise copy the licensed files into `brand/assets/` as `source: "local"` (never ship
     fonts the creator isn't licensed to use; pick the closest Google family and say so).
     `proofPoints`: 3–4 short benefits, each traceable to `product.md`. Set `source` to where
     you extracted from (this replaces the `"fictional example"` placeholder).
   - `brand/product.md`: what it does, real surfaces with their exact labels, and the claim
     boundary (can claim / must not claim).
   - `brand/voice.md` and `brand/visual-language.md`: short, specific, with things to avoid.
   - `brand/assets/`: logo(s), a square app icon, local fonts, a few real screenshots. Remove
     the placeholder `icon.svg` once replaced.
   - Verify: `cd video && npm install && npm run stills -- BrandCheck 0`, then look at the
     still: brand fonts actually loaded (not a fallback), colors right, logo crisp. Fix before
     moving on.

## Close the loop

- Read the finished files back to the creator in summary form; correct anything they push back on.
- If the brand batch ran, show the BrandCheck still and offer `create-brand-video` as a next step.
- Offer the natural next step: a first concept portfolio (10–15 lightweight idea hypotheses in `content/research/`, each tied to a real question their audience asks) — via `produce-content-package` once they select one.
- Remind them of the standing division: the agent prepares, they publish. Nothing in this system posts on its own.

## Re-onboarding

When positioning shifts (new niche, new platform, new intent) or the product changes (rebrand, new features), re-run only the affected batches and update the files in place with a dated note. Never silently rewrite the refuse-list — confirm changes to it explicitly.

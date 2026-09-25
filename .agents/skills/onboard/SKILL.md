---
name: onboard
description: First-run interview that sets up this repo for either a personal creator (profile, content strategy, boundaries) or a business (brand pack, product truth, claim boundary, asset plan), or both. Starts by asking which. Run once before any other skill, or again when positioning or the product changes. Produces context/profile.md, content/STRATEGY.md, additions to AGENTS.md, and for businesses brand/ (tokens, voice, product truth, assets). Do not run content tasks for anyone who has no profile.
---

# Onboard

Interview the person, then write the files everything else depends on. This is a conversation, not a form: ask in small batches (use the ask-user tooling when available, otherwise plain questions), adapt follow-ups to their answers, skip what they've already told you, and push back once — gently — when an answer is vague, because vague inputs produce generic content.

## First: which setup?

Ask this before anything else, as one question with three options:

- **Personal socials**: building your own presence as a creator, founder or expert. → Track P.
- **Brand assets for a business**: product videos, App Store previews, launch demos, content for a company account. → Track B.
- **Both**: you're the face of a business, or you want both. → Track B first (brand), then Track P, skipping questions Track B already answered.

Record the answer as the first line of `context/profile.md`: `Mode: personal | business | both`. Other skills read it: `create-brand-video` needs Track B done; `produce-content-package` works in either mode, speaking as the person (personal) or as the brand (business).

## Track P — personal creator (~10–14 questions, 4 batches)

**P1 — Identity and receipts.** What do you actually do, and for how long? What have you shipped, built, run, or survived that a stranger could verify or that you can show on camera? What are you credibly expert in versus merely interested in?
*Why it matters: credibility rules come from real history. The system will refuse claims that outrun these receipts.*

**P2 — Audience and anti-positioning.** Who do you want to reach (be specific: role, situation, question they're asking)? Where are they (platforms, current follower counts per platform — real numbers, including zero)? And the load-bearing one: **what accounts do you refuse to become?** Name the genre that would make you cringe if your smartest friend saw it.
*Why it matters: the refuse-list prevents drift toward whatever the feed rewards this month. It gets written into the operating rules verbatim.*

**P3 — Voice and production reality.** How do you talk (formal/casual, humor, profanity, jargon tolerance)? Are you willing to be on camera? Voice only? Screen recordings? How much time per post, per week, honestly? What can you record with (phone, mic, screen)?
*Why it matters: strategy that ignores production reality produces a dead account in three weeks.*

**P4 — Boundaries and intent.** What is off-limits: family, kids, employer, clients, health, money specifics? Is this audience-building for its own sake, lead generation, or a product someday — or undecided (a legitimate answer)? Any disclosure obligations (job, sponsorships, licenses)?
*Why it matters: boundaries become hard rules the agent enforces even when the creator forgets; intent calibrates CTAs (an audience-building account earns trust with zero-ask posts; a lead-gen account may use honest comment-gates).*

## Track B — business brand (~10–14 questions, 4 batches)

**B1 — Company and product.** What does the product do *today* (not the roadmap), and for whom? Who buys it vs. who uses it? What stage is it at? What can you publicly stand behind: customers, usage, reviews, press (real numbers only, blanks are fine)? What do people use instead of you?
*Why it matters: this becomes `brand/product.md`, the claim boundary every video and post stays inside.*

**B2 — Where the brand lives.** Point me at the real sources: live site or web app URL, product repo path, design files or HTML exports (e.g. from Claude Design), App Store listing, brand guidelines, logo and font files. Which screens or features are you proudest of? Anything in the current UI you'd rather not show?
*Why it matters: tokens, fonts, logos and UI surfaces are extracted from these, not invented. Real surfaces are what make the videos look like the product.*

**B3 — Voice and claims.** Three words for how the brand should sound, plus a line of copy you love (yours or anyone's) and one you hate. What must never be said or claimed: unreleased features, numbers you can't back, competitor comparisons, regulated claims (health, finance, legal)? Current pricing and trial terms, stated exactly (used in ads, never in App Store media)?
*Why it matters: voice keeps every asset sounding like one company; the never-list becomes hard rules.*

**B4 — Assets, channels and approvals.** What do you need first: App Store preview, website hero video, launch demo, ads, company social posts, sales-deck clips? Which channels and formats? Who approves before anything ships? Is anyone on camera (founder, team), or is it product-only? Any customer data or screens that must never appear?
*Why it matters: sets the asset plan and the privacy floor for demo data and screenshots.*

## Write the files

**Track P:**

1. **`context/profile.md`** — `Mode:` line, identity, receipts, expertise vs. interests, voice notes (with 2–3 verbatim phrases from the interview so drafts can sound like them), production constraints, platforms and real baselines, disclosure obligations.
2. **`content/STRATEGY.md`** — positioning statement, audience hypotheses (framed as hypotheses to test, not facts), 3–5 content pillars derived from receipts + audience (each with an example post idea), tone rules, metrics that will define success in phase one (learning, not follower targets), posting cadence matched to their time budget (3–5/week is the researched sweet spot; never prescribe more than their honest budget).
3. **Append to `AGENTS.md`**: their personal refuse-list (add a "What this system refuses to produce" section if it's missing) and their boundaries to the privacy section as hard rules.

**Track B:**

1. **`brand/`** — extract, don't invent. Inspect the real sources from B2 before writing: global CSS and design tokens, font declarations and files, light and dark logos, app icon, marketing headlines, real feature names and UI labels, screenshots. Separate observed facts from interpretation.
   - `brand/brand.ts`: fill every field of `brand/schema.ts`. Colors from the product's real tokens (background, surface, foreground, muted, accent, accentSoft, border, plus a 4-color palette for color-coding). Fonts: `source: "google"` if the family is on Google Fonts, otherwise copy the licensed files into `brand/assets/` as `source: "local"` (never ship fonts they aren't licensed to use; pick the closest Google family and say so). `proofPoints`: 3–4 short benefits, each traceable to `product.md`. `sound.mood` (warm, bright, driving or calm) from the B3 voice words; it sets the family of every generated score. Set `source` to where you extracted from (this replaces the `"fictional example"` placeholder).
   - `brand/product.md`: what it does, real surfaces with their exact labels, publishable proof from B1, pricing/trial facts from B3, and the claim boundary (can claim / must not claim).
   - `brand/voice.md` and `brand/visual-language.md`: short, specific, with the loved/hated copy from B3 and things to avoid.
   - `brand/assets/`: logo(s), a square app icon, local fonts, a few real screenshots. Remove the placeholder `icon.svg` once replaced.
   - Verify: `cd video && npm install && npm run stills -- BrandCheck 0`, then look at the still: brand fonts actually loaded (not a fallback), colors right, logo crisp. Fix before moving on.
2. **`context/profile.md`** — `Mode:` line, the company in two sentences, who's operating this repo and who approves, channels and formats from B4, on-camera talent (if any), and the never-show list.
3. **`content/STRATEGY.md`** — an asset plan rather than a posting cadence: the first 3–5 assets in priority order (each with channel, format, the one belief it should create, and the product moment that proves it), plus brand-channel posting only if they asked for it.
4. **Append to `AGENTS.md`**: the brand's never-say/never-claim list (in a "What this system refuses to produce" section, added if missing) and the never-show list to the privacy section as hard rules (e.g. real customer names or data in demo screens).

**Both:** do Track B's files, then Track P's, merging into the same `context/profile.md` (company section + personal section) and one `STRATEGY.md` with the asset plan and the personal pillars side by side.

## Close the loop

- Read the finished files back in summary form; correct anything they push back on.
- Track B: show the BrandCheck still and offer `create-brand-video` for the top asset in the plan.
- Track P: offer a first concept portfolio (10–15 lightweight idea hypotheses in `content/research/`, each tied to a real question their audience asks), via `produce-content-package` once they select one.
- Remind them of the standing division: the agent prepares, they publish. Nothing in this system posts or uploads on its own.

## Re-onboarding

When positioning shifts (new niche, new platform, new intent) or the product changes (rebrand, new features, new pricing), re-run only the affected batches and update the files in place with a dated note. Switching mode (e.g. personal → both) runs just the new track. Never silently rewrite a refuse-list or claim boundary — confirm changes explicitly.

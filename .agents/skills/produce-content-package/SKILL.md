---
name: produce-content-package
description: Turn a selected content idea into a fact-checked, recording-ready package. Use when the creator selects a concept or asks for research, sourcing, scripting, visual planning, captions, or repurposing for a post. Do not use for generic idea generation, post-publication review, or publishing under the creator's identity.
---

# Produce Content Package

Take one selected concept from question to recording-ready. The creator remains the host, editor, taste layer, and final authority.

## Establish context

1. Read `AGENTS.md`, `context/profile.md`, `content/STRATEGY.md`, and the concept's source note. If profile or strategy are missing, stop and run `onboard` first.
2. Reuse an existing canonical folder when one exists; preserve the creator's edits. Otherwise create `content/ideas/NNN-short-slug/`.
3. Use the schemas in `templates/post-package/`. All seven files are expected for a serious video package; quick-tier posts (opinion takes, memes) may use a trimmed README + script with a claim-safety note instead of a full ledger.
4. Keep normal production inside the creator's time budget from STRATEGY.md.

## Research before drafting

1. Define target viewer, their actual question, one-sentence promise, likely format, and claim boundary.
2. Research current facts with primary or official sources. Community posts establish that questions and confusion exist — never product truth.
3. Record each source once in `sources.md`; synthesize in `research.md` using source IDs. For fully firsthand concepts, the ledger lists internal artifacts (the creator's real work) instead of web sources — same rigor, same IDs.
4. Separate verified facts, firsthand observations, inference, opinion, and unresolved claims.
5. Design any demonstration before running it; never imply one run is a universal benchmark.
6. Complete the research gate before scripting. Mandatory for news and current product claims. If research is unavailable, mark the gap and stop.

## Lock the angle

Write the production brief in `README.md`: viewer + question, promise, **strongest honest hook** (favor person + stake + specific true number over process description — cite the latest feed-patterns note when one exists), core claim, practical takeaway, why now, the creator's credible angle, format + time cap, CTA only if it serves the viewer or a real deliverable, and what stays uncertain.

Begin with a question, consequence, failure, or decision the viewer recognizes. Never lead with a taxonomy merely because the explanation contains one.

## Draft the post

Read `references/draft-craft.md` first — it is the tested craft ruleset and outranks generic social-media advice. Write `script.md` only after research is complete.

- Target the format's length; get to why the viewer cares immediately.
- Conversational language the creator can say naturally; use the voice notes in `context/profile.md`, and mark where their judgment or lived example must replace a placeholder — never invent their firsthand experience.
- One concrete example or observed behavior minimum.
- End with one useful takeaway. A comment-gate CTA ("comment X for the template") is allowed only when the promised deliverable exists before publish.
- Caption adds context; it never repeats the script. Estimate read time and trim.

Avoid fake urgency, engagement bait, invented certainty, generic creator language, and the creator's refuse-list in `AGENTS.md`.

## Plan visuals and repurposing

1. `visual-plan.md`: shots, screen recordings, overlays, required assets, and a privacy capture-checklist naming what must never appear on screen. Prefer the smallest visual that proves the point.
2. `repurposing.md`: adapt only where the concept fits the platform register (per STRATEGY.md channels). Never mechanically split a transcript into slides.
3. `followups.md`: expected questions, natural sequels, the content hypothesis, and which responses would matter (including what would count as a demand signal).

## Fact-check and hand off

1. Map every factual claim in script AND caption to a source ID or a firsthand label in the internal fact-check table.
2. Mark opinions and inferences explicitly. Remove or soften every unsupported claim.
3. Note claims that age (counts, "biggest post," dates) with a recheck-on-publish-day flag.
4. Leave the package in `content/ideas/`. Never publish or speak as the creator.
5. Final handoff: link the package, state the angle and time cap, list the judgment only the creator can supply, and exactly what they need to record or capture.

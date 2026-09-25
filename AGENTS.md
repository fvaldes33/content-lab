# Operating Rules

This repository is a content production system operated by one human creator and one AI agent. The agent does evidence work; the creator does judgment. Read `context/profile.md` and `content/STRATEGY.md` before any content task — if they don't exist, run the `onboard` skill first and do nothing else. When the creator has a product or company, `brand/` holds its tokens, voice, product truth and assets; read `brand/product.md` before any claim about the product.

## Division of labor

**The agent:** research, source ledgers, fact-check tables, script drafts, captions, visual plans, repurposing, footage transcription and review, rough-cut assembly, brand video production (`video/`), metrics logging, performance analysis.

**The creator, always:** what's worth making, final wording and voice, recording, the kill decision, publishing, replying to their audience, and any judgment involving their family, employer, or reputation.

The agent never publishes, posts, comments, likes, follows, DMs, or speaks as the creator anywhere. Preparing drafts is the ceiling.

## Evidence rules

- Every factual claim in a script maps to a source ID in the package's `sources.md` or is explicitly labeled firsthand observation. Claims that can't be backed get cut or softened before handoff.
- Keep four claim classes visibly distinct: verified fact, firsthand observation, inference, opinion. Contested or uncertain points stay visible in the research brief — never silently dropped.
- Prefer primary sources (official docs, announcements, papers) for anything current. Community posts establish that confusion exists, never product truth.
- Never fabricate: numbers, quotes, results, demand, transformations, or authority. If the creator's real numbers are small, say them plainly — honesty about small numbers is a differentiator in feeds full of invented ones.
- For news content: no post whose only payload is that an announcement happened. Require a mechanism, test, implication, or decision.

## The pipeline

```
RESEARCH → ANGLE → SOURCE PACK → SCRIPT → VISUAL PLAN → SHOOT → REVIEW FOOTAGE → PUBLISH → METRICS → FOLLOW-UP
```

Unselected ideas stay lightweight (a line in a research note). When the creator selects one, `produce-content-package` builds the canonical folder under `content/ideas/NNN-slug/` using `templates/post-package/`. After publishing, the folder moves to `content/published/` and gains `results.md`. Never duplicate packages across both directories.

## Footage review

When raw footage lands in a package folder: transcribe every take, identify keepers and false starts, verify spoken claims against the fact-check table, check every frame for private information (names, screens, documents, locations, bystanders), and assemble a rough cut when useful. Flag problems; never decide alone that footage is fine to publish. A privacy finding blocks publish until the creator confirms the fix.

## Brand videos

`create-brand-video` produces Remotion-rendered product videos in `video/` from the brand pack. The same evidence rules apply to motion: every on-screen line and UI surface traces to `brand/product.md`, a real screen, or a design the creator approved, and invented demo copy is listed for the creator. Never render in the placeholder brand. Stills are approved before any full render; the creator uploads and publishes. App Store preview media never mentions price, trials or terms. Craft defaults and their reasons live in `video/references/craft.md`.

## Privacy boundary

Set per-creator during onboarding, but these are floors, not defaults to negotiate:

- Children: never names, faces, voices, schools, routines, diagnoses, or identifying details. Generalized or synthetic examples only.
- Never expose employers', clients', or third parties' private information.
- Screen recordings get a frame-by-frame check before publish.

## Production economics

Normal post: 45–90 minutes total. Quick response: 30–60. Anything longer must earn it with a reusable artifact or a real experiment. Repetitions beat polish while learning; do not let editing sophistication substitute for a stronger idea.

## Metrics discipline

- Log real observed values only; blanks over guesses.
- Prefer rates (saves per 1,000 reached, follows per profile visit) over raw counts when denominators exist.
- No pillar or format verdicts from one post. Compare medians across at least four comparable attempts. Views are not validation; saves, shares, thoughtful questions, and profile actions are stronger signals.
- Platform followers are rented distribution. Only an exportable contact channel is owned.

## Demand signals

Audience requests are signals, not build orders. Log repeated, specific requests (three independent people asking for substantially the same thing) in `content/research/demand-signals.md` with links to the source posts. One enthusiastic comment is not demand.

## Improving these rules

If the same mistake recurs, propose one concise change to this file. Keep durable principles here and task-specific instructions in the skills.

---
name: review-content-performance
description: Analyze a published post using the creator's actual platform metrics and qualitative feedback, then record lessons, follow-ups, and qualified demand signals. Use when the creator provides a URL, metrics, or comment themes, or asks what a post taught them. Do not use to draft content or to infer unavailable metrics.
---

# Review Content Performance

Turn one published artifact into durable learning without mistaking one post — or followers, or views — for validation.

## Establish the record

1. Read `AGENTS.md`, `content/STRATEGY.md`, the package, and `content/metrics/post-metrics.csv`.
2. Require post ID, channel, publish date/time, and whatever raw numbers the creator actually has. Leave unavailable values blank; zero only when truly observed zero.
3. If the package is still in `content/ideas/`, move the whole folder to `content/published/` and create `results.md` from the template. Never duplicate.


## Collect metrics via browser (preferred over asking)

Before asking the creator to paste numbers, offer to collect them with the browser tools against their logged-in session — same infrastructure as `research-feed-patterns`, tighter scope:

- **Allowed surfaces only:** the creator's own published posts (public counts) and their own analytics dashboards — Instagram professional dashboard / Business Suite insights, TikTok Studio analytics, X post analytics, LinkedIn post analytics. Never DMs, inboxes, settings, or other accounts' private data. Read-only, always.
- **Per-platform reality:** TikTok Studio (web) exposes the most (views, watch %, retention, sources); X and LinkedIn show per-post analytics on web; Instagram exposes public counts on permalinks but hides some insights (non-follower %, watch time, saves breakdown) in the app — collect what the web surface shows, leave the rest for the creator.
- **Record with discipline:** log values exactly as displayed with a capture timestamp; platforms abbreviate (12.4K) — record the abbreviated value rather than inventing precision. Blanks stay blank when a surface doesn't expose a metric; never estimate.
- **Fallback:** no extension, no permission, or a surface that won't load twice — ask the creator for exactly the missing fields, nothing more.
- Comments are qualitative gold: while on the post, capture repeated questions and notable comments verbatim (public ones only) for the qualitative section.

## Quantitative

- Update or append the CSV row. Raw values first, then only rates whose denominators exist (non-follower share, saves/1k reached, follows per profile visit).
- Never compare raw counts across posts with materially different reach when a rate is available.
- Platform followers are rented; only exportable contact channels count as owned.

## Qualitative

Capture: repeated questions in the audience's words; thoughtful objections and corrections; requests for resources, templates, or help; unexpected audience clusters; why people shared; signs the hook attracted the wrong crowd. Separate observation from interpretation. Summarize private messages rather than quoting without permission.

## Decide, bounded

Choose CONTINUE / ITERATE / PAUSE / KILL for the post or format, and state exactly what changes next.

- One post proves nothing about a pillar. Five comparable posts: review mechanics. Ten: use format medians. Four independent attempts minimum before any pillar-level verdict.
- Discount: news timing, borrowed distribution, controversy, tiny denominators, missing metrics.
- Expect heavy-tailed outcomes: frequency buys shots at outliers, medians stay flat. A flat median with no outliers yet is normal early, not failure.

## Demand signals

Log in `content/research/demand-signals.md` only when: three independent people request substantially the same thing; someone offers money or asks how to buy; or repeated feedback reveals costly current behavior. Link back to the post. Generic "need this!" replies and comment-gate keyword floods are not demand — count deliverable follow-through (link clicks, template clones, specific setup questions) instead.

## Close the loop

Update `followups.md` with observed questions; note data gaps and the single most useful change for the next comparable post; update `STATUS.md` only when a hypothesis actually changed. Final handoff: what happened, what it may mean, what it does not prove, next action.

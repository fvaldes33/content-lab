---
name: research-feed-patterns
description: Live-browse the creator's logged-in social feeds with browser tools to catalog what is currently performing in their niche — formats, hooks, engagement mechanics — and produce a dated pattern-research note. Takes a platform argument (instagram | x | tiktok). Use before choosing hooks/formats, when a package feels flat, or weekly. Strictly read-only — never like, follow, comment, reply, DM, or post from the creator's account.
---

# Research Feed Patterns

Turn a scroll session into citable evidence. Output: `content/research/YYYY-MM-DD-feed-patterns-<platform>.md`. Hook and format decisions in packages should cite these notes like sources.

## Hard rules (all platforms)

- **Read-only.** No likes, follows, comments, replies, votes, saves, or DMs from the creator's account. Opening posts and profiles is fine. Never click irreversible controls.
- Log only public data. Never screenshot or transcribe DMs or private surfaces.
- 10–20 cataloged posts per session is enough; this is pattern research, not scraping.
- Study manipulative genres for mechanics; never adopt their substance. The creator's refuse-list in `AGENTS.md` wins over anything the feed rewards.

## Session procedure

1. Load the browser tools (one ToolSearch batch), list connected browsers, let the creator pick theirs, get tab context, navigate to the platform.
2. **Scroll reliably:** synthetic wheel/keyboard scroll often fails on feed SPAs (observed in Dia and some Chrome setups). Use the JavaScript tool: `window.scrollBy(0, 1500)` between screenshots, batched as scroll → wait → screenshot triplets.
3. **Catalog each niche-relevant post:** account (+ follower scale when visible), hook/overlay text verbatim, format (talking head, carousel, stack list, quote card, meme, screen demo), visible engagement (likes, comments, reposts, age), CTA mechanics. Skip ads. Flag comments≫likes inversions — that's a comment-gate at work.
4. **Open 1–3 standouts** for scale context (profile grid, pinned posts). Classify funnels without descending into them.
5. **Write the note:** catalog table → patterns to adopt → anti-patterns rejected (name why, citing the operating rules) → immediate implications for in-flight packages.

## Platform playbooks

### instagram
- Surfaces: home feed (likes/comments visible), Reels tab, Explore. Profile grids of standout accounts show pinned posts and content mix.
- Watch for: overlay-text hooks (person + stake + number outperform process descriptions), comment-gate CTAs ("Comment X and I'll send…"), cheatsheet/stack-list formats (drive saves), quote cards.
- Engagement reading: comments vs likes ratio exposes CTA mechanics; reposts signal shareability.

### x
- **Collect via DOM, not screenshots.** Inject a collector keyed on status URL so passes dedupe:

```js
window.__c = window.__c || {};
window.grab = function(){
  document.querySelectorAll('article[data-testid="tweet"]').forEach(a => {
    try {
      const t = a.querySelector('time'); if (!t) return;
      const l = t.closest('a');
      const u = l ? 'https://x.com' + l.getAttribute('href') : null;
      if (!u || window.__c[u]) return;
      if (a.innerText.match(/^Replying to/m)) return;
      const nb = a.querySelector('[data-testid="User-Name"]');
      const nt = nb ? nb.innerText.split('\n') : [];
      const te = a.querySelector('[data-testid="tweetText"]');
      const gr = a.querySelector('[role="group"]');
      window.__c[u] = { url: u, ts: t.getAttribute('datetime'),
        name: nt[0] || '', handle: (nt.find(x => x.startsWith('@')) || ''),
        text: te ? te.innerText.slice(0, 400) : '',
        metrics: gr ? gr.getAttribute('aria-label') : '' };
    } catch(e) {}
  });
  return Object.keys(window.__c).length;
};
window.grab();
```

  The action row's `aria-label` carries replies/reposts/likes/bookmarks/views as text — parse that, never the abbreviated rendered numbers.
- **Operational ceilings (these will bite):** injected scripts die at ~45s (CDP timeout) — scroll in loops of ~10 × `scrollBy(0, innerHeight*0.85)` with 1s sleeps; when `document.body.scrollHeight` stops growing the feed is throttled, not broken — switch to search, a different endpoint that holds up; dump collections in slices (~5 posts, text capped ~280 chars) or output truncates; navigation clears page state — stash the collection in `sessionStorage` across searches and clean it up after.
- **Search beats the feed for research.** Shape: `x.com/search?q=<ENCODED>&src=typed_query&f=live` with `(term OR term) min_faves:40-80 lang:en since:<today> -filter:replies`. `min_faves` does most of the quality work: loosen it when thin, tighten it when noisy — negative keywords overfit. Expect crypto collisions on terms like API/ARR/agentic; filter by content at scoring, not by keyword. Launch-day news reliably has the highest reach with the thinnest reply threads, and the For You feed often never shows it.
- **Score opportunities by reply headroom, not raw reach:** 20k views with 6 replies beats 200k views with 400 — early and visible beats big and buried. Rank on headroom + reply-ability (an open question or claim to push on) + who posted (builders and maintainers over aggregators).
- Reply-pattern research may inform **drafted reply suggestions the creator sends manually** — drafting is the ceiling; the agent never replies. And a human pacing warning worth passing on: bursts of ~15 rapid replies to strangers have triggered rate limits; ~5–8 an hour mixed with normal browsing is the survivable range. Never work around a limit or block.
- A dormant account's For You feed skews stale; search and Explore give the truer read of the current meta.

### tiktok
- Web profile grids show **actual view counts per video** — the best public performance data of the three platforms. Use standout creators' grids to see what popped vs. their baseline.
- Surfaces: For You (web), search with niche terms, Creative Center trends when accessible.
- Watch for: first-2-second hooks, native/unpolished production beating produced content, trending-audio reuse.

## Cadence and decay

Run before any package whose hook feels weak; otherwise weekly while actively publishing. Patterns decay — re-verify a note older than ~3 weeks before citing it.

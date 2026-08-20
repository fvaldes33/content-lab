# Repurposing

Reframed 2026-08-16. Repurpose the failure→fix structure and the two-memory model, not the Reel transcript mechanically.

## X post

Your AI has two memories: a long-term profile it builds from your chats, and the short-term context of the current conversation.

Three ways they fail you — all three fixable.

**1. It ignores instructions in long chats.**
Models use the start and end of a conversation best; the middle gets blurry. Restate the rule right before the task, or start a fresh chat.

**2. It remembers wrong or stale things.**
Any chat can feed your long-term profile — help a friend with a resume and it might think you're job hunting. Keep one-offs in Temporary Chat (ChatGPT) or Incognito (Claude), and edit the memory page. Both products let you correct or delete entries.

**3. Important context doesn't carry over.**
Long-term memory keeps highlights, not transcripts. Pin must-haves in Custom Instructions (ChatGPT) or a Project (Claude — each project gets its own separate memory).

The one everyone gets wrong: deleting a chat does NOT delete what was learned from it. In either product. Both vendors document this — removing the memory entry is a separate step.

Audit today: Settings → Memory, in both apps.

## LinkedIn carousel (added 2026-08-17 — primary LinkedIn artifact)

`linkedin-carousel.pdf` in this folder — 8 slides, built from `linkedin-carousel-spec.json` with the `$make-linkedin-carousel` skill (Swiss Notice theme). Upload as a **document post**: Add a document → title "AI memory: 3 failures, 3 fixes" → intro text below (Franco's wording, locked 2026-08-17) → **no hashtags** (2026 algorithm research: no-hashtag posts outperform by 5–10%; keywords in copy are what gets read — at most `#ChatGPT #ClaudeAI` if desired). No links in body or comments (comment links now suppressed). Launch ritual: engage with the feed ~10 min before posting, then reply to every comment fast — ~70% of reach is decided in the first 60–90 minutes. Tue/Wed morning.

Intro text:

> Your AI has two memories: a long-term profile it builds from your chats, and the short-term context of the current conversation.
>
> Three ways they fail you. All three are fixable.

## LinkedIn text post (alternative, if the carousel underperforms or for a later re-run)

Work-lens reframe, text-first. Do not crosspost the Reel; the word-pop style reads casual there and text posts travel further on LinkedIn. No links in the body (drop the Reel link in a comment if at all). 3 hashtags max. Best window: Tue or Wed morning.

Your company is full of people using ChatGPT and Claude every day. Almost none of them know what these tools actually remember.

These tools have two memories. A long-term profile built from your chats, and the short-term context of the current conversation. They fail differently.

1. Long chats start ignoring your instructions. Models pay the most attention to the start and end of a conversation. Restate the rule right before the task, or start a fresh chat.

2. They remember wrong or stale things. Any chat can feed your profile. Keep one-off topics in Temporary Chat on ChatGPT or Incognito on Claude, and actually go read your memory page. Both products let you correct or delete what they've saved.

3. Important context doesn't carry over. Memory keeps highlights, not transcripts. Pin what matters in Custom Instructions or a Project.

The part everyone gets wrong: deleting a chat does not delete what was already learned from it. Both vendors document this. Removing the memory is a separate step.

And the part that matters at work: on Claude Team and Enterprise plans, incognito chats still follow your org's data retention policy. Private mode is not invisible to your company. Worth knowing what your ChatGPT workspace is set to as well.

Ten minutes well spent with your team this week: everyone opens Settings > Memory and reads what's in there.

**Why LinkedIn for this piece:** Franco's professional network is real seed distribution (unlike the new IG account), and the org-retention angle is the exact wedge the business-signal section of `followups.md` is watching for. Team/audit/training requests are most likely to surface here. Log LinkedIn reactions in `results.md` alongside the other channels.

## Carousel outline, if appropriate

This concept fits a carousel well (one failure per slide). Do not produce it before the Reel earns a reason to reuse the idea.

| Slide | Job | Copy / visual |
| ---: | --- | --- |
| 1 | Earn the swipe | `Remembers your dog's name. Forgets your instructions.` |
| 2 | The model | `Your AI has two memories.` Two-column diagram |
| 3 | Fail 1 | `Long chats: the middle gets blurry.` Fix: restate or start fresh |
| 4 | Fail 2 | `Stale memories: any chat can feed your profile.` Fix: Temporary/Incognito + edit the page |
| 5 | Fail 3 | `It keeps highlights, not transcripts.` Fix: Custom Instructions / Claude Project |
| 6 | Kicker | `Deleting a chat ≠ deleting memory. Both apps.` |
| 7 | Action | `Audit today: Settings → Memory.` Both paths listed |
| 8 | Preserve nuance | `Both products are mid-rollout — your screens may differ. Temporary/Incognito ≠ zero-retention.` |

## Other useful adaptation, if earned

- A still image of the two-memory diagram attached to the X post.
- A follow-up screen recording walking through both memory pages, only if viewers ask for the walkthrough.
- The original four-source provenance model ("where did ChatGPT get that?") as a standalone follow-up if comments show provenance confusion — the research for it is already in this folder's git history and `research.md`.

## Formats deliberately skipped

- Long X thread: the single post above carries all three fixes; a thread would pad it.
- Newsletter/article: premature for a zero-audience first post and likely to duplicate official documentation.
- YouTube long-form: not justified until the short version demonstrates demand for a deeper walkthrough.

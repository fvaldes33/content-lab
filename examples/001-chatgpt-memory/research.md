# Research Brief

Reframed 2026-08-16 after Franco's review: the original four-source taxonomy explained where recall comes from but gave the viewer nothing to do, and it was scoped to ChatGPT only. The post is now failure-first and covers both ChatGPT and Claude: three recognizable memory failures, the mechanism behind each, and a concrete fix that works in both products. The four-source model remains the internal skeleton and a candidate follow-up, not the on-screen content.

## Research question

When ChatGPT or Claude remembers or forgets something unexpectedly, what mechanism explains it, and what specific action fixes or prevents it?

## The two-memory model (internal skeleton)

Both products give a response two kinds of user-specific context:

1. **Long-term memory** — a synthesized profile carried across chats. ChatGPT: Memory synthesizes context from chats, files, and connected apps (S1, S2). Claude: categorized memory entries built from chats, plus separate per-Project memories (S11, S12).
2. **Working context** — the current conversation, which is finite (S4) and degrades in practice as it grows (S14, S15).

Retrieval (web, files, past-chat search) and trained model weights still exist as sources (S3, S5, S10, S11), but the post no longer recites the taxonomy; it uses it to diagnose failures.

## Three failure modes

### Failure 1 — It ignores an instruction given earlier in the same long chat

- **Mechanism:** Working context is finite (S4), and models tend to use information at the beginning and end of a long context better than information in the middle (S14). Anthropic's own engineering guidance describes a finite attention budget and "context rot" as context grows (S15). Consumer products may also compress or truncate long conversations in undocumented ways (S4 limitation).
- **Fix (both products):** Restate the binding constraint immediately before the task that depends on it, or start a fresh chat instead of extending a degraded one and let long-term memory or an explicit summary carry over what matters.
- **Hedge:** "Start and end beat the middle" is a documented tendency in research, not a guaranteed behavior of any specific current model; do not quote token limits or claim to know consumer context-assembly policy.

### Failure 2 — It remembers things that are wrong, stale, or none of its business

- **Mechanism:** With memory enabled, ordinary chats feed the long-term profile automatically. ChatGPT synthesizes memory from chats without explicit "remember this" requests (S1, S2). Claude creates and updates memory entries during conversations (S11, S13). A one-off conversation can therefore shape the profile (illustration: helping a friend with a resume could plausibly surface job-related context later — this is an illustrative hypothetical, not an observed case).
- **Fix (both products):** Keep one-off topics out of the profile — Temporary Chat in ChatGPT (S6), Incognito chat (ghost icon) in Claude (S11) — and audit the memory page: ChatGPT's Memory summary is editable (S1); Claude's memory entries can be individually corrected or deleted, with in-chat edits applying immediately (S11).
- **Hedge:** Temporary Chat is not zero-retention — OpenAI may keep a copy up to 30 days for safety (S6). Claude Incognito chats are excluded from memory and history, but on Team/Enterprise plans they follow the organization's retention and export policies (S11). Neither is an anonymity feature.

### Failure 3 — Something important did not carry over to a new chat

- **Mechanism:** Long-term memory is a synthesis, not a transcript. ChatGPT's Memory summary "will not include everything" (S1); Claude stores derived entries, not full conversations, and its global memory excludes Project chats entirely (S11). What the system deemed less important may simply not be there.
- **Fix:** Pin must-have context where it is deterministic instead of hoping the synthesis kept it: Custom Instructions in ChatGPT (S1, S7), a Project in Claude — each Project has its own separate memory space (S11, S12). (ChatGPT also has Projects with a project-only memory option; the script keeps the simpler pairing and the caption can note it.)
- **Hedge:** Do not claim memory "always" drops details or that the visible summary/entries are the complete state (S1, S11).

### The kicker (highest save-value fact)

Deleting a conversation does **not** delete what was already learned from it, in either product. OpenAI: saved memories from a deleted chat can still be used; full deletion requires removing every source where the information appears (S1). Anthropic: "when a conversation expires or is deleted, related memory entries generated from it won't be removed," though entries can be deleted individually (S11). This is documented, symmetrical, and widely misunderstood — it closes the post.

## Key facts

| Fact or finding | Type | Source ID | Confidence | How it affects the post |
| --- | --- | --- | --- | --- |
| ChatGPT Memory synthesizes context from chats, files, and connected apps; the summary may not show everything used. | verified fact | S1, S2 | HIGH | Grounds failures 2 and 3 on the ChatGPT side. |
| Claude memory is categorized, individually editable entries; in-chat edits apply immediately; available across plans including free. | verified fact | S11, S13 | HIGH | Grounds the "edit or delete what it saved" fix on the Claude side. |
| Each Claude Project has its own separate memory, excluded from global memory. | verified fact | S11, S12 | HIGH | Grounds the failure-3 fix and a genuine ChatGPT/Claude difference. |
| Temporary Chat (ChatGPT) and Incognito chat (Claude) exclude conversations from memory. | verified fact | S6, S11 | HIGH | Grounds the failure-2 fix; hedges: 30-day safety copy (ChatGPT), org retention (Claude Team/Enterprise). |
| Deleting a chat does not delete memories derived from it, in both products. | verified fact | S1, S11 | HIGH | The closing kicker; must be worded as "that's a separate step," not as a privacy scandal. |
| Models use long contexts unevenly; middle content is recalled worst; attention budget degrades with length. | verified research finding | S14, S15 | HIGH as tendency | Grounds failure 1; must stay hedged ("tends to"). |
| Model context windows are finite; consumer assembly behavior is not fully documented. | verified fact / gap | S4 | HIGH / MEDIUM | Prevents overclaiming in failure 1. |
| Users publicly report surprise recall and sudden memory loss in both directions. | community observation | S8, S9 | MEDIUM | Confirms the failures are recognizable; not evidence of any specific cause. |

## Common misconceptions

| Misconception | What is more accurate | Evidence |
| --- | --- | --- |
| "It forgot my instruction, so the model is bad." | Long-context degradation is a known mechanism; restating the constraint or starting fresh usually fixes it. | S14, S15 |
| "Deleting the chat deletes what it knows." | Both products keep derived memories after the source chat is deleted; removal is a separate, documented step. | S1, S11 |
| "The memory page shows everything it knows about me." | Both products describe the visible summary/entries as incomplete views of a broader synthesis. | S1, S11 |
| "Temporary/Incognito means no record exists." | ChatGPT may retain a copy up to 30 days for safety; Claude Team/Enterprise retention and exports still apply. | S6, S11 |
| "Claude and ChatGPT memory work the same way." | Similar synthesis approach, different structure: Claude scopes memory per Project; ChatGPT centers one profile plus Custom Instructions (and has its own Projects option). | S1, S11, S12 |
| "Turning off model training turns off memory." | Training controls and memory are separate switches in ChatGPT. | S1, S7 |

## Important nuance

- Both memory systems are mid-rollout: ChatGPT accounts may see current or legacy Memory experiences (S1); Claude accounts may see legacy summary or the 2026 entries panel (S11, S13). The script names no interface element that isn't verified in the captures.
- A response can confidently misstate where its own answer came from; prefer visible controls (memory page, sources indicators) over asking the model to introspect (S1 nuance retained from the original brief).
- The resume example in failure 2 is an illustrative hypothetical and must be delivered as one ("it might think…"), never as an observed case.
- Do not frame the delete-chat kicker as a scandal; both vendors document it and provide per-entry deletion.

## Demonstration or test protocol

- **Question being tested:** Can Franco show each fix as a real, current control in both products without exposing personal data or asserting undocumented behavior?
- **Inputs and environment:** Before recording, privately log for each product: date, plan, surface, model/mode, memory setting state, and which memory experience is visible (legacy vs. current).
- **Acceptance criteria:** Each capture shows a real control; no personal information; no claimed behavior the interface doesn't display; total capture time ≤ 15 minutes across both products.
- **Steps:**
  1. ChatGPT: tight crop of Settings → Personalization → Memory (heading and controls only).
  2. Claude: tight crop of Settings → Memory entries panel (categories visible, contents cropped or synthetic).
  3. Claude: the ghost icon on a new chat (Incognito); ChatGPT: the Temporary Chat control.
  4. Optional: Claude Project settings showing project memory; ChatGPT Custom Instructions panel (empty or synthetic).
  5. Do not create real memories or delete real chats for the demo; if a capture is unsafe or unavailable, use the on-screen text card fallback in `visual-plan.md`.
- **Limitations:** Captures demonstrate one account per product on one date; they do not prove universal behavior, memory completeness, or the cause of any specific viewer's failure.

## Uncertain or contested

- Consumer context-assembly, compression, and truncation policies are undocumented for both products.
- Both vendors' memory docs are changing during rollouts; recheck S1 and S11 immediately before publishing.
- Whether an individual viewer sees the current or legacy memory interface in either product cannot be predicted.
- Claude Incognito retention duration for consumer plans is not stated in S11; the script and caption make no consumer-side retention claim for Claude beyond "excluded from memory and history."

## Research gate

- [x] Current claims were refreshed on 2026-08-16 (ChatGPT sources re-verified; Claude sources added and verified).
- [x] Primary sources were preferred (official help docs, vendor announcements, peer-reviewed research).
- [x] Facts, observations, inference, illustration, and opinion are separated.
- [x] The demonstration was designed before results were interpreted.
- [x] Research is sufficient to begin drafting.

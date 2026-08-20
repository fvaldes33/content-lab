# Script and Caption

Reframed 2026-08-16: failure-first, cross-product (ChatGPT + Claude), fixes as the payload. Prior four-source taxonomy version is in git history.

## Instagram Reel

### Working hook

> ChatGPT can remember your dog's name from three months ago—and forget the instruction you just gave it.

### Script

ChatGPT can remember your dog's name from three months ago—and forget the instruction you just gave it. Claude does the same thing. That's because your AI has two memories. One long-term—a profile it builds from your chats. One short-term—this conversation. Three ways they fail you—three fixes.

Failure one: it ignores instructions in long chats. Models focus on the start and end of a conversation—the middle gets blurry. Restate the rule right before the task, or start a fresh chat.

Failure two: it remembers wrong or stale things. Any chat can feed your profile—help a friend with a resume, and it might think you're job hunting. Keep one-offs in Temporary Chat—Incognito on Claude—and edit or delete bad entries in your memory settings.

Failure three: something important didn't carry over. Long-term memory keeps highlights, not transcripts. Pin critical context in Custom Instructions—or a Claude Project, which gets its own memory.

And deleting a chat doesn't delete what it learned from that chat. Both apps. Separate step. Go check your memory page.

### Practical takeaway / CTA

No engagement CTA. On screen, end with:

> Audit today: Settings → Memory (both apps)

### Read-time check

- **Estimated spoken duration:** 65–71 seconds at approximately 150–165 words per minute.
- **Words:** 178
- **Within selected format:** yes (60–75 second Reel)

## ElevenLabs v3 voiceover script

Paste this version into ElevenLabs with the **Eleven v3** model. The wording is identical to the approved script—only audio tags and pacing punctuation are added—so the fact-check table still applies. Use the clean script above for burned-in captions; tags must never appear on screen.

```text
ChatGPT can remember your dog's name from three months ago and forget the instruction you just gave it. Claude does the same thing. That's because your AI has TWO memories. One long-term… a profile it builds from your chats. One short-term… this conversation. Three ways they fail you—three fixes.

Failure one: it ignores instructions in long chats. Models focus on the start and end of a conversation… the middle gets blurry. Restate the rule right before the task—or start a fresh chat.

Failure two: it remembers wrong or stale things. Any chat can feed your profile. Help a friend with a resume… and it might think you're job hunting. Keep one-offs in Temporary Chat—Incognito on Claude—and edit or delete bad entries in your memory settings.

Failure three: something important didn't carry over. Long-term memory keeps highlights… not transcripts. Pin critical context in Custom Instructions—or a Claude Project, which gets its own memory.

[pause] And deleting a chat… does NOT delete what it learned from that chat. Both apps. Separate step. Go check your memory page.
```

### Generation settings

- **Model:** Eleven v3. Audio tags are ignored or spoken literally on multilingual v2 / turbo / flash—do not use them there.
- **Stability:** Creative or Natural. Robust suppresses tag responsiveness.
- **Voice:** Test tags on the exact voice first. ElevenLabs has noted professional voice clones are not fully optimized for v3; an instant clone or designed voice may respond to tags better than a PVC.
- **Takes:** v3 varies take to take. Generate two or three, pick the best; regenerate only the hook line if the tags overact.
- **Pacing is punctuation:** ellipses add beats, em-dashes add short breaks, CAPS ("TWO", "NOT") adds emphasis. If a pause runs long, remove an ellipsis rather than adding tags.
- **Tags are for pace only:** the single `[pause]` tag marks the kicker. No emotion tags — delivery comes from the voice and punctuation. If a line reads flat, adjust punctuation first; only reach for an emotion tag as a last resort on the resume line.

### Hands-off caveat

An AI voiceover changes the format: the talking-head beats in `visual-plan.md` become diagram and screen-capture beats. It also touches the channel's practitioner-authenticity positioning—whether to use the clone voice and whether to disclose it is Franco's call, recorded in the README.

## Caption

Your AI has two memories. There are three ways they fail you.

Long term memory is a profile built from your chats, not a transcript. Short term is the current conversation, and it gets worse as the chat gets long. These fixes work in both ChatGPT and Claude.

1. Long chat ignoring your instructions? Models pay the most attention to the start and end of a conversation. Restate the rule right before the task, or just start a fresh chat.

2. Wrong or stale memories? Keep one-off stuff in Temporary Chat on ChatGPT, or Incognito on Claude (the ghost icon). And actually go edit the memory page. ChatGPT: Settings > Personalization > Memory. Claude: Settings > Memory. You can fix or delete anything in there.

3. Important context not carrying over? Memory keeps highlights, not everything. Put must-haves in Custom Instructions on ChatGPT or a Project on Claude. Each Claude project gets its own separate memory. ChatGPT projects have a project-only option too.

The one everyone gets wrong: deleting a chat does not delete what it already learned from that chat. True in both apps, and both companies document it. You have to remove the memory too.

Fine print: Temporary Chat isn't zero retention, OpenAI says a copy can stick around up to 30 days for safety. On Claude Team and Enterprise plans, incognito chats still follow your org's retention policy. Both products are mid rollout so your screens may look different.

Sources: OpenAI Memory FAQ and Data Controls FAQ, Anthropic's Claude memory documentation, and long-context research (Liu et al., TACL 2024). Researched 2026-08-16.

Optional hashtag line (weak-evidence marginal gain; skip if it feels spammy): #chatgpt #claudeai #aitips

## TikTok caption (trimmed variant)

Your AI has two memories. There are three ways they fail you. The fixes in the video work in both ChatGPT and Claude.

The one everyone gets wrong: deleting a chat does NOT delete what it already learned from that chat. Remove the memory too. ChatGPT: Settings > Personalization > Memory. Claude: Settings > Memory.

Fine print: Temporary and Incognito chats aren't zero retention. OpenAI says a copy can stick around up to 30 days for safety.

## Channel plan at publish

- **Instagram Reels + TikTok:** `recording-v3.MP4`, Monday ~8:30am ET. IG uses the full caption above; TikTok uses the trimmed variant.
- **X:** text post from `repurposing.md` with `endcard.png` (or the two-memory diagram) attached — not the video. Late morning/lunch window, so the two launches aren't monitored simultaneously.
- Log exact publish times per channel in `results.md` after posting.

## Internal fact check

| Claim | Support | Classification | Status |
| --- | --- | --- | --- |
| An AI can surface an old personal detail yet miss a recent instruction (dog's-name hook). | S1, S2, S8, S9, S14 | illustrative pairing of documented behaviors | verified as illustration; not a claim about a specific account |
| Both ChatGPT and Claude have a synthesized long-term memory plus this-chat working context. | S1, S2, S4, S11, S12 | fact / framing | verified; "two memories" is Franco's model, not vendor terminology |
| Models use the start and end of long contexts better; the middle degrades. | S14, S15 | research finding | verified as tendency; script says "gets blurry," no absolutes |
| Restate the rule before the task, or start a fresh chat. | S14, S15 | engineering practice / inference | verified as motivated advice, not a vendor instruction |
| Ordinary chats can feed the long-term profile in both products. | S1, S2, S11, S13 | fact | verified; conditional "can" — requires memory enabled |
| Resume example ("might think you're job hunting"). | mechanism: S1, S11 | illustrative hypothetical | verified as plausible mechanism; must be spoken with "might" |
| Temporary Chat (ChatGPT) and Incognito (Claude) keep chats out of memory. | S6, S11 | fact | verified; caveats live in the caption |
| Both products let you edit or delete memory entries. | S1, S11 | fact | verified 2026-08-16; interfaces vary mid-rollout |
| Long-term memory keeps highlights, not transcripts. | S1, S11 | fact (both vendors describe synthesis/incomplete views) | verified |
| Custom Instructions (ChatGPT) and Projects (Claude) pin context; Claude projects have separate memory. | S1, S7, S11, S12 | fact | verified |
| Deleting a chat does not delete memories derived from it — both products. | S1, S11 | fact | verified; word as "separate step," not scandal |
| Caption: ChatGPT memory path Settings → Personalization → Memory; Claude path Settings → Memory. | S1, S11 | fact | verified 2026-08-16; recheck both at publish |
| Caption: Temporary Chat 30-day safety copy. | S6 | fact | verified; distinct from S1's 30-day deleted-saved-memories log — do not conflate; recheck S6 before publish |
| Caption: Claude Team/Enterprise incognito follows org retention. | S11 | fact | verified |
| Caption: ChatGPT projects have a project-only memory option. | OpenAI release notes (via S1-family help center) | fact | verified via release notes; low-stakes parenthetical — cut if it can't be re-verified at publish |

## Franco edit notes

- **Hook decision:** "Dog's name" is a synthetic example. If Franco has a real, privacy-safe example of surprising recall from his own usage, swap it in — a firsthand observation beats a hypothetical.
- **Voice check:** "the middle gets blurry," "none of its business" (cut from script, lives in research), and "Both apps. Separate step." are the most stylized lines — loosen or drop if they don't sound natural.
- **Judgment Codex cannot supply:** Whether Franco's own memory pages (either product) are safe to show; whether he has personally hit any of the three failures with a story worth telling in one line.
- **Final claims to recheck immediately before publishing:** Both settings paths; whether Franco's Claude account shows the entries panel or legacy summary; whether Franco's ChatGPT account shows current or legacy Memory; S6's Temporary Chat wording; the ChatGPT project-only memory parenthetical.

#!/usr/bin/env python3
"""Original synth score for a campaign, placed from its timing.json.

    npm run score -- <campaign> [--no-typing] [--bpm 120]
    -> public/campaigns/<campaign>/score.wav   (the composition picks it up automatically)

Soft electric keys, warm pulse bass and light percussion at 120 BPM; quiet until the
groove cue, then full. Every UI sound comes from timing.json "sound.events", and a loose,
low typing texture runs under each typed heading. Needs python3 + numpy. No samples, no
licensing questions: everything is synthesized here.

Taste notes from real reviews: keep effects sparse. Whooshes on scene cuts read as cheap;
effects on the closing/CTA scene clash with the music; one click per typed character
sounds like a rattle, so the typing texture is deliberately loose and low.
"""
import argparse, json, math, pathlib, wave
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("campaign")
ap.add_argument("--no-typing", action="store_true")
ap.add_argument("--bpm", type=float)
args = ap.parse_args()

root = pathlib.Path(__file__).resolve().parent.parent
T = json.loads((root / "campaigns" / args.campaign / "timing.json").read_text())
S = T["scenes"]; fps = T.get("fps", 30); snd = T.get("sound", {})

def at(scene, cue=None, plus=0):
    return (S[scene]["from"] + (S[scene]["cues"][cue] if cue else 0) + plus) / fps

sr = 48000
dur = max(s["from"] + s["dur"] for s in S.values()) / fps
n = int(sr * dur); rng = np.random.default_rng(23); mix = np.zeros((n, 2))

def add(t, a, g=.1, pan=0):
    st = int(t * sr); en = min(n, st + len(a))
    if en <= st or st < 0: return
    a = a[:en - st] * g
    mix[st:en, 0] += a * (1 - pan * .45); mix[st:en, 1] += a * (1 + pan * .45)

def tone(freq, length, decay=3):
    t = np.arange(int(length * sr)) / sr
    return (np.sin(2*np.pi*freq*t) + .22*np.sin(2*np.pi*freq*2*t)) * np.minimum(t/.006, 1) * np.exp(-decay*t)

def kick():
    t = np.arange(int(.22 * sr)) / sr
    return np.sin(2*np.pi*(46*t + 46*.04*(1 - np.exp(-t/.04)))) * np.exp(-20*t)

def noise(length, decay):
    x = rng.normal(0, 1, int(length * sr)); return x * np.exp(-np.arange(len(x)) / sr * decay)

def pop(t, freq=1150, g=.07, pan=.25):
    add(t, tone(freq, .12, 60), g, pan); add(t, tone(freq * 1.5, .08, 80), g * .4, -pan)

# Music bed: D / C / A / G, 8th-note keys, pulse bass, kick, off-beat hats once the groove starts.
chords = [[146.83, 220, 293.66, 369.99], [130.81, 196, 261.63, 329.63],
          [110, 164.81, 220, 277.18], [98, 146.83, 196, 246.94]]
beat = 60 / (args.bpm or snd.get("bpm", 120))
g = snd.get("grooveAt")
groove = at(g["scene"], g.get("cue")) if g else 0
for b in range(int(dur / beat) + 1):
    when = b * beat; ch = chords[(b // 4) % 4]; bar_pos = b % 4; drive = when >= groove
    for k in range(2):
        add(when + k * beat / 2, tone(ch[[0, 2, 1, 3][(b * 2 + k) % 4]] * 2, 1.0, 5.5), .05, (-1) ** k * .55)
    if bar_pos == 0:
        for fr in ch: add(when, tone(fr, 2.2, 1.4), .02)
    add(when, kick(), .15 if drive else .07)
    add(when, tone(ch[0] / 2, .42, 7), .09 if drive else .05)
    if drive:
        add(when + beat / 2, np.diff(noise(.035, 160), prepend=0), .016, -.4)
        add(when + beat / 4, np.diff(noise(.02, 220), prepend=0), .007, .4)
    if bar_pos % 2: add(when, noise(.09, 65), .04 if drive else .025, .15)

# UI events from timing.json.
for e in snd.get("events", []):
    t = at(e["scene"], e.get("cue"), e.get("plus", 0)); k = e["kind"]
    if k == "pop": pop(t, e.get("pitch", 1150))
    elif k == "tick": pop(t, 1760, .05, -.2)
    elif k == "hit": add(t, kick(), .12); add(t, tone(73.42, .8, 3), .08)
    elif k == "chime": f = e.get("pitch", 1318.5); add(t, tone(f, .5, 6), .05); add(t, tone(f * 4 / 3, .5, 6), .035)

# Loose, low typing texture across each typed heading (not one click per character).
def keyclick(low=False):
    L = .06; t = np.arange(int(L * sr)) / sr
    x = np.convolve(rng.normal(0, 1, len(t)), np.ones(14) / 14, mode="same")
    thock = np.sin(2 * np.pi * (rng.uniform(95, 115) if low else rng.uniform(135, 175)) * t) * np.exp(-t / .016)
    return x * np.exp(-t / .005) * 1.6 + thock * (1.0 if low else .7)
if not args.no_typing:
    for sc, h in T.get("typing", {}).items():
        if sc not in S: continue
        t = h["at"]; frames = []
        for ch in h["text"]:
            frames.append(math.floor(t)); t += 3 if ch == "\n" else h["fpc"]
        k, end = at(sc, plus=frames[0]), at(sc, plus=frames[-1])
        while k <= end:
            add(k, keyclick(rng.random() < .2), .095 * rng.uniform(.75, 1.05), rng.uniform(-.25, .25))
            k += rng.uniform(.07, .12)

t = np.arange(n) / sr
fade = np.minimum(t / .03, 1) * np.clip((dur - t) / 1.2, 0, 1)
mix = np.tanh(mix * 1.4) * fade[:, None]; mix *= .77 / max(np.max(np.abs(mix)), .77); mix *= 10 ** (5 / 20)
clipped = int((np.abs(mix) >= .969).sum())
mix = np.clip(mix, -.97, .97)
out = root / "public" / "campaigns" / args.campaign / "score.wav"
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((mix * 32767).astype("<i2").tobytes())
print(f"{out.relative_to(root)}  {dur:.2f}s  peak {np.max(np.abs(mix)):.3f}  clipped samples {clipped}")

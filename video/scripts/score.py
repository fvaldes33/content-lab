#!/usr/bin/env python3
"""Original synthesized score for a campaign, placed from its timing.json.

    npm run score -- <campaign>                 # choose from brand + campaign seed
    npm run score -- <campaign> --seed take-2   # reroll
    npm run score -- <campaign> --no-typing
    -> public/campaigns/<campaign>/score.wav    (the composition picks it up automatically)

Every score is generated here from scratch (no samples, no licensing questions), and each
one is different:

- The brand's mood (brand/brand.ts -> sound.mood: warm | bright | driving | calm) sets the
  family: tempo range, instrument, drum feel. Videos from one brand sound related.
- A seed (brand name + campaign slug, or --seed) picks the key, mode, chord progression,
  arpeggio and bass pattern inside that family. Campaigns don't sound identical.
- The chosen settings are printed. Paste them into timing.json -> "sound" to pin a score
  you like; anything set there overrides the seeded choice.

UI sounds come from timing.json "sound.events" and are tuned to the chosen key. Events can
use "step" (0..9, a note of the key's pentatonic scale, higher = brighter; rising steps for a
sequence feel good) or "pitch" in Hz.

Taste notes from real reviews: keep effects sparse. Whooshes on scene cuts read as cheap;
effects on the closing and CTA scenes clash with the music; one click per typed character
sounds like a rattle, so the typing texture is deliberately loose and low.
"""
import argparse, hashlib, json, math, pathlib, re, wave
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("campaign")
ap.add_argument("--seed")
ap.add_argument("--no-typing", action="store_true")
args = ap.parse_args()

root = pathlib.Path(__file__).resolve().parent.parent
T = json.loads((root / "campaigns" / args.campaign / "timing.json").read_text())
S = T["scenes"]; fps = T.get("fps", 30); snd = T.get("sound", {})

# Brand name and mood from brand/brand.ts (read as text; it's plain data).
brand_src = (root.parent / "brand" / "brand.ts").read_text()
brand_name = (re.search(r'\bname:\s*"([^"]+)"', brand_src) or [None, "brand"])[1]
mood_m = re.search(r'\bmood:\s*"(warm|bright|driving|calm)"', brand_src)
mood = snd.get("mood") or (mood_m[1] if mood_m else "warm")

# ---------------------------------------------------------------- choices
seed_text = args.seed or snd.get("seed") or f"{brand_name}/{args.campaign}"
seeded = lambda s: np.random.default_rng(int(hashlib.sha256(s.encode()).hexdigest()[:12], 16))
brand_rng, rng = seeded(brand_name), seeded(seed_text)
pick = lambda r, xs: xs[int(r.integers(len(xs)))]

MOODS = {
    "warm":    {"bpm": (100, 116), "keys": ["softkeys", "pad"],   "drums": ["halftime", "four"],    "modes": ["major", "lydian", "mixolydian"]},
    "bright":  {"bpm": (114, 126), "keys": ["pluck", "bell"],     "drums": ["four", "broken"],      "modes": ["major", "lydian"]},
    "driving": {"bpm": (120, 132), "keys": ["pluck", "softkeys"], "drums": ["four", "broken"],      "modes": ["minor", "dorian"]},
    "calm":    {"bpm": (84, 100),  "keys": ["pad", "bell"],       "drums": ["minimal", "halftime"], "modes": ["major", "lydian", "dorian"]},
}
MODES = {"major": [0, 2, 4, 5, 7, 9, 11], "minor": [0, 2, 3, 5, 7, 8, 10], "dorian": [0, 2, 3, 5, 7, 9, 10],
         "lydian": [0, 2, 4, 6, 7, 9, 11], "mixolydian": [0, 2, 4, 5, 7, 9, 10]}
# Scale-degree progressions (0 = tonic), one chord per bar.
PROGS = {
    "bright": [[0, 4, 5, 3], [5, 3, 0, 4], [0, 5, 3, 4], [3, 4, 2, 5], [0, 3, 1, 4], [0, 2, 3, 4]],
    "dark": [[0, 5, 2, 6], [0, 3, 6, 2], [0, 6, 5, 6], [0, 3, 4, 3], [0, 5, 3, 4]],
}
KEYS = {"C": 48, "D♭": 49, "D": 50, "E♭": 51, "E": 52, "F": 53, "G♭": 54, "G": 43, "A♭": 44, "A": 45, "B♭": 46, "B": 47}
ARPS = [[0, 1, 2, 3], [0, 2, 1, 3], [0, 2, 3, 2], [0, 1, 3, 2], [3, 2, 1, 0], [0, 2, 1, 2]]
BASS = ["pulse", "octaves", "syncopated"]

fam = MOODS[mood]
choice = {
    "mood": mood,
    "instrument": snd.get("instrument") or pick(brand_rng, fam["keys"]),  # brand-level
    "drums": snd.get("drums") or pick(brand_rng, fam["drums"]),           # brand-level
    "bpm": snd.get("bpm") or int(rng.integers(fam["bpm"][0], fam["bpm"][1] + 1)),
    "key": snd.get("key") or pick(rng, list(KEYS)),
    "mode": snd.get("mode") or pick(rng, fam["modes"]),
}
dark = choice["mode"] in ("minor", "dorian")
choice["progression"] = snd.get("progression") or pick(rng, PROGS["dark" if dark else "bright"])
choice["arp"] = snd.get("arp") or pick(rng, ARPS)
choice["bassPattern"] = snd.get("bassPattern") or pick(rng, BASS)

# ---------------------------------------------------------------- engine
sr = 48000
dur = max(s["from"] + s["dur"] for s in S.values()) / fps
n = int(sr * dur); mix = np.zeros((n, 2)); nrng = np.random.default_rng(7)

def at(scene, cue=None, plus=0):
    return (S[scene]["from"] + (S[scene]["cues"][cue] if cue else 0) + plus) / fps

def add(t, a, g=.1, pan=0):
    st = int(t * sr); en = min(n, st + len(a))
    if en <= st or st < 0: return
    a = a[:en - st] * g
    mix[st:en, 0] += a * (1 - pan * .45); mix[st:en, 1] += a * (1 + pan * .45)

hz = lambda midi: 440 * 2 ** ((midi - 69) / 12)
tt = lambda length: np.arange(int(length * sr)) / sr

def softkeys(f, L, d=5.0):
    t = tt(L); return (np.sin(2*np.pi*f*t) + .22*np.sin(4*np.pi*f*t)) * np.minimum(t/.006, 1) * np.exp(-d*t)

def pluck(f, L, d=6.0):
    t = tt(L); out = np.zeros_like(t)
    for h in range(1, 7): out += np.sin(2*np.pi*f*h*t) * np.exp(-d*h*.7*t) / h
    return out * np.minimum(t/.002, 1) * .9

def bell(f, L, d=3.0):
    t = tt(L); idx = 2.2 * np.exp(-6*t)
    return np.sin(2*np.pi*f*t + idx*np.sin(2*np.pi*f*3.5*t)) * np.minimum(t/.003, 1) * np.exp(-d*t)

def pad(f, L, d=0.6):
    t = tt(L); out = np.zeros_like(t)
    for det in (-0.12, 0, 0.12):
        for h in range(1, 6): out += np.sin(2*np.pi*f*2**(det/12)*h*t) / (h * 1.6)
    return out / 3 * np.minimum(t/.25, 1) * np.exp(-d*t)

VOICE = {"softkeys": softkeys, "pluck": pluck, "bell": bell, "pad": pad}

def kick():
    t = tt(.22); return np.sin(2*np.pi*(46*t + 46*.04*(1 - np.exp(-t/.04)))) * np.exp(-20*t)
def noise(L, d): x = nrng.normal(0, 1, int(L*sr)); return x * np.exp(-np.arange(len(x))/sr*d)
def hat(): return np.diff(noise(.035, 160), prepend=0)
def snare(): t = tt(.18); return noise(.18, 30) * .7 + np.sin(2*np.pi*190*t) * np.exp(-25*t) * .5
def clap():
    L = int(.16 * sr); out = np.zeros(L)
    for k in range(3):
        b = noise(.12, 45); s = int(k * .011 * sr); out[s:s + len(b)] += b[:L - s]
    return out * .5
def shaker(): x = noise(.06, 70); return np.diff(x, prepend=0) * np.hanning(len(x))

scale = MODES[choice["mode"]]; tonic = KEYS[choice["key"]]
def degree(d): return tonic + scale[d % 7] + 12 * (d // 7)
def chord(d): return [degree(d), degree(d + 2), degree(d + 4), degree(d + 6)]
penta = [tonic + [0, 2, 4, 7, 9][i % 5] + 12 * (i // 5) + 36 for i in range(10)]  # ~1–2 kHz, in key

beat = 60 / choice["bpm"]; bar = beat * 4; step = beat / 4
g = snd.get("grooveAt")
groove = at(g["scene"], g.get("cue")) if g else 0
resolve = at(max(S, key=lambda k: S[k]["from"]))   # from the final scene on, rest on the tonic
voice = VOICE[choice["instrument"]]
arp_rate = 4 if (mood == "driving" and choice["instrument"] == "pluck") else 2  # notes per beat

DRUMS = {  # 16 steps per bar: kick, snare/clap, hat
    "four":     ([0, 4, 8, 12], [4, 12], [2, 6, 10, 14]),
    "halftime": ([0, 10], [8], [0, 2, 4, 6, 8, 10, 12, 14]),
    "broken":   ([0, 6, 10], [4, 12], [2, 3, 6, 7, 10, 11, 14, 15]),
    "minimal":  ([0, 8], [12], []),
}
kicks, snares, hats = DRUMS[choice["drums"]]

for b in range(int(dur / bar) + 1):
    t0 = b * bar
    notes = chord(0 if t0 >= resolve - 1e-6 else choice["progression"][b % len(choice["progression"])])
    drive = t0 + bar > groove
    for m in notes[:3]: add(t0, pad(hz(m), bar * 1.1, .5), .018)                     # harmony
    for k in range(4 * arp_rate):                                                     # arpeggio
        idx = choice["arp"][k % len(choice["arp"])]
        add(t0 + k * beat / arp_rate, voice(hz(notes[idx] + 12), 1.0), .045 if drive else .035, (-1) ** k * .5)
    r = notes[0] - 12                                                                 # bass
    hits = {"pulse": [(q * beat, r) for q in range(4)],
            "octaves": [(q * beat / 2, r + (12 if q % 2 else 0)) for q in range(8)],
            "syncopated": [(0, r), (beat * 1.5, r), (beat * 2.5, r + 7), (beat * 3, r)]}[choice["bassPattern"]]
    for off, m in hits: add(t0 + off, softkeys(hz(m), .45, 7), .09 if drive else .05)
    for s16 in range(16):                                                             # drums
        w = t0 + s16 * step
        if s16 in kicks: add(w, kick(), .15 if w >= groove else (.06 if s16 == 0 else 0))
        if w < groove: continue
        if s16 in snares: add(w, clap() if choice["drums"] == "four" else snare(), .05, .15)
        if s16 in hats: add(w, hat(), .016, -.4)
        if choice["drums"] == "minimal": add(w, shaker(), .012, .3)

# UI events from timing.json, tuned to the key.
def ui_pitch(e, default_step):
    return e["pitch"] if "pitch" in e else hz(penta[max(0, min(9, e.get("step", default_step)))])
def pop(t, f, g=.07, pan=.25):
    add(t, softkeys(f, .12, 60), g, pan); add(t, softkeys(f * 1.5, .08, 80), g * .4, -pan)
for e in snd.get("events", []):
    t = at(e["scene"], e.get("cue"), e.get("plus", 0)); k = e["kind"]
    if k == "pop": pop(t, ui_pitch(e, 3))
    elif k == "tick": pop(t, ui_pitch(e, 7), .05, -.2)
    elif k == "hit": add(t, kick(), .12); add(t, softkeys(hz(tonic - 12), .8, 3), .08)
    elif k == "chime": f = ui_pitch(e, 5); add(t, bell(f, .6), .05); add(t, bell(f * 1.5, .6), .03)

# Loose, low typing texture across each typed heading (not one click per character).
def keyclick(low=False):
    t = tt(.06); x = np.convolve(nrng.normal(0, 1, len(t)), np.ones(14) / 14, mode="same")
    thock = np.sin(2*np.pi*(nrng.uniform(95, 115) if low else nrng.uniform(135, 175))*t) * np.exp(-t/.016)
    return x * np.exp(-t/.005) * 1.6 + thock * (1.0 if low else .7)
if not args.no_typing:
    for sc, h in T.get("typing", {}).items():
        if sc not in S: continue
        t = h["at"]; frames = []
        for ch in h["text"]:
            frames.append(math.floor(t)); t += 3 if ch == "\n" else h["fpc"]
        k, end = at(sc, plus=frames[0]), at(sc, plus=frames[-1])
        while k <= end:
            add(k, keyclick(nrng.random() < .2), .095 * nrng.uniform(.75, 1.05), nrng.uniform(-.25, .25))
            k += nrng.uniform(.07, .12)

# Master: soft saturation, fades, consistent loudness with headroom.
t = np.arange(n) / sr
fade = np.minimum(t / .03, 1) * np.clip((dur - t) / 1.2, 0, 1)
mix = np.tanh(mix * 1.6) * fade[:, None]
rms = float(np.sqrt(np.mean(mix ** 2))) or 1.0
mix *= min(0.11 / rms, 0.92 / (float(np.max(np.abs(mix))) or 1.0))  # ≈ -16 LUFS
mix = np.clip(mix, -.97, .97)
out = root / "public" / "campaigns" / args.campaign / "score.wav"
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((mix * 32767).astype("<i2").tobytes())
print(f"{out.relative_to(root)}  {dur:.2f}s  peak {np.max(np.abs(mix)):.3f}  seed \"{seed_text}\"")
print('to pin this score, merge into timing.json "sound":', json.dumps(
    {k: choice[k] for k in ("mood", "instrument", "drums", "bpm", "key", "mode", "progression", "arp", "bassPattern")},
    ensure_ascii=False))

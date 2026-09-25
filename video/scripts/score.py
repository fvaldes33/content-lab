#!/usr/bin/env python3
"""Original synthesized score for a campaign, placed from its timing.json.

    npm run score -- <campaign>                 # choose from brand + campaign seed
    npm run score -- <campaign> --seed take-2   # reroll
    npm run score -- <campaign> --no-typing
    -> public/campaigns/<campaign>/score.wav    (the composition picks it up automatically)

Every score is generated here from scratch (no samples, no licensing questions), and each
one is different:

- The brand's mood (brand/brand.ts -> sound.mood) sets the family: tempo range, instrument,
  drum feel. Videos from one brand sound related.
    warm | bright | driving | calm   soft bed: keys/pluck/bell/pad arps, light drums (-17 LUFS)
    hype                             140-152 BPM four-on-the-floor, sidechained supersaw stabs,
                                     off-beat saw bass, arp, risers and impacts into drops
    euphoric                         124-128 BPM festival anthem: supersaw chords, a seeded lead
                                     hook with hall reverb, piano + pad intro (both ~-13 LUFS)
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
import argparse, hashlib, json, math, pathlib, re, sys, wave
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
mood_m = re.search(r'\bmood:\s*"(warm|bright|driving|calm|hype|euphoric)"', brand_src)
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
    "hype":     {"bpm": (140, 152), "keys": ["supersaw"], "drums": ["four"], "modes": ["minor", "dorian"]},
    "euphoric": {"bpm": (124, 128), "keys": ["supersaw"], "drums": ["four"], "modes": ["major", "mixolydian"]},
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

# ---------------------------------------------------------------- hype / euphoric engine
# Club-style arrangement driven by the scene structure in timing.json: intro until the groove
# cue, then full groove; a riser into every scene start; snare rolls into the first drop and
# the final scene; an impact on every "hit" event and the final scene; one sustained stab to
# end. Optional timing.json sound.break = "<scene>" drops the drums for that scene (a flash
# or transition beat) with a longer riser back in.
def render_edm():
    EU = mood == "euphoric"
    sr = 48000
    dur = max(v["from"] + v["dur"] for v in S.values()) / fps
    n = int(sr * dur)
    orng = np.random.default_rng(int(hashlib.sha256((seed_text + "/osc").encode()).hexdigest()[:12], 16))
    at = lambda scene, cue=None, plus=0: (S[scene]["from"] + (S[scene]["cues"][cue] if cue else 0) + plus) / fps
    drums, music, fx, wet = (np.zeros((n, 2)) for _ in range(4))

    def add(bus, t, a, g=1.0, pan=0.0):
        st = int(round(t * sr))
        if st >= n: return
        if st < 0: a = a[-st:]; st = 0
        en = min(n, st + len(a)); a = a[: en - st] * g
        bus[st:en, 0] += a * (1 - pan); bus[st:en, 1] += a * (1 + pan)

    def filt(x, lo=None, hi=None):
        X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr); h = np.ones_like(f)
        if lo: h *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
        if hi: h *= 1 / np.sqrt(1 + (f / hi) ** 4)
        return np.fft.irfft(X * h, len(x))

    def env(L, a=.003, d=8.0):
        t = np.arange(int(L * sr)) / sr
        return np.minimum(t / a, 1) * np.exp(-d * t), t

    def saw(freq, t, detune=0.0):
        return 2 * ((freq * (1 + detune) * t + orng.random()) % 1.0) - 1

    def kick():
        e, t = env(.32, .001, 11)
        body = np.sin(2 * np.pi * np.cumsum(48 + 110 * np.exp(-t / .03)) / sr)
        click = filt(orng.normal(0, 1, len(t)) * np.exp(-t / .004), lo=2000) * .5
        return np.tanh(2.2 * (body * e + click))

    def clap():
        t = np.arange(int(.35 * sr)) / sr
        e = sum(np.exp(-np.maximum(t - o, 0) / .006) * (t >= o) for o in (0, .011, .022))
        e = e + .55 * np.exp(-np.maximum(t - .03, 0) / .09) * (t >= .03)
        return filt(orng.normal(0, 1, len(t)) * e, lo=900, hi=5500)

    def snare():
        e, t = env(.18, .001, 22)
        return filt(orng.normal(0, 1, len(t)), lo=1200, hi=9000) * e * .9 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .6

    def hat(open_=False):
        e, t = env(.16 if open_ else .035, .0005, 14 if open_ else 90)
        return filt(orng.normal(0, 1, len(t)), lo=7500) * e

    def crash():
        e, t = env(1.8, .002, 2.2); return filt(orng.normal(0, 1, len(t)), lo=4500) * e

    def impact():
        e, t = env(1.4, .002, 2.6)
        sub = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t / .12)) / sr) * e
        return np.tanh(1.6 * (sub + filt(orng.normal(0, 1, len(t)) * np.exp(-t * 7), hi=400) * 1.4))

    def riser(L):
        t = np.arange(int(L * sr)) / sr; p = t / L; x = orng.normal(0, 1, len(t))
        sweep = np.sin(2 * np.pi * np.cumsum(200 + 1400 * p ** 2) / sr) * .25
        return ((1 - p) * filt(x, hi=1200) * .5 + p * filt(x, lo=3000) + sweep) * p ** 2.2

    def supersaw(freqs, L, cutoff=3200, d=5.5):
        e, t = env(L, .004, d)
        x = sum(saw(fr, t, dt) for fr in freqs for dt in (-.011, -.005, 0, .005, .011))
        return filt(x * e, hi=cutoff, lo=120) / (len(freqs) * 2.2)

    def bass(freq, L=.17):
        e, t = env(L, .002, 9)
        x = saw(freq, t) * .6 + np.sin(2 * np.pi * freq * t) * .9 + np.sin(np.pi * freq * t) * .4
        return np.tanh(1.5 * filt(x * e, hi=900))

    def pluck(freq, L=.16):
        e, t = env(L, .001, 22); return filt((saw(freq, t) + .5 * saw(freq, t, .004)) * e, hi=5200, lo=300) * .5

    def lead(freq, L=.3):
        e, t = env(L, .004, 4.5)
        x = sum(saw(freq, t, dt) for dt in (-.012, -.006, -.002, .002, .006, .012)) / 6 + .35 * np.sin(4 * np.pi * freq * t)
        return filt(x * e, hi=7000, lo=250)

    def piano(freqs, L=1.4):
        e, t = env(L, .002, 2.4)
        x = sum(sum(np.sin(2 * np.pi * f * h * t) * a * np.exp(-t * h * 1.2) for h, a in ((1, 1), (2, .45), (3, .2), (4, .1))) for f in freqs)
        return x * e / len(freqs)

    def pad(freqs, L):
        t = np.arange(int(L * sr)) / sr
        e = np.minimum(t / .25, 1) * np.clip((L - t) / .2, 0, 1)
        return filt(sum(saw(f, t, dt) for f in freqs for dt in (-.008, 0, .008)) * e, hi=2200, lo=150) / (len(freqs) * 3)

    def reverb(x, L=2.2, decay=3.2):
        t = np.arange(int(L * sr)) / sr; out = np.zeros_like(x)
        for ch in range(2):
            ir = filt(orng.normal(0, 1, len(t)) * np.exp(-decay * t), lo=300, hi=6000); ir /= np.sqrt(np.sum(ir ** 2))
            N = 1 << (len(x) + len(ir) - 1).bit_length()
            out[:, ch] = np.fft.irfft(np.fft.rfft(x[:, ch], N) * np.fft.rfft(ir, N), N)[: len(x)]
        return out

    def tone(freq, L, d):
        t = np.arange(int(L * sr)) / sr
        return (np.sin(2 * np.pi * freq * t) + .22 * np.sin(4 * np.pi * freq * t)) * np.minimum(t / .004, 1) * np.exp(-d * t)

    # Harmony from the seeded key / mode / progression.
    sc = MODES[choice["mode"]]; tonic = KEYS[choice["key"]]
    deg = lambda d: tonic + sc[d % 7] + 12 * (d // 7)
    def fit(m, lo, hi):
        while m < lo: m += 12
        while m > hi: m -= 12
        return m
    def triad(d):
        r = fit(deg(d) + 12, 57, 68); third = deg(d + 2) + 12; fifth = deg(d + 4) + 12
        while third < r: third += 12
        while fifth < third: fifth += 12
        return [r, third, fifth]
    prog = choice["progression"]
    CH = [[hz(m) for m in triad(d)] for d in prog]
    BASS = [hz(fit(deg(d), 36, 47)) for d in prog]
    HOOK_STEPS = [0, 3, 6, 8, 10, 12, 14]
    motif = [int(x) for x in rng.integers(0, 4, len(HOOK_STEPS))]
    motif_b = [int(x) for x in rng.integers(0, 4, len(HOOK_STEPS))]
    def hook_note(bar, i):
        tones = [m + 12 for m in triad(prog[bar])] + [triad(prog[bar])[0] + 24]
        return hz(tones[(motif_b if bar == 3 else motif)[i]])

    penta_e = [tonic + [0, 2, 4, 7, 9][i % 5] + 12 * (i // 5) + 36 for i in range(10)]
    def ui_pitch(e, default_step):
        return e["pitch"] if "pitch" in e else hz(penta_e[max(0, min(9, e.get("step", default_step)))])

    # Arrangement from the scene structure.
    beat = 60 / choice["bpm"]; six = beat / 4
    order = sorted(S, key=lambda k: S[k]["from"])
    g = snd.get("grooveAt")
    t_drop = at(g["scene"], g.get("cue")) if g else at(order[0]) + beat
    t_end = dur - 1.05
    brk = snd.get("break")
    starts = [at(k) for k in order[1:]]
    last = at(order[-1])
    events = snd.get("events", [])
    hits = [at(e["scene"], e.get("cue"), e.get("plus", 0)) for e in events if e["kind"] == "hit"]
    impacts = sorted(set(round(h, 3) for h in hits + [last]))

    def grid(t0, t1):
        k0 = int(np.ceil((t0 - t_drop) / six)); k1 = int(np.floor((t1 - t_drop) / six))
        return [(k, t_drop + k * six) for k in range(k0, k1 + 1) if t0 <= t_drop + k * six < t1]

    full = [(t_drop, t_end)]
    if brk in S:
        b0, b1 = at(brk), at(brk) + S[brk]["dur"] / fps
        full = [(t_drop, b0), (b1, t_end)]
    arp_from = starts[0] if starts else t_drop
    K, C, SN, H, HO = kick(), clap(), snare(), hat(), hat(True)
    STAB = [0, 3, 6, 10, 12]
    kicks = []
    for (a, b) in full:
        for k, t in grid(a, b):
            step = k % 16; bar = (k // 16) % len(prog)
            if step % 4 == 0:
                add(drums, t, K, .95); kicks.append(t)
                add(music, t + six * 2, bass(BASS[bar]), .42)
            if step in (4, 12): add(drums, t, C, .55, .05)
            add(drums, t, HO if step % 4 == 2 else H, .16 if step % 4 == 2 else .09, .25 if step % 2 else -.25)
            if EU:
                if step in (0, 6, 8, 14): add(music, t, supersaw(CH[bar], .42 if step in (0, 8) else .2, cutoff=4200, d=3.5), .38)
                if step in HOOK_STEPS:
                    x = lead(hook_note(bar, HOOK_STEPS.index(step)), .34 if step in (6, 14) else .22)
                    add(music, t, x, .5); add(wet, t, x, .5)
                continue
            if step in STAB: add(music, t, supersaw(CH[bar], .26), .5)
            if t >= arp_from - .01:
                tones = CH[bar] + [CH[bar][0] * 2]
                add(music, t, pluck(tones[[0, 1, 2, 3, 2, 1, 3, 2][step % 8]] * 2), .16, .35 if step % 2 else -.35)

    # Intro into the first drop.
    for k, t in grid(0.12, t_drop):
        if k % 4 == 0: add(drums, t, filt(K, hi=300), .6); kicks.append(t)
    if EU:
        x = piano(CH[0] + [CH[0][0] * 2], 1.6); add(music, .1, x, .55); add(wet, .1, x, .6)
        add(wet, .1, pad(CH[0], max(t_drop - .1, .3)), .5)
    else:
        add(music, .1, supersaw(CH[0], max(t_drop - .1, .3), cutoff=900, d=1.2), .45)

    # Break scene: sustained harmony, drums out.
    if brk in S:
        b0, b1 = at(brk), at(brk) + S[brk]["dur"] / fps
        if EU:
            x = piano(CH[-1] + [CH[-1][-1] * 2], 1.0); add(music, b0, x, .6); add(wet, b0, x, .7)
            add(wet, b0, pad(CH[1], b1 - b0), .7)
        else:
            add(music, b0, supersaw(CH[1], b1 - b0, cutoff=1400, d=1.5), .55)
        add(fx, b0, riser(b1 - b0), .32)

    # Risers into the drop and every scene start; snare rolls into the drop and the last scene.
    for t_to in [t_drop] + [x for x in starts if not (brk in S and abs(x - (at(brk) + S[brk]["dur"] / fps)) < .05)]:
        L = min(.6 if t_to != t_drop else t_drop - .1, t_to - .05)
        if L > .2: add(fx, t_to - L, riser(L), .32)
    for t_to in (t_drop, last):
        L = min(.8, t_to - .05); steps = int(L / (six / 2))
        for i in range(steps):
            if i < steps // 2 and i % 2: continue
            add(drums, t_to - L + i * six / 2, SN, .12 + .3 * i / max(steps, 1), .1)
    for t in impacts:
        add(fx, t, impact(), .75); add(fx, t, crash(), .22, .1)

    # Ending: one sustained stab on the downbeat after the groove stops.
    t_last = t_drop + int(np.ceil((t_end - t_drop) / beat)) * beat
    if t_last < dur - .2:
        end_chord = CH[0] + [CH[0][0] / 2]
        add(music, t_last, supersaw(end_chord, dur - t_last, cutoff=2400, d=1.6), .7)
        if EU: add(wet, t_last, supersaw(end_chord, dur - t_last, cutoff=3000, d=1.4), .6)
        add(drums, t_last, K, .9); add(fx, t_last, crash(), .18)

    # Sidechain pump from every kick; hall reverb on the euphoric lead and piano.
    pump = np.ones(n)
    for k in kicks:
        st = int(k * sr); en = min(n, st + int(.3 * sr))
        if st >= n: continue
        x = np.arange(en - st) / sr
        pump[st:en] = np.minimum(pump[st:en], 1 - .7 * np.exp(-x / .07))
    music *= pump[:, None]
    if EU: music += reverb(wet) * .55 * (0.5 + 0.5 * pump[:, None])

    # UI events, tuned to the key and tucked under the track.
    for e in events:
        t = at(e["scene"], e.get("cue"), e.get("plus", 0)); k = e["kind"]
        if k == "pop": f = ui_pitch(e, 3); add(fx, t, tone(f, .12, 55), .16, .2); add(fx, t, tone(f * 1.5, .08, 80), .06, -.2)
        elif k == "tick": add(fx, t, tone(ui_pitch(e, 7), .06, 90), .12, -.15)
        elif k == "chime": f = ui_pitch(e, 5); add(fx, t, tone(f, .5, 6), .1); add(fx, t, tone(f * 4 / 3, .5, 6), .07)

    tt = np.arange(n) / sr
    mix = drums + music + fx
    fade = np.minimum(tt / .01, 1) * np.clip((dur - tt) / .5, 0, 1)
    mix /= max(np.percentile(np.abs(mix), 99.95), 1e-6)
    mix = np.tanh(mix * 1.1) / np.tanh(1.1) * fade[:, None]
    mix *= 10 ** (-1.5 / 20) * .84 / max(np.max(np.abs(mix)), 1e-6)
    return np.clip(mix, -.97, .97), dur

def write(mix, dur):
    out = root / "public" / "campaigns" / args.campaign / "score.wav"
    out.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(out), "w") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(48000); w.writeframes((mix * 32767).astype("<i2").tobytes())
    print(f"{out.relative_to(root)}  {dur:.2f}s  peak {np.max(np.abs(mix)):.3f}  seed \"{seed_text}\"")
    print('to pin this score, merge into timing.json "sound":', json.dumps(
        {k: choice[k] for k in ("mood", "instrument", "drums", "bpm", "key", "mode", "progression", "arp", "bassPattern")},
        ensure_ascii=False))

hz = lambda midi: 440 * 2 ** ((midi - 69) / 12)
if mood in ("hype", "euphoric"):
    write(*render_edm())
    sys.exit(0)

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
write(mix, dur)

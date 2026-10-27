"""Compose KATAKATING's background music as a deterministic, original WAV.

Everything is synthesized from scratch (no samples, no network), so the
track is original work with no third-party licence attached.

Arc (seconds follow src/timing/scenes.ts):
  0.0  PROBLEM       dark D drone, tense shimmer, sparse ticks
 15.0  LOST          muted bass pulse, falling bell motif, near-silence at "Padahal"
 30.0  REVEAL        swell → open Bb / F chords on the brand moment
 38.6  DISCOVERY     soft groove: kick, bass, plucked arpeggio (Dm–Bb–F–C)
 51.7  FEATURES      same groove, brighter
 66.5  GRAPH         breathing room: pads + sparse bells, no kick
 80.0  CONTRIBUTION  groove returns, rising
 87.4  ENDING        uplifting F–C–Dm–Bb, final F(add9) chord on the lockup, long tail

Usage (from katakating-video/):
    python3 scripts/generate-music.py
Output: public/audio/music/katakating-bgm.wav (48 kHz, 16-bit, stereo)
"""

from __future__ import annotations

import os
import wave

import numpy as np

SR = 48_000
DURATION = 99.2
N = int(SR * DURATION)
BEAT = 60 / 96  # 96 BPM
BAR = 4 * BEAT
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "music", "katakating-bgm.wav")
rng = np.random.default_rng(1027)

# Scene starts (seconds), mirrored from src/timing/scenes.ts
LOST, REVEAL, DISCOVERY, FEATURES, GRAPH, CONTRIB, ENDING = 15.0, 30.0, 38.6, 51.7, 66.5, 80.0, 87.4
PADAHAL, BRAND, LOCKUP = 24.0, 31.55, 93.0


def hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "Bb": 10, "B": 11}


def m(name: str, octave: int) -> int:
    return 12 * (octave + 1) + NOTE[name]


# Chords as MIDI notes
DM = [m("D", 3), m("F", 3), m("A", 3), m("E", 4)]
BB = [m("Bb", 2), m("D", 3), m("F", 3), m("C", 4)]
FM = [m("F", 3), m("A", 3), m("C", 4), m("G", 4)]
CM = [m("C", 3), m("E", 3), m("G", 3), m("D", 4)]
ROOT = {id(DM): m("D", 2), id(BB): m("Bb", 1), id(FM): m("F", 2), id(CM): m("C", 2)}

# ---------------------------------------------------------------------------
# DSP helpers
# ---------------------------------------------------------------------------


def track() -> np.ndarray:
    return np.zeros((N, 2))


def place(buf: np.ndarray, sig: np.ndarray, t: float, gain: float = 1.0, pan: float = 0.0) -> None:
    """Add mono or stereo `sig` at time t (seconds)."""
    i = int(t * SR)
    if i >= N:
        return
    if sig.ndim == 1:
        left = np.sqrt(0.5 * (1 - pan))
        right = np.sqrt(0.5 * (1 + pan))
        sig = np.stack([sig * left, sig * right], axis=1)
    end = min(N, i + len(sig))
    buf[i:end] += sig[: end - i] * gain


def fft_filter(x: np.ndarray, low: float | None = None, high: float | None = None) -> np.ndarray:
    """Zero-phase band filter with smooth (Butterworth-like) roll-off, per channel."""
    out = np.empty_like(x)
    for c in range(x.shape[1]):
        n = 1 << int(np.ceil(np.log2(len(x))))
        spec = np.fft.rfft(x[:, c], n)
        f = np.fft.rfftfreq(n, 1 / SR)
        h = np.ones_like(f)
        if high:
            h *= 1 / np.sqrt(1 + (f / high) ** 8)
        if low:
            h *= 1 / np.sqrt(1 + (low / np.maximum(f, 1e-3)) ** 8)
        out[:, c] = np.fft.irfft(spec * h, n)[: len(x)]
    return out


def reverb(x: np.ndarray, seconds: float = 2.8, wet: float = 0.3) -> np.ndarray:
    """Convolution reverb with a decorrelated exponential-noise impulse response."""
    ir_n = int(seconds * SR)
    t = np.arange(ir_n) / SR
    out = np.empty_like(x)
    n = 1 << int(np.ceil(np.log2(len(x) + ir_n)))
    for c in range(2):
        ir = rng.standard_normal(ir_n) * np.exp(-t * 6.9 / seconds)
        ir[: int(0.012 * SR)] = 0  # pre-delay
        ir = fft_filter(ir[:, None].repeat(2, axis=1), high=6000)[:, 0]
        ir /= np.sqrt(np.sum(ir**2))
        y = np.fft.irfft(np.fft.rfft(x[:, c], n) * np.fft.rfft(ir, n), n)[: len(x)]
        out[:, c] = x[:, c] + wet * y
    return out


def automation(points: list[tuple[float, float]]) -> np.ndarray:
    ts, vs = zip(*points)
    return np.interp(np.arange(N) / SR, ts, vs)[:, None]


def env_adsr(n: int, a: float, r: float) -> np.ndarray:
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    na, nr = min(na, n // 2), min(nr, n // 2)
    e[:na] = np.linspace(0, 1, na) ** 1.5
    e[n - nr :] *= np.linspace(1, 0, nr) ** 1.5
    return e


def saw(freq: float, dur: float, harmonics_to: float = 7000) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    k_max = max(1, int(harmonics_to / freq))
    s = np.zeros_like(t)
    phase = rng.random() * 2 * np.pi
    for k in range(1, k_max + 1):
        s += np.sin(2 * np.pi * freq * k * t + phase * k) / k
    return s * 0.6


def sine(freq: float, dur: float) -> np.ndarray:
    return np.sin(2 * np.pi * freq * np.arange(int(dur * SR)) / SR)


# ---------------------------------------------------------------------------
# Instruments
# ---------------------------------------------------------------------------


def pad_chord(buf: np.ndarray, notes: list[int], t: float, dur: float, gain: float, attack=1.2, release=1.6) -> None:
    for i, note in enumerate(notes):
        for detune, pan in ((-7, -0.7), (0, 0.0), (7, 0.7)):
            f = hz(note + detune / 100)
            s = saw(f, dur + release, harmonics_to=3000) * env_adsr(int((dur + release) * SR), attack, release)
            place(buf, s, t, gain * (0.8 if detune else 1.0) / len(notes), pan * (0.4 + 0.15 * i))


def drone(buf: np.ndarray, t: float, dur: float, gain: float) -> None:
    for note, pan in ((m("D", 2), -0.2), (m("A", 2), 0.2), (m("D", 1), 0.0)):
        s = (sine(hz(note), dur) * 0.7 + saw(hz(note), dur, 900) * 0.3) * env_adsr(int(dur * SR), 2.5, 3.0)
        place(buf, s, t, gain, pan)


def shimmer(buf: np.ndarray, t: float, dur: float, gain: float) -> None:
    """Tense, slowly beating high cluster (E5 / F5)."""
    for note, pan, beat in ((m("E", 5), -0.6, 0.0), (m("F", 5), 0.6, 0.0), (m("E", 5) + 0.12, 0.3, 0.0)):
        s = sine(hz(note), dur) * env_adsr(int(dur * SR), 3.0, 3.0)
        place(buf, s, t, gain, pan)


def pluck(freq: float, decay: float = 0.28) -> np.ndarray:
    dur = decay * 4
    s = saw(freq, dur, harmonics_to=5000)
    t = np.arange(len(s)) / SR
    return s * np.exp(-t / decay) * np.clip(t / 0.003, 0, 1)


def bell(freq: float) -> np.ndarray:
    dur = 2.5
    t = np.arange(int(dur * SR)) / SR
    s = (
        np.sin(2 * np.pi * freq * t) * np.exp(-t / 1.2)
        + 0.4 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t / 0.5)
        + 0.2 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t / 0.25)
    )
    return s * np.clip(t / 0.002, 0, 1)


def kick() -> np.ndarray:
    dur = 0.5
    t = np.arange(int(dur * SR)) / SR
    f = 45 + 75 * np.exp(-t / 0.04)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18)
    return s * np.clip(t / 0.002, 0, 1)


def hat(length: float = 0.04) -> np.ndarray:
    n = int(length * SR)
    s = rng.uniform(-1, 1, n) * np.exp(-np.arange(n) / SR / (length / 4))
    return s


def bass_note(note: int, dur: float) -> np.ndarray:
    f = hz(note)
    s = sine(f, dur) * 0.8 + saw(f, dur, 700) * 0.35
    return s * env_adsr(len(s), 0.01, min(0.08, dur / 3))


def sub_hit(dur: float = 4.0) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    f = 38 + 50 * np.exp(-t / 0.08)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 1.1)


def riser(dur: float) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    s = noise * (t / dur) ** 2.5
    return s


# ---------------------------------------------------------------------------
# Score
# ---------------------------------------------------------------------------


def groove(drums, bass, arps, start: float, end: float, chords: list[list[int]], *, kick_on=True, hats=True, sixteenths=True, arp_gain=1.0):
    t = start
    bar = 0
    while t < end - 0.01:
        chord = chords[bar % len(chords)]
        root = ROOT[id(chord)]
        for b in range(4):
            bt = t + b * BEAT
            if bt >= end:
                break
            if kick_on and b in (0, 2):
                place(drums, kick(), bt, 0.9)
            if hats:
                place(drums, fft_filter(hat()[:, None].repeat(2, 1), low=7000)[:, 0], bt + BEAT / 2, 0.16, 0.3)
            for e in range(2):
                place(bass, bass_note(root if e == 0 else root + 12, BEAT / 2 * 0.9), bt + e * BEAT / 2, 0.55)
            steps = 4 if sixteenths else 2
            for s in range(steps):
                idx = (b * steps + s) % len(chord)
                note = chord[idx] + (12 if (b * steps + s) % 8 >= 4 else 0)
                place(arps, pluck(hz(note)), bt + s * BEAT / steps, 0.22 * arp_gain, -0.5 if s % 2 else 0.5)
        t += BAR
        bar += 1


def compose() -> np.ndarray:
    pads, drones, bells, drums, bass, arps, fx = (track() for _ in range(7))

    # PROBLEM / LOST: tension
    drone(drones, 0.0, PADAHAL + 0.6, 0.15)
    shimmer(drones, 4.0, 20.5, 0.035)
    for i, t in enumerate(np.arange(6.6, 14.4, BEAT)):
        place(drums, fft_filter(hat(0.02)[:, None].repeat(2, 1), low=5000)[:, 0], t, 0.12 if i % 2 == 0 else 0.07, 0.4)
    pad_chord(pads, [m("D", 3), m("A", 3), m("E", 4)], 10.4, 13.0, 0.10, attack=2.5, release=2.0)
    for t in np.arange(16.8, PADAHAL - 0.2, BEAT / 2):
        place(bass, bass_note(m("D", 1), BEAT / 2 * 0.8), t, 0.28)
    for t, note in zip((18.6, 19.4, 20.4, 21.4, 22.4), ("A", "G", "F", "E", "D")):
        place(bells, bell(hz(m(note, 5))), t, 0.10, 0.3)

    # "Padahal..." near-silence, then swell into the reveal
    pad_chord(pads, [m("D", 3), m("F", 3), m("A", 3)], PADAHAL + 0.4, 6.8, 0.07, attack=4.0, release=0.4)
    place(fx, fft_filter(riser(BRAND - 25.6)[:, None].repeat(2, 1), low=400, high=3000)[:, 0], 25.6, 0.03)

    # REVEAL: brand moment
    place(fx, sub_hit(), BRAND, 0.55)
    pad_chord(pads, BB, BRAND, 2.8, 0.48, attack=0.05, release=1.2)
    pad_chord(pads, FM, 34.4, 4.6, 0.40, attack=0.8, release=1.5)
    place(bells, bell(hz(m("F", 5))), BRAND, 0.10, -0.2)
    place(bells, bell(hz(m("C", 6))), BRAND + 0.4, 0.07, 0.3)

    # DISCOVERY + FEATURES: groove
    prog = [DM, BB, FM, CM]
    groove(drums, bass, arps, DISCOVERY, FEATURES, prog, hats=False, sixteenths=False)
    groove(drums, bass, arps, FEATURES, GRAPH - 0.2, prog, arp_gain=1.1)
    t = DISCOVERY
    i = 0
    while t < GRAPH:
        pad_chord(pads, prog[i % 4], t, min(BAR, GRAPH - t), 0.12, attack=0.6, release=0.8)
        t += BAR
        i += 1

    # GRAPH: breathing room
    graph_prog = [BB, FM, DM, CM]
    t = GRAPH
    i = 0
    while t < CONTRIB:
        pad_chord(pads, graph_prog[i % 4], t, min(BAR * 1.5, CONTRIB - t), 0.17, attack=1.2, release=1.4)
        place(bells, bell(hz(graph_prog[i % 4][2] + 12)), t + 0.2, 0.07, -0.4 if i % 2 else 0.4)
        t += BAR * 1.5
        i += 1
    for t in np.arange(GRAPH + 2.0, CONTRIB, BEAT):
        place(bass, bass_note(m("D", 2), BEAT * 0.6), t, 0.12)
    place(fx, fft_filter(riser(CONTRIB - 77.4)[:, None].repeat(2, 1), low=600, high=3500)[:, 0], 77.4, 0.018)

    # CONTRIBUTION: groove returns, rising
    groove(drums, bass, arps, CONTRIB, ENDING - 0.3, prog, arp_gain=1.15)
    pad_chord(pads, DM, CONTRIB, BAR, 0.12)
    pad_chord(pads, BB, CONTRIB + BAR, BAR, 0.12)
    pad_chord(pads, FM, CONTRIB + 2 * BAR, ENDING - CONTRIB - 2 * BAR, 0.12)
    place(fx, fft_filter(riser(ENDING - 84.6)[:, None].repeat(2, 1), low=800, high=4000)[:, 0], 84.6, 0.025)

    # ENDING: uplifting, then the final chord on the lockup
    end_prog = [FM, CM, DM, BB]
    groove(drums, bass, arps, ENDING, LOCKUP - 0.15, end_prog, hats=True, arp_gain=1.2)
    t = ENDING
    i = 0
    while t < LOCKUP:
        pad_chord(pads, end_prog[i % 4], t, min(BAR, LOCKUP - t), 0.15, attack=0.4, release=0.6)
        t += BAR
        i += 1
    final = [m("F", 2), m("C", 3), m("F", 3), m("A", 3), m("C", 4), m("G", 4)]
    pad_chord(pads, final, LOCKUP, DURATION - LOCKUP - 1.5, 0.42, attack=0.03, release=3.5)
    place(fx, sub_hit(5.0), LOCKUP, 0.5)
    for k, note in enumerate((m("F", 5), m("A", 5), m("C", 6))):
        place(bells, bell(hz(note)), LOCKUP + 0.15 * k, 0.08, (-0.4, 0.0, 0.4)[k])

    # Per-layer tone + automation
    pads = fft_filter(pads, low=90, high=2600)
    drones = fft_filter(drones, high=1400)
    arps = fft_filter(arps, low=180, high=3600)
    bass = fft_filter(bass, high=420)
    drums = fft_filter(drums, high=12000)

    arp_level = automation([(0, 0), (DISCOVERY, 0.75), (FEATURES, 1.0), (GRAPH, 1.0), (CONTRIB, 1.0), (ENDING, 1.1), (DURATION, 1.1)])
    mix = (
        pads * 1.0
        + drones * 1.0
        + bells * 1.0
        + drums * 0.85
        + bass * 0.9
        + arps * arp_level
        + fx * 1.0
    )
    mix = reverb(mix, seconds=3.0, wet=0.28)

    # Global arc + fades
    arc = automation([
        (0, 0.0), (1.5, 0.85), (PADAHAL, 0.9), (PADAHAL + 0.5, 0.45), (29.5, 0.85),
        (REVEAL, 0.95), (DISCOVERY, 0.95), (GRAPH, 0.9), (ENDING, 1.0),
        (DURATION - 3.0, 1.0), (DURATION, 0.0),
    ])
    mix *= arc
    mix = np.tanh(mix * 1.4) / 1.4  # gentle saturation, no hard limiting
    peak = np.max(np.abs(mix)) or 1.0
    return mix / peak * 10 ** (-3 / 20)


def main() -> None:
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    mix = compose()
    data = (np.clip(mix, -1, 1) * 32767).astype("<i2")
    with wave.open(OUT, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"Wrote {os.path.normpath(OUT)}  ({len(mix) / SR:.1f}s)")


if __name__ == "__main__":
    main()

"""Generate KATAKATING's sound-effect palette as deterministic WAV files.

Every sound is synthesized from scratch (no samples, no network), so the
palette is license-free and identical on every run.

Usage (from katakating-video/):
    python3 scripts/generate-sfx.py

Output: public/audio/sfx/*.wav (48 kHz, 16-bit, mono)
"""

from __future__ import annotations

import os
import wave

import numpy as np

SR = 48_000
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "sfx")
rng = np.random.default_rng(20261027)


# ---------------------------------------------------------------------------
# Building blocks
# ---------------------------------------------------------------------------


def t_axis(seconds: float) -> np.ndarray:
    return np.arange(int(seconds * SR)) / SR


def env_exp(seconds: float, decay: float, attack: float = 0.001) -> np.ndarray:
    t = t_axis(seconds)
    a = np.clip(t / attack, 0, 1)
    return a * np.exp(-t / decay)


def sine(freq, seconds: float) -> np.ndarray:
    """Sine with a constant or per-sample frequency array."""
    n = int(seconds * SR)
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    phase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(phase)


def noise(seconds: float) -> np.ndarray:
    return rng.uniform(-1, 1, int(seconds * SR))


def one_pole_lp(x: np.ndarray, cutoff: float) -> np.ndarray:
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def one_pole_hp(x: np.ndarray, cutoff: float) -> np.ndarray:
    return x - one_pole_lp(x, cutoff)


def bandpass(x: np.ndarray, low: float, high: float) -> np.ndarray:
    return one_pole_lp(one_pole_hp(x, low), high)


def sweep_lp(x: np.ndarray, cutoffs: np.ndarray) -> np.ndarray:
    """Low-pass with a per-sample cutoff (for whooshes)."""
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        a = np.exp(-2 * np.pi * cutoffs[i] / SR)
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def pad(x: np.ndarray, seconds: float) -> np.ndarray:
    n = int(seconds * SR)
    if len(x) >= n:
        return x[:n]
    return np.concatenate([x, np.zeros(n - len(x))])


def mix(*parts: np.ndarray) -> np.ndarray:
    n = max(len(p) for p in parts)
    out = np.zeros(n)
    for p in parts:
        out[: len(p)] += p
    return out


def delay(x: np.ndarray, seconds: float) -> np.ndarray:
    return np.concatenate([np.zeros(int(seconds * SR)), x])


def fade_out(x: np.ndarray, seconds: float = 0.01) -> np.ndarray:
    n = min(len(x), int(seconds * SR))
    x = x.copy()
    x[-n:] *= np.linspace(1, 0, n)
    return x


def normalize(x: np.ndarray, peak_db: float) -> np.ndarray:
    peak = np.max(np.abs(x)) or 1.0
    return x / peak * (10 ** (peak_db / 20))


def write(name: str, x: np.ndarray, peak_db: float = -3.0) -> None:
    x = fade_out(normalize(x, peak_db))
    data = (np.clip(x, -1, 1) * 32767).astype("<i2")
    path = os.path.join(OUT_DIR, f"{name}.wav")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"  {name}.wav  {len(x) / SR:.2f}s")


# ---------------------------------------------------------------------------
# Palette
# ---------------------------------------------------------------------------


def key_tick(pitch: float) -> np.ndarray:
    """A short, soft mechanical key press."""
    dur = 0.05
    body = bandpass(noise(dur), 1800 * pitch, 7000) * env_exp(dur, 0.006)
    thock = sine(320 * pitch, dur) * env_exp(dur, 0.01) * 0.5
    return mix(body, thock)


def ui_click() -> np.ndarray:
    dur = 0.08
    tick = bandpass(noise(dur), 2500, 9000) * env_exp(dur, 0.003)
    tone = sine(2100, dur) * env_exp(dur, 0.012) * 0.35
    low = sine(240, dur) * env_exp(dur, 0.015) * 0.4
    return mix(tick, tone, low)


def snap_lock() -> np.ndarray:
    """Two-stage 'lock into place' click."""
    first = ui_click() * 0.7
    second = mix(
        bandpass(noise(0.1), 1200, 6000) * env_exp(0.1, 0.004),
        sine(160, 0.12) * env_exp(0.12, 0.03) * 0.8,
    )
    return mix(first, delay(second, 0.035))


def digital_hit() -> np.ndarray:
    """Punchy, clean emphasis hit for short VO statements."""
    dur = 0.6
    t = t_axis(dur)
    sub = sine(55 + 50 * np.exp(-t / 0.03), dur) * env_exp(dur, 0.16)
    click = bandpass(noise(dur), 3000, 12000) * env_exp(dur, 0.004) * 0.6
    tone = sine(880, dur) * env_exp(dur, 0.09) * 0.12
    tone += sine(1320, dur) * env_exp(dur, 0.06) * 0.06
    return mix(sub, click, tone)


def whoosh() -> np.ndarray:
    dur = 0.7
    t = t_axis(dur)
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2.2
    cutoffs = 400 + 5200 * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    air = sweep_lp(noise(dur), cutoffs) * shape
    return one_pole_hp(air, 180)


def node_activate() -> np.ndarray:
    """Soft blip with a quick upward glide: a node comes online."""
    dur = 0.32
    t = t_axis(dur)
    f = 990 + 330 * (1 - np.exp(-t / 0.02))
    blip = sine(f, dur) * env_exp(dur, 0.07, attack=0.002)
    shimmer = sine(f * 2, dur) * env_exp(dur, 0.03) * 0.15
    return mix(blip, shimmer)


def confirm() -> np.ndarray:
    """Mechanical confirmation: two ascending, tightly spaced blips."""
    a = sine(880, 0.16) * env_exp(0.16, 0.04, attack=0.002)
    b = sine(1320, 0.3) * env_exp(0.3, 0.08, attack=0.002)
    c = ui_click() * 0.5
    return mix(c, a * 0.8, delay(b, 0.085))


def glitch() -> np.ndarray:
    """Subtle data-loss stutter for knowledge disappearing."""
    dur = 0.42
    out = np.zeros(int(dur * SR))
    pos = 0
    for i in range(9):
        seg_len = int(SR * (0.012 + 0.02 * rng.random()))
        if pos + seg_len >= len(out):
            break
        f = 600 + 2400 * rng.random()
        seg = sine(f, seg_len / SR) * 0.5 + bandpass(noise(seg_len / SR), 1500, 8000) * 0.5
        seg *= 1 - i / 10
        out[pos : pos + seg_len] += seg[:seg_len]
        pos += seg_len + int(SR * 0.012 * rng.random())
    return one_pole_lp(out, 9000)


def brand_hit() -> np.ndarray:
    """Brand moment: sub impact + clean open fifth that rings out."""
    dur = 2.4
    t = t_axis(dur)
    sub = sine(42 + 60 * np.exp(-t / 0.05), dur) * env_exp(dur, 0.45)
    click = bandpass(noise(dur), 2500, 12000) * env_exp(dur, 0.006) * 0.5
    chord = (
        sine(220, dur) * 0.35
        + sine(330, dur) * 0.22
        + sine(440, dur) * 0.16
        + sine(880, dur) * 0.05
    ) * env_exp(dur, 0.9, attack=0.01)
    return mix(sub, click, chord * 0.55)


def hum() -> np.ndarray:
    """Very soft digital hum bed for the Knowledge Graph (4 s, loopable)."""
    dur = 4.0
    t = t_axis(dur)
    base = sine(110, dur) * 0.5 + sine(165, dur) * 0.22 + sine(220, dur) * 0.12
    lfo = 0.75 + 0.25 * np.sin(2 * np.pi * 0.5 * t)
    air = bandpass(noise(dur), 800, 3000) * 0.04
    x = base * lfo + air
    edge = int(0.4 * SR)
    ramp = np.linspace(0, 1, edge)
    x[:edge] *= ramp
    x[-edge:] *= ramp[::-1]
    return x


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    print("Generating KATAKATING SFX ->", os.path.normpath(OUT_DIR))
    for i, pitch in enumerate((1.0, 1.12, 0.92)):
        write(f"type-{i + 1}", pad(key_tick(pitch), 0.06), -8)
    write("click", ui_click(), -6)
    write("snap", snap_lock(), -5)
    write("hit", digital_hit(), -2)
    write("whoosh", whoosh(), -6)
    write("node", node_activate(), -8)
    write("confirm", confirm(), -5)
    write("glitch", glitch(), -7)
    write("brand", brand_hit(), -1)
    write("hum", hum(), -14)


if __name__ == "__main__":
    main()

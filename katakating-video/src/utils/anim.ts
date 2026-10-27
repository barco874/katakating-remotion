import { Easing, interpolate } from "remotion";

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Motion vocabulary: precise, fast, controlled. */
export const EASE = {
  /** Fast start, long settle. Default for reveals. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Symmetric move between two states. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Hard snap: almost instant, tiny settle. */
  snap: Easing.bezier(0.2, 0, 0, 1),
  /** Accelerate away (exits). */
  in: Easing.bezier(0.55, 0, 1, 0.45),
} as const;

/** 0 → 1 progress over [start, start + duration], clamped. */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = EASE.out,
) =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
    ...CLAMP,
    easing,
  });

/** Linear map with clamping. */
export const mapClamp = (
  frame: number,
  input: readonly number[],
  output: readonly number[],
  easing?: (t: number) => number,
) => interpolate(frame, input, output, { ...CLAMP, easing });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Number of characters visible for a type-on that starts at `start`. */
export const typedCount = (
  frame: number,
  start: number,
  totalChars: number,
  charsPerFrame: number,
) => Math.max(0, Math.min(totalChars, Math.floor((frame - start) * charsPerFrame)));

/** Deterministic on/off caret blink (period in frames). */
export const blink = (frame: number, period = 16) =>
  Math.floor(frame / (period / 2)) % 2 === 0 ? 1 : 0;

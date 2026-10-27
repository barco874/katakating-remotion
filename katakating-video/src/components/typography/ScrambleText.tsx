import React from "react";
import { random, useCurrentFrame } from "remotion";

const GLYPHS = "█▓▒░<>/\\[]{}#$%&*+=?01";

/**
 * Deterministic text corruption: from `start`, characters progressively
 * swap to glyph noise and drop out. Uses Remotion's seeded random(), so
 * every render is identical.
 */
export const ScrambleText: React.FC<{
  readonly text: string;
  readonly start: number;
  readonly duration: number;
  readonly seed: string;
  readonly style?: React.CSSProperties;
}> = ({ text, start, duration, seed, style }) => {
  const frame = useCurrentFrame();
  const t = (frame - start) / duration;
  if (t <= 0) {
    return <span style={style}>{text}</span>;
  }
  const chars = text.split("").map((ch, i) => {
    if (ch === " ") return " ";
    const threshold = random(`${seed}-${i}`);
    if (t > threshold + 0.35) return " ";
    if (t > threshold) {
      const pick = Math.floor(random(`${seed}-${i}-${Math.floor(frame / 2)}`) * GLYPHS.length);
      return GLYPHS[pick];
    }
    return ch;
  });
  return <span style={style}>{chars.join("")}</span>;
};

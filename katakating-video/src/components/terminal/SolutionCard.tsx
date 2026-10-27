import React from "react";
import { random, useCurrentFrame } from "remotion";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";
import { CheckIcon } from "../icons/Icons";
import { ScrambleText } from "../typography/ScrambleText";

/** Where the solution card sits. Shared by Problem (appears) and Lost (breaks apart). */
export const SOLUTION_CARD = { x: 1010, y: 300, w: 720 } as const;

export const SOLUTION_LINES = [
  "$ wsl --update",
  "$ wsl --install -d Ubuntu-24.04",
  "Ubuntu 24.04 LTS installed.",
] as const;

/**
 * A fix someone already found ("angkatan 2022"). In Problem it locks in;
 * in Lost, from `breakAt`, it corrupts and dissolves (deterministic glitch).
 */
export const SolutionCard: React.FC<{
  readonly appear?: number;
  readonly breakAt?: number;
}> = ({ appear = 1, breakAt = Infinity }) => {
  const frame = useCurrentFrame();
  const broken = frame - breakAt;
  const glitching = broken >= 0;
  const slice = glitching ? Math.floor(frame / 2) : 0;
  const jitterX = glitching && broken < 18 ? (random(`sc-x-${slice}`) - 0.5) * 18 : 0;
  const fade = glitching ? Math.max(0, 1 - broken / 22) : 1;
  const flicker = glitching && broken < 22 && random(`sc-f-${slice}`) > 0.7 ? 0.35 : 1;
  const top = glitching ? random(`sc-t-${slice}`) * 60 : 0;
  const bottom = glitching ? random(`sc-b-${slice}`) * 40 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: SOLUTION_CARD.x,
        top: SOLUTION_CARD.y,
        width: SOLUTION_CARD.w,
        opacity: appear * fade * flicker,
        translate: `${jitterX}px ${(1 - appear) * 30}px`,
        scale: String(0.97 + 0.03 * appear),
        clipPath: glitching ? `inset(${top}% 0 ${bottom}% 0)` : undefined,
        background: COLORS.surface,
        border: `1px solid ${COLORS.borderStrong}`,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 22px",
          borderBottom: `1px solid ${COLORS.border}`,
          fontFamily: FONT_MONO,
          fontSize: 16,
          letterSpacing: "0.1em",
          color: COLORS.textMuted,
        }}
      >
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: 26,
            height: 26,
            borderRadius: 6,
            border: `1px solid ${COLORS.green}`,
            background: COLORS.greenSoft,
          }}
        >
          <CheckIcon size={16} color={COLORS.green} strokeWidth={2.4} />
        </span>
        <span style={{ color: COLORS.text, fontWeight: 700 }}>SOLVED</span>
        <span>· angkatan 2022</span>
      </div>
      <div style={{ padding: "22px 24px", fontFamily: FONT_MONO, fontSize: 22, lineHeight: 1.75 }}>
        {SOLUTION_LINES.map((line, i) => (
          <div key={line} style={{ color: i === 2 ? COLORS.textMuted : COLORS.text, whiteSpace: "pre" }}>
            <ScrambleText text={line} start={breakAt + i * 2} duration={16} seed={`sol-${i}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

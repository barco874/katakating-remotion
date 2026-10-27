import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";

/**
 * The `[>]` brand symbol, built from type so it can assemble on screen.
 *
 * - `open`  (0→1): brackets travel from the centre to their resting place.
 * - `arrow` (0→1): the `>` snaps in (scale + opacity).
 * - `glow`  (0→1): brand-moment glow, used sparingly.
 */
export const BracketMark: React.FC<{
  readonly size: number;
  readonly open?: number;
  readonly arrow?: number;
  readonly glow?: number;
  readonly bracketColor?: string;
  readonly arrowColor?: string;
  readonly style?: React.CSSProperties;
}> = ({
  size,
  open = 1,
  arrow = 1,
  glow = 0,
  bracketColor = COLORS.green,
  arrowColor = COLORS.green,
  style,
}) => {
  const gap = size * 0.62 * open;
  const glyph: React.CSSProperties = {
    fontFamily: FONT_MONO,
    fontWeight: 700,
    fontSize: size,
    lineHeight: 1,
    position: "absolute",
    top: "50%",
    left: "50%",
  };
  const shadow =
    glow > 0 ? `0 0 ${size * 0.35 * glow}px ${COLORS.greenGlow}` : undefined;
  return (
    <div
      style={{
        position: "relative",
        width: size * 1.9,
        height: size * 1.2,
        ...style,
      }}
    >
      <span
        style={{
          ...glyph,
          color: bracketColor,
          translate: `calc(-50% - ${gap}px) -50%`,
          textShadow: shadow,
        }}
      >
        [
      </span>
      <span
        style={{
          ...glyph,
          color: arrowColor,
          translate: "-50% -52%",
          scale: String(0.4 + 0.6 * arrow),
          opacity: arrow,
          textShadow: shadow,
        }}
      >
        &gt;
      </span>
      <span
        style={{
          ...glyph,
          color: bracketColor,
          translate: `calc(-50% + ${gap}px) -50%`,
          textShadow: shadow,
        }}
      >
        ]
      </span>
    </div>
  );
};

import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../constants/colors";
import { FONT_SANS } from "../../constants/fonts";
import { EASE, progress } from "../../utils/anim";

/**
 * Kinetic headline: words rise out of a clipping mask one after another.
 * `wordStarts` gives each word its own start frame so words can land on the
 * spoken syllable; `highlight` maps word index → colour.
 */
export const WordReveal: React.FC<{
  readonly words: readonly string[];
  readonly wordStarts: readonly number[];
  readonly fontSize: number;
  readonly color?: string;
  readonly weight?: number;
  readonly fontFamily?: string;
  readonly letterSpacing?: string;
  readonly highlight?: Readonly<Record<number, string>>;
  readonly duration?: number;
  /** Word indices that land with a hard stop instead of easing in. */
  readonly snapWords?: readonly number[];
  readonly style?: React.CSSProperties;
}> = ({
  words,
  wordStarts,
  fontSize,
  color = COLORS.text,
  weight = 800,
  fontFamily = FONT_SANS,
  letterSpacing = "-0.04em",
  highlight = {},
  duration = 9,
  snapWords = [],
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: fontSize * 0.26,
        fontFamily,
        fontWeight: weight,
        fontSize,
        letterSpacing,
        lineHeight: 1.08,
        color,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const snap = snapWords.includes(i);
        const p = progress(frame, wordStarts[i] ?? 0, snap ? 2 : duration, snap ? EASE.snap : EASE.out);
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: fontSize * 0.08,
              marginBottom: -fontSize * 0.08,
            }}
          >
            <span
              style={{
                display: "inline-block",
                translate: `0 ${(1 - p) * 105}%`,
                color: highlight[i] ?? color,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};

import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";
import { EASE, progress } from "../../utils/anim";

/**
 * Characters resolve left → right while tracking tightens from wide to
 * final. Used for the KATAKATING wordmark.
 */
export const TrackingReveal: React.FC<{
  readonly text: string;
  readonly start: number;
  readonly fontSize: number;
  readonly duration?: number;
  readonly stagger?: number;
  readonly fromTracking?: number;
  readonly toTracking?: number;
  readonly color?: string;
  readonly weight?: number;
  readonly fontFamily?: string;
  readonly style?: React.CSSProperties;
}> = ({
  text,
  start,
  fontSize,
  duration = 18,
  stagger = 1.5,
  fromTracking = 0.6,
  toTracking = 0.08,
  color = COLORS.text,
  weight = 700,
  fontFamily = FONT_MONO,
  style,
}) => {
  const frame = useCurrentFrame();
  const track = progress(frame, start, duration + text.length * stagger, EASE.out);
  return (
    <div
      style={{
        fontFamily,
        fontWeight: weight,
        fontSize,
        color,
        whiteSpace: "pre",
        lineHeight: 1,
        letterSpacing: `${fromTracking + (toTracking - fromTracking) * track}em`,
        ...style,
      }}
    >
      {text.split("").map((ch, i) => {
        const p = progress(frame, start + i * stagger, 6, EASE.snap);
        return (
          <span key={i} style={{ opacity: p, display: "inline-block", translate: `0 ${(1 - p) * 0.25}em` }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

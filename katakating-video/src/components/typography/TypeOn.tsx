import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";
import { typedCount } from "../../utils/anim";
import { Caret } from "./Caret";

/**
 * Terminal-style type-on. The caret stays solid while typing and blinks
 * once the line is complete (unless `caretAfter` is false).
 */
export const TypeOn: React.FC<{
  readonly text: string;
  readonly start: number;
  readonly charsPerFrame?: number;
  readonly fontSize: number;
  readonly color?: string;
  readonly weight?: number;
  readonly fontFamily?: string;
  readonly caret?: boolean;
  readonly caretAfter?: boolean;
  readonly caretColor?: string;
  readonly style?: React.CSSProperties;
}> = ({
  text,
  start,
  charsPerFrame = 0.9,
  fontSize,
  color = COLORS.text,
  weight = 500,
  fontFamily = FONT_MONO,
  caret = true,
  caretAfter = true,
  caretColor = COLORS.green,
  style,
}) => {
  const frame = useCurrentFrame();
  const count = typedCount(frame, start, text.length, charsPerFrame);
  const typing = frame >= start && count < text.length;
  const done = count >= text.length;
  const showCaret = caret && frame >= start - 8 && (!done || caretAfter);
  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: weight,
        color,
        whiteSpace: "pre",
        lineHeight: 1.2,
        ...style,
      }}
    >
      {text.slice(0, count)}
      {showCaret ? (
        <Caret
          height={Math.round(fontSize * 0.95)}
          color={caretColor}
          solid={typing}
          style={{ marginLeft: fontSize * 0.08, translate: `0 -${fontSize * 0.06}px` }}
        />
      ) : null}
    </div>
  );
};

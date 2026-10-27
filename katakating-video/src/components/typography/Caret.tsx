import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../constants/colors";
import { blink } from "../../utils/anim";

/**
 * Terminal block caret. Blinks deterministically from the frame number;
 * `solid` holds it on (e.g. while typing).
 */
export const Caret: React.FC<{
  readonly height: number;
  readonly width?: number;
  readonly color?: string;
  readonly solid?: boolean;
  readonly style?: React.CSSProperties;
}> = ({ height, width, color = COLORS.green, solid = false, style }) => {
  const frame = useCurrentFrame();
  const on = solid ? 1 : blink(frame);
  return (
    <span
      style={{
        display: "inline-block",
        width: width ?? Math.round(height * 0.55),
        height,
        background: color,
        opacity: on,
        verticalAlign: "middle",
        ...style,
      }}
    />
  );
};

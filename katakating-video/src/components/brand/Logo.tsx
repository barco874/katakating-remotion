import React from "react";
import { Img, staticFile } from "remotion";

/** Official logo file, used as-is (never redrawn). viewBox 135.9 × 82.22. */
export const LOGO_SRC = staticFile("brand/logo-katakating-white.svg");
export const LOGO_ASPECT = 135.9 / 82.22;

export const Logo: React.FC<{
  readonly height: number;
  readonly style?: React.CSSProperties;
}> = ({ height, style }) => (
  <Img
    src={LOGO_SRC}
    style={{
      height,
      width: height * LOGO_ASPECT,
      display: "block",
      flexShrink: 0,
      ...style,
    }}
  />
);

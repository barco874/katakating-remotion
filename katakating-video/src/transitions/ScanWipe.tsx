import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../constants/colors";
import { WIDTH } from "../constants/video";

/**
 * A single green scan line sweeping left → right.
 * - mode "cover":  the frame behind the line is wiped to background.
 * - mode "reveal": the frame ahead of the line is still background.
 * Used as a pair across a scene boundary so the line travels continuously.
 */
export const ScanWipe: React.FC<{ readonly progress: number; readonly mode: "cover" | "reveal" }> = ({ progress, mode }) => {
  if (progress <= 0 || progress >= 1) {
    return mode === "cover" && progress >= 1 ? <AbsoluteFill style={{ background: COLORS.bg }} /> : null;
  }
  const x = progress * WIDTH;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: mode === "cover" ? 0 : x,
          width: mode === "cover" ? x : WIDTH - x,
          background: COLORS.bg,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: x - 1,
          width: 2,
          background: COLORS.green,
          boxShadow: `0 0 24px 4px ${COLORS.greenGlow}`,
        }}
      />
    </AbsoluteFill>
  );
};

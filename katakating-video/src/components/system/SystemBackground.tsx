import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../constants/colors";
import { gridBackground } from "../ui/primitives";

/**
 * Persistent backdrop: near-black with the same fine grid used on the
 * website's note covers, faded towards the edges. Static on purpose:
 * motion lives in the content, not the background.
 */
export const SystemBackground: React.FC<{ readonly gridOpacity?: number }> = ({
  gridOpacity = 1,
}) => (
  <AbsoluteFill style={{ background: COLORS.bg }}>
    <AbsoluteFill
      style={{
        ...gridBackground(48, "rgba(255,255,255,0.035)"),
        opacity: gridOpacity,
        maskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, #000 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, #000 30%, transparent 100%)",
      }}
    />
  </AbsoluteFill>
);

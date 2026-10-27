/**
 * Palette sampled from the live KATAKATING website (dark mode) plus the
 * brand accent from the master brief.
 *
 * GREEN is the brand accent. Keep it controlled: reveal, highlight,
 * cursor/selection, active node, transitions and the final brand moment.
 * Everything else stays monochrome like the website.
 */
export const COLORS = {
  // Surfaces (sampled from screenshots)
  bg: "#090A0D",
  bgDeep: "#050506",
  surface: "#111318",
  surfaceRaised: "#181B22",
  border: "#22252D",
  borderStrong: "#30343D",

  // Text
  text: "#F4F4F5",
  textSoft: "#C9CBD1",
  textMuted: "#8B9099",
  textDim: "#5A5F69",

  // Brand accent
  green: "#00FF66",
  greenSoft: "rgba(0, 255, 102, 0.16)",
  greenGlow: "rgba(0, 255, 102, 0.35)",

  // Functional (terminal only, used sparingly)
  error: "#FF5F57",
  warn: "#FEBC2E",
  ok: "#28C840",
} as const;

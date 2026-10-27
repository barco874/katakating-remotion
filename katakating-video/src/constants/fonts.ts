import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT_MONO = "JetBrains Mono";
export const FONT_SANS = "Inter";

const WEIGHTS = ["400", "500", "600", "700", "800"] as const;

/**
 * Fonts are bundled locally in public/fonts so rendering never depends on
 * the network. loadFont() blocks rendering until each file is ready.
 */
export const fontsReady = Promise.all(
  WEIGHTS.flatMap((weight) => [
    loadFont({
      family: FONT_MONO,
      url: staticFile(`fonts/JetBrainsMono-${weight}.woff2`),
      weight,
    }),
    loadFont({
      family: FONT_SANS,
      url: staticFile(`fonts/Inter-${weight}.woff2`),
      weight,
    }),
  ]),
);

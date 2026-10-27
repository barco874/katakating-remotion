import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";
import { HEIGHT, WIDTH } from "../constants/video";
import { BracketMark } from "../components/brand/BracketMark";
import { Caret } from "../components/typography/Caret";
import { TypeOn } from "../components/typography/TypeOn";
import { BRAND_ROW_WIDTH, BrandRow, Navbar } from "../components/ui/Navbar";
import { BROWSER, BrowserWindow, pageToScreen } from "../components/window/BrowserWindow";
import { BEATS, local } from "../timing/beats";
import { SCENES } from "../timing/scenes";
import { EASE, lerp, mapClamp, progress } from "../utils/anim";

const B = local(BEATS.reveal, SCENES.reveal.from);
const LOCKUP_SCALE = 4.6;
const SUBLINE = "Knowledge Hub mahasiswa Universitas Boash.";

/**
 * 00:30 – KATAKATING REVEAL. The caret left by the previous scene becomes
 * `[>]`, the wordmark resolves, then the lockup docks into the website
 * header as the browser builds around it.
 */
export const SceneReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const open = progress(frame, B.bracketsOpen, 12, EASE.out);
  const arrow = progress(frame, B.markLock, 3, EASE.snap);
  const glow = arrow * (1 - progress(frame, B.markLock + 2, 36, EASE.out) * 0.75);
  const lift = progress(frame, B.wordmark - 4, 14, EASE.inOut);

  const chars = progress(frame, B.wordmark, 14, EASE.out);
  const logo = progress(frame, B.wordmark - 2, 8, EASE.out);
  const badge = progress(frame, B.subline - 2, 10, EASE.snap);

  const dock = progress(frame, B.dock, 22, EASE.inOut);
  const build = progress(frame, B.dock + 2, 18, EASE.out);
  const fadeExtras = 1 - progress(frame, B.dock - 4, 8, EASE.in);

  // Lockup: centred in the frame (width grows as the badge opens) → navbar position.
  const startW = lerp(BRAND_ROW_WIDTH.logoAndWordmark, BRAND_ROW_WIDTH.full, badge) * LOCKUP_SCALE;
  const startLeft = WIDTH / 2 - startW / 2;
  const startY = HEIGHT / 2 + 70;
  const nav = pageToScreen(233, 30);
  const scale = lerp(LOCKUP_SCALE, BROWSER.scale, dock);
  const left = lerp(startLeft, nav.x, dock);
  const centerY = lerp(startY, nav.y, dock);

  return (
    <AbsoluteFill>
      {/* Browser builds around the docking lockup (navbar brand hidden; the lockup IS the brand). */}
      {build > 0 ? (
        <BrowserWindow build={build}>
          <Navbar hideBrand />
        </BrowserWindow>
      ) : null}

      {/* Caret → [>] */}
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2,
          top: HEIGHT / 2 - lift * 210,
          translate: "-50% -50%",
          scale: String(1 - lift * 0.45),
          opacity: fadeExtras,
        }}
      >
        <BracketMark size={200} open={open} arrow={arrow} glow={glow} />
        {arrow < 1 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              translate: "-50% -50%",
              opacity: frame < B.bracketsOpen ? 1 : 1 - arrow,
            }}
          >
            <Caret height={52 + open * 60} width={28 + open * 16} solid={frame >= B.bracketsOpen} />
          </div>
        ) : null}
      </div>

      {/* KATAKATING lockup (official logo + wordmark + badge) */}
      {frame >= B.wordmark - 2 ? (
        <div style={{ position: "absolute", left, top: centerY, translate: "0 -50%" }}>
          <BrandRow scale={scale} chars={chars} logo={logo} badge={badge} />
        </div>
      ) : null}

      {/* Knowledge Hub mahasiswa Universitas Boash. */}
      {frame >= B.subline - 6 ? (
        <div
          style={{
            position: "absolute",
            left: WIDTH / 2 - (SUBLINE.length * 0.6 * 32) / 2,
            top: startY + 92,
            opacity: fadeExtras * mapClamp(frame, [B.subline - 6, B.subline], [0, 1]),
          }}
        >
          <TypeOn text={SUBLINE} start={B.subline} charsPerFrame={0.75} fontSize={32} color={COLORS.textSoft} weight={500} caretAfter={false} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

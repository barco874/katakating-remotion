import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";
import { HEIGHT, WIDTH } from "../../constants/video";
import { LockIcon } from "../icons/Icons";

/**
 * Browser frame. Its page content is laid out at native website size
 * (1920 × PAGE_HEIGHT) and scaled into the frame, so website components
 * keep the exact metrics measured from the screenshots.
 */
export const BROWSER = {
  scale: 0.84,
  chromeHeight: 46,
  pageHeight: 1080,
} as const;

export const BROWSER_FRAME = (() => {
  const w = WIDTH * BROWSER.scale;
  const h = BROWSER.chromeHeight + BROWSER.pageHeight * BROWSER.scale;
  return { x: (WIDTH - w) / 2, y: (HEIGHT - h) / 2, w, h };
})();

/** Map a native page coordinate to a composition coordinate. */
export const pageToScreen = (px: number, py: number) => ({
  x: BROWSER_FRAME.x + px * BROWSER.scale,
  y: BROWSER_FRAME.y + BROWSER.chromeHeight + py * BROWSER.scale,
});

export const BrowserWindow: React.FC<{
  readonly url?: string;
  readonly children: React.ReactNode;
  /** 0→1 frame build-in (border draws, chrome appears). */
  readonly build?: number;
  readonly style?: React.CSSProperties;
}> = ({ url = "katakating.pages.dev", children, build = 1, style }) => (
  <div
    style={{
      position: "absolute",
      left: BROWSER_FRAME.x,
      top: BROWSER_FRAME.y,
      width: BROWSER_FRAME.w,
      height: BROWSER_FRAME.h,
      borderRadius: 12,
      border: `1px solid ${COLORS.borderStrong}`,
      background: COLORS.bg,
      overflow: "hidden",
      clipPath: `inset(0 ${(1 - build) * 50}% 0 ${(1 - build) * 50}% round 12px)`,
      boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
      ...style,
    }}
  >
    <div
      style={{
        height: BROWSER.chromeHeight,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 18px",
        background: COLORS.bgDeep,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 11, height: 11, borderRadius: 99, background: COLORS.borderStrong }} />
      ))}
      <div
        style={{
          marginLeft: 18,
          flex: 1,
          maxWidth: 560,
          height: 28,
          borderRadius: 6,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          fontFamily: FONT_MONO,
          fontSize: 13,
          color: COLORS.textMuted,
        }}
      >
        <LockIcon size={12} />
        {url}
      </div>
    </div>
    <div
      style={{
        position: "relative",
        width: WIDTH,
        height: BROWSER.pageHeight,
        scale: String(BROWSER.scale),
        transformOrigin: "0 0",
        overflow: "hidden",
        background: COLORS.bg,
      }}
    >
      {children}
    </div>
  </div>
);

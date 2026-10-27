import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";
import { NAV_LINKS } from "../../data/site";
import { Logo } from "../brand/Logo";
import { GraphIcon, LoginIcon, SunIcon } from "../icons/Icons";

/** Website layout metrics (native px at 1920 wide, from the screenshots). */
export const SITE = {
  navHeight: 60,
  contentLeft: 233,
  contentWidth: 1450,
  logoHeight: 17,
  logoTop: 21,
} as const;

/**
 * Native width of BrandRow parts at scale 1 (JetBrains Mono advance = 0.6em).
 * Used to centre the large reveal lockup before it docks into the navbar.
 */
export const BRAND_ROW_WIDTH = {
  logoAndWordmark: 17 * (135.9 / 82.22) + 10 + 10 * (15 * 0.6 + 15 * 0.08),
  full: 17 * (135.9 / 82.22) + 10 + 10 * (15 * 0.6 + 15 * 0.08) + 10 + 13 * (12 * 0.6 + 12 * 0.06) + 18,
} as const;

/** Brand row exactly as it appears in the website header. */
export const BrandRow: React.FC<{
  readonly scale?: number;
  readonly badge?: number;
  /** 0→1 left-to-right reveal of the wordmark characters. */
  readonly chars?: number;
  readonly logo?: number;
  readonly style?: React.CSSProperties;
}> = ({ scale = 1, badge = 1, chars = 1, logo = 1, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10 * scale,
      ...style,
    }}
  >
    <Logo height={SITE.logoHeight * scale} style={{ opacity: logo }} />
    <span
      style={{
        fontFamily: FONT_MONO,
        fontWeight: 700,
        fontSize: 15 * scale,
        letterSpacing: "0.08em",
        color: COLORS.text,
      }}
    >
      {"KATAKATING".split("").map((ch, i) => (
        <span key={i} style={{ opacity: chars * 10 - i >= 1 ? 1 : 0 }}>
          {ch}
        </span>
      ))}
    </span>
    <span
      style={{
        fontFamily: FONT_MONO,
        fontWeight: 700,
        fontSize: 12 * scale,
        letterSpacing: "0.06em",
        color: COLORS.text,
        border: `${Math.max(1, scale)}px solid ${COLORS.borderStrong}`,
        borderRadius: 6 * scale,
        padding: `${4 * scale}px ${8 * scale}px`,
        opacity: badge,
        clipPath: `inset(0 ${(1 - badge) * 100}% 0 0)`,
      }}
    >
      KNOWLEDGE HUB
    </span>
  </div>
);

export const Navbar: React.FC<{
  readonly active?: (typeof NAV_LINKS)[number];
  readonly hideBrand?: boolean;
}> = ({ active = "Semua Catatan", hideBrand = false }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      height: SITE.navHeight,
      borderBottom: `1px solid ${COLORS.border}`,
      background: COLORS.surface,
      display: "flex",
      alignItems: "center",
      padding: `0 ${1920 - SITE.contentLeft - SITE.contentWidth}px 0 ${SITE.contentLeft}px`,
    }}
  >
    <BrandRow style={{ opacity: hideBrand ? 0 : 1 }} />
    <div style={{ flex: 1 }} />
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      {NAV_LINKS.map((link) => (
        <span
          key={link}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 15,
            color: link === active ? COLORS.text : COLORS.textMuted,
          }}
        >
          {link}
        </span>
      ))}
      <GraphIcon size={20} color={COLORS.textMuted} />
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 42,
          padding: "0 14px",
          border: `1px solid ${COLORS.borderStrong}`,
          borderRadius: 6,
          fontFamily: FONT_MONO,
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "0.08em",
          color: COLORS.text,
        }}
      >
        <LoginIcon size={15} />
        MASUK
      </span>
      <span
        style={{
          width: 40,
          height: 40,
          display: "grid",
          placeItems: "center",
          border: `1px solid ${COLORS.borderStrong}`,
          borderRadius: 6,
          marginLeft: -20,
        }}
      >
        <SunIcon size={18} color={COLORS.text} />
      </span>
    </div>
  </div>
);

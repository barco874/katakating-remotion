import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";

/** Small building blocks shared by the website reconstruction. */

export const Tag: React.FC<{
  readonly children: React.ReactNode;
  readonly active?: boolean;
  readonly size?: number;
}> = ({ children, active = false, size = 12 }) => (
  <span
    style={{
      fontFamily: FONT_MONO,
      fontSize: size,
      color: active ? COLORS.text : COLORS.textMuted,
      border: `1px solid ${active ? COLORS.green : COLORS.borderStrong}`,
      background: active ? COLORS.greenSoft : COLORS.surfaceRaised,
      borderRadius: 5,
      padding: `${size * 0.3}px ${size * 0.75}px`,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

export const IconPill: React.FC<{
  readonly icon: React.ReactNode;
  readonly label?: string;
}> = ({ icon, label }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 26,
      padding: "0 9px",
      border: `1px solid ${COLORS.borderStrong}`,
      borderRadius: 6,
      color: COLORS.textMuted,
      fontFamily: FONT_MONO,
      fontSize: 12,
    }}
  >
    {icon}
    {label}
  </span>
);

export const OutlineButton: React.FC<{
  readonly children: React.ReactNode;
  readonly height?: number;
  readonly fontSize?: number;
  readonly active?: number;
  readonly style?: React.CSSProperties;
}> = ({ children, height = 34, fontSize = 13, active = 0, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height,
      padding: `0 ${fontSize}px`,
      border: `1px solid ${active > 0.5 ? COLORS.green : COLORS.borderStrong}`,
      background: active > 0 ? `rgba(0,255,102,${0.14 * active})` : COLORS.bg,
      borderRadius: 6,
      color: COLORS.text,
      fontFamily: FONT_MONO,
      fontWeight: 700,
      fontSize,
      letterSpacing: "0.04em",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

/** `// LABEL` style eyebrow used across the site. */
export const Eyebrow: React.FC<{
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({ children, size = 15, color = COLORS.text, style }) => (
  <div
    style={{
      fontFamily: FONT_MONO,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "0.22em",
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Muted, widely tracked section label ("BARU DITAMBAHKAN", "SEMUA CATATAN"). */
export const SectionLabel: React.FC<{
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      fontFamily: FONT_MONO,
      fontSize: 13,
      letterSpacing: "0.28em",
      color: COLORS.textDim,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Fine grid pattern used on note covers and as the system background. */
export const gridBackground = (cell: number, line = "rgba(255,255,255,0.045)") =>
  ({
    backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
    backgroundSize: `${cell}px ${cell}px`,
  }) as const;

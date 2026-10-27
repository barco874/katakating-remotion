import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO, FONT_SANS } from "../../constants/fonts";
import { BookmarkIcon, HeartIcon, PrintIcon, ShareIcon } from "../icons/Icons";
import { Eyebrow } from "./primitives";

/**
 * Article header in the layout of the website's note page (MENU PANDUAN
 * screenshots): `[>]` breadcrumb, `// KODE` eyebrow, large title, meta,
 * hashtags and the SUKA / SIMPAN / BAGIKAN / CETAK / PDF actions.
 */
export const ARTICLE = {
  left: 445,
  width: 1025,
} as const;

export const ArticleHeader: React.FC<{
  readonly crumbs: readonly string[];
  readonly eyebrow: string;
  readonly title: string;
  readonly contributor: string;
  readonly date: string;
  readonly minutes: number;
  readonly tags: readonly string[];
  /** 0→1 staggered build of header rows. */
  readonly build?: number;
}> = ({ crumbs, eyebrow, title, contributor, date, minutes, tags, build = 1 }) => {
  const row = (i: number): React.CSSProperties => {
    const p = Math.max(0, Math.min(1, build * 6 - i));
    return { opacity: p, translate: `0 ${(1 - p) * 14}px` };
  };
  return (
    <div style={{ width: ARTICLE.width }}>
      <div style={{ ...row(0), display: "flex", gap: 12, fontFamily: FONT_MONO, fontSize: 15, color: COLORS.textMuted }}>
        <span style={{ color: COLORS.green }}>[&gt;]</span>
        {crumbs.map((c, i) => (
          <React.Fragment key={c}>
            {i > 0 ? <span style={{ color: COLORS.textDim }}>/</span> : null}
            <span style={i === crumbs.length - 1 ? { color: COLORS.text, fontWeight: 700 } : undefined}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <Eyebrow size={15} style={{ ...row(1), marginTop: 40 }}>
        {eyebrow}
      </Eyebrow>
      <div
        style={{
          ...row(2),
          marginTop: 30,
          fontFamily: FONT_SANS,
          fontWeight: 800,
          fontSize: 50,
          letterSpacing: "-0.035em",
          lineHeight: 1.14,
          color: COLORS.text,
        }}
      >
        {title}
      </div>
      <div style={{ ...row(3), marginTop: 22, fontFamily: FONT_MONO, fontSize: 14, color: COLORS.textMuted, display: "flex", gap: 14 }}>
        <span>
          Kontributor:<b style={{ color: COLORS.textSoft }}>{contributor}</b>
        </span>
        <span>{date}</span>
        <span>•</span>
        <span>{minutes} menit baca</span>
      </div>
      <div style={{ ...row(4), marginTop: 16, display: "flex", gap: 8 }}>
        {tags.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 13,
              color: COLORS.textMuted,
              border: `1px solid ${COLORS.borderStrong}`,
              background: COLORS.surfaceRaised,
              borderRadius: 5,
              padding: "4px 9px",
            }}
          >
            #{t}
          </span>
        ))}
      </div>
      <div
        style={{
          ...row(5),
          marginTop: 26,
          padding: "20px 0",
          borderTop: `1px solid ${COLORS.border}`,
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          gap: 10,
        }}
      >
        {[
          { icon: <HeartIcon size={15} />, label: "SUKA ( 0 )" },
          { icon: <BookmarkIcon size={15} />, label: "SIMPAN" },
          { icon: <ShareIcon size={15} />, label: "BAGIKAN" },
          { icon: <PrintIcon size={15} />, label: "CETAK / PDF" },
        ].map((a) => (
          <span
            key={a.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              height: 40,
              padding: "0 18px",
              border: `1px solid ${COLORS.borderStrong}`,
              borderRadius: 6,
              fontFamily: FONT_MONO,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.12em",
              color: COLORS.textSoft,
            }}
          >
            {a.icon}
            {a.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export const ArticleHeading: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: FONT_SANS,
      fontWeight: 700,
      fontSize: 28,
      letterSpacing: "-0.02em",
      color: COLORS.text,
      paddingBottom: 14,
      borderBottom: `1px solid ${COLORS.border}`,
    }}
  >
    {children}
  </div>
);

export const ArticleParagraph: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONT_SANS, fontSize: 19, lineHeight: 1.7, color: COLORS.textSoft }}>{children}</div>
);

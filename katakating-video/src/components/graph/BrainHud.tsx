import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";
import { BRAIN } from "../../data/site";

/**
 * Interface chrome around the graph, reconstructed from THE BRAIN page:
 * title bar with ONLINE badge, VITALS (left), INSPECTOR + THOUGHT STREAM
 * (right), legend and key hints (bottom). Copy is verbatim from the site.
 */
const panel: React.CSSProperties = {
  position: "absolute",
  background: "rgba(17,19,24,0.86)",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  padding: "20px 22px",
  fontFamily: FONT_MONO,
};

const heading: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 15,
  letterSpacing: "0.12em",
  color: COLORS.text,
  marginBottom: 16,
};

export const THOUGHT_STREAM = [
  "Publikasi terindeks: \"Standar Baku Format Margin Laporan Praktikum & TA (4-4-3-3)\" · 2026-09-21",
  "Publikasi terindeks: \"Setup Lengkap WSL2 Ubuntu 24.04 untuk Web Development\" · 2026-09-21",
  "Publikasi terindeks: \"Konfigurasi Inter-VLAN Routing & Trunking pada Cisco Packet Tracer\" · 2026-09-21",
] as const;

export const BrainHud: React.FC<{
  /** 0→1 panels slide in. */
  readonly enter: number;
  /** 0→1 vitals count up. */
  readonly count: number;
  /** 0→1 inspector locks onto the selected organ. */
  readonly locked: number;
  readonly lockedLabel: string;
}> = ({ enter, count, locked, lockedLabel }) => {
  const slide = (dir: number): React.CSSProperties => ({ opacity: enter, translate: `${(1 - enter) * 40 * dir}px 0` });
  return (
    <>
      {/* Title bar */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 34,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: FONT_MONO,
          opacity: enter,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 24, letterSpacing: "0.1em", color: COLORS.text }}>{BRAIN.title}</span>
        <span
          style={{
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.12em",
            color: COLORS.green,
            border: `1px solid ${COLORS.green}`,
            background: COLORS.greenSoft,
            borderRadius: 5,
            padding: "4px 9px",
          }}
        >
          ONLINE
        </span>
        <span style={{ fontSize: 15, color: COLORS.textMuted }}>PUBLISHED SNAPSHOT · katalog terverifikasi</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, border: `1px solid ${COLORS.borderStrong}`, borderRadius: 6, padding: "8px 14px" }}>
          [↻ REPLAY]
        </span>
      </div>

      {/* VITALS */}
      <div style={{ ...panel, left: 40, top: 110, width: 330, ...slide(-1) }}>
        <div style={heading}>VITALS</div>
        {BRAIN.vitals.map((v) => (
          <div key={v.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: COLORS.textMuted, marginBottom: 12 }}>
            <span>{v.label}</span>
            <span style={{ color: COLORS.text, fontWeight: 700 }}>{Math.round(v.value * count)}</span>
          </div>
        ))}
      </div>

      {/* INSPECTOR + THOUGHT STREAM */}
      <div style={{ ...panel, right: 40, top: 110, width: 380, ...slide(1) }}>
        <div style={heading}>INSPECTOR</div>
        {locked < 0.5 ? (
          <div style={{ fontSize: 15, lineHeight: 1.55, color: COLORS.textMuted }}>
            Arahkan kursor ke sebuah memori untuk inspeksi — klik untuk mengunci pilihan.
          </div>
        ) : (
          <div style={{ fontSize: 15, lineHeight: 1.55, color: COLORS.textMuted }}>
            <div style={{ color: COLORS.green, fontWeight: 700, letterSpacing: "0.1em", fontSize: 13 }}>LOCKED · ORGAN</div>
            <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 19, marginTop: 6 }}>{lockedLabel}</div>
          </div>
        )}
        <div style={{ ...heading, marginTop: 26 }}>THOUGHT STREAM</div>
        {THOUGHT_STREAM.map((t, i) => (
          <div
            key={t}
            style={{
              fontSize: 14,
              lineHeight: 1.5,
              color: i === 0 && locked > 0.5 ? COLORS.text : COLORS.textMuted,
              borderLeft: `2px solid ${i === 0 && locked > 0.5 ? COLORS.green : COLORS.borderStrong}`,
              padding: "6px 0 6px 12px",
              marginBottom: 10,
            }}
          >
            σ {t}
          </div>
        ))}
      </div>

      {/* Legend + key hints */}
      <div style={{ position: "absolute", left: 40, bottom: 34, display: "flex", gap: 10, fontFamily: FONT_MONO, fontSize: 15, color: COLORS.text, opacity: enter }}>
        {BRAIN.legend.map((l) => (
          <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 12px", background: COLORS.surface }}>
            <span style={{ width: 9, height: 9, borderRadius: l === "author" ? 0 : 99, background: COLORS.text, rotate: l === "author" ? "45deg" : undefined }} />
            {l}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 40, fontFamily: FONT_MONO, fontSize: 14, color: COLORS.textMuted, opacity: enter }}>
        hover = inspect · click = lock · R = replay · drag = pan
      </div>
    </>
  );
};

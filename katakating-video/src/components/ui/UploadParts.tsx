import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO, FONT_SANS } from "../../constants/fonts";
import { CheckIcon, FileUpIcon } from "../icons/Icons";
import { Caret } from "../typography/Caret";

/** Format badge (DOCX / TXT / MD / PDF) in the website's style. */
export const FormatBadge: React.FC<{
  readonly ext: string;
  readonly size?: number;
  readonly active?: boolean;
}> = ({ ext, size = 14, active = false }) => (
  <span
    style={{
      fontFamily: FONT_MONO,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "0.06em",
      color: active ? COLORS.green : COLORS.text,
      background: COLORS.bgDeep,
      border: `1px solid ${active ? COLORS.green : COLORS.borderStrong}`,
      borderRadius: 6,
      padding: `${size * 0.45}px ${size * 0.75}px`,
    }}
  >
    {ext}
  </span>
);

/** Template card from "// UNDUH BERKAS TEMPLATE". */
export const TemplateCard: React.FC<{
  readonly ext: string;
  readonly label: string;
  readonly sub: string;
  readonly width?: number;
  readonly active?: boolean;
  readonly style?: React.CSSProperties;
}> = ({ ext, label, sub, width = 286, active = false, style }) => (
  <div
    style={{
      width,
      height: 160,
      borderRadius: 8,
      border: `1px solid ${active ? COLORS.green : COLORS.borderStrong}`,
      background: COLORS.surfaceRaised,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      ...style,
    }}
  >
    <FormatBadge ext={ext} active={active} />
    <span style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 21, color: COLORS.text }}>{label}</span>
    <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: COLORS.textMuted }}>{sub}</span>
  </div>
);

/** Drag & drop zone, verbatim copy from the Upload page. */
export const Dropzone: React.FC<{
  readonly width: number;
  readonly active?: number;
  readonly children?: React.ReactNode;
}> = ({ width, active = 0, children }) => (
  <div
    style={{
      width,
      height: 284,
      borderRadius: 8,
      border: `2px dashed ${active > 0.5 ? COLORS.green : COLORS.borderStrong}`,
      background: active > 0 ? `rgba(0,255,102,${0.05 * active})` : "transparent",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      position: "relative",
    }}
  >
    <span
      style={{
        width: 58,
        height: 58,
        borderRadius: 8,
        border: `1px solid ${active > 0.5 ? COLORS.green : COLORS.borderStrong}`,
        display: "grid",
        placeItems: "center",
        background: COLORS.bg,
      }}
    >
      <FileUpIcon size={26} color={active > 0.5 ? COLORS.green : COLORS.text} />
    </span>
    <span style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 19, color: COLORS.text, letterSpacing: "0.03em" }}>
      Tarik &amp; Lepaskan Berkas ke Sini
    </span>
    <span style={{ fontFamily: FONT_SANS, fontSize: 16, color: COLORS.textMuted }}>DOCX, PDF, TXT, MD • Maks. 10 MB</span>
    <span
      style={{
        marginTop: 8,
        fontFamily: FONT_MONO,
        fontWeight: 700,
        fontSize: 15,
        color: COLORS.text,
        border: `1px solid ${COLORS.borderStrong}`,
        borderRadius: 6,
        padding: "9px 20px",
      }}
    >
      Pilih Berkas dari Perangkat
    </span>
    {children}
  </div>
);

/** File chip being dragged into the dropzone. */
export const FileChip: React.FC<{
  readonly name: string;
  readonly ext: string;
  readonly done?: number;
  readonly style?: React.CSSProperties;
}> = ({ name, ext, done = 0, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 18px 12px 12px",
      borderRadius: 8,
      background: COLORS.surfaceRaised,
      border: `1px solid ${done > 0.5 ? COLORS.green : COLORS.borderStrong}`,
      boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
      ...style,
    }}
  >
    <FormatBadge ext={ext} size={13} active={done > 0.5} />
    <span style={{ fontFamily: FONT_MONO, fontSize: 16, color: COLORS.text }}>{name}</span>
    {done > 0.5 ? <CheckIcon size={18} color={COLORS.green} /> : null}
  </div>
);

/** Metadata field (label + value with type-on). */
export const FormField: React.FC<{
  readonly label: string;
  readonly value: string;
  readonly visible: number;
  readonly typing: boolean;
  readonly focused: boolean;
  readonly width: number;
}> = ({ label, value, visible, typing, focused, width }) => (
  <div style={{ width }}>
    <div style={{ fontFamily: FONT_MONO, fontSize: 13, letterSpacing: "0.14em", color: COLORS.textMuted, marginBottom: 8 }}>
      {label.toUpperCase()}
    </div>
    <div
      style={{
        height: 50,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        borderRadius: 6,
        border: `1px solid ${focused ? COLORS.green : COLORS.borderStrong}`,
        background: COLORS.bg,
        fontFamily: FONT_MONO,
        fontSize: 17,
        color: COLORS.text,
        whiteSpace: "pre",
      }}
    >
      {value.slice(0, visible)}
      {focused ? <Caret height={20} width={2} solid={typing} style={{ marginLeft: 2 }} /> : null}
    </div>
  </div>
);

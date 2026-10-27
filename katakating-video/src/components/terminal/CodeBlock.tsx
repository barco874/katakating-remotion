import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";
import { CopyIcon } from "../icons/Icons";

export type CodeLine = {
  readonly text: string;
  readonly color?: string;
};

/**
 * Code block in the website's style (●●● BASH header, SALIN button).
 * Also used as the generic terminal window across the video.
 *
 * - `visibleChars`: total characters revealed across lines (type-on).
 * - `highlightLine` + `highlight`: green selection bar on one line.
 */
export const CodeBlock: React.FC<{
  readonly lines: readonly CodeLine[];
  readonly width: number;
  readonly label?: string;
  readonly fontSize?: number;
  readonly visibleChars?: number;
  readonly highlightLine?: number;
  readonly highlight?: number;
  readonly showCopy?: boolean;
  readonly minLines?: number;
  readonly style?: React.CSSProperties;
}> = ({
  lines,
  width,
  label = "BASH",
  fontSize = 17,
  visibleChars = Infinity,
  highlightLine = -1,
  highlight = 0,
  showCopy = true,
  minLines = 0,
  style,
}) => {
  let remaining = visibleChars;
  const lineHeight = fontSize * 1.6;
  return (
    <div
      style={{
        width,
        background: COLORS.surface,
        border: `1px solid ${COLORS.borderStrong}`,
        borderRadius: 8,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          height: fontSize * 2.5,
          padding: `0 ${fontSize}px`,
          borderBottom: `1px solid ${COLORS.border}`,
          fontFamily: FONT_MONO,
          fontSize: fontSize * 0.78,
          letterSpacing: "0.12em",
          color: COLORS.textMuted,
        }}
      >
        {[COLORS.error, COLORS.warn, COLORS.ok].map((c) => (
          <span key={c} style={{ width: fontSize * 0.5, height: fontSize * 0.5, borderRadius: 99, background: c }} />
        ))}
        <span style={{ marginLeft: 6 }}>{label}</span>
        <span style={{ flex: 1 }} />
        {showCopy ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: `1px solid ${COLORS.borderStrong}`,
              borderRadius: 5,
              padding: "4px 9px",
              fontWeight: 700,
              color: COLORS.textSoft,
            }}
          >
            <CopyIcon size={fontSize * 0.75} /> SALIN
          </span>
        ) : null}
      </div>
      <div
        style={{
          padding: `${fontSize * 1.2}px ${fontSize * 1.3}px`,
          fontFamily: FONT_MONO,
          fontSize,
          minHeight: minLines * lineHeight + fontSize * 2.4,
        }}
      >
        {lines.map((line, i) => {
          const shown = Math.max(0, Math.min(line.text.length, remaining));
          remaining -= line.text.length;
          const isHi = i === highlightLine && highlight > 0;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                height: lineHeight,
                lineHeight: `${lineHeight}px`,
                whiteSpace: "pre",
                color: line.color ?? COLORS.textSoft,
              }}
            >
              {isHi ? (
                <div
                  style={{
                    position: "absolute",
                    left: -fontSize * 0.6,
                    top: 0,
                    bottom: 0,
                    width: `calc(${highlight * 100}% + ${fontSize * 1.2}px)`,
                    background: COLORS.greenSoft,
                    borderLeft: `2px solid ${COLORS.green}`,
                  }}
                />
              ) : null}
              <span style={{ position: "relative", color: isHi && highlight > 0.5 ? COLORS.text : undefined }}>
                {line.text.slice(0, shown)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

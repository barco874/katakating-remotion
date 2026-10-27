import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";
import { FILTER_CHIPS, SEARCH_PLACEHOLDER } from "../../data/site";
import { Caret } from "../typography/Caret";
import { ChevronDownIcon, SearchIcon } from "../icons/Icons";

/**
 * "SEMUA CATATAN" search + filter panel. Typed query, focus state and the
 * active chip are driven by props so a scene can animate them.
 */
export const SearchPanel: React.FC<{
  readonly width: number;
  readonly query: string;
  readonly focus: number;
  readonly typing: boolean;
  readonly activeChip: (typeof FILTER_CHIPS)[number];
  readonly chipPress?: number;
}> = ({ width, query, focus, typing, activeChip, chipPress = 0 }) => (
  <div
    style={{
      width,
      border: `1px solid ${focus > 0.5 ? COLORS.green : COLORS.borderStrong}`,
      boxShadow: focus > 0 ? `0 0 0 ${3 * focus}px ${COLORS.greenSoft}` : undefined,
      borderRadius: 8,
      background: COLORS.surface,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 60,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 22px",
          fontFamily: FONT_MONO,
          fontSize: 17,
        }}
      >
        <SearchIcon size={19} color={focus > 0.5 ? COLORS.green : COLORS.textMuted} />
        {query.length > 0 ? (
          <span style={{ color: COLORS.text }}>{query}</span>
        ) : (
          <span style={{ color: COLORS.textMuted }}>{focus > 0.5 ? "" : SEARCH_PLACEHOLDER}</span>
        )}
        {focus > 0.5 ? (
          <Caret height={20} width={2} solid={typing} style={{ marginLeft: -12 }} />
        ) : null}
      </div>
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 22px",
          borderLeft: `1px solid ${COLORS.border}`,
          fontFamily: FONT_MONO,
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "0.06em",
          color: COLORS.text,
        }}
      >
        TERBARU DITAMBAHKAN
        <ChevronDownIcon size={14} color={COLORS.textMuted} />
      </div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 58,
        padding: "0 18px",
        fontFamily: FONT_MONO,
        fontSize: 15,
      }}
    >
      <span style={{ color: COLORS.textDim, marginRight: 8, letterSpacing: "0.08em", fontSize: 13 }}>
        FILTER
      </span>
      {FILTER_CHIPS.map((chip) => {
        const active = chip === activeChip;
        const isNew = active && chip !== "Semua Kategori";
        return (
          <span
            key={chip}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              border: `1px solid ${
                isNew ? COLORS.green : active ? COLORS.text : COLORS.borderStrong
              }`,
              background: isNew ? COLORS.greenSoft : active ? COLORS.surfaceRaised : "transparent",
              color: active ? COLORS.text : COLORS.textMuted,
              fontWeight: active ? 700 : 400,
              scale: isNew ? String(1 - 0.06 * chipPress) : undefined,
            }}
          >
            {chip}
          </span>
        );
      })}
      <span style={{ flex: 1 }} />
      <span
        style={{
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "0.06em",
          color: COLORS.textSoft,
          paddingRight: 10,
        }}
      >
        RESET
      </span>
    </div>
  </div>
);

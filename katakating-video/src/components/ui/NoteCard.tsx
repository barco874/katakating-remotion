import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO, FONT_SANS } from "../../constants/fonts";
import type { Note } from "../../data/site";
import {
  ArrowUpRightIcon,
  BookmarkIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
} from "../icons/Icons";
import { IconPill, OutlineButton, Tag, gridBackground } from "./primitives";

/**
 * Note card as rendered on the website: grid cover with a 4-letter code,
 * mono title, author/category meta, description, tags and footer.
 * `highlight` (0→1) draws the green selection state.
 */
export const NoteCard: React.FC<{
  readonly note: Note;
  readonly width: number;
  readonly highlight?: number;
  readonly buttonActive?: number;
  readonly coverHeight?: number;
  readonly style?: React.CSSProperties;
}> = ({ note, width, highlight = 0, buttonActive = 0, coverHeight = 175, style }) => (
  <div
    style={{
      width,
      background: COLORS.surface,
      border: `1px solid ${highlight > 0.5 ? COLORS.green : COLORS.borderStrong}`,
      boxShadow: highlight > 0 ? `0 0 0 ${3 * highlight}px ${COLORS.greenSoft}` : undefined,
      borderRadius: 8,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    <div
      style={{
        height: coverHeight,
        background: COLORS.bgDeep,
        ...gridBackground(22),
        display: "grid",
        placeItems: "center",
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontWeight: 700,
          fontSize: 36,
          letterSpacing: "0.12em",
          color: COLORS.text,
        }}
      >
        {note.code}
      </span>
    </div>
    <div style={{ padding: "20px 20px 0", flex: 1 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div
          style={{
            flex: 1,
            fontFamily: FONT_MONO,
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1.33,
            color: COLORS.text,
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {note.title}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <IconPill icon={<BookmarkIcon size={13} />} label="0" />
          <IconPill icon={<HeartIcon size={13} />} label="0" />
          <IconPill icon={<ShareIcon size={13} />} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONT_MONO,
          fontSize: 13,
          color: COLORS.textMuted,
          marginTop: 10,
        }}
      >
        <span>
          by {note.author}
          {note.category ? ` • ${note.category}` : ""}
        </span>
        <span style={{ color: COLORS.textDim }}>{note.index}</span>
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 15,
          lineHeight: 1.5,
          color: COLORS.textMuted,
          marginTop: 12,
        }}
      >
        {note.description}
      </div>
      <div style={{ display: "flex", gap: 8, margin: "18px 0 20px" }}>
        {note.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 18px",
        borderTop: `1px solid ${COLORS.border}`,
        background: COLORS.surfaceRaised,
        fontFamily: FONT_MONO,
        fontSize: 13,
        color: COLORS.textMuted,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {note.minutes} menit
        <span style={{ color: COLORS.textDim }}>·</span>
        <EyeIcon size={14} /> 0
      </span>
      <OutlineButton height={30} fontSize={13} active={buttonActive}>
        Buka <ArrowUpRightIcon size={12} />
      </OutlineButton>
    </div>
  </div>
);

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";
import { FONT_MONO } from "../constants/fonts";
import { HEIGHT, WIDTH } from "../constants/video";
import { CheckIcon } from "../components/icons/Icons";
import { CodeBlock } from "../components/terminal/CodeBlock";
import { TypeOn } from "../components/typography/TypeOn";
import { WordReveal } from "../components/typography/WordReveal";
import { NoteCard } from "../components/ui/NoteCard";
import { FormatBadge } from "../components/ui/UploadParts";
import { gridBackground } from "../components/ui/primitives";
import { FORMATS, NOTES, type NoteKey } from "../data/site";
import { BEATS, local } from "../timing/beats";
import { SCENES } from "../timing/scenes";
import { vo } from "../timing/vo";
import { EASE, lerp, mapClamp, progress } from "../utils/anim";
import { CODE_HANDOFF, WSL_CODE } from "./SceneDiscovery";

const B = local(BEATS.features, SCENES.features.from);
const at = (absolute: number) => absolute - SCENES.features.from;
const LEFT = 160;

/** Guide tiles: technical notes that exist on the site. */
const GUIDES: readonly NoteKey[] = ["flut", "wsl", "vlan", "sql"];
const TILE = { w: 340, h: 300, gap: 26, top: 400 } as const;
const tileX = (i: number) => (WIDTH - (GUIDES.length * TILE.w + (GUIDES.length - 1) * TILE.gap)) / 2 + i * (TILE.w + TILE.gap);

/** Large term label that swaps on each VO beat: `> panduan teknis`. */
const Term: React.FC<{ readonly text: string; readonly start: number; readonly end: number; readonly frame: number }> = ({ text, start, end, frame }) => {
  if (frame < start - 2 || frame > end + 8) return null;
  const inP = progress(frame, start, 8, EASE.snap);
  const outP = progress(frame, end, 6, EASE.in);
  return (
    <div
      style={{
        position: "absolute",
        left: LEFT,
        top: 150,
        fontFamily: FONT_MONO,
        fontWeight: 700,
        fontSize: 68,
        letterSpacing: "-0.01em",
        color: COLORS.text,
        opacity: inP * (1 - outP),
        translate: `${(1 - inP) * 24}px ${-outP * 24}px`,
        whiteSpace: "pre",
      }}
    >
      <span style={{ color: COLORS.green }}>&gt; </span>
      {text}
    </div>
  );
};

/** Cover-only tile (grid + code + short title), echoing the site's note covers. */
const GuideTile: React.FC<{ readonly k: NoteKey; readonly label?: string }> = ({ k, label }) => (
  <div style={{ width: TILE.w, height: TILE.h, border: `1px solid ${COLORS.borderStrong}`, borderRadius: 8, overflow: "hidden", background: COLORS.surface }}>
    <div style={{ height: 170, background: COLORS.bgDeep, ...gridBackground(22), display: "grid", placeItems: "center", borderBottom: `1px solid ${COLORS.border}` }}>
      <span style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 40, letterSpacing: "0.12em", color: COLORS.text }}>{NOTES[k].code}</span>
    </div>
    <div style={{ padding: "16px 18px", fontFamily: FONT_MONO, fontWeight: 700, fontSize: 16, lineHeight: 1.4, color: COLORS.text }}>
      <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{NOTES[k].title}</div>
      {label ? <div style={{ marginTop: 10, fontWeight: 400, fontSize: 14, color: COLORS.textMuted }}>{label}</div> : null}
    </div>
  </div>
);

/** A4 page with the 4-4-3-3 margin rule drawn as dimension guides. */
const MarginPage: React.FC<{ readonly draw: number }> = ({ draw }) => {
  const w = 400;
  const h = (w * 29.7) / 21;
  const cm = w / 21;
  const m = { left: 4 * cm, top: 4 * cm, right: 3 * cm, bottom: 3 * cm };
  const d = (i: number) => Math.max(0, Math.min(1, draw * 4 - i));
  const label: React.CSSProperties = { position: "absolute", fontFamily: FONT_MONO, fontWeight: 700, fontSize: 20, color: COLORS.green, whiteSpace: "nowrap" };
  return (
    <div style={{ position: "relative", width: w, height: h, background: COLORS.surfaceRaised, border: `1px solid ${COLORS.borderStrong}`, borderRadius: 4 }}>
      {/* text body inside the margins */}
      <div style={{ position: "absolute", left: m.left, top: m.top, right: m.right, bottom: m.bottom }}>
        {Array.from({ length: 13 }).map((_, i) => (
          <div key={i} style={{ height: 8, marginBottom: 16, width: i === 0 ? "60%" : i % 4 === 3 ? "72%" : "100%", background: i === 0 ? COLORS.textMuted : COLORS.borderStrong, borderRadius: 2 }} />
        ))}
      </div>
      {/* margin frame */}
      <div
        style={{
          position: "absolute",
          left: m.left,
          top: m.top,
          right: m.right,
          bottom: m.bottom,
          border: `2px dashed ${COLORS.green}`,
          opacity: d(0),
        }}
      />
      {/* dimension guides */}
      <div style={{ position: "absolute", left: 0, top: h / 2, width: m.left * d(1), height: 2, background: COLORS.green }} />
      <div style={{ ...label, left: m.left / 2 - 22, top: h / 2 - 34, opacity: d(1) }}>4 cm</div>
      <div style={{ position: "absolute", left: w / 2, top: 0, width: 2, height: m.top * d(1), background: COLORS.green }} />
      <div style={{ ...label, left: w / 2 + 10, top: m.top / 2 - 12, opacity: d(1) }}>4 cm</div>
      <div style={{ position: "absolute", right: 0, top: h / 2, width: m.right * d(2), height: 2, background: COLORS.green }} />
      <div style={{ ...label, left: w + 14, top: h / 2 - 12, opacity: d(2) }}>3 cm</div>
      <div style={{ position: "absolute", left: w / 2, bottom: 0, width: 2, height: m.bottom * d(2), background: COLORS.green }} />
      <div style={{ ...label, left: w / 2 + 10, top: h - m.bottom / 2 - 12, opacity: d(2) }}>3 cm</div>
    </div>
  );
};

/**
 * 00:52 – FEATURES. "Bukan cuma catatan." The lifted code block becomes
 * one of many technical guides, then the 4-4-3-3 template, then
 * multi-format documentation, then the three principles collapse into the
 * single point the Knowledge Graph grows from.
 */
export const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();

  const introOut = progress(frame, B.guides - 6, 6, EASE.in);
  const toTile = progress(frame, B.guides - 2, 14, EASE.inOut);
  const guidesOut = progress(frame, B.template - 4, 10, EASE.in);
  const templateIn = progress(frame, B.template, 12, EASE.out);
  const templateOut = progress(frame, B.formats - 4, 8, EASE.in);
  const formatsIn = (i: number) => progress(frame, B.formats + i * 4, 8, EASE.snap);
  const merge = progress(frame, B.formatsMerge - 10, 12, EASE.inOut);
  const formatsOut = progress(frame, B.principles - 6, 8, EASE.in);
  const collapse = progress(frame, B.collapse, 12, EASE.in);

  // The code block → WSL tile (index 1)
  const wslX = tileX(1);
  const codeRect = {
    x: lerp(CODE_HANDOFF.x, wslX, toTile),
    y: lerp(CODE_HANDOFF.y, TILE.top, toTile),
    w: lerp(CODE_HANDOFF.w, TILE.w, toTile),
    fontSize: lerp(CODE_HANDOFF.fontSize, 9, toTile),
  };

  return (
    <AbsoluteFill>
      {/* Intro: "Bukan cuma catatan." / KATAKATING juga menghadirkan */}
      {introOut < 1 ? (
        <div style={{ position: "absolute", left: LEFT, top: 110, opacity: 1 - introOut, translate: `0 ${-introOut * 30}px` }}>
          <WordReveal words={["Bukan", "cuma", "catatan."]} wordStarts={[0, 5, 10].map((d) => B.title + d)} fontSize={104} />
          <div style={{ marginTop: 26 }}>
            <TypeOn
              text="// KATAKATING JUGA MENGHADIRKAN"
              start={at(vo("f2"))}
              charsPerFrame={1.2}
              fontSize={22}
              color={COLORS.textMuted}
              weight={700}
              style={{ letterSpacing: "0.2em" }}
              caretAfter={false}
            />
          </div>
        </div>
      ) : null}

      {/* Lifted code block, shrinking into the WSL guide tile */}
      {toTile < 1 ? (
        <div style={{ position: "absolute", left: codeRect.x, top: codeRect.y, opacity: 1 - mapClamp(toTile, [0.6, 1], [0, 1]) }}>
          <CodeBlock lines={WSL_CODE} width={codeRect.w} fontSize={codeRect.fontSize} highlightLine={0} highlight={1} />
        </div>
      ) : null}

      {/* Technical guides */}
      <Term text="panduan teknis" start={B.guides} end={B.template - 6} frame={frame} />
      {frame >= B.guides - 4 && guidesOut < 1
        ? GUIDES.map((k, i) => {
            const p = k === "wsl" ? mapClamp(toTile, [0.5, 1], [0, 1]) : progress(frame, B.guides + Math.abs(i - 1) * 3, 8, EASE.snap);
            const out = Math.max(0, Math.min(1, guidesOut * 1.5 - i * 0.15));
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: tileX(i) - out * 80,
                  top: TILE.top + (1 - p) * 26,
                  opacity: p * (1 - out),
                }}
              >
                <GuideTile k={k} />
              </div>
            );
          })
        : null}
      {frame >= B.guides + 6 && guidesOut < 1 ? (
        <div style={{ position: "absolute", left: tileX(0), top: TILE.top + TILE.h + 44, opacity: 1 - guidesOut }}>
          <TypeOn
            text="setup  ·  troubleshooting  ·  development  ·  documentation"
            start={B.guides + 8}
            charsPerFrame={2.4}
            fontSize={22}
            color={COLORS.textMuted}
            caretAfter={false}
          />
        </div>
      ) : null}

      {/* Academic template: 4-4-3-3 */}
      <Term text="template akademik" start={B.template} end={B.formats - 6} frame={frame} />
      {templateIn > 0 && templateOut < 1 ? (
        <AbsoluteFill style={{ opacity: templateIn * (1 - templateOut) }}>
          <div style={{ position: "absolute", left: 420, top: 300, translate: `0 ${(1 - templateIn) * 30}px` }}>
            <MarginPage draw={progress(frame, B.template + 6, 26, EASE.out)} />
          </div>
          <div style={{ position: "absolute", left: 1010, top: 330, translate: `${(1 - templateIn) * 40}px 0` }}>
            <NoteCard note={NOTES.margin} width={470} highlight={progress(frame, B.template + 20, 8, EASE.out)} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Multi-format documentation */}
      <Term text="berbagai format" start={B.formats} end={B.principles - 6} frame={frame} />
      {frame >= B.formats - 2 && formatsOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - formatsOut }}>
          {FORMATS.map((f, i) => {
            const p = formatsIn(i);
            const x0 = 420;
            const y0 = 360 + i * 120;
            const x = lerp(x0, 940, merge);
            const y = lerp(y0, 560, merge);
            return (
              <div key={f.ext} style={{ position: "absolute", left: x, top: y, opacity: p * (1 - mapClamp(merge, [0.7, 1], [0, 1])), translate: `${(1 - p) * -30}px -50%` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                  <FormatBadge ext={f.ext} size={26} />
                  <span style={{ fontFamily: FONT_MONO, fontSize: 24, color: COLORS.textMuted, opacity: 1 - merge }}>{f.sub}</span>
                </div>
              </div>
            );
          })}
          {/* Converted into the repository format */}
          <div
            style={{
              position: "absolute",
              left: 1000,
              top: 560,
              translate: "0 -50%",
              opacity: progress(frame, B.formatsMerge, 8, EASE.out),
              scale: String(0.94 + 0.06 * progress(frame, B.formatsMerge, 8, EASE.snap)),
            }}
          >
            <div
              style={{
                width: 560,
                border: `1px solid ${COLORS.green}`,
                background: COLORS.surface,
                borderRadius: 8,
                padding: "26px 28px",
                boxShadow: `0 0 0 4px ${COLORS.greenSoft}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT_MONO, fontSize: 16, letterSpacing: "0.14em", color: COLORS.textMuted }}>
                <CheckIcon size={20} color={COLORS.green} strokeWidth={2.4} />
                FORMAT REPOSITORI
              </div>
              <div style={{ marginTop: 16, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 24, color: COLORS.text, lineHeight: 1.4 }}>
                Terkonversi otomatis ke format repositori.
              </div>
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                {[92, 100, 76].map((w, i) => (
                  <div key={i} style={{ height: 8, width: `${w}%`, background: COLORS.borderStrong, borderRadius: 2 }} />
                ))}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Semua dirancang agar pengetahuan lebih mudah ditemukan, dipahami, dan digunakan kembali. */}
      {frame >= B.principles - 2 ? (
        <AbsoluteFill
          style={{
            scale: String(1 - collapse),
            opacity: 1 - collapse,
            transformOrigin: `${WIDTH / 2}px ${HEIGHT / 2}px`,
          }}
        >
          <div style={{ position: "absolute", left: 560, top: 300 }}>
            <TypeOn
              text="Semua dirancang agar pengetahuan lebih mudah"
              start={B.principles}
              charsPerFrame={1.1}
              fontSize={28}
              color={COLORS.textMuted}
              caretAfter={false}
            />
          </div>
          {[
            { text: "ditemukan,", at: B.word1 },
            { text: "dipahami,", at: B.word2 },
            { text: "digunakan kembali.", at: B.word3 },
          ].map((row, i) => {
            const p = progress(frame, row.at, 6, EASE.snap);
            return (
              <div
                key={row.text}
                style={{
                  position: "absolute",
                  left: 560,
                  top: 380 + i * 110,
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  fontFamily: FONT_MONO,
                  fontWeight: 700,
                  fontSize: 76,
                  color: COLORS.text,
                  opacity: p,
                  translate: `${(1 - p) * 40}px 0`,
                }}
              >
                <span style={{ color: COLORS.green }}>[&gt;]</span>
                {row.text}
              </div>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* The point the Knowledge Graph grows from */}
      {collapse > 0.5 ? (
        <div
          style={{
            position: "absolute",
            left: WIDTH / 2,
            top: HEIGHT / 2 + 10,
            width: 42,
            height: 42,
            translate: "-50% -50%",
            borderRadius: 99,
            background: COLORS.text,
            boxShadow: "0 0 60px rgba(255,255,255,0.35)",
            scale: String(mapClamp(collapse, [0.5, 1], [0.2, 1])),
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

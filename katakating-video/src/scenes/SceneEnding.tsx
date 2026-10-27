import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";
import { FONT_MONO } from "../constants/fonts";
import { HEIGHT, WIDTH } from "../constants/video";
import { BracketMark } from "../components/brand/BracketMark";
import { CheckIcon } from "../components/icons/Icons";
import { Caret } from "../components/typography/Caret";
import { WordReveal } from "../components/typography/WordReveal";
import { BRAND_ROW_WIDTH, BrandRow } from "../components/ui/Navbar";
import { FormatBadge } from "../components/ui/UploadParts";
import { Tag } from "../components/ui/primitives";
import { BEATS, local } from "../timing/beats";
import { SCENES } from "../timing/scenes";
import { vo } from "../timing/vo";
import { EASE, lerp, mapClamp, progress, typedCount } from "../utils/anim";
import { newNodeScreen } from "./SceneContribution";

const B = local(BEATS.ending, SCENES.ending.from);
const at = (absolute: number) => absolute - SCENES.ending.from;

/* Timeline of cohorts: today's note → later cohorts. */
const AXIS = { y: 800, left: 300, right: 1620 } as const;
const COHORTS = ["2026", "2027", "2028", "2029"] as const;
const tickX = (i: number) => lerp(AXIS.left, AXIS.right, i / (COHORTS.length - 1));

/* Final lockup geometry */
const LOCKUP_SCALE = 5;
const LOCKUP_Y = 470;
const TAGLINE = "Knowledge Should Move Forward.";
const TAG_SIZE = 42;
const MARK_SIZE = 42;
const MARK_W = MARK_SIZE * 1.9;
const TAG_GAP = 18;
const TAG_TOTAL = MARK_W + TAG_GAP + TAGLINE.length * 0.6 * TAG_SIZE;
const TAG_LEFT = WIDTH / 2 - TAG_TOTAL / 2;
const TAG_Y = 640;

/** The note contributed in the previous scene. */
const TodayNote: React.FC<{ readonly glow: number }> = ({ glow }) => (
  <div
    style={{
      width: 520,
      background: COLORS.surface,
      border: `1px solid ${glow > 0.5 ? COLORS.green : COLORS.borderStrong}`,
      boxShadow: glow > 0 ? `0 0 0 ${4 * glow}px ${COLORS.greenSoft}` : undefined,
      borderRadius: 10,
      padding: "24px 26px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT_MONO, fontSize: 15, color: COLORS.textMuted }}>
      <FormatBadge ext="MD" size={13} active />
      <span>catatan-praktikum.md</span>
      <span style={{ flex: 1 }} />
      <span style={{ color: COLORS.green, fontWeight: 700, letterSpacing: "0.08em" }}>HARI INI</span>
    </div>
    <div style={{ marginTop: 18, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 24, lineHeight: 1.35, color: COLORS.text }}>
      Setup Docker untuk Praktikum Web
    </div>
    <div style={{ marginTop: 10, fontFamily: FONT_MONO, fontSize: 15, color: COLORS.textMuted }}>by Nama Mahasiswa • Web &amp; Tooling</div>
    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
      {["docker", "setup", "web"].map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  </div>
);

/**
 * 01:28 – FINAL MESSAGE. One note today travels forward to later cohorts,
 * everything resolves into `[>]`, then the KATAKATING lockup:
 * logo + wordmark, `[>] Knowledge Should Move Forward.`
 */
export const SceneEnding: React.FC = () => {
  const frame = useCurrentFrame();

  // Dot from Contribution → note card
  const dot = newNodeScreen();
  const grow = progress(frame, B.card, 16, EASE.out);
  const toTimeline = progress(frame, B.forward, 20, EASE.inOut);
  const cardX = lerp(lerp(dot.x, WIDTH / 2 - 260, grow), tickX(0) - 130, toTimeline);
  const cardY = lerp(lerp(dot.y, 470, grow), AXIS.y - 210, toTimeline);
  const cardScale = lerp(lerp(0.05, 1, grow), 0.5, toTimeline);

  // Forward signal along the axis
  const signal = progress(frame, B.forward + 16, 60, EASE.inOut);

  const collapse = progress(frame, B.collapse, 12, EASE.in);
  const markIn = progress(frame, B.collapse + 6, 10, EASE.out);
  const markArrow = progress(frame, B.lockup, 3, EASE.snap);
  const settle = progress(frame, B.lockup + 14, 18, EASE.inOut);
  const chars = progress(frame, B.lockup + 16, 14, EASE.out);
  const logo = progress(frame, B.lockup + 14, 10, EASE.out);
  const typed = typedCount(frame, B.tagline, TAGLINE.length, 1.1);

  // [>] travels from centre to the tagline prefix
  const markSize = lerp(150, MARK_SIZE, settle);
  const markX = lerp(WIDTH / 2, TAG_LEFT + MARK_W / 2, settle);
  const markY = lerp(HEIGHT / 2, TAG_Y, settle);

  const lockupW = BRAND_ROW_WIDTH.logoAndWordmark * LOCKUP_SCALE;

  return (
    <AbsoluteFill>
      {/* Story half: text + note + cohort timeline */}
      {collapse < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - collapse, scale: String(1 - collapse * 0.12), transformOrigin: "50% 50%" }}>
          <div style={{ position: "absolute", left: 160, top: 120 }}>
            <WordReveal words={["Satu", "catatan", "hari", "ini,"]} wordStarts={[0, 5, 11, 15].map((d) => at(vo("e1")) + d)} fontSize={96} />
          </div>
          <div style={{ position: "absolute", left: 160, top: 250, width: 1600 }}>
            <WordReveal
              words={["bisa", "menjadi", "solusi", "untuk", "seseorang", "di", "kemudian", "hari."]}
              wordStarts={[0, 4, 9, 15, 19, 27, 30, 37].map((d) => B.forward + d)}
              fontSize={60}
              color={COLORS.textMuted}
              highlight={{ 2: COLORS.text }}
            />
          </div>

          {/* Cohort axis */}
          <div
            style={{
              position: "absolute",
              left: AXIS.left,
              top: AXIS.y,
              height: 2,
              width: (AXIS.right - AXIS.left) * progress(frame, B.forward + 4, 16, EASE.out),
              background: COLORS.borderStrong,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: AXIS.left,
              top: AXIS.y,
              height: 2,
              width: (AXIS.right - AXIS.left) * signal,
              background: COLORS.green,
              boxShadow: `0 0 16px ${COLORS.greenGlow}`,
            }}
          />
          {COHORTS.map((year, i) => {
            const appear = progress(frame, B.forward + 4 + i * 3, 8, EASE.out);
            const reached = i === 0 ? 1 : progress(frame, B.forward + 16 + (60 * i) / (COHORTS.length - 1) - 4, 6, EASE.snap);
            return (
              <div key={year} style={{ position: "absolute", left: tickX(i), top: AXIS.y, opacity: appear }}>
                <div
                  style={{
                    position: "absolute",
                    left: -8,
                    top: -7,
                    width: 16,
                    height: 16,
                    borderRadius: 99,
                    background: reached > 0.5 ? COLORS.green : COLORS.textMuted,
                  }}
                />
                <div style={{ position: "absolute", left: -110, top: 26, width: 220, textAlign: "center", fontFamily: FONT_MONO, fontSize: 20, color: COLORS.textSoft }}>
                  angkatan {year}
                </div>
                {i > 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: -86,
                      top: -88,
                      width: 172,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      border: `1px solid ${COLORS.green}`,
                      background: COLORS.surface,
                      borderRadius: 8,
                      fontFamily: FONT_MONO,
                      fontSize: 16,
                      color: COLORS.text,
                      opacity: reached,
                      translate: `0 ${(1 - reached) * 12}px`,
                    }}
                  >
                    <CheckIcon size={18} color={COLORS.green} strokeWidth={2.4} />
                    solusi
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* Today's note */}
          <div
            style={{
              position: "absolute",
              left: cardX,
              top: cardY,
              scale: String(cardScale),
              transformOrigin: "0 0",
              opacity: mapClamp(grow, [0, 0.3], [0, 1]),
            }}
          >
            <TodayNote glow={1 - toTimeline * 0.5} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Lockup */}
      {markIn > 0 ? (
        <div style={{ position: "absolute", left: markX, top: markY, translate: "-50% -50%" }}>
          <BracketMark size={markSize} open={markIn} arrow={markArrow} glow={markArrow * (1 - settle * 0.8)} />
        </div>
      ) : null}
      {frame >= B.lockup + 12 ? (
        <>
          <div style={{ position: "absolute", left: WIDTH / 2 - lockupW / 2, top: LOCKUP_Y, translate: "0 -50%" }}>
            <BrandRow scale={LOCKUP_SCALE} chars={chars} logo={logo} badge={0} />
          </div>
          <div
            style={{
              position: "absolute",
              left: TAG_LEFT + MARK_W + TAG_GAP,
              top: TAG_Y,
              translate: "0 -50%",
              fontFamily: FONT_MONO,
              fontWeight: 500,
              fontSize: TAG_SIZE,
              color: COLORS.text,
              whiteSpace: "pre",
            }}
          >
            {TAGLINE.slice(0, typed)}
            {frame >= B.tagline - 4 ? (
              <Caret height={TAG_SIZE * 0.95} width={TAG_SIZE * 0.5} solid={typed < TAGLINE.length} style={{ marginLeft: 6, translate: "0 -3px" }} />
            ) : null}
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

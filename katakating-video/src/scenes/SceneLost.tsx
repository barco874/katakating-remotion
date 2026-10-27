import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";
import { FONT_MONO, FONT_SANS } from "../constants/fonts";
import { HEIGHT, WIDTH } from "../constants/video";
import { FileIcon, FolderIcon } from "../components/icons/Icons";
import { SolutionCard } from "../components/terminal/SolutionCard";
import { Caret } from "../components/typography/Caret";
import { TypeOn } from "../components/typography/TypeOn";
import { WordReveal } from "../components/typography/WordReveal";
import { BEATS, local } from "../timing/beats";
import { SCENES } from "../timing/scenes";
import { vo } from "../timing/vo";
import { EASE, mapClamp, progress } from "../utils/anim";

const B = local(BEATS.lost, SCENES.lost.from);
const at = (absolute: number) => absolute - SCENES.lost.from;
const LEFT = 160;

/** Visibility window helper: fades in at `a`, out at `b`. */
const windowed = (frame: number, a: number, b: number, inDur = 8, outDur = 8) =>
  progress(frame, a, inDur, EASE.out) * (1 - progress(frame, b - outDur, outDur, EASE.in));

const Statement: React.FC<{ readonly words: string[]; readonly start: number; readonly size?: number; readonly width?: number }> = ({
  words,
  start,
  size = 112,
  width = 820,
}) => (
  <WordReveal words={words} wordStarts={words.map((_, i) => start + i * 5)} fontSize={size} style={{ width }} />
);

/* ---------- "Tenggelam di chat." ---------- */

const CHAT = [
  { who: "Raka", text: "ada yang tau fix wsl error kernel?" },
  { who: "Dimas · 2022", text: "coba `wsl --update` dulu, terus install ulang. aman.", solution: true },
  { who: "Nadia", text: "kak modul 3 dikumpul kapan ya" },
  { who: "Bima", text: "link zoom asistensi mana?" },
  { who: "Sari", text: "absen dong 🙏" },
  { who: "Raka", text: "laporan pakai template yang mana?" },
  { who: "Tio", text: "besok kuis?" },
  { who: "Nadia", text: "file-nya di drive ya" },
  { who: "Bima", text: "ok" },
  { who: "Sari", text: "sip makasih" },
  { who: "Tio", text: "yang tadi gimana kak?" },
  { who: "Raka", text: "wkwk" },
  { who: "Dimas", text: "cek pinned" },
  { who: "Nadia", text: "pinned yang mana" },
] as const;

const ChatPanel: React.FC<{ readonly frame: number }> = ({ frame }) => {
  const base = 2;
  const flood = Math.max(0, Math.floor((frame - B.chatFlood) / 3));
  const shown = Math.min(CHAT.length, base + flood);
  const rowH = 78;
  return (
    <div
      style={{
        width: 640,
        height: 620,
        background: COLORS.surface,
        border: `1px solid ${COLORS.borderStrong}`,
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "16px 22px", borderBottom: `1px solid ${COLORS.border}`, fontFamily: FONT_MONO, fontSize: 16, color: COLORS.textMuted }}>
        <span style={{ color: COLORS.text, fontWeight: 700 }}>grup angkatan</span> · 214 anggota
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 18 }}>
          {CHAT.slice(0, shown).map((m, i) => {
            const isNew = i >= base;
            const arrive = isNew ? progress(frame, B.chatFlood + (i - base) * 3, 4, EASE.snap) : 1;
            const isSolution = "solution" in m;
            return (
              <div key={i} style={{ height: rowH, display: "flex", flexDirection: "column", justifyContent: "center", opacity: arrive }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: COLORS.textDim, marginBottom: 6 }}>{m.who}</div>
                <div
                  style={{
                    alignSelf: "flex-start",
                    fontFamily: FONT_SANS,
                    fontSize: 19,
                    color: isSolution ? COLORS.text : COLORS.textSoft,
                    background: COLORS.surfaceRaised,
                    border: `1px solid ${isSolution ? COLORS.textMuted : COLORS.border}`,
                    borderRadius: 8,
                    padding: "8px 14px",
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------- "Tersimpan di laptop." ---------- */

const FILES = [
  { icon: "folder", name: "praktikum-jarkom/" },
  { icon: "file", name: "laporan_final_v3_fix.docx" },
  { icon: "file", name: "catatan_wsl.txt", key: true },
  { icon: "file", name: "tugas_basdat_REVISI(2).docx" },
  { icon: "folder", name: "modul-lab-2022/" },
] as const;

const LaptopFolder: React.FC<{ readonly frame: number }> = ({ frame }) => {
  const close = progress(frame, B.laptopClose - 6, 8, EASE.in);
  return (
    <div
      style={{
        width: 640,
        background: COLORS.surface,
        border: `1px solid ${COLORS.borderStrong}`,
        borderRadius: 10,
        overflow: "hidden",
        scale: `1 ${1 - close * 0.98}`,
        opacity: 1 - close * 0.6,
      }}
    >
      <div style={{ padding: "16px 22px", borderBottom: `1px solid ${COLORS.border}`, fontFamily: FONT_MONO, fontSize: 16, color: COLORS.textMuted }}>
        ~/Documents/kuliah/semester-3/
      </div>
      <div style={{ padding: "10px 0" }}>
        {FILES.map((f, i) => {
          const isKey = "key" in f;
          return (
            <div
              key={f.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "13px 22px",
                fontFamily: FONT_MONO,
                fontSize: 19,
                color: isKey ? COLORS.text : COLORS.textSoft,
                background: isKey ? COLORS.surfaceRaised : undefined,
                opacity: progress(frame, B.laptopIn + i * 2, 6, EASE.out),
              }}
            >
              {f.icon === "folder" ? <FolderIcon size={20} color={COLORS.textMuted} /> : <FileIcon size={20} color={COLORS.textMuted} />}
              {f.name}
            </div>
          );
        })}
      </div>
      <div
        style={{
          padding: "14px 22px",
          borderTop: `1px solid ${COLORS.border}`,
          fontFamily: FONT_MONO,
          fontSize: 14,
          letterSpacing: "0.08em",
          color: COLORS.textDim,
        }}
      >
        PENYIMPANAN LOKAL · TIDAK TERSINKRON
      </div>
    </div>
  );
};

/* ---------- "Atau ikut pergi bersama angkatan sebelumnya." ---------- */

const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025"] as const;

const CohortTimeline: React.FC<{ readonly frame: number }> = ({ frame }) => {
  const leave = progress(frame, B.cohortLeave, 26, EASE.inOut);
  const left = 160;
  const span = 1600;
  const step = span / (YEARS.length - 1);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT }}>
      <div
        style={{
          position: "absolute",
          left,
          top: 820,
          width: span * progress(frame, B.cohortIn, 14, EASE.out),
          height: 1,
          background: COLORS.borderStrong,
        }}
      />
      {YEARS.map((year, i) => {
        const departing = i < 3;
        const x = left + i * step;
        const dx = departing ? -leave * (360 + i * 60) : 0;
        const fade = departing ? 1 - leave : 1;
        const appear = progress(frame, B.cohortIn + i * 2, 8, EASE.out);
        const blocks = departing ? 5 : i === 3 ? 2 : 1;
        return (
          <div key={year} style={{ position: "absolute", left: x + dx, top: 560, opacity: appear * fade }}>
            {Array.from({ length: blocks }).map((_, k) => {
              const scatter = departing ? leave * (random(`blk-${i}-${k}`) - 0.5) * 80 : 0;
              return (
                <div
                  key={k}
                  style={{
                    width: 64,
                    height: 34,
                    marginBottom: 8,
                    marginLeft: -32,
                    border: `1px solid ${COLORS.borderStrong}`,
                    background: COLORS.surfaceRaised,
                    borderRadius: 5,
                    translate: `${scatter}px ${-scatter * 0.6}px`,
                  }}
                />
              );
            })}
            <div style={{ position: "absolute", top: 252, left: -6, width: 12, height: 12, borderRadius: 99, background: COLORS.textMuted }} />
            <div style={{ position: "absolute", top: 280, left: -40, width: 80, textAlign: "center", fontFamily: FONT_MONO, fontSize: 20, color: COLORS.textSoft }}>
              {year}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Scene ---------- */

/** 00:15 – KNOWLEDGE GETS LOST: the fix breaks apart, gets buried, stays local, leaves with its cohort. */
export const SceneLost: React.FC = () => {
  const frame = useCurrentFrame();

  const l1 = windowed(frame, 0, B.chatIn, 1, 6);
  const l2 = windowed(frame, B.chatIn, B.laptopIn);
  const l3 = windowed(frame, B.laptopIn, B.cohortIn);
  const l4 = windowed(frame, B.cohortIn, B.clear);

  // "pengetahuan nggak seharusnya berhenti di satu angkatan."
  const words = ["pengetahuan", "nggak", "seharusnya", "berhenti", "di", "satu", "angkatan."];
  const s = B.statement;
  const starts = [s, s + 9, s + 17, B.stopWord, B.stopWord + 12, B.stopWord + 17, B.stopWord + 23];
  const collapse = progress(frame, B.collapse, 12, EASE.in);

  return (
    <AbsoluteFill>
      {/* "Tapi hilang." — the solution card corrupts */}
      {l1 > 0 ? (
        <AbsoluteFill style={{ opacity: l1 }}>
          <SolutionCard breakAt={B.glitch} />
          <div style={{ position: "absolute", left: LEFT, top: 430 }}>
            <Statement words={["Tapi", "hilang."]} start={at(vo("l1"))} />
          </div>
        </AbsoluteFill>
      ) : null}

      {l2 > 0 ? (
        <AbsoluteFill style={{ opacity: l2 }}>
          <div style={{ position: "absolute", left: LEFT, top: 430 }}>
            <Statement words={["Tenggelam", "di", "chat."]} start={at(vo("l2"))} />
          </div>
          <div style={{ position: "absolute", left: 1090, top: 230, translate: `0 ${(1 - l2) * 30}px` }}>
            <ChatPanel frame={frame} />
          </div>
        </AbsoluteFill>
      ) : null}

      {l3 > 0 ? (
        <AbsoluteFill style={{ opacity: l3 }}>
          <div style={{ position: "absolute", left: LEFT, top: 430 }}>
            <Statement words={["Tersimpan", "di", "laptop."]} start={at(vo("l3"))} />
          </div>
          <div style={{ position: "absolute", left: 1090, top: 320, translate: `0 ${(1 - l3) * 30}px` }}>
            <LaptopFolder frame={frame} />
          </div>
        </AbsoluteFill>
      ) : null}

      {l4 > 0 ? (
        <AbsoluteFill style={{ opacity: l4 }}>
          <div style={{ position: "absolute", left: LEFT, top: 150 }}>
            <WordReveal
              words={["Atau", "ikut", "pergi", "bersama", "angkatan", "sebelumnya."]}
              wordStarts={[0, 6, 11, 18, 26, 36].map((d) => at(vo("l4")) + d)}
              fontSize={92}
              style={{ width: 1400 }}
              color={COLORS.text}
            />
          </div>
          <CohortTimeline frame={frame} />
        </AbsoluteFill>
      ) : null}

      {/* "Padahal..." → the core message → collapses to the caret that opens the reveal */}
      {frame >= B.clear ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: 290, opacity: 1 - collapse }}>
            <TypeOn
              text="Padahal..."
              start={at(vo("l5"))}
              charsPerFrame={0.5}
              fontSize={44}
              color={COLORS.textMuted}
              caret={frame < s}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              scale: `${1 - collapse} ${1 - collapse * 0.7}`,
              opacity: 1 - collapse,
              filter: collapse > 0 ? `blur(${collapse * 6}px)` : undefined,
            }}
          >
            <WordReveal words={words.slice(0, 3)} wordStarts={starts.slice(0, 3)} fontSize={108} />
            <WordReveal words={words.slice(3)} wordStarts={starts.slice(3)} fontSize={108} snapWords={[0]} />
          </div>
          {frame >= B.collapse + 6 ? (
            <div style={{ position: "absolute", left: WIDTH / 2 - 14, top: HEIGHT / 2 - 26, opacity: mapClamp(frame, [B.collapse + 6, B.collapse + 10], [0, 1]) }}>
              <Caret height={52} width={28} />
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

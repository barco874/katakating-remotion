import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";
import { FONT_MONO } from "../constants/fonts";
import { CodeBlock } from "../components/terminal/CodeBlock";
import { SolutionCard } from "../components/terminal/SolutionCard";
import { TypeOn } from "../components/typography/TypeOn";
import { WordReveal } from "../components/typography/WordReveal";
import { BEATS, local } from "../timing/beats";
import { SCENES } from "../timing/scenes";
import { OPENING_TYPING } from "../timing/typing";
import { EASE, mapClamp, progress } from "../utils/anim";

const B = local(BEATS.problem, SCENES.problem.from);
const LEFT = 160;

/** Three cohorts hitting the same wall. Positions cascade so the repetition reads instantly. */
const COHORTS = [
  { year: "2023", x: 150, y: 96 },
  { year: "2024", x: 620, y: 226 },
  { year: "2025", x: 1090, y: 356 },
] as const;

const ERROR_LINES = (year: string) => [
  { text: `mahasiswa@angkatan-${year}:~$ wsl --install -d Ubuntu-24.04` },
  { text: "Installing: Ubuntu 24.04 LTS", color: COLORS.textMuted },
  { text: "Error: WSL 2 requires an update to its", color: COLORS.error },
  { text: "kernel component.", color: COLORS.error },
];

const QUESTION_LINES = (year: string) => [
  { text: `#tanya-praktikum · angkatan ${year}`, color: COLORS.textMuted },
  { text: "" },
  { text: "kak, format margin laporan", color: COLORS.text },
  { text: "praktikum itu berapa ya?", color: COLORS.text },
];

/** 00:00 – PROBLEM: the question, the repeating error, the repeating question, the lost fix. */
export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();

  // Opening lines: the question moves up and dims when the next phrase arrives.
  const shiftUp = progress(frame, B.typeP2 - 4, 12, EASE.out);
  const openingOut = frame >= B.errorCut;

  // Cohort panels: in on the error cut, content swaps on the question cut, out before the solution.
  const panelsOut = progress(frame, B.solutionText - 10, 8, EASE.in);
  const isQuestion = frame >= B.questionCut;

  // Solution phase text exits right before the scene hands the card to "Lost".
  const textExit = progress(frame, SCENES.problem.duration - 10, 8, EASE.in);

  return (
    <AbsoluteFill>
      {/* "Pernah kepikiran... kenapa masalah yang sama, harus terus terjadi?" */}
      {!openingOut ? (
        <>
          <div
            style={{
              position: "absolute",
              left: LEFT,
              top: 430 - shiftUp * 130,
              opacity: 1 - shiftUp * 0.55,
            }}
          >
            <TypeOn text={OPENING_TYPING.text} start={B.typeP1} charsPerFrame={OPENING_TYPING.charsPerFrame} fontSize={56} caretAfter={frame < B.typeP2} />
          </div>
          <div style={{ position: "absolute", left: LEFT, top: 420, width: 1500 }}>
            <WordReveal words={["kenapa", "masalah", "yang", "sama,"]} wordStarts={[0, 5, 10, 14].map((d) => B.typeP2 + d)} fontSize={104} />
            <WordReveal
              words={["harus", "terus", "terjadi?"]}
              wordStarts={[0, 6, 12].map((d) => B.typeP3 + d)}
              fontSize={104}
              color={COLORS.textMuted}
              highlight={{ 1: COLORS.text }}
            />
          </div>
        </>
      ) : null}

      {/* Cohort panels: same error → same question */}
      {frame >= B.errorCut && frame < B.solutionText ? (
        <>
          {COHORTS.map((c, i) => {
            const appear = progress(frame, B.errorCut + i * 3, 7, EASE.snap);
            const swap = isQuestion ? progress(frame, B.questionCut + i * 3, 5, EASE.snap) : 0;
            const out = Math.max(0, Math.min(1, panelsOut * 1.4 - i * 0.2));
            const lines = isQuestion ? QUESTION_LINES(c.year) : ERROR_LINES(c.year);
            const revealed = isQuestion
              ? Math.floor(swap * 200)
              : frame >= B.errorHit + i * 3
                ? 999
                : lines[0].text.length + lines[1].text.length;
            return (
              <div
                key={c.year}
                style={{
                  position: "absolute",
                  left: c.x,
                  top: c.y,
                  opacity: appear * (1 - out),
                  translate: `0 ${(1 - appear) * 24 - out * 20}px`,
                }}
              >
                <CodeBlock
                  lines={lines}
                  width={680}
                  fontSize={19}
                  label={isQuestion ? "CHAT" : "TERMINAL"}
                  showCopy={false}
                  visibleChars={revealed}
                  minLines={4}
                />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: LEFT, top: 820, opacity: 1 - panelsOut }}>
            {isQuestion ? (
              <WordReveal words={["Pertanyaan", "yang", "sama."]} wordStarts={[0, 5, 9].map((d) => B.questionHit + d)} fontSize={120} />
            ) : (
              <WordReveal words={["Error", "yang", "sama."]} wordStarts={[0, 5, 9].map((d) => B.errorHit + d)} fontSize={120} />
            )}
          </div>
        </>
      ) : null}

      {/* "Dan solusi yang sebenarnya... sudah pernah ditemukan." */}
      {frame >= B.solutionText - 4 ? (
        <div style={{ position: "absolute", left: LEFT, top: 360, opacity: 1 - textExit, translate: `0 ${-textExit * 20}px` }}>
          <TypeOn
            text="Dan solusi yang sebenarnya..."
            start={B.solutionText}
            charsPerFrame={0.6}
            fontSize={40}
            color={COLORS.textSoft}
            caretAfter={frame < B.solutionLock - 8}
          />
          <div style={{ marginTop: 28 }}>
            <WordReveal
              words={["sudah", "pernah", "ditemukan."]}
              wordStarts={[0, 6, 12].map((d) => B.solutionLock - 6 + d)}
              fontSize={92}
              style={{ width: 800 }}
            />
          </div>
          <div
            style={{
              marginTop: 34,
              fontFamily: FONT_MONO,
              fontSize: 18,
              letterSpacing: "0.16em",
              color: COLORS.textDim,
              opacity: mapClamp(frame, [B.solutionLock + 10, B.solutionLock + 20], [0, 1]),
            }}
          >
            // oleh angkatan sebelumnya
          </div>
        </div>
      ) : null}

      <Sequence from={B.solutionLock - 4} layout="none">
        <SolutionCardIn />
      </Sequence>
    </AbsoluteFill>
  );
};

const SolutionCardIn: React.FC = () => {
  const frame = useCurrentFrame();
  return <SolutionCard appear={progress(frame, 0, 10, EASE.snap)} />;
};

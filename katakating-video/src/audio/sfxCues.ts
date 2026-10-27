import { BEATS } from "../timing/beats";
import { SCENES } from "../timing/scenes";
import { OPENING_TYPING, SEARCH_TYPING, UPLOAD_TYPING } from "../timing/typing";
import { sec } from "../timing/vo";
import type { SfxName } from "./config";

/**
 * SFX CUE SHEET
 *
 * Every cue is anchored to a named beat from timing/beats.ts, the same beat
 * the visual uses. Retiming the VO moves picture and sound together.
 *
 * Rule of thumb: one sound per meaningful event. Sound marks hierarchy
 * (statement hits, brand moments, real UI interactions), not every motion.
 */
export type SfxCue = {
  readonly sound: SfxName;
  readonly at: number;
  /** Optional per-cue gain on top of SFX_LEVELS (default 1). */
  readonly gain?: number;
  /** For looping beds (hum): how long to play, in frames. */
  readonly duration?: number;
  /** For typing: which key variant (1..3). */
  readonly variant?: 1 | 2 | 3;
};

const typing = (start: number, count: number, framesPerChar: number, gain = 1): SfxCue[] =>
  Array.from({ length: count }, (_, i) => ({
    sound: "type" as const,
    at: Math.round(start + i * framesPerChar),
    variant: ((i % 3) + 1) as 1 | 2 | 3,
    gain: gain * (i % 4 === 3 ? 0.7 : 1),
  }));

const B = BEATS;

export const SFX_CUES: readonly SfxCue[] = [
  // PROBLEM: type-on question, then two statement hits, then the solution locks.
  ...typing(
    B.problem.typeP1,
    Math.ceil(OPENING_TYPING.text.replace(/\./g, "").length / OPENING_TYPING.soundEvery),
    OPENING_TYPING.soundEvery / OPENING_TYPING.charsPerFrame,
    0.8,
  ),
  { sound: "hit", at: B.problem.errorHit },
  { sound: "hit", at: B.problem.questionHit, gain: 0.85 },
  { sound: "snap", at: B.problem.solutionLock },

  // LOST: knowledge breaks apart, gets buried, leaves.
  { sound: "glitch", at: B.lost.glitch },
  { sound: "snap", at: B.lost.laptopClose, gain: 0.6 },
  { sound: "whoosh", at: B.lost.cohortLeave, gain: 0.8 },
  { sound: "hit", at: B.lost.stopWord, gain: 0.75 },

  // REVEAL: the turning point.
  { sound: "whoosh", at: B.reveal.bracketsOpen - 6, gain: 0.6 },
  { sound: "brand", at: B.reveal.markLock },
  { sound: "whoosh", at: B.reveal.dock, gain: 0.7 },

  // DISCOVERY: real interactions only.
  { sound: "click", at: B.discovery.searchClick },
  ...typing(B.discovery.searchType, SEARCH_TYPING.text.length, SEARCH_TYPING.framesPerChar),
  { sound: "click", at: B.discovery.categoryClick },
  { sound: "click", at: B.discovery.cardOpen },
  { sound: "snap", at: B.discovery.codeHighlight, gain: 0.7 },

  // FEATURES
  { sound: "whoosh", at: SCENES.features.from - 2, gain: 0.6 },
  { sound: "snap", at: B.features.guides },
  { sound: "snap", at: B.features.template, gain: 0.8 },
  { sound: "confirm", at: B.features.formatsMerge, gain: 0.8 },
  { sound: "node", at: B.features.word1 },
  { sound: "node", at: B.features.word2 },
  { sound: "node", at: B.features.word3 },

  // KNOWLEDGE GRAPH: soft hum bed + node activations.
  { sound: "hum", at: SCENES.graph.from, duration: SCENES.graph.duration },
  { sound: "node", at: B.graph.core, gain: 1.2 },
  { sound: "node", at: B.graph.organs + 10, gain: 0.8 },
  { sound: "click", at: B.graph.hud, gain: 0.7 },
  { sound: "click", at: B.graph.inspect },
  { sound: "node", at: B.graph.inspect + 2 },
  { sound: "node", at: B.graph.forward, gain: 0.9 },
  { sound: "node", at: B.graph.forwardArrive, gain: 1.1 },
  { sound: "whoosh", at: B.graph.wipe, gain: 0.8 },

  // CONTRIBUTION
  { sound: "snap", at: B.contribution.drop },
  ...typing(B.contribution.form + UPLOAD_TYPING.offset, UPLOAD_TYPING.keystrokes, UPLOAD_TYPING.framesPerChar, 0.8),
  { sound: "click", at: B.contribution.submit },
  { sound: "confirm", at: B.contribution.ticket },
  { sound: "node", at: B.contribution.joinGraph + 8, gain: 1.1 },

  // FINAL MESSAGE
  { sound: "whoosh", at: B.ending.forward + 4, gain: 0.55 },
  { sound: "brand", at: B.ending.lockup },
  { sound: "snap", at: B.ending.tagline + sec(0.1), gain: 0.5 },
];

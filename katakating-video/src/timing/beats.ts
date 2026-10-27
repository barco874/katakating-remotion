import { SCENES } from "./scenes";
import { sec, vo, voEnd } from "./vo";

/**
 * Named visual beats (absolute frames), derived from the VO timing map.
 *
 * Scenes animate from these beats and the SFX cue sheet (sfx.ts) fires on
 * the very same beats, so a visual hit and its sound can never drift apart.
 * When the recorded VO arrives, only vo.ts changes.
 */
export const BEATS = {
  problem: {
    typeP1: vo("p1"),
    typeP2: vo("p2"),
    typeP3: vo("p3"),
    errorCut: vo("p4") - 3,
    errorHit: vo("p4"),
    questionCut: vo("p5") - 3,
    questionHit: vo("p5"),
    solutionText: vo("p6"),
    solutionLock: vo("p7") + 4,
  },
  lost: {
    glitch: vo("l1") + 3,
    chatIn: vo("l2") - 4,
    chatFlood: vo("l2") + 6,
    laptopIn: vo("l3") - 4,
    laptopClose: voEnd("l3") - 2,
    cohortIn: vo("l4") - 4,
    cohortLeave: vo("l4") + sec(1.0),
    clear: vo("l5") - 4,
    statement: vo("l6"),
    /** Estimated moment the word "berhenti" is spoken. */
    stopWord: sec(27.3),
    collapse: voEnd("l6") + 6,
  },
  reveal: {
    bracketsOpen: vo("r1"),
    markLock: vo("r2") - 2,
    wordmark: vo("r2") + 10,
    subline: vo("r3"),
    dock: SCENES.discovery.from - 22,
  },
  discovery: {
    cardsIn: vo("d2"),
    structure: vo("d3"),
    scrollToSearch: voEnd("d3") - 14,
    searchClick: vo("d4") - 6,
    searchType: vo("d4") + 2,
    categoryClick: vo("d5") + 10,
    cardHover: vo("d6") - 2,
    cardOpen: vo("d6") + 14,
    codeHighlight: vo("d6") + 38,
    zoomOut: SCENES.features.from - 16,
  },
  features: {
    title: vo("f1"),
    guides: vo("f3"),
    template: vo("f4"),
    formats: vo("f5"),
    formatsMerge: vo("f5") + 34,
    principles: vo("f6"),
    word1: voEnd("f7") - 16,
    word2: vo("f8"),
    word3: vo("f9") + 8,
    collapse: SCENES.graph.from - 12,
  },
  graph: {
    core: SCENES.graph.from + 2,
    organs: vo("g1") + 4,
    links: vo("g2"),
    hud: vo("g3") - 2,
    inspect: vo("g4") + 12,
    forward: vo("g5"),
    forwardArrive: voEnd("g5") - 6,
    wipe: SCENES.contribution.from - 10,
  },
  contribution: {
    drag: vo("c1") - 4,
    drop: vo("c1") + 16,
    form: vo("c2") - 2,
    submit: vo("c3") + 6,
    ticket: vo("c3") + 14,
    joinGraph: vo("c4") + 4,
  },
  ending: {
    card: SCENES.ending.from,
    forward: vo("e2"),
    collapse: voEnd("e2") + 4,
    lockup: vo("e3") - 6,
    tagline: vo("e4"),
  },
} as const;

/** Convert a scene's absolute beats to frames relative to the scene start. */
export const local = <T extends Record<string, number>>(beats: T, sceneFrom: number) =>
  Object.fromEntries(
    Object.entries(beats).map(([k, v]) => [k, v - sceneFrom]),
  ) as { [K in keyof T]: number };

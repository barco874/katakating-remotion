import { TOTAL_FRAMES, sec, vo } from "./vo";

/**
 * Scene boundaries (absolute frames). Each scene starts a few frames before
 * its first VO phrase so the visual can land on the word.
 *
 * Scenes hand off to each other by continuity (the last state of one scene
 * is the first state of the next), so boundaries are hard cuts in code but
 * read as one continuous system on screen.
 */
type SceneRange = { readonly from: number; readonly duration: number };

const range = (from: number, to: number): SceneRange => ({
  from,
  duration: to - from,
});

const PROBLEM_START = 0;
const LOST_START = vo("l1") - sec(0.2);
const REVEAL_START = vo("r1") - sec(0.4);
const DISCOVERY_START = vo("d1") - sec(0.2);
const FEATURES_START = vo("f1") - sec(0.2);
const GRAPH_START = vo("g1") - sec(0.3);
const CONTRIBUTION_START = vo("c1") - sec(0.2);
const ENDING_START = vo("e1") - sec(0.3);

export const SCENES = {
  problem: range(PROBLEM_START, LOST_START),
  lost: range(LOST_START, REVEAL_START),
  reveal: range(REVEAL_START, DISCOVERY_START),
  discovery: range(DISCOVERY_START, FEATURES_START),
  features: range(FEATURES_START, GRAPH_START),
  graph: range(GRAPH_START, CONTRIBUTION_START),
  contribution: range(CONTRIBUTION_START, ENDING_START),
  ending: range(ENDING_START, TOTAL_FRAMES),
} as const;

export type SceneId = keyof typeof SCENES;

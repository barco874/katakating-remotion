import { random } from "remotion";
import { BRAIN } from "../../data/site";

/**
 * Deterministic layout for the Knowledge Graph, modelled on THE BRAIN:
 * one cortex (KATAKATING), organs (rumpun) on an inner ring, memories
 * (catatan) around their organ, authors (triangles) on the outer ring.
 * Counts follow the site's vitals: 20 memories, 5 authors, 75 links.
 * All jitter comes from Remotion's seeded random(), so renders are stable.
 */
export type GraphNode = {
  readonly id: string;
  readonly kind: "cortex" | "organ" | "memory" | "author";
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly label?: string;
  /** Order in which the node appears during growth (0..1). */
  readonly order: number;
};

export type GraphLink = {
  readonly a: string;
  readonly b: string;
  readonly order: number;
};

const ORGAN_RING = 250;
const AUTHOR_RING = 430;

const polar = (r: number, deg: number) => ({
  x: r * Math.cos((deg * Math.PI) / 180),
  y: r * Math.sin((deg * Math.PI) / 180),
});

const build = () => {
  const nodes: GraphNode[] = [{ id: "core", kind: "cortex", x: 0, y: 0, r: 22, label: "KATAKATING", order: 0 }];
  const links: GraphLink[] = [];

  const organCount = BRAIN.organs.length;
  BRAIN.organs.forEach((label, i) => {
    const deg = -90 + (360 / organCount) * i + (random(`organ-a-${i}`) - 0.5) * 10;
    const p = polar(ORGAN_RING * (0.82 + random(`organ-r-${i}`) * 0.3), deg);
    nodes.push({ id: `o${i}`, kind: "organ", ...p, r: 12, label, order: 0.05 + (i / organCount) * 0.3 });
    links.push({ a: "core", b: `o${i}`, order: 0.05 + (i / organCount) * 0.3 });
  });

  // 20 memories distributed over organs
  for (let m = 0; m < 20; m++) {
    const organ = m % organCount;
    const base = nodes[1 + organ];
    const ang = Math.atan2(base.y, base.x) * (180 / Math.PI) + (random(`mem-a-${m}`) - 0.5) * 70;
    const dist = 80 + random(`mem-d-${m}`) * 70;
    const p = polar(dist, ang);
    nodes.push({ id: `m${m}`, kind: "memory", x: base.x + p.x, y: base.y + p.y, r: 7, order: 0.35 + (m / 20) * 0.35 });
    links.push({ a: `o${organ}`, b: `m${m}`, order: 0.35 + (m / 20) * 0.35 });
  }

  for (let a = 0; a < 5; a++) {
    const deg = -60 + a * 72 + (random(`auth-${a}`) - 0.5) * 18;
    nodes.push({ id: `a${a}`, kind: "author", ...polar(AUTHOR_RING, deg), r: 9, order: 0.6 + a * 0.05 });
  }

  // Memory → author attribution links (20)
  for (let m = 0; m < 20; m++) {
    links.push({ a: `m${m}`, b: `a${Math.floor(random(`attr-${m}`) * 5)}`, order: 0.7 + (m / 20) * 0.15 });
  }

  // Cross links between memories until the site's 75 links are reached.
  let k = 0;
  while (links.length < 75) {
    const a = Math.floor(random(`x-a-${k}`) * 20);
    const b = Math.floor(random(`x-b-${k}`) * 20);
    k++;
    if (a === b) continue;
    links.push({ a: `m${a}`, b: `m${b}`, order: 0.8 + (links.length % 15) / 75 });
  }

  return { nodes, links };
};

export const GRAPH = build();

export const nodeById = Object.fromEntries(GRAPH.nodes.map((n) => [n.id, n])) as Record<string, GraphNode>;

/** Knowledge travelling forward: an older memory → its organ → core → a newer memory. */
export const FORWARD_PATH = ["m14", "o2", "core", "o8", "m8"] as const;

/** Where a newly contributed note joins the graph (used by Contribution). */
export const NEW_NODE = { id: "new", x: nodeById.o5.x * 1.45, y: nodeById.o5.y * 1.45, parent: "o5" } as const;

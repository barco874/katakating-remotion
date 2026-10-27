import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";
import { FONT_MONO } from "../constants/fonts";
import { HEIGHT, WIDTH } from "../constants/video";
import { BrainHud } from "../components/graph/BrainHud";
import { KnowledgeGraph } from "../components/graph/KnowledgeGraph";
import { nodeById } from "../components/graph/graphData";
import { Cursor } from "../components/system/Cursor";
import { ScanWipe } from "../transitions/ScanWipe";
import { BEATS, local } from "../timing/beats";
import { SCENES } from "../timing/scenes";
import { vo } from "../timing/vo";
import { EASE, mapClamp, progress } from "../utils/anim";

const B = local(BEATS.graph, SCENES.graph.from);
const at = (absolute: number) => absolute - SCENES.graph.from;

/** Graph is drawn in a 1040-unit viewBox; this size keeps the core equal to the dot Features hands over. */
export const GRAPH_SIZE = 980;
const UNIT = GRAPH_SIZE / 1040;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 + 10 };
const ROTATE_PER_FRAME = 0.05;
const INSPECT_NODE = "o1";

/** Screen position of a graph node at a given rotation. */
export const nodeScreen = (id: string, rotateDeg: number, center = CENTER, unit = UNIT) => {
  const n = nodeById[id];
  const r = (rotateDeg * Math.PI) / 180;
  return {
    x: center.x + (n.x * Math.cos(r) - n.y * Math.sin(r)) * unit,
    y: center.y + (n.x * Math.sin(r) + n.y * Math.cos(r)) * unit,
  };
};

/**
 * 01:06 – KNOWLEDGE GRAPH. Visual breathing room: the corpus grows from the
 * single point, THE BRAIN's interface settles around it, one organ is
 * inspected, then knowledge travels forward through the network.
 */
export const SceneGraph: React.FC = () => {
  const frame = useCurrentFrame();

  const growth = mapClamp(frame, [B.core, B.organs, B.links, B.hud], [0.08, 0.1, 0.42, 1], EASE.inOut);
  const rotate = frame * ROTATE_PER_FRAME;
  const hud = progress(frame, B.hud, 16, EASE.out);
  const count = progress(frame, B.hud + 4, 24, EASE.out);
  const locked = progress(frame, B.inspect, 6, EASE.snap);
  const forward = progress(frame, B.forward, B.forwardArrive - B.forward, EASE.inOut);
  const wipe = progress(frame, B.wipe, 10, (t) => t);

  const inspectAt = nodeScreen(INSPECT_NODE, B.inspect * ROTATE_PER_FRAME);
  const cursorKeys = [
    { f: B.inspect - 30, x: 1480, y: 860 },
    { f: B.inspect - 2, x: inspectAt.x + 6, y: inspectAt.y + 6 },
    { f: B.forward, x: inspectAt.x + 30, y: inspectAt.y + 50 },
  ];

  const caption1 = progress(frame, at(vo("g4")) + 20, 8, EASE.out);
  const caption2 = progress(frame, B.forward + 6, 8, EASE.snap);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: CENTER.x - GRAPH_SIZE / 2, top: CENTER.y - GRAPH_SIZE / 2 }}>
        <KnowledgeGraph
          size={GRAPH_SIZE}
          growth={growth}
          rotate={rotate}
          rings={progress(frame, B.links, 20, EASE.out)}
          labels={progress(frame, B.organs + 6, 12, EASE.out)}
          active={INSPECT_NODE}
          activeAmount={locked}
          forward={forward}
          coreGlow={0.6 + 0.4 * (1 - progress(frame, 0, 20, EASE.out))}
        />
      </div>

      <BrainHud enter={hud} count={count} locked={locked} lockedLabel={nodeById[INSPECT_NODE].label ?? ""} />

      <Cursor keys={cursorKeys} clicks={[B.inspect]} visibleFrom={B.inspect - 30} visibleTo={B.forward + 10} size={26} />

      {/* ditemukan → diteruskan */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 92,
          display: "flex",
          justifyContent: "center",
          gap: 22,
          fontFamily: FONT_MONO,
          fontWeight: 700,
          fontSize: 34,
        }}
      >
        <span style={{ color: COLORS.textSoft, opacity: caption1 }}>ditemukan</span>
        <span style={{ color: COLORS.green, opacity: caption2, translate: `${(1 - caption2) * -16}px 0` }}>&gt; diteruskan</span>
      </div>

      <ScanWipe progress={wipe} mode="cover" />
    </AbsoluteFill>
  );
};

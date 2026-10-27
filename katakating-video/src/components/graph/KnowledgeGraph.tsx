import React from "react";
import { COLORS } from "../../constants/colors";
import { FONT_MONO } from "../../constants/fonts";
import { BRAIN } from "../../data/site";
import { FORWARD_PATH, GRAPH, NEW_NODE, nodeById } from "./graphData";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Element visibility for a growth value: each item eases in over a short window after its `order`. */
const appear = (growth: number, order: number, window = 0.08) => clamp01((growth - order) / window);

/**
 * Knowledge Graph renderer (pure SVG, deterministic).
 *
 * - `growth` 0→1 replays the corpus growing (like THE BRAIN's "replay growth").
 * - `active` highlights one node in brand green (inspector lock).
 * - `forward` 0→1 sends a green pulse along FORWARD_PATH.
 * - `joined` 0→1 adds a newly contributed note to the graph.
 */
export const KnowledgeGraph: React.FC<{
  readonly size: number;
  readonly growth: number;
  readonly rotate?: number;
  readonly rings?: number;
  readonly labels?: number;
  readonly active?: string | null;
  readonly activeAmount?: number;
  readonly forward?: number;
  readonly joined?: number;
  readonly coreGlow?: number;
  readonly style?: React.CSSProperties;
}> = ({
  size,
  growth,
  rotate = 0,
  rings = 1,
  labels = 1,
  active = null,
  activeAmount = 0,
  forward = 0,
  joined = 0,
  coreGlow = 0.6,
  style,
}) => {
  const half = 520;
  const pathNodes = FORWARD_PATH.map((id) => nodeById[id]);
  const segs = pathNodes.length - 1;
  const pulsePos = (() => {
    const t = clamp01(forward) * segs;
    const i = Math.min(segs - 1, Math.floor(t));
    const f = t - i;
    const a = pathNodes[i];
    const b = pathNodes[i + 1];
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, seg: t };
  })();
  const onPath = (a: string, b: string) => {
    for (let i = 0; i < segs; i++) {
      const x = FORWARD_PATH[i];
      const y = FORWARD_PATH[i + 1];
      if ((a === x && b === y) || (a === y && b === x)) return i;
    }
    return -1;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <defs>
        <radialGradient id="kg-core">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55 * coreGlow} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="kg-green">
          <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.55} />
          <stop offset="100%" stopColor={COLORS.green} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Timeline rings with dates (from THE BRAIN) */}
      <g opacity={rings}>
        {BRAIN.rings.map((label, i) => {
          const r = 470 - i * 46;
          return (
            <g key={label}>
              <circle r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={0} y={-r + 16} textAnchor="middle" fontFamily={FONT_MONO} fontSize={13} fill={COLORS.textDim}>
                {label}
              </text>
            </g>
          );
        })}
      </g>

      <g transform={`rotate(${rotate})`}>
        {/* Links */}
        {GRAPH.links.map((l, i) => {
          const a = nodeById[l.a];
          const b = nodeById[l.b];
          const p = appear(growth, l.order, 0.1);
          if (p <= 0) return null;
          const seg = onPath(l.a, l.b);
          const lit = seg >= 0 && forward > 0 ? clamp01(pulsePos.seg - seg) : 0;
          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={a.x + (b.x - a.x) * p}
                y2={a.y + (b.y - a.y) * p}
                stroke={l.a === "core" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.14)"}
                strokeWidth={l.a === "core" ? 1.4 : 1}
              />
              {lit > 0 ? (
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={a.x + (b.x - a.x) * lit}
                  y2={a.y + (b.y - a.y) * lit}
                  stroke={COLORS.green}
                  strokeWidth={2.4}
                />
              ) : null}
            </g>
          );
        })}

        {/* New contributed note joining via its organ */}
        {joined > 0 ? (
          <g>
            <line
              x1={nodeById[NEW_NODE.parent].x}
              y1={nodeById[NEW_NODE.parent].y}
              x2={nodeById[NEW_NODE.parent].x + (NEW_NODE.x - nodeById[NEW_NODE.parent].x) * clamp01(joined * 2)}
              y2={nodeById[NEW_NODE.parent].y + (NEW_NODE.y - nodeById[NEW_NODE.parent].y) * clamp01(joined * 2)}
              stroke={COLORS.green}
              strokeWidth={2}
            />
            <circle cx={NEW_NODE.x} cy={NEW_NODE.y} r={34 * clamp01(joined * 2 - 0.6)} fill="url(#kg-green)" />
            <circle
              cx={NEW_NODE.x}
              cy={NEW_NODE.y}
              r={9 * clamp01(joined * 2 - 0.8)}
              fill={COLORS.bg}
              stroke={COLORS.green}
              strokeWidth={3}
            />
          </g>
        ) : null}

        {/* Nodes */}
        {GRAPH.nodes.map((n) => {
          const p = appear(growth, n.order);
          if (p <= 0) return null;
          const isActive = active === n.id && activeAmount > 0;
          const passed = FORWARD_PATH.indexOf(n.id as (typeof FORWARD_PATH)[number]);
          const reached = passed >= 0 && forward > 0 && pulsePos.seg >= passed - 0.02;
          const green = isActive || reached;
          const stroke = green ? COLORS.green : "#ffffff";
          return (
            <g key={n.id} transform={`translate(${n.x} ${n.y}) scale(${p})`}>
              {n.kind === "cortex" ? <circle r={90} fill="url(#kg-core)" /> : null}
              {green ? <circle r={n.r * 3.2} fill="url(#kg-green)" opacity={isActive ? activeAmount : 1} /> : null}
              {n.kind === "author" ? (
                <path d={`M0 ${-n.r} L${n.r} ${n.r * 0.8} L${-n.r} ${n.r * 0.8} Z`} fill="#ffffff" opacity={0.85} />
              ) : n.kind === "cortex" ? (
                <circle r={n.r} fill="#ffffff" />
              ) : (
                <>
                  <circle r={n.r} fill={n.kind === "organ" ? "#ffffff" : COLORS.bg} stroke={stroke} strokeWidth={n.kind === "organ" ? 0 : 2} />
                  {n.kind === "organ" ? <circle r={2.6} fill={COLORS.bg} /> : null}
                  {green && n.kind === "organ" ? <circle r={n.r + 4} fill="none" stroke={COLORS.green} strokeWidth={2} /> : null}
                </>
              )}
              {isActive ? (
                <circle r={n.r + 10} fill="none" stroke={COLORS.green} strokeWidth={1.5} strokeDasharray="4 4" opacity={activeAmount} />
              ) : null}
            </g>
          );
        })}

        {/* Forward pulse head */}
        {forward > 0 && forward < 1 ? (
          <g transform={`translate(${pulsePos.x} ${pulsePos.y})`}>
            <circle r={26} fill="url(#kg-green)" />
            <circle r={5} fill={COLORS.green} />
          </g>
        ) : null}
      </g>

      {/* Labels stay upright: computed in rotated space, drawn unrotated */}
      <g opacity={labels}>
        {GRAPH.nodes
          .filter((n) => n.kind === "organ" || n.kind === "cortex")
          .map((n) => {
            const p = appear(growth, n.order + 0.04);
            if (p <= 0) return null;
            const rad = (rotate * Math.PI) / 180;
            const x = n.x * Math.cos(rad) - n.y * Math.sin(rad);
            const y = n.x * Math.sin(rad) + n.y * Math.cos(rad);
            const isCore = n.kind === "cortex";
            return (
              <text
                key={`l-${n.id}`}
                x={x}
                y={isCore ? y - 38 : Number(n.id.slice(1)) % 2 === 1 ? y + 32 : y - 20}
                textAnchor="middle"
                fontFamily={FONT_MONO}
                fontSize={isCore ? 17 : 14}
                fontWeight={isCore ? 700 : 500}
                letterSpacing={isCore ? "0.08em" : undefined}
                fill={active === n.id && activeAmount > 0.5 ? COLORS.green : isCore ? COLORS.text : COLORS.textSoft}
                opacity={p}
              >
                {n.label}
              </text>
            );
          })}
      </g>
    </svg>
  );
};

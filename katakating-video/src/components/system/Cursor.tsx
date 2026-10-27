import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../constants/colors";
import { EASE, mapClamp, progress } from "../../utils/anim";

export type CursorKey = {
  /** Frame (scene-local) at which the cursor arrives at this point. */
  readonly f: number;
  readonly x: number;
  readonly y: number;
};

/** Position along a keyframed path with eased segments. */
export const cursorAt = (frame: number, keys: readonly CursorKey[]) => {
  if (frame <= keys[0].f) return { x: keys[0].x, y: keys[0].y };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (frame <= b.f) {
      const t = progress(frame, a.f, b.f - a.f, EASE.inOut);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last.x, y: last.y };
};

/**
 * Pointer cursor with click feedback. `clicks` are scene-local frames;
 * each click gives a short press and a green selection ring.
 */
export const Cursor: React.FC<{
  readonly keys: readonly CursorKey[];
  readonly clicks?: readonly number[];
  readonly visibleFrom?: number;
  readonly visibleTo?: number;
  readonly size?: number;
}> = ({ keys, clicks = [], visibleFrom = -Infinity, visibleTo = Infinity, size = 30 }) => {
  const frame = useCurrentFrame();
  if (frame < visibleFrom - 6 || frame > visibleTo + 6) return null;
  const { x, y } = cursorAt(frame, keys);
  const opacity =
    mapClamp(frame, [visibleFrom - 6, visibleFrom], [0, 1]) *
    mapClamp(frame, [visibleTo, visibleTo + 6], [1, 0]);
  const lastClick = clicks.filter((c) => c <= frame).pop();
  const since = lastClick === undefined ? Infinity : frame - lastClick;
  const press = since < 6 ? mapClamp(since, [0, 2, 6], [1, 0.82, 1]) : 1;
  const ring = since < 14 ? since / 14 : -1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, pointerEvents: "none" }}>
      {ring >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: -18 - ring * 14,
            top: -18 - ring * 14,
            width: 36 + ring * 28,
            height: 36 + ring * 28,
            borderRadius: 99,
            border: `2px solid ${COLORS.green}`,
            opacity: 1 - ring,
          }}
        />
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ display: "block", scale: String(press), transformOrigin: "0 0", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }}
      >
        <path d="M3 2 L3 19 L7.5 14.8 L10.6 21.5 L13.4 20.3 L10.4 13.7 L16.5 13.4 Z" fill={COLORS.text} stroke={COLORS.bgDeep} strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

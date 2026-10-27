import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { VO_LINES } from "../timing/vo";
import { MUSIC_TRACK, SFX_LEVELS, VO_TRACK } from "./config";
import { SFX_CUES, type SfxCue } from "./sfxCues";

/**
 * Duck factor (0 = full music, 1 = fully ducked) at a frame, from the VO map.
 * No VO file yet → no ducking, so the music doesn't dip under silence.
 */
const duckAmount = (frame: number, fps: number) => {
  if (!VO_TRACK.src) return 0;
  const fade = MUSIC_TRACK.duckFadeSeconds * fps;
  let amount = 0;
  for (const line of VO_LINES) {
    const s = line.start * fps;
    const e = line.end * fps;
    const a = interpolate(frame, [s - fade, s, e, e + fade], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    amount = Math.max(amount, a);
  }
  return amount;
};

const VoiceOver: React.FC = () => {
  const { fps } = useVideoConfig();
  if (!VO_TRACK.src) return null;
  return (
    <Sequence from={Math.round(VO_TRACK.startAtSeconds * fps)} name="VO" layout="none">
      <Audio
        src={staticFile(VO_TRACK.src)}
        trimBefore={Math.round(VO_TRACK.trimStartSeconds * fps)}
        volume={VO_TRACK.volume}
      />
    </Sequence>
  );
};

const Music: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  if (!MUSIC_TRACK.src) return null;
  return (
    <Sequence name="Music" layout="none">
      <Audio
        src={staticFile(MUSIC_TRACK.src)}
        trimBefore={Math.round(MUSIC_TRACK.trimStartSeconds * fps)}
        volume={(f) => {
          const base =
            MUSIC_TRACK.volume +
            (MUSIC_TRACK.duckedVolume - MUSIC_TRACK.volume) * duckAmount(f, fps);
          const edges = interpolate(
            f,
            [0, MUSIC_TRACK.fadeInSeconds * fps, durationInFrames - MUSIC_TRACK.fadeOutSeconds * fps, durationInFrames],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return base * edges;
        }}
      />
    </Sequence>
  );
};

const sfxFile = (cue: SfxCue) =>
  staticFile(`audio/sfx/${cue.sound === "type" ? `type-${cue.variant ?? 1}` : cue.sound}.wav`);

const Sfx: React.FC = () => (
  <>
    {SFX_CUES.map((cue, i) => {
      const volume = SFX_LEVELS[cue.sound] * (cue.gain ?? 1);
      return (
        <Sequence
          key={`${cue.sound}-${i}`}
          name={`sfx:${cue.sound}`}
          from={cue.at}
          durationInFrames={cue.duration}
          layout="none"
        >
          {cue.sound === "hum" ? (
            <Audio
              src={sfxFile(cue)}
              loop
              volume={(f) =>
                volume *
                interpolate(f, [0, 20, (cue.duration ?? 60) - 25, cue.duration ?? 60], [0, 1, 1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              }
            />
          ) : (
            <Audio src={sfxFile(cue)} volume={volume} />
          )}
        </Sequence>
      );
    })}
  </>
);

/** VO + music slots (empty until files are provided) and the SFX layer. */
export const AudioLayers: React.FC = () => (
  <>
    <VoiceOver />
    <Music />
    <Sfx />
  </>
);

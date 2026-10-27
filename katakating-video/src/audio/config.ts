/**
 * AUDIO SLOTS
 *
 * VO and background music are provided later by the KATAKATING team.
 * Until then both slots are empty (src: null) and the video renders with
 * SFX only.
 *
 * To add the voice-over:
 *   1. Put the file in public/audio/vo/ (e.g. katakating-vo.wav).
 *   2. Set VO_TRACK.src to "audio/vo/katakating-vo.wav".
 *   3. Update phrase times in src/timing/vo.ts to match the recording.
 *
 * To add the music:
 *   1. Put the file in public/audio/music/ (e.g. backsound.mp3).
 *   2. Set MUSIC_TRACK.src to "audio/music/backsound.mp3".
 *   Music is automatically ducked under every VO phrase (see AudioLayers).
 */
export const VO_TRACK = {
  src: null as string | null,
  /** Seconds to skip at the start of the VO file (e.g. leading silence). */
  trimStartSeconds: 0,
  /** Seconds into the video at which the VO file starts playing. */
  startAtSeconds: 0,
  volume: 1,
};

export const MUSIC_TRACK = {
  src: null as string | null,
  trimStartSeconds: 0,
  /** Music level with no VO speaking. */
  volume: 0.55,
  /** Music level while a VO phrase is speaking. */
  duckedVolume: 0.22,
  /** Fade time into / out of ducking (seconds). */
  duckFadeSeconds: 0.25,
  /** Fade at the very start and end of the video (seconds). */
  fadeInSeconds: 1.0,
  fadeOutSeconds: 2.0,
};

/** Master levels per SFX type. Tune here, never per cue. */
export const SFX_LEVELS = {
  type: 0.22,
  click: 0.45,
  snap: 0.5,
  hit: 0.55,
  whoosh: 0.32,
  node: 0.3,
  confirm: 0.45,
  glitch: 0.4,
  brand: 0.7,
  hum: 0.35,
} as const;

export type SfxName = keyof typeof SFX_LEVELS;

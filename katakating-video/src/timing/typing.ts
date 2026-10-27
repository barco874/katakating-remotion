/**
 * Shared typing specs. The scene that shows the typing and the SFX cue
 * sheet that plays the key clicks read the same numbers.
 */
export const OPENING_TYPING = {
  text: "Pernah kepikiran...",
  charsPerFrame: 0.42,
  /** One key sound every N characters. */
  soundEvery: 2,
} as const;

export const SEARCH_TYPING = {
  text: "install",
  framesPerChar: 2.5,
} as const;

export const UPLOAD_TYPING = {
  /** Frames after the `form` beat before typing starts. */
  offset: 6,
  /** Audible keystrokes (we don't click on every typed character). */
  keystrokes: 12,
  framesPerChar: 1.6,
} as const;

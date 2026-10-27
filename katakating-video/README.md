# KATAKATING — Launch Video (Remotion)

Motion-graphic launch video for **KATAKATING**, the knowledge hub for students of Universitas Boash.
The master execution brief is the source of truth. Product UI is reconstructed from screenshots of the live website.

- Composition: `KatakatingLaunch`
- 1920 × 1080, 30 fps, ~99 s (timing follows the VO map, see below)
- 100% motion graphics. No network access at render time: fonts, logo and SFX are all local.

## Commands

```console
npm i --loglevel=error          # install
npm run dev                     # Remotion Studio preview
npx remotion render KatakatingLaunch out/katakating.mp4
npm run lint                    # eslint + tsc
python3 scripts/generate-sfx.py # regenerate the SFX palette (deterministic)
```

## Story structure

| # | Scene | File | Starts on VO |
|---|-------|------|--------------|
| 1 | Problem | `src/scenes/SceneProblem.tsx` | "Pernah kepikiran..." |
| 2 | Knowledge gets lost | `src/scenes/SceneLost.tsx` | "Tapi hilang." |
| 3 | KATAKATING reveal | `src/scenes/SceneReveal.tsx` | "Karena itu," |
| 4 | Discovery (search, category, article) | `src/scenes/SceneDiscovery.tsx` | "Satu tempat," |
| 5 | Features (guides, 4-4-3-3 template, formats) | `src/scenes/SceneFeatures.tsx` | "Bukan cuma catatan." |
| 6 | Knowledge Graph | `src/scenes/SceneGraph.tsx` | "Dan untuk melihat bagaimana" |
| 7 | Contribution | `src/scenes/SceneContribution.tsx` | "Bagikan catatanmu." |
| 8 | Final message + lockup | `src/scenes/SceneEnding.tsx` | "Satu catatan hari ini," |

Scenes hand off by continuity: the last state of one scene is the first state of the next.
For example, the caret becomes `[>]`, the lockup docks into the navbar, the code block lifts out of the page, and the new note's node becomes the final card.

## Project layout

```
src/
  KatakatingVideo.tsx      main composition (scene sequences + audio layers)
  Root.tsx                 composition registration
  timing/
    vo.ts                  VO script (verbatim) + phrase times: the single timing source
    scenes.ts              scene boundaries, derived from vo.ts
    beats.ts               named visual beats, derived from vo.ts
    typing.ts              typing specs shared by visuals and SFX
  audio/
    config.ts              VO / music slots, ducking, SFX levels
    sfxCues.ts             SFX cue sheet, anchored to beats
    AudioLayers.tsx        VO, music (auto-ducked) and SFX playback
  scenes/                  one file per scene
  components/
    brand/                 official logo (file as-is), [>] mark
    typography/            TypeOn, WordReveal, TrackingReveal, ScrambleText, Caret
    ui/                    website reconstruction: Navbar, NoteCard, SearchPanel, ArticlePage, UploadParts
    window/                BrowserWindow (native-size page scaled into a frame)
    terminal/              CodeBlock (site style), SolutionCard
    graph/                 KnowledgeGraph (deterministic layout), BrainHud
    system/                Cursor, SystemBackground
    icons/                 line icons
  transitions/             ScanWipe
  constants/               colors, fonts, video size
  data/site.ts             all on-screen website copy, verbatim from the screenshots
public/
  brand/logo-katakating-white.svg   official logo, unmodified
  fonts/                   JetBrains Mono + Inter (OFL, see LICENSE files)
  audio/sfx/               generated SFX palette
  audio/vo/                put the recorded VO here
  audio/music/             put the backsound here
scripts/generate-sfx.py    SFX synthesizer
```

## Adding the voice-over (after recording)

1. Put the file in `public/audio/vo/`, e.g. `katakating-vo.wav`.
2. In `src/audio/config.ts`, set `VO_TRACK.src = "audio/vo/katakating-vo.wav"`. Use `trimStartSeconds` if the take has leading silence.
3. In `src/timing/vo.ts`, replace each phrase's `start` / `end` (seconds) with the times measured from the recording.

Everything else follows automatically: scene boundaries, visual beats, SFX cues, music ducking and total duration.
Do not edit the VO text in `vo.ts`. It is the master-brief script.

## Adding the backsound

1. Put the file in `public/audio/music/`, e.g. `backsound.mp3`.
2. In `src/audio/config.ts`, set `MUSIC_TRACK.src = "audio/music/backsound.mp3"`.

The music is ducked automatically under every VO phrase (`volume`, `duckedVolume`, `duckFadeSeconds`) and fades in and out at the edges.

## SFX

The palette is synthesized by `scripts/generate-sfx.py`. It is license-free and deterministic.

| Sound | Use |
|-------|-----|
| `type-1..3` | key presses for type-on and search |
| `click` | real UI interactions (search, filter, open, submit) |
| `snap` | something locks into place |
| `hit` | short VO statements ("Error yang sama.") |
| `whoosh` | scene transitions |
| `glitch` | knowledge disappearing |
| `node` | node activation / knowledge moving |
| `confirm` | conversion done, ticket issued |
| `brand` | `[>]` reveal and final lockup |
| `hum` | soft bed under the Knowledge Graph |

Levels are set per sound type in `SFX_LEVELS` (`src/audio/config.ts`). Cues are set in `src/audio/sfxCues.ts`.

## Rules kept from the brief

- The VO script is used verbatim. Brand accent `#00FF66` is used only for reveal, highlight, cursor/selection, active node, transitions and the brand moment.
- The `[>]` mark is used for the reveal, transitions and the final lockup. The official logo is used unmodified for UI and the brand lockup.
- All site copy (`src/data/site.ts`) is taken verbatim from the reference screenshots.
- The form state after upload and the WSL article page are reconstructed only from verified site layouts and flows.
- All animation is frame-driven and deterministic (seeded `random()`, no CSS animations).

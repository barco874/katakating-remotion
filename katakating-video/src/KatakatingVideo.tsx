import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AudioLayers } from "./audio/AudioLayers";
import { SystemBackground } from "./components/system/SystemBackground";
import "./constants/fonts";
import { SceneContribution } from "./scenes/SceneContribution";
import { SceneDiscovery } from "./scenes/SceneDiscovery";
import { SceneEnding } from "./scenes/SceneEnding";
import { SceneFeatures } from "./scenes/SceneFeatures";
import { SceneGraph } from "./scenes/SceneGraph";
import { SceneLost } from "./scenes/SceneLost";
import { SceneProblem } from "./scenes/SceneProblem";
import { SceneReveal } from "./scenes/SceneReveal";
import { SCENES } from "./timing/scenes";

/**
 * KATAKATING — launch video.
 *
 * PROBLEM → KNOWLEDGE GETS LOST → REVEAL → DISCOVERY → FEATURES →
 * KNOWLEDGE GRAPH → CONTRIBUTION → FINAL MESSAGE
 *
 * Scene boundaries come from timing/scenes.ts (derived from the VO map).
 */
export const KatakatingVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", fontVariantLigatures: "none" }}>
    <SystemBackground />
    <Sequence name="01 Problem" from={SCENES.problem.from} durationInFrames={SCENES.problem.duration}>
      <SceneProblem />
    </Sequence>
    <Sequence name="02 Knowledge gets lost" from={SCENES.lost.from} durationInFrames={SCENES.lost.duration}>
      <SceneLost />
    </Sequence>
    <Sequence name="03 Reveal" from={SCENES.reveal.from} durationInFrames={SCENES.reveal.duration}>
      <SceneReveal />
    </Sequence>
    <Sequence name="04 Discovery" from={SCENES.discovery.from} durationInFrames={SCENES.discovery.duration}>
      <SceneDiscovery />
    </Sequence>
    <Sequence name="05 Features" from={SCENES.features.from} durationInFrames={SCENES.features.duration}>
      <SceneFeatures />
    </Sequence>
    <Sequence name="06 Knowledge Graph" from={SCENES.graph.from} durationInFrames={SCENES.graph.duration}>
      <SceneGraph />
    </Sequence>
    <Sequence name="07 Contribution" from={SCENES.contribution.from} durationInFrames={SCENES.contribution.duration}>
      <SceneContribution />
    </Sequence>
    <Sequence name="08 Final message" from={SCENES.ending.from} durationInFrames={SCENES.ending.duration}>
      <SceneEnding />
    </Sequence>
    <AudioLayers />
  </AbsoluteFill>
);

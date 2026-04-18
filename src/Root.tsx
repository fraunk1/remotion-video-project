import React from "react";
import { Composition, staticFile } from "remotion";
import { Presentation } from "./compositions/Presentation";
import { SocialClip } from "./compositions/SocialClip";
import { DataDashboard } from "./compositions/DataDashboard";
import { NarratedPresentation } from "./compositions/NarratedPresentation";
import { ChilesBriefing } from "./compositions/ChilesBriefing";
import { MedReviewBriefing } from "./compositions/MedReviewBriefing";
import { GenericBriefing } from "./compositions/GenericBriefing";
import type { Scene } from "./scenes/types";

const MIN_SLIDE_SECONDS = 4;
const NARRATED_FPS = 30;
const INTRO_BUFFER_FRAMES = 45;  // must match NarratedPresentation.tsx
const CHILES_OUTRO_BUFFER_FRAMES = 36; // must match ChilesBriefing.tsx

const loadScene = async (sceneName: string): Promise<Scene> => {
  const url = staticFile(`scenes/${sceneName}.json`);
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to load scene '${sceneName}': ${resp.status} ${resp.statusText}`);
  }
  return (await resp.json()) as Scene;
};

const computeNarratedDurationFrames = (scene: Scene, fps: number, withOutroBuffer = false): number => {
  const lastIdx = scene.slides.length - 1;
  const total = scene.slides.reduce((acc, slide, idx) => {
    const audioSeconds = slide.audio.duration_seconds || 0;
    const slideSeconds = Math.max(audioSeconds, MIN_SLIDE_SECONDS);
    let frames = Math.max(1, Math.ceil(slideSeconds * fps));
    if (idx === 0) frames += INTRO_BUFFER_FRAMES;
    if (withOutroBuffer && idx === lastIdx) frames += CHILES_OUTRO_BUFFER_FRAMES;
    return acc + frames;
  }, 0);
  return Math.max(1, total);
};

const emptyScene: Scene = {
  version: 1,
  source_deck: "",
  title: "Loading...",
  captions: true,
  voice: { sample_id: "", sample_path: "", reference_text: "" },
  theme: { accent: "#F7941D", navy: "#2E4A6E", font: "DM Sans" },
  slides: [],
};

export const Root: React.FC = () => {
  return (
    <>
      {/* Presentation — 16:9 widescreen slide deck */}
      <Composition
        id="Presentation"
        component={Presentation}
        durationInFrames={810}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Social Clip — 9:16 vertical for Reels / TikTok / Shorts */}
      <Composition
        id="SocialClip"
        component={SocialClip}
        durationInFrames={420}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Data Dashboard — 16:9 animated metrics dashboard */}
      <Composition
        id="DataDashboard"
        component={DataDashboard}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Chiles v. Salazar — fully-animated React briefing */}
      <Composition
        id="ChilesBriefing"
        component={ChilesBriefing}
        fps={NARRATED_FPS}
        width={1920}
        height={1080}
        defaultProps={{ sceneData: emptyScene }}
        durationInFrames={1}
        calculateMetadata={async ({ props }) => {
          const anyProps = props as unknown as { sceneData?: Scene };
          try {
            const scene = await loadScene("chiles");
            return {
              durationInFrames: computeNarratedDurationFrames(scene, NARRATED_FPS, true),
              props: { sceneData: scene } as unknown as typeof props,
            };
          } catch (e) {
            console.warn("ChilesBriefing: could not load scene 'chiles':", e);
            return { durationInFrames: 1 };
          }
        }}
      />

      {/* MedReview Pitch — fully-animated React briefing */}
      <Composition
        id="MedReviewBriefing"
        component={MedReviewBriefing}
        fps={NARRATED_FPS}
        width={1920}
        height={1080}
        defaultProps={{ sceneData: emptyScene }}
        durationInFrames={1}
        calculateMetadata={async ({ props }) => {
          const anyProps = props as unknown as { sceneData?: Scene };
          try {
            const scene = await loadScene("medreview-pitch");
            return {
              durationInFrames: computeNarratedDurationFrames(scene, NARRATED_FPS, true),
              props: { sceneData: scene } as unknown as typeof props,
            };
          } catch (e) {
            console.warn("MedReviewBriefing: could not load scene 'medreview-pitch':", e);
            return { durationInFrames: 1 };
          }
        }}
      />

      {/*
        AIMSA now renders through GenericBriefing (see below) — the bespoke
        AimsaBriefing composition was retired in Phase 4b once the 9 shared
        lib components reached v19 parity. Scene name is `aimsa`.
      */}

      {/*
        GenericBriefing — data-driven briefing composition.
        Render any briefing with:
          npx remotion render GenericBriefing out/foo.mp4 --props='{"sceneName":"foo"}'
        Briefings that need custom slide types should create a tiny wrapper
        composition in compositions/ that passes a componentRegistry prop.
      */}
      <Composition
        id="GenericBriefing"
        component={GenericBriefing}
        fps={NARRATED_FPS}
        width={1920}
        height={1080}
        defaultProps={{ sceneData: emptyScene }}
        durationInFrames={1}
        calculateMetadata={async ({ props }) => {
          const anyProps = props as unknown as { sceneName?: string; sceneData?: Scene };
          const sceneName = anyProps.sceneName;
          if (!sceneName) {
            return { durationInFrames: 1 };
          }
          try {
            const scene = await loadScene(sceneName);
            return {
              durationInFrames: computeNarratedDurationFrames(scene, NARRATED_FPS, true),
              props: { sceneData: scene } as unknown as typeof props,
            };
          } catch (e) {
            console.warn(`GenericBriefing: could not load scene '${sceneName}':`, e);
            return { durationInFrames: 1 };
          }
        }}
      />

      {/* Narrated Presentation — data-driven from scenes/<name>.json */}
      <Composition
        id="NarratedPresentation"
        component={NarratedPresentation}
        fps={NARRATED_FPS}
        width={1920}
        height={1080}
        defaultProps={{ sceneData: emptyScene }}
        durationInFrames={1}
        calculateMetadata={async ({ props }) => {
          // Scene name is expected to be passed via --props='{"sceneName":"<name>"}'.
          // The build_video.py wrapper handles this. When opened in Studio without a
          // sceneName, fall back to rendering an empty (1-frame) composition.
          const anyProps = props as unknown as { sceneName?: string; sceneData?: Scene };
          const sceneName = anyProps.sceneName;
          if (!sceneName) {
            return { durationInFrames: 1 };
          }
          try {
            const scene = await loadScene(sceneName);
            return {
              durationInFrames: computeNarratedDurationFrames(scene, NARRATED_FPS),
              props: { sceneData: scene } as unknown as typeof props,
            };
          } catch (e) {
            console.warn(`NarratedPresentation: could not load scene '${sceneName}':`, e);
            return { durationInFrames: 1 };
          }
        }}
      />
    </>
  );
};

import React from "react";
import { Composition, staticFile } from "remotion";
import { Presentation } from "./compositions/Presentation";
import { SocialClip } from "./compositions/SocialClip";
import { DataDashboard } from "./compositions/DataDashboard";
import { NarratedPresentation } from "./compositions/NarratedPresentation";
import type { Scene } from "./scenes/types";

const MIN_SLIDE_SECONDS = 4;
const NARRATED_FPS = 30;

const loadScene = async (sceneName: string): Promise<Scene> => {
  const url = staticFile(`scenes/${sceneName}.json`);
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to load scene '${sceneName}': ${resp.status} ${resp.statusText}`);
  }
  return (await resp.json()) as Scene;
};

const computeNarratedDurationFrames = (scene: Scene, fps: number): number => {
  const total = scene.slides.reduce((acc, slide) => {
    const audioSeconds = slide.audio.duration_seconds || 0;
    const slideSeconds = Math.max(audioSeconds, MIN_SLIDE_SECONDS);
    return acc + Math.max(1, Math.ceil(slideSeconds * fps));
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

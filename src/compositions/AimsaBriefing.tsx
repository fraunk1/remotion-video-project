import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/DMSans";
import { Scene } from "../scenes/types";
import { AimsaTitle } from "../components/aimsa/AimsaTitle";
import { AimsaAgenda } from "../components/aimsa/AimsaAgenda";
import { AimsaSectionHeader } from "../components/aimsa/AimsaSectionHeader";
import { AimsaThreeBills } from "../components/aimsa/AimsaThreeBills";
import { AimsaParallelBoard } from "../components/aimsa/AimsaParallelBoard";
import { AimsaSevenMoves } from "../components/aimsa/AimsaSevenMoves";
import { AimsaComparativeLandscape } from "../components/aimsa/AimsaComparativeLandscape";
import { AimsaFDAGap } from "../components/aimsa/AimsaFDAGap";
import { AimsaClosing } from "../components/aimsa/AimsaClosing";

// Load DM Sans once globally so all child components inherit fontFamily.
loadFont();

const MIN_SLIDE_SECONDS = 3;
const INTRO_BUFFER_FRAMES = 30;   // 1.0s silent intro on slide 1
const OUTRO_BUFFER_FRAMES = 36;   // ~1.2s of visual beat on closing before audio
const TRAIL_BUFFER_FRAMES = 12;   // ~0.4s after audio ends, before next slide cuts in

export type AimsaBriefingProps = { sceneData: Scene };

const renderSlide = (slideId: string): React.ReactElement => {
  switch (slideId) {
    case "slide_01":
      return <AimsaTitle />;
    case "slide_02":
      return <AimsaAgenda />;
    case "slide_03":
      return (
        <AimsaSectionHeader
          partLabel="Part I"
          title="The Bills"
          subtitle="Cicero AIMSA · Idaho HB 945 · Iowa HSB 766"
          color="blue"
        />
      );
    case "slide_04":
      return <AimsaThreeBills />;
    case "slide_05":
      return (
        <AimsaSectionHeader
          partLabel="Part II"
          title="The Headline Finding"
          subtitle="A new &quot;Board of Autonomous Medical Practice&quot; that bypasses the existing medical board"
          color="orange"
        />
      );
    case "slide_06":
      return <AimsaParallelBoard />;
    case "slide_07":
      return (
        <AimsaSectionHeader
          partLabel="Part III"
          title="Seven Considerations"
          subtitle="Coordinated design choices that reinforce each other"
          color="blue"
        />
      );
    case "slide_08":
      return <AimsaSevenMoves />;
    case "slide_09":
      return (
        <AimsaSectionHeader
          partLabel="Part IV"
          title="What This Means"
          subtitle="The comparative landscape, the FDA limits, and the FSMB response"
          color="orange"
        />
      );
    case "slide_10":
      return <AimsaComparativeLandscape />;
    case "slide_11":
      return <AimsaFDAGap />;
    case "slide_12":
      return <AimsaClosing />;
    default:
      return <AbsoluteFill style={{ background: "#F5F7FA" }} />;
  }
};

export const AimsaBriefing: React.FC<AimsaBriefingProps> = ({ sceneData }) => {
  const { fps } = useVideoConfig();

  const lastIdx = sceneData.slides.length - 1;
  let runningFrame = 0;
  const ranges = sceneData.slides.map((slide, idx) => {
    const audioSec = slide.audio.duration_seconds || 0;
    const slideSec = Math.max(audioSec, MIN_SLIDE_SECONDS);
    // Add a small trail buffer per slide so audio fully plays before the
    // visual cuts to the next slide — prevents end-of-narration clipping
    // at slide-to-slide transitions.
    let durationInFrames = Math.max(1, Math.ceil(slideSec * fps) + TRAIL_BUFFER_FRAMES);
    if (idx === 0) durationInFrames += INTRO_BUFFER_FRAMES;
    if (idx === lastIdx) durationInFrames += OUTRO_BUFFER_FRAMES;
    const startFrame = runningFrame;
    runningFrame += durationInFrames;
    return { slide, startFrame, durationInFrames };
  });

  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      {ranges.map(({ slide, startFrame, durationInFrames }, idx) => (
        <Sequence key={slide.id} from={startFrame} durationInFrames={durationInFrames}>
          {renderSlide(slide.id)}
          {slide.audio.file && (
            <Sequence from={idx === 0 ? INTRO_BUFFER_FRAMES : (idx === lastIdx ? OUTRO_BUFFER_FRAMES : 0)}>
              <Audio src={staticFile(slide.audio.file)} />
            </Sequence>
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

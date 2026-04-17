import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/DMSans";
import { Scene } from "../scenes/types";
import { MedReviewTitle } from "../components/medreview/MedReviewTitle";
import { MedReviewComplaintArrives } from "../components/medreview/MedReviewComplaintArrives";
import { MedReviewChallenge } from "../components/medreview/MedReviewChallenge";
import { MedReviewSectionHeader } from "../components/medreview/MedReviewSectionHeader";
import { MedReviewWhatItDoes } from "../components/medreview/MedReviewWhatItDoes";
import { MedReviewPipeline } from "../components/medreview/MedReviewPipeline";
import { MedReviewOCR } from "../components/medreview/MedReviewOCR";
import { MedReviewCaseAnalysis } from "../components/medreview/MedReviewCaseAnalysis";
import { MedReviewSyntheticPipeline } from "../components/medreview/MedReviewSyntheticPipeline";
import { MedReviewStatus } from "../components/medreview/MedReviewStatus";
import { MedReviewReviewProcess } from "../components/medreview/MedReviewReviewProcess";
import { MedReviewClosing } from "../components/medreview/MedReviewClosing";

loadFont();

const MIN_SLIDE_SECONDS = 3;
const INTRO_BUFFER_FRAMES = 30;
const OUTRO_BUFFER_FRAMES = 36;

export type MedReviewBriefingProps = { sceneData: Scene };

const renderSlide = (slideId: string): React.ReactElement => {
  switch (slideId) {
    case "slide_01":
      return <MedReviewTitle />;
    case "slide_02":
      return <MedReviewComplaintArrives />;
    case "slide_03":
      return <MedReviewChallenge />;
    case "slide_04":
      return (
        <MedReviewSectionHeader
          partLabel="Part I"
          title="Introducing MedReview"
          subtitle="What it does, how it works, and the technology behind it"
          color="blue"
        />
      );
    case "slide_05":
      return <MedReviewWhatItDoes />;
    case "slide_06":
      return <MedReviewPipeline />;
    case "slide_07":
      return <MedReviewOCR />;
    case "slide_08":
      return <MedReviewCaseAnalysis />;
    case "slide_09":
      return (
        <MedReviewSectionHeader
          partLabel="Part II"
          title="Safe, Synthetic Test Data"
          subtitle="Patient privacy is paramount — the entire corpus is synthetic"
          color="orange"
        />
      );
    case "slide_10":
      return <MedReviewSyntheticPipeline />;
    case "slide_11":
      return <MedReviewStatus />;
    case "slide_12":
      return (
        <MedReviewSectionHeader
          partLabel="Part III"
          title="We Need Your Expertise"
          subtitle="Physician subject matter experts evaluate MedReview's clinical output"
          color="blue"
        />
      );
    case "slide_13":
      return <MedReviewReviewProcess />;
    case "slide_14":
      return <MedReviewClosing />;
    default:
      return <AbsoluteFill style={{ background: "#F5F7FA" }} />;
  }
};

export const MedReviewBriefing: React.FC<MedReviewBriefingProps> = ({ sceneData }) => {
  const { fps } = useVideoConfig();

  const lastIdx = sceneData.slides.length - 1;
  let runningFrame = 0;
  const ranges = sceneData.slides.map((slide, idx) => {
    const audioSec = slide.audio.duration_seconds || 0;
    const slideSec = Math.max(audioSec, MIN_SLIDE_SECONDS);
    let durationInFrames = Math.max(1, Math.ceil(slideSec * fps));
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
            <Sequence
              from={
                idx === 0
                  ? INTRO_BUFFER_FRAMES
                  : idx === lastIdx
                  ? OUTRO_BUFFER_FRAMES
                  : 0
              }
            >
              <Audio src={staticFile(slide.audio.file)} />
            </Sequence>
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

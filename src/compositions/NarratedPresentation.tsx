import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Scene, Slide } from "../scenes/types";
import { TitleSlide } from "../components/slides_narrated/TitleSlide";
import { BulletsSlide } from "../components/slides_narrated/BulletsSlide";
import { QuoteSlide } from "../components/slides_narrated/QuoteSlide";
import { ClosingSlide } from "../components/slides_narrated/ClosingSlide";
import { ContentSlide } from "../components/slides_narrated/ContentSlide";
import { TwoColumnSlide } from "../components/slides_narrated/TwoColumnSlide";
import { Captions } from "../components/Captions";

const MIN_SLIDE_SECONDS = 4;

export type NarratedPresentationProps = {
  sceneData: Scene;
};

const renderSlide = (slide: Slide, slideDurationFrames: number) => {
  switch (slide.type) {
    case "title":
      return <TitleSlide slide={slide} />;
    case "bullets":
      return <BulletsSlide slide={slide} slideDurationFrames={slideDurationFrames} />;
    case "quote":
      return <QuoteSlide slide={slide} />;
    case "closing":
      return <ClosingSlide slide={slide} />;
    case "twoColumn":
      return <TwoColumnSlide slide={slide} />;
    case "content":
    default:
      return <ContentSlide slide={slide} />;
  }
};

export const NarratedPresentation: React.FC<NarratedPresentationProps> = ({ sceneData }) => {
  const { fps } = useVideoConfig();

  let runningFrame = 0;
  const slideFrameRanges = sceneData.slides.map((slide) => {
    const audioSeconds = slide.audio.duration_seconds || 0;
    const slideSeconds = Math.max(audioSeconds, MIN_SLIDE_SECONDS);
    const durationInFrames = Math.max(1, Math.ceil(slideSeconds * fps));
    const startFrame = runningFrame;
    runningFrame += durationInFrames;
    return { slide, startFrame, durationInFrames };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAF9" }}>
      {slideFrameRanges.map(({ slide, startFrame, durationInFrames }) => (
        <Sequence key={slide.id} from={startFrame} durationInFrames={durationInFrames}>
          {renderSlide(slide, durationInFrames)}
          {slide.audio.file && <Audio src={staticFile(slide.audio.file)} />}
          {sceneData.captions && (
            <Captions
              notes={slide.notes}
              slideStartFrame={0}
              slideDurationFrames={durationInFrames}
            />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

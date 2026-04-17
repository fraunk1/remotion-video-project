import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Scene, Slide } from "../scenes/types";
import { TitleSlide } from "../components/slides_narrated/TitleSlide";
import { BulletsSlide } from "../components/slides_narrated/BulletsSlide";
import { QuoteSlide } from "../components/slides_narrated/QuoteSlide";
import { ClosingSlide } from "../components/slides_narrated/ClosingSlide";
import { ContentSlide } from "../components/slides_narrated/ContentSlide";
import { TwoColumnSlide } from "../components/slides_narrated/TwoColumnSlide";
import { ScreenshotSlide } from "../components/slides_narrated/ScreenshotSlide";
import { Captions } from "../components/Captions";
import { ChilesBottomBar } from "../components/ChilesBottomBar";

const MIN_SLIDE_SECONDS = 4;
const INTRO_BUFFER_FRAMES = 45; // 1.5s at 30fps — silence before first slide's audio

export type NarratedPresentationProps = {
  sceneData: Scene;
};

const renderSlide = (slide: Slide, slideDurationFrames: number) => {
  // If the slide has a screenshot image, render it full-bleed
  // (used for complex decks where HTML→React conversion loses fidelity)
  if (slide.image) {
    return <ScreenshotSlide slide={slide} />;
  }

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
  const slideFrameRanges = sceneData.slides.map((slide, idx) => {
    const audioSeconds = slide.audio.duration_seconds || 0;
    const slideSeconds = Math.max(audioSeconds, MIN_SLIDE_SECONDS);
    let durationInFrames = Math.max(1, Math.ceil(slideSeconds * fps));
    // Slide 1 has a pre-audio silent buffer — extend its duration so the
    // audio isn't clipped by the outer Sequence's durationInFrames.
    if (idx === 0) durationInFrames += INTRO_BUFFER_FRAMES;
    const startFrame = runningFrame;
    runningFrame += durationInFrames;
    return { slide, startFrame, durationInFrames };
  });

  const totalFrames = runningFrame;

  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAF9" }}>
      {slideFrameRanges.map(({ slide, startFrame, durationInFrames }, idx) => (
        <Sequence key={slide.id} from={startFrame} durationInFrames={durationInFrames}>
          {renderSlide(slide, durationInFrames)}
          <ChilesBottomBar
            slideIndex={idx}
            startFrame={startFrame}
            totalFrames={totalFrames}
          />
          {slide.audio.file && (
            <Sequence from={startFrame === 0 ? INTRO_BUFFER_FRAMES : 0}>
              <Audio src={staticFile(slide.audio.file)} />
            </Sequence>
          )}
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

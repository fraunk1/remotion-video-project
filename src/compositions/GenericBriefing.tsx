import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/DMSans";
import { Scene, Slide } from "../scenes/types";
import {
  BriefingTitle,
  BriefingSectionHeader,
  BriefingClosing,
  BriefingContent,
  BriefingIconRow,
  BriefingWorkflowChevrons,
  BriefingComparativePanels,
  BriefingSourcesGrid,
  BriefingTakeawayGraySwoosh,
} from "../lib";

loadFont();

const MIN_SLIDE_SECONDS = 3;
const INTRO_BUFFER_FRAMES = 30;
const OUTRO_BUFFER_FRAMES = 36;

/**
 * Props passed to every registered slide component. Custom components
 * receive the whole slide plus any scene-level context they need; per-slide
 * data is available via `slide.props` or destructured from the slide.
 */
export interface RegisteredSlideProps {
  slide: Slide;
  scene: Scene;
  slideIndex: number;
  slideDurationFrames: number;
}

export type SlideComponent = React.ComponentType<RegisteredSlideProps>;

/**
 * Default registry — built-in slide types. Briefings may extend this by
 * passing a componentRegistry prop to GenericBriefing with additional
 * entries. Unknown types fall back to BriefingContent.
 */
const defaultRegistry: Record<string, SlideComponent> = {
  title: ({ slide }) => {
    const p = (slide.props ?? {}) as Record<string, unknown>;
    return (
      <BriefingTitle
        logoPath={p.logoPath as string | undefined}
        eyebrow={p.eyebrow as string | undefined}
        titleAccent={p.titleAccent as string | undefined}
        titleMain={(p.titleMain as string | undefined) ?? slide.title}
        subtitle={(p.subtitle as string | undefined) ?? slide.subtitle ?? undefined}
        presenter={p.presenter as string | undefined}
        presenterRole={p.presenterRole as string | undefined}
        caseCite={p.caseCite as string | undefined}
      />
    );
  },
  section_header: ({ slide }) => {
    const p = (slide.props ?? {}) as Record<string, unknown>;
    return (
      <BriefingSectionHeader
        partLabel={(p.partLabel as string) ?? ""}
        title={(p.title as string | undefined) ?? slide.title}
        subtitle={(p.subtitle as string | undefined) ?? slide.subtitle ?? undefined}
        color={((p.color as string | undefined) ?? "blue") as "blue" | "orange"}
      />
    );
  },
  closing: ({ slide }) => {
    const p = (slide.props ?? {}) as Record<string, unknown>;
    return (
      <BriefingClosing
        headline={(p.headline as string | undefined) ?? slide.title}
        quote={p.quote as string | undefined}
        quoteSource={p.quoteSource as string | undefined}
        stickerPath={p.stickerPath as string | undefined}
      />
    );
  },
  content: ({ slide }) => {
    const p = (slide.props ?? {}) as Record<string, unknown>;
    return (
      <BriefingContent
        eyebrow={p.eyebrow as string | undefined}
        title={slide.title}
        subtitle={slide.subtitle ?? undefined}
        bullets={slide.bullets}
        image={slide.image ?? undefined}
        logoPath={p.logoPath as string | undefined}
      />
    );
  },
  bullets: ({ slide }) => {
    const p = (slide.props ?? {}) as Record<string, unknown>;
    return (
      <BriefingContent
        eyebrow={p.eyebrow as string | undefined}
        title={slide.title}
        subtitle={slide.subtitle ?? undefined}
        bullets={slide.bullets}
        logoPath={p.logoPath as string | undefined}
      />
    );
  },
  icon_row: ({ slide }) => <BriefingIconRow slide={slide} />,
  workflow_chevrons: ({ slide }) => <BriefingWorkflowChevrons slide={slide} />,
  comparative_panels: ({ slide }) => <BriefingComparativePanels slide={slide} />,
  sources_grid: ({ slide }) => <BriefingSourcesGrid slide={slide} />,
  takeaway_gray_swoosh: ({ slide }) => <BriefingTakeawayGraySwoosh slide={slide} />,
};

export type GenericBriefingProps = {
  sceneData: Scene;
  componentRegistry?: Record<string, SlideComponent>;
};

export const GenericBriefing: React.FC<GenericBriefingProps> = ({
  sceneData,
  componentRegistry = {},
}) => {
  const { fps } = useVideoConfig();
  const registry = { ...defaultRegistry, ...componentRegistry };

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
      {ranges.map(({ slide, startFrame, durationInFrames }, idx) => {
        const Component = registry[slide.type] ?? registry.content;
        return (
          <Sequence key={slide.id} from={startFrame} durationInFrames={durationInFrames}>
            <Component
              slide={slide}
              scene={sceneData}
              slideIndex={idx}
              slideDurationFrames={durationInFrames}
            />
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
        );
      })}
    </AbsoluteFill>
  );
};

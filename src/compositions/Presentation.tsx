/**
 * Presentation-Style Video — Animated slide deck.
 * Edit the THEME, SLIDES array, and slide components to customize.
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  TransitionSeries,
  springTiming,
  linearTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { useFadeSlideIn } from "../components/animations";

// ============================================================
// CONSTANTS — Edit these to customize the presentation
// ============================================================

const THEME = {
  bg: "#0f172a",
  surface: "#1e293b",
  primary: "#3b82f6",
  accent: "#f59e0b",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  font: "Inter, system-ui, sans-serif",
};

const LAYOUT = {
  padding: 80,
  headingSize: 72,
  subheadingSize: 36,
  bodySize: 28,
  bulletSize: 32,
};

const SLIDES = [
  {
    type: "title" as const,
    title: "Quarterly Business Review",
    subtitle: "Q1 2026 — Growth & Strategy",
    duration: 150,
  },
  {
    type: "bullets" as const,
    title: "Key Highlights",
    bullets: [
      "Revenue up 23% year-over-year",
      "Customer base expanded to 10,000+",
      "Launched 3 new product lines",
      "Net promoter score reached 72",
    ],
    duration: 210,
  },
  {
    type: "twoColumn" as const,
    title: "Market Position",
    leftContent:
      "Our market share grew from 12% to 18% in the enterprise segment, driven by our AI-powered features.",
    rightLabel: "Market Share",
    rightValue: "18%",
    duration: 180,
  },
  {
    type: "quote" as const,
    quote:
      "Innovation distinguishes between a leader and a follower.",
    attribution: "Strategic Vision",
    duration: 150,
  },
  {
    type: "closing" as const,
    title: "Thank You",
    subtitle: "Questions & Discussion",
    duration: 120,
  },
];

// ============================================================
// SLIDE COMPONENTS
// ============================================================

const TitleSlide: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  const titleStyle = useFadeSlideIn(0);
  const subtitleStyle = useFadeSlideIn(15);
  const lineStyle = useFadeSlideIn(10);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: LAYOUT.padding,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontFamily: THEME.font,
            fontSize: LAYOUT.headingSize,
            fontWeight: 700,
            color: THEME.text,
            margin: 0,
            lineHeight: 1.2,
            ...titleStyle,
          }}
        >
          {title}
        </h1>
        <div
          style={{
            width: 120,
            height: 4,
            backgroundColor: THEME.primary,
            margin: "30px auto",
            borderRadius: 2,
            ...lineStyle,
          }}
        />
        <p
          style={{
            fontFamily: THEME.font,
            fontSize: LAYOUT.subheadingSize,
            color: THEME.textMuted,
            margin: 0,
            ...subtitleStyle,
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};

const BulletSlide: React.FC<{ title: string; bullets: string[] }> = ({
  title,
  bullets,
}) => {
  const titleStyle = useFadeSlideIn(0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        padding: LAYOUT.padding,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontFamily: THEME.font,
          fontSize: LAYOUT.headingSize * 0.8,
          fontWeight: 700,
          color: THEME.text,
          marginBottom: 50,
          ...titleStyle,
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {bullets.map((bullet, i) => {
          const itemStyle = useFadeSlideIn(15 + i * 10);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                ...itemStyle,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: THEME.primary,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: THEME.font,
                  fontSize: LAYOUT.bulletSize,
                  color: THEME.text,
                  lineHeight: 1.5,
                }}
              >
                {bullet}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TwoColumnSlide: React.FC<{
  title: string;
  leftContent: string;
  rightLabel: string;
  rightValue: string;
}> = ({ title, leftContent, rightLabel, rightValue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleStyle = useFadeSlideIn(0);
  const leftStyle = useFadeSlideIn(15);
  const rightStyle = useFadeSlideIn(25);

  const valueScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        padding: LAYOUT.padding,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontFamily: THEME.font,
          fontSize: LAYOUT.headingSize * 0.8,
          fontWeight: 700,
          color: THEME.text,
          marginBottom: 50,
          ...titleStyle,
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", gap: 60 }}>
        <div style={{ flex: 1, ...leftStyle }}>
          <p
            style={{
              fontFamily: THEME.font,
              fontSize: LAYOUT.bodySize,
              color: THEME.textMuted,
              lineHeight: 1.7,
            }}
          >
            {leftContent}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: THEME.surface,
            borderRadius: 24,
            padding: 40,
            ...rightStyle,
          }}
        >
          <span
            style={{
              fontFamily: THEME.font,
              fontSize: 96,
              fontWeight: 800,
              color: THEME.primary,
              transform: `scale(${valueScale})`,
            }}
          >
            {rightValue}
          </span>
          <span
            style={{
              fontFamily: THEME.font,
              fontSize: LAYOUT.bodySize,
              color: THEME.textMuted,
              marginTop: 10,
            }}
          >
            {rightLabel}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const QuoteSlide: React.FC<{ quote: string; attribution: string }> = ({
  quote,
  attribution,
}) => {
  const quoteStyle = useFadeSlideIn(0);
  const attrStyle = useFadeSlideIn(20);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: LAYOUT.padding * 2,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: THEME.font,
            fontSize: 120,
            color: THEME.primary,
            opacity: 0.3,
            lineHeight: 0.5,
          }}
        >
          &ldquo;
        </span>
        <p
          style={{
            fontFamily: THEME.font,
            fontSize: 44,
            fontWeight: 500,
            fontStyle: "italic",
            color: THEME.text,
            lineHeight: 1.6,
            maxWidth: 1200,
            margin: "0 auto",
            ...quoteStyle,
          }}
        >
          {quote}
        </p>
        <p
          style={{
            fontFamily: THEME.font,
            fontSize: LAYOUT.bodySize,
            color: THEME.textMuted,
            marginTop: 30,
            ...attrStyle,
          }}
        >
          &mdash; {attribution}
        </p>
      </div>
    </AbsoluteFill>
  );
};

const ClosingSlide: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  const titleStyle = useFadeSlideIn(0);
  const subtitleStyle = useFadeSlideIn(15);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontFamily: THEME.font,
            fontSize: LAYOUT.headingSize,
            fontWeight: 700,
            color: THEME.text,
            ...titleStyle,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: THEME.font,
            fontSize: LAYOUT.subheadingSize,
            color: THEME.textMuted,
            marginTop: 20,
            ...subtitleStyle,
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// SLIDE RENDERER
// ============================================================

const renderSlide = (s: (typeof SLIDES)[number]) => {
  switch (s.type) {
    case "title":
      return <TitleSlide title={s.title} subtitle={s.subtitle} />;
    case "bullets":
      return <BulletSlide title={s.title} bullets={s.bullets} />;
    case "twoColumn":
      return (
        <TwoColumnSlide
          title={s.title}
          leftContent={s.leftContent}
          rightLabel={s.rightLabel}
          rightValue={s.rightValue}
        />
      );
    case "quote":
      return <QuoteSlide quote={s.quote} attribution={s.attribution} />;
    case "closing":
      return <ClosingSlide title={s.title} subtitle={s.subtitle} />;
    default:
      return null;
  }
};

// ============================================================
// MAIN COMPOSITION
// ============================================================

export const Presentation: React.FC = () => {
  return (
    <TransitionSeries>
      {SLIDES.map((slideData, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={slideData.duration}>
            {renderSlide(slideData)}
          </TransitionSeries.Sequence>
          {i < SLIDES.length - 1 && (
            <TransitionSeries.Transition
              timing={
                i % 2 === 0
                  ? springTiming({ config: { damping: 200 } })
                  : linearTiming({ durationInFrames: 20 })
              }
              presentation={
                i % 2 === 0 ? slide({ direction: "from-right" }) : fade()
              }
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};

/**
 * Social Media Clip — Vertical 9:16 for Reels / TikTok / Shorts.
 * Edit THEME and CONTENT constants to customize.
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Series,
} from "remotion";
import { ProgressBar } from "../components/animations";

// ============================================================
// CONSTANTS
// ============================================================

const THEME = {
  bg: "#000000",
  primary: "#8b5cf6",
  accent: "#ec4899",
  text: "#ffffff",
  textMuted: "#a1a1aa",
  font: "Inter, system-ui, sans-serif",
  gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
};

const CONTENT = {
  hook: "3 Things You\nDidn't Know About",
  topic: "React",
  points: [
    { number: "01", text: "Components re-render on every state change" },
    { number: "02", text: "Keys help React track list items efficiently" },
    { number: "03", text: "useEffect runs after paint, not before" },
  ],
  cta: "Follow for more tips!",
  handle: "@yourhandle",
};

const SAFE = { top: 120, bottom: 160, left: 60, right: 60 };

// ============================================================
// SCENES
// ============================================================

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const scale = interpolate(textProgress, [0, 1], [0.5, 1]);
  const opacity = interpolate(textProgress, [0, 1], [0, 1]);
  const flashOpacity = interpolate(frame, [0, 4, 8], [0.8, 0, 0], {
    extrapolateRight: "clamp",
  });

  const topicProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15 },
  });
  const topicY = interpolate(topicProgress, [0, 1], [60, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: SAFE.left,
      }}
    >
      <AbsoluteFill style={{ backgroundColor: THEME.primary, opacity: flashOpacity }} />
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: THEME.font,
            fontSize: 64,
            fontWeight: 800,
            color: THEME.text,
            lineHeight: 1.2,
            transform: `scale(${scale})`,
            opacity,
            whiteSpace: "pre-line",
          }}
        >
          {CONTENT.hook}
        </div>
        <div
          style={{
            fontFamily: THEME.font,
            fontSize: 96,
            fontWeight: 900,
            background: THEME.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: 20,
            transform: `translateY(${topicY}px)`,
            opacity: interpolate(topicProgress, [0, 1], [0, 1]),
          }}
        >
          {CONTENT.topic}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PointScene: React.FC<{ number: string; text: string }> = ({
  number,
  text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numP = spring({ frame, fps, config: { damping: 200 } });
  const txtP = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const lineW = interpolate(numP, [0, 1], [0, 200]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: SAFE.left,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 900 }}>
        <div
          style={{
            fontFamily: THEME.font,
            fontSize: 180,
            fontWeight: 900,
            background: THEME.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transform: `scale(${interpolate(numP, [0, 1], [0.3, 1])})`,
            lineHeight: 1,
          }}
        >
          {number}
        </div>
        <div
          style={{
            width: lineW,
            height: 4,
            background: THEME.gradient,
            margin: "30px auto",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            fontFamily: THEME.font,
            fontSize: 48,
            fontWeight: 600,
            color: THEME.text,
            lineHeight: 1.4,
            transform: `translateY(${interpolate(txtP, [0, 1], [30, 0])}px)`,
            opacity: interpolate(txtP, [0, 1], [0, 1]),
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaP = spring({ frame, fps, config: { damping: 200 } });
  const handleP = spring({ frame: frame - 15, fps, config: { damping: 200 } });
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2) * 0.03;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: SAFE.left,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: THEME.font,
            fontSize: 56,
            fontWeight: 800,
            color: THEME.text,
            opacity: interpolate(ctaP, [0, 1], [0, 1]),
            transform: `scale(${interpolate(ctaP, [0, 1], [0.8, 1]) * pulse})`,
          }}
        >
          {CONTENT.cta}
        </div>
        <div
          style={{
            fontFamily: THEME.font,
            fontSize: 36,
            fontWeight: 600,
            background: THEME.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: 24,
            opacity: interpolate(handleP, [0, 1], [0, 1]),
          }}
        >
          {CONTENT.handle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// MAIN COMPOSITION
// ============================================================

export const SocialClip: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
      <Series>
        <Series.Sequence durationInFrames={90}>
          <HookScene />
        </Series.Sequence>
        {CONTENT.points.map((point, i) => (
          <Series.Sequence key={i} durationInFrames={90}>
            <PointScene number={point.number} text={point.text} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={60}>
          <CTAScene />
        </Series.Sequence>
      </Series>
      <ProgressBar color={THEME.primary} />
    </AbsoluteFill>
  );
};

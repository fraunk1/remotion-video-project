/**
 * Remotion Social Media Clip Template
 *
 * Vertical (9:16) format for Instagram Reels, TikTok, YouTube Shorts.
 * Register in Root.tsx with width=1080, height=1920.
 *
 * Customize: Edit THEME, CONTENT constants, and scene components.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Series,
} from "remotion";

// ============================================================
// CONSTANTS
// ============================================================

const THEME = {
  bg: "#000000",
  surface: "#111111",
  primary: "#8b5cf6",
  accent: "#ec4899",
  text: "#ffffff",
  textMuted: "#a1a1aa",
  font: "Inter, system-ui, sans-serif",
  gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
};

const CONTENT = {
  hook: "3 Things You\nDidn't Know About",
  hookEmoji: "",
  topic: "React",
  points: [
    { number: "01", text: "Components re-render on every state change" },
    { number: "02", text: "Keys help React track list items efficiently" },
    { number: "03", text: "useEffect runs after paint, not before" },
  ],
  cta: "Follow for more tips!",
  handle: "@yourhandle",
};

// Safe zone inset for vertical video (away from platform UI)
const SAFE_ZONE = {
  top: 120,
  bottom: 160,
  left: 60,
  right: 60,
};

// ============================================================
// ANIMATION HELPERS
// ============================================================

const useSpringIn = (delay = 0, config = { damping: 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

// ============================================================
// SCENE COMPONENTS
// ============================================================

/** Hook scene — grabs attention in first 2-3 seconds */
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

  // Flash effect on first few frames
  const flashOpacity = interpolate(frame, [0, 4, 8], [0.8, 0, 0], {
    extrapolateRight: "clamp",
  });

  // Topic text slides up after hook
  const topicProgress = useSpringIn(20, { damping: 15 });
  const topicY = interpolate(topicProgress, [0, 1], [60, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: SAFE_ZONE.left,
      }}
    >
      {/* Flash overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: THEME.primary,
          opacity: flashOpacity,
        }}
      />

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

/** Individual point scene with number and text */
const PointScene: React.FC<{ number: string; text: string }> = ({
  number,
  text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberProgress = spring({ frame, fps, config: { damping: 200 } });
  const textProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
  });

  const numberScale = interpolate(numberProgress, [0, 1], [0.3, 1]);
  const textY = interpolate(textProgress, [0, 1], [30, 0]);
  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);

  // Animated accent line
  const lineWidth = interpolate(numberProgress, [0, 1], [0, 200]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: SAFE_ZONE.left,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 900 }}>
        {/* Large number */}
        <div
          style={{
            fontFamily: THEME.font,
            fontSize: 180,
            fontWeight: 900,
            background: THEME.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transform: `scale(${numberScale})`,
            lineHeight: 1,
          }}
        >
          {number}
        </div>

        {/* Accent line */}
        <div
          style={{
            width: lineWidth,
            height: 4,
            background: THEME.gradient,
            margin: "30px auto",
            borderRadius: 2,
          }}
        />

        {/* Point text */}
        <div
          style={{
            fontFamily: THEME.font,
            fontSize: 48,
            fontWeight: 600,
            color: THEME.text,
            lineHeight: 1.4,
            transform: `translateY(${textY}px)`,
            opacity: textOpacity,
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** CTA scene — final call to action */
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaProgress = spring({ frame, fps, config: { damping: 200 } });
  const handleProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
  });

  // Pulsing effect for CTA
  const pulse =
    1 + Math.sin((frame / fps) * Math.PI * 2) * 0.03;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: SAFE_ZONE.left,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: THEME.font,
            fontSize: 56,
            fontWeight: 800,
            color: THEME.text,
            opacity: interpolate(ctaProgress, [0, 1], [0, 1]),
            transform: `scale(${interpolate(ctaProgress, [0, 1], [0.8, 1]) * pulse})`,
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
            opacity: interpolate(handleProgress, [0, 1], [0, 1]),
          }}
        >
          {CONTENT.handle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Animated progress bar at the bottom of the video */
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: "absolute",
        bottom: SAFE_ZONE.bottom - 40,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        height: 4,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: THEME.gradient,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

// ============================================================
// MAIN COMPOSITION
// ============================================================

export const SocialClip: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
      <Series>
        {/* Hook — 3 seconds */}
        <Series.Sequence durationInFrames={90}>
          <HookScene />
        </Series.Sequence>

        {/* Points — 3 seconds each */}
        {CONTENT.points.map((point, i) => (
          <Series.Sequence key={i} durationInFrames={90}>
            <PointScene number={point.number} text={point.text} />
          </Series.Sequence>
        ))}

        {/* CTA — 2 seconds */}
        <Series.Sequence durationInFrames={60}>
          <CTAScene />
        </Series.Sequence>
      </Series>

      {/* Progress bar overlay */}
      <ProgressBar />
    </AbsoluteFill>
  );
};

// ============================================================
// COMPOSITION REGISTRATION (add to Root.tsx)
// ============================================================
//
// <Composition
//   id="SocialClip"
//   component={SocialClip}
//   durationInFrames={420}   // 90 + (90*3) + 60 = 420 frames = 14 seconds
//   fps={30}
//   width={1080}
//   height={1920}
// />
//
// For square (Instagram Feed):
// width={1080} height={1080}
//
// For landscape (LinkedIn):
// width={1920} height={1080}

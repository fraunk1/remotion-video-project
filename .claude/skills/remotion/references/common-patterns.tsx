/**
 * Remotion Common Animation Patterns
 *
 * Reusable animation components and utilities. Import these into your
 * compositions or copy the patterns you need.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  random,
} from "remotion";

// ============================================================
// REUSABLE ANIMATION WRAPPERS
// ============================================================

/**
 * Fade in with optional vertical slide.
 * Usage: <FadeIn delay={10}><YourContent /></FadeIn>
 */
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  slideDistance?: number;
  damping?: number;
}> = ({ children, delay = 0, slideDistance = 30, damping = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [slideDistance, 0]);

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
};

/**
 * Scale in from center with optional bounce.
 * Usage: <ScaleIn delay={10} bounce><YourContent /></ScaleIn>
 */
export const ScaleIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  bounce?: boolean;
}> = ({ children, delay = 0, bounce = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: bounce ? 12 : 200 },
  });
  const scale = interpolate(progress, [0, 1], [0, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};

/**
 * Slide in from a direction.
 * Usage: <SlideIn direction="left" delay={10}><YourContent /></SlideIn>
 */
export const SlideIn: React.FC<{
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  distance?: number;
}> = ({ children, direction = "left", delay = 0, distance = 100 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const directionMap = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: -distance },
    down: { x: 0, y: distance },
  };

  const { x, y } = directionMap[direction];
  const translateX = interpolate(progress, [0, 1], [x, 0]);
  const translateY = interpolate(progress, [0, 1], [y, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translate(${translateX}px, ${translateY}px)`,
      }}
    >
      {children}
    </div>
  );
};

// ============================================================
// TEXT EFFECTS
// ============================================================

/**
 * Typewriter effect for text.
 * Usage: <Typewriter text="Hello World" speed={2} />
 */
export const Typewriter: React.FC<{
  text: string;
  startFrame?: number;
  speed?: number; // frames per character
  style?: React.CSSProperties;
}> = ({ text, startFrame = 0, speed = 2, style }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charsToShow = Math.min(text.length, Math.floor(elapsed / speed));

  // Blinking cursor
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;
  const showCursor = charsToShow < text.length;

  return (
    <span style={style}>
      {text.slice(0, charsToShow)}
      {showCursor && (
        <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
      )}
    </span>
  );
};

/**
 * Text revealed character by character with staggered fade.
 * Usage: <StaggeredText text="Hello" />
 */
export const StaggeredText: React.FC<{
  text: string;
  delay?: number;
  stagger?: number; // frames between each character
  style?: React.CSSProperties;
}> = ({ text, delay = 0, stagger = 2, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <span style={{ display: "inline-flex", ...style }}>
      {text.split("").map((char, i) => {
        const charDelay = delay + i * stagger;
        const progress = spring({
          frame: frame - charDelay,
          fps,
          config: { damping: 200 },
        });
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const y = interpolate(progress, [0, 1], [20, 0]);

        return (
          <span
            key={i}
            style={{
              opacity,
              transform: `translateY(${y}px)`,
              display: "inline-block",
              whiteSpace: char === " " ? "pre" : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

/**
 * Animated counter that counts up to a target number.
 * Usage: <AnimatedCounter target={1234} prefix="$" />
 */
export const AnimatedCounter: React.FC<{
  target: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ target, delay = 0, decimals = 0, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  const value = target * Math.max(0, Math.min(1, progress));

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

  return (
    <span style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

// ============================================================
// LAYOUT HELPERS
// ============================================================

/**
 * Staggered list — each child fades in sequentially.
 * Usage:
 *   <StaggeredList stagger={8}>
 *     <div>Item 1</div>
 *     <div>Item 2</div>
 *   </StaggeredList>
 */
export const StaggeredList: React.FC<{
  children: React.ReactNode[];
  delay?: number;
  stagger?: number;
  direction?: "vertical" | "horizontal";
  gap?: number;
}> = ({ children, delay = 0, stagger = 8, direction = "vertical", gap = 16 }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction === "vertical" ? "column" : "row",
        gap,
      }}
    >
      {children.map((child, i) => (
        <FadeIn key={i} delay={delay + i * stagger}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
};

// ============================================================
// VISUAL EFFECTS
// ============================================================

/**
 * Animated gradient background.
 * Usage: <AnimatedGradient colors={["#3b82f6", "#8b5cf6"]} />
 */
export const AnimatedGradient: React.FC<{
  colors?: string[];
  speed?: number;
}> = ({ colors = ["#3b82f6", "#8b5cf6", "#ec4899"], speed = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const angle = (frame / fps) * speed * 360;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle % 360}deg, ${colors.join(", ")})`,
      }}
    />
  );
};

/**
 * Floating particles background effect.
 * Uses deterministic random() for Remotion compatibility.
 * Usage: <FloatingParticles count={20} color="#3b82f6" />
 */
export const FloatingParticles: React.FC<{
  count?: number;
  color?: string;
  maxSize?: number;
}> = ({ count = 15, color = "rgba(255,255,255,0.1)", maxSize = 8 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const particles = Array.from({ length: count }, (_, i) => {
    const x = random(`particle-x-${i}`) * width;
    const baseY = random(`particle-y-${i}`) * height;
    const size = random(`particle-size-${i}`) * maxSize + 2;
    const speed = random(`particle-speed-${i}`) * 0.5 + 0.2;

    // Float upward over time
    const y = (baseY - (frame / fps) * speed * 100) % (height + 50);

    return { x, y: y < -50 ? height + 50 + y : y, size };
  });

  return (
    <AbsoluteFill>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/**
 * Progress bar overlay — shows video playback progress.
 * Usage: <ProgressBar color="#3b82f6" height={4} />
 */
export const ProgressBar: React.FC<{
  color?: string;
  height?: number;
  position?: "top" | "bottom";
}> = ({ color = "#3b82f6", height = 4, position = "bottom" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: "absolute",
        [position]: 0,
        left: 0,
        right: 0,
        height,
        backgroundColor: "rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: color,
        }}
      />
    </div>
  );
};

// ============================================================
// SHAPE PRIMITIVES
// ============================================================

/**
 * Animated circle that draws itself.
 * Usage: <DrawCircle radius={100} color="#3b82f6" strokeWidth={4} />
 */
export const DrawCircle: React.FC<{
  radius?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
}> = ({ radius = 50, color = "#3b82f6", strokeWidth = 3, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - Math.max(0, Math.min(1, progress)));

  const size = (radius + strokeWidth) * 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

/**
 * Animated line that draws from point A to point B.
 * Usage: <DrawLine x1={0} y1={0} x2={200} y2={0} />
 */
export const DrawLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
}> = ({ x1, y1, x2, y2, color = "#3b82f6", strokeWidth = 3, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const dashOffset = length * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={length}
      strokeDashoffset={dashOffset}
      strokeLinecap="round"
    />
  );
};

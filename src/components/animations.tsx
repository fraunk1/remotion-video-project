/**
 * Reusable animation components and utilities.
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";

// ============================================================
// ANIMATION WRAPPERS
// ============================================================

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

  const dirMap = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: -distance },
    down: { x: 0, y: distance },
  };

  const { x, y } = dirMap[direction];
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

export const Typewriter: React.FC<{
  text: string;
  startFrame?: number;
  speed?: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame = 0, speed = 2, style }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charsToShow = Math.min(text.length, Math.floor(elapsed / speed));
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;
  const showCursor = charsToShow < text.length;

  return (
    <span style={style}>
      {text.slice(0, charsToShow)}
      {showCursor && <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>}
    </span>
  );
};

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
  const formatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

  return (
    <span style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

// ============================================================
// VISUAL EFFECTS
// ============================================================

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
// HOOK: useFadeSlideIn
// ============================================================

export const useFadeSlideIn = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
  };
};

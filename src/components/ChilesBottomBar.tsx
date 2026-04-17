import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

/**
 * Bottom chapter/progress ribbon that covers the white-space band at the
 * bottom of content screenshots. Hidden on title/closing/section-header slides,
 * where the slide itself already fills the frame.
 */

// Slide # → chapter (null = hide the bar entirely on that slide)
const CHAPTER_BY_SLIDE_INDEX: Record<number, string | null> = {
  0: null,               // slide 1 — title
  1: "Part I · The Case",// slide 2 — agenda (uses Part I since next content is Part I)
  2: null,               // slide 3 — Part I section header
  3: "Part I · The Case",
  4: null,               // slide 5 — Part II section header
  5: "Part II · The Decision",
  6: "Part II · The Decision",
  7: "Part II · The Decision",
  8: null,               // slide 9 — Part III section header
  9: "Part III · Impact on Boards",
  10: null,              // slide 11 — Part IV section header
  11: "Part IV · Hypotheticals",
  12: "Part IV · Hypotheticals",
  13: null,              // slide 14 — closing
};

export const ChilesBottomBar: React.FC<{
  slideIndex: number;
  totalFrames: number;
  startFrame: number;
}> = ({ slideIndex, totalFrames, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chapter = CHAPTER_BY_SLIDE_INDEX[slideIndex];
  if (!chapter) return null;

  // Overall progress across the whole video (0..1)
  const overallProgress = Math.max(0, Math.min(1, (startFrame + frame) / totalFrames));

  // Fade-in for the bar (first 20 frames of the slide)
  const barOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 86,
        background: "linear-gradient(180deg, rgba(14,40,65,0) 0%, rgba(14,40,65,0.94) 30%, rgba(14,40,65,0.98) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 64px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: "#FFFFFF",
        opacity: barOpacity,
        pointerEvents: "none",
      }}
    >
      {/* Left — chapter label */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#E8EDF2",
        }}
      >
        {chapter}
      </div>

      {/* Right — progress bar + % */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 320,
            height: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.18)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${overallProgress * 100}%`,
              background: "linear-gradient(90deg, #189ACF 0%, #FBAA29 100%)",
              borderRadius: 2,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: "#A7A8A9",
            minWidth: 46,
            letterSpacing: "0.04em",
          }}
        >
          {Math.round(overallProgress * 100)}%
        </div>
      </div>
    </div>
  );
};

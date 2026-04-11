import React from "react";
import { useCurrentFrame } from "remotion";
import { fsmbTheme } from "../theme/fsmb";

interface Props {
  notes: string;
  slideStartFrame: number;
  slideDurationFrames: number;
}

/**
 * Simple linear-progress caption: words appear evenly across the slide duration.
 * Not phoneme-accurate — good enough for readability and regression-catching.
 */
export const Captions: React.FC<Props> = ({ notes, slideStartFrame, slideDurationFrames }) => {
  const frame = useCurrentFrame();

  if (!notes.trim()) return null;

  const words = notes.split(/\s+/).filter(Boolean);
  const localFrame = frame - slideStartFrame;
  const progress = Math.min(1, Math.max(0, localFrame / slideDurationFrames));
  const wordsShown = Math.max(1, Math.ceil(words.length * progress));

  // Show a rolling window of the last ~15 words so the caption isn't a wall of text
  const windowSize = 15;
  const startIdx = Math.max(0, wordsShown - windowSize);
  const visible = words.slice(startIdx, wordsShown).join(" ");

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        maxWidth: 1400,
        padding: "20px 40px",
        background: "rgba(15, 23, 42, 0.82)",
        color: fsmbTheme.colors.textLight,
        fontSize: fsmbTheme.sizes.caption,
        fontFamily: fsmbTheme.fonts.body,
        textAlign: "center",
        borderRadius: 12,
        lineHeight: 1.35,
      }}
    >
      {visible}
    </div>
  );
};

/**
 * MedReview briefing theme — FSMB brand colors + DM Sans typography.
 * Shares the FSMB brand palette with the Chiles briefing but tuned for
 * MedReview's product-pitch tone (more blue/orange accents for AI/flagging).
 */

export const medreviewTheme = {
  colors: {
    // FSMB brand (External Brand Guide)
    navy: "#0E2841",
    blue: "#189ACF",
    blueBright: "#156082",
    orange: "#FBAA29",
    orangeBright: "#E8870F",

    // Neutrals
    white: "#FFFFFF",
    bgSoft: "#F1F4F8",       // page background — soft grey so white cards pop
    bgCard: "#FFFFFF",
    bgCardAlt: "#FAFBFD",
    border: "rgba(14, 40, 65, 0.08)",
    borderHover: "rgba(14, 40, 65, 0.22)",

    // Text
    text: "#545859",
    textDim: "#A7A8A9",
    textBright: "#0E2841",

    // Semantic — used for severity / confidence chips
    green: "#15803d",
    amber: "#E8870F",
    red: "#c2410c",
  },
  font: {
    family: '"DM Sans", -apple-system, "Segoe UI", sans-serif',
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  sizes: {
    h1: 96,
    h2: 72,
    h3: 32,
    eyebrow: 24,
    body: 30,
    caption: 22,
    stat: 160,
    statLabel: 28,
  },
  timing: {
    introFrames: 14,
    staggerFrames: 6,
    exitFrames: 10,
  },
  shadows: {
    card: "0 14px 36px rgba(14, 40, 65, 0.10), 0 2px 8px rgba(14, 40, 65, 0.06)",
    cardPop: "0 20px 48px rgba(14, 40, 65, 0.14), 0 3px 10px rgba(14, 40, 65, 0.08)",
    subtle: "0 4px 16px rgba(14, 40, 65, 0.06)",
  },
} as const;

/**
 * Shared fade-up line animation helper.
 * Usage: const p = spring({frame, fps, config: {damping: 180}});
 *        <div style={lineIn(p, 24)}>...</div>
 */
export function lineIn(progress: number, distance = 24) {
  return {
    opacity: Math.max(0, Math.min(1, progress)),
    transform: `translateY(${(1 - Math.max(0, Math.min(1, progress))) * distance}px)`,
  };
}

/**
 * Eased count-up for stat numbers. Interpolates a number from 0 → target
 * as `frame` moves through [startFrame, startFrame + durationFrames].
 * Uses a cubic ease-out so the number decelerates into its final value.
 */
export function countUp(
  frame: number,
  startFrame: number,
  durationFrames: number,
  target: number,
): number {
  const t = Math.max(0, Math.min(1, (frame - startFrame) / durationFrames));
  const eased = 1 - Math.pow(1 - t, 3);
  return target * eased;
}

export function formatStat(n: number, decimals = 0, suffix = ""): string {
  if (decimals === 0) return `${Math.round(n)}${suffix}`;
  return `${n.toFixed(decimals)}${suffix}`;
}

/**
 * FSMB brand theme — colors, DM Sans typography, card shadows.
 *
 * This is the default theme for briefing videos. Extracted from the Chiles
 * briefing (components/chiles/theme.ts) so new briefings inherit the same
 * FSMB look without copying files.
 */

export const fsmbTheme = {
  colors: {
    // FSMB brand (per External Brand Guide)
    navy: "#0E2841",
    blue: "#189ACF",
    blueBright: "#156082",
    orange: "#FBAA29",
    orangeBright: "#E8870F",

    // Neutrals
    white: "#FFFFFF",
    bgSoft: "#F1F4F8",
    bgCard: "#FFFFFF",
    bgCardAlt: "#FAFBFD",
    border: "rgba(14, 40, 65, 0.08)",
    borderHover: "rgba(14, 40, 65, 0.22)",

    // Text
    text: "#545859",
    textDim: "#A7A8A9",
    textBright: "#0E2841",

    // Semantic
    green: "#15803d",
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
    body: 36,
    caption: 24,
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

export type BriefingTheme = typeof fsmbTheme;

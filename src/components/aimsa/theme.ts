/**
 * AIMSA briefing theme — FSMB brand colors + DM Sans typography.
 * Mirrors chiles/theme.ts to keep the briefing series visually unified.
 */

import type React from "react";

export const aimsaTheme = {
  colors: {
    // FSMB brand
    navy: "#0E2841",
    blue: "#189ACF",
    blueBright: "#156082",
    orange: "#FBAA29",
    orangeBright: "#E8870F",

    // Neutrals
    white: "#FFFFFF",
    bgSoft: "#F5F7FA",                 // soft gray page bg — cards + overall brightness both benefit
    bgCard: "#FFFFFF",
    bgCardAlt: "#FAFBFD",
    bgCardTint: "#DEE9F2",             // visible light-blue tint to contrast against white page
    bgCardTintBorder: "#BFD0E1",       // matching border for tinted cards
    bgCardGray: "#EEF0F3",             // neutral gray tint — pair with soft page bg for visible card edges
    bgCardGrayBorder: "#C8CCD1",       // matching border for gray cards
    border: "rgba(14, 40, 65, 0.08)",
    borderHover: "rgba(14, 40, 65, 0.22)",

    // Text
    text: "#545859",
    textDim: "#A7A8A9",
    textBright: "#0E2841",

    // Semantic
    green: "#15803d",
    red: "#c2410c",

    // Mono / citation
    cite: "#6b7280",
  },
  font: {
    family: '"DM Sans", -apple-system, "Segoe UI", sans-serif',
    mono: '"Fira Code", "JetBrains Mono", "SFMono-Regular", Consolas, monospace',
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
    cite: 18,
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
    doc: "0 10px 24px rgba(14, 40, 65, 0.20), 0 2px 6px rgba(14, 40, 65, 0.10)",
  },
} as const;

/**
 * Shared citation/hyperlink style — monospace + blue-underline treatment.
 * Apply to every citation URL across slides to signal linkable intent.
 */
export const citationStyle: React.CSSProperties = {
  fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace",
  fontSize: 14,
  color: aimsaTheme.colors.blue,
  textDecoration: "underline",
  textDecorationColor: "rgba(24, 154, 207, 0.45)",
  textDecorationThickness: 1,
  textUnderlineOffset: 3,
  letterSpacing: "0.01em",
  marginTop: 6,
  display: "block",
  wordBreak: "break-all",
  lineHeight: 1.4,
};

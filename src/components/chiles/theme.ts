/**
 * Chiles briefing theme — FSMB brand colors + DM Sans typography.
 * Mirrors the HTML deck at Presentations/Chiles v Salazar Briefing/
 * so the rendered video matches the slides users saw in the deck.
 */

export const chilesTheme = {
  colors: {
    // FSMB brand (per External Brand Guide)
    navy: "#0E2841",
    blue: "#189ACF",
    blueBright: "#156082",
    orange: "#FBAA29",
    orangeBright: "#E8870F",

    // Neutrals
    white: "#FFFFFF",
    bgSoft: "#F1F4F8",       // page background — soft grey so white cards pop
    bgCard: "#FFFFFF",        // card fill
    bgCardAlt: "#FAFBFD",     // secondary card fill (for alternating / subtle)
    border: "rgba(14, 40, 65, 0.08)",
    borderHover: "rgba(14, 40, 65, 0.22)",

    // Text
    text: "#545859",       // body
    textDim: "#A7A8A9",    // muted
    textBright: "#0E2841", // headlines, strong

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
    // At 1920×1080, expressed as px. Used across components for consistency.
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
    // Common animation tuning
    introFrames: 14,      // ~0.5s at 30fps
    staggerFrames: 6,     // delay between sequential elements
    exitFrames: 10,       // for optional outro fades
  },
  shadows: {
    // Deeper than CSS card norms so cards feel anchored against the soft grey page bg
    card: "0 14px 36px rgba(14, 40, 65, 0.10), 0 2px 8px rgba(14, 40, 65, 0.06)",
    cardPop: "0 20px 48px rgba(14, 40, 65, 0.14), 0 3px 10px rgba(14, 40, 65, 0.08)",
    subtle: "0 4px 16px rgba(14, 40, 65, 0.06)",
  },
} as const;

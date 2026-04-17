import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AimsaContainer } from "./AimsaContainer";
import { aimsaTheme as t, citationStyle } from "./theme";

/**
 * Slide 12 — Closing. Two visual phases within the same ~26.7s audio:
 *   Phase 1 (frames 0-600): Sources Tile Grid — 7 uniform linked cards
 *   Phase 2 (frames 600-end): Full-screen takeaway + Frank sticker + contact block
 *
 * Transition is a 30-frame cross-fade centered on frame 615.
 */

type SourceTile = {
  title: string;
  url: string;
  image: string; // path under public/
};

const SOURCES: SourceTile[] = [
  {
    title: "Cicero Institute — AI Medical Services Act",
    url: "ciceroinstitute.org/research/ai-medical-services-act/",
    image: "aimsa-bg/sources/cicero-aimsa.png",
  },
  {
    title: "Idaho HB 945",
    url: "legislature.idaho.gov/sessioninfo/2026/legislation/H0945/",
    image: "aimsa-bg/sources/idaho-hb945.png",
  },
  {
    title: "Iowa HSB 766",
    url: "legis.iowa.gov/legislation/BillBook?ga=91&ba=HSB766",
    image: "aimsa-bg/sources/iowa-hsb766.png",
  },
  {
    title: "California AB 489",
    url: "leginfo.legislature.ca.gov · AB 489",
    image: "aimsa-bg/sources/california-ab489.png",
  },
  {
    title: "Utah Doctronic Agreement",
    url: "commerce.utah.gov/ai/agreements/doctronic/",
    image: "aimsa-bg/sources/utah-doctronic.png",
  },
  {
    title: "FDA Clinical Decision Support Guidance",
    url: "fda.gov/.../clinical-decision-support-software",
    image: "aimsa-bg/sources/fda-cds-guidance.png",
  },
  {
    title: "FSMB AI Policies",
    url: "fsmb.org/advocacy/policies/",
    image: "aimsa-bg/sources/fsmb-policies.png",
  },
];

// Phase 1 runs frames 0-615, Phase 2 runs frames 600-end.
// Cross-fade from 600 to 630 (30 frames ~ 1s).
const PHASE_TRANSITION_START = 600;
const PHASE_TRANSITION_END = 630;

export const AimsaClosing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crossfade opacity — Phase 1 visible before 600, Phase 2 after 630.
  const phase1Opacity = interpolate(
    frame,
    [PHASE_TRANSITION_START, PHASE_TRANSITION_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const phase2Opacity = interpolate(
    frame,
    [PHASE_TRANSITION_START, PHASE_TRANSITION_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Phase 1 (Sources) on watermark; Phase 2 (Discussion ending) on gray swoosh.
  // Render the appropriate container per phase so the background matches.
  if (frame < PHASE_TRANSITION_START) {
    return (
      <AimsaContainer background="watermark" padding={0}>
        <Phase1SourcesGrid frame={frame} fps={fps} opacity={1} />
      </AimsaContainer>
    );
  }
  if (frame < PHASE_TRANSITION_END) {
    // Crossfade window: stack both with opacity transition
    return (
      <>
        <AimsaContainer background="watermark" padding={0}>
          <Phase1SourcesGrid frame={frame} fps={fps} opacity={phase1Opacity} />
        </AimsaContainer>
        <AimsaContainer background="swoosh-gray" textOnDark padding={0}>
          <Phase2Takeaway frame={frame} fps={fps} opacity={phase2Opacity} />
        </AimsaContainer>
      </>
    );
  }
  return (
    <AimsaContainer background="swoosh-gray" textOnDark padding={0}>
      <Phase2Takeaway frame={frame} fps={fps} opacity={1} />
    </AimsaContainer>
  );
};

// --- Phase 1 --------------------------------------------------------------

const Phase1SourcesGrid: React.FC<{ frame: number; fps: number; opacity: number }> = ({
  frame,
  fps,
  opacity,
}) => {
  const eyebrowP = spring({ frame, fps, config: { damping: 180 } });
  const h2P = spring({ frame: frame - 6, fps, config: { damping: 180 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: "60px 90px 36px 90px",
        opacity,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 24,
          fontWeight: t.font.weight.semibold,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: t.colors.blue,
          ...lineIn(eyebrowP, 14),
        }}
      >
        Sources &amp; Further Reading
      </div>
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 60,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 4,
          marginBottom: 28,
          ...lineIn(h2P, 16),
        }}
      >
        The Record
      </div>

      {/* Tile grid — 4 cols x 2 rows (7 tiles + empty cell for balance) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 22,
          flex: 1,
          minHeight: 0,
        }}
      >
        {SOURCES.map((src, i) => {
          // Staggered reveal — each tile pops in sequence (6-10 frames apart).
          // NO pulse / bloom animation on any tile — all uniform.
          const p = spring({
            frame: frame - (18 + i * 8),
            fps,
            config: { damping: 16, mass: 0.7 },
          });
          return (
            <div
              key={src.url}
              style={{
                background: t.colors.bgCardTint,
                border: `2px solid ${t.colors.bgCardTintBorder}`,
                borderRadius: 12,
                boxShadow: t.shadows.card,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                opacity: interpolate(p, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px) scale(${interpolate(
                  p,
                  [0, 1],
                  [0.94, 1],
                )})`,
              }}
            >
              {/* Screenshot — top ~68% */}
              <div
                style={{
                  flex: "0 0 68%",
                  overflow: "hidden",
                  position: "relative",
                  background: t.colors.bgSoft,
                  borderBottom: `1px solid ${t.colors.bgCardTintBorder}`,
                }}
              >
                <Img
                  src={staticFile(src.image)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              </div>

              {/* Caption — bottom ~32% with light-blue background */}
              <div
                style={{
                  flex: "1 1 auto",
                  background: t.colors.bgCardTint,
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: t.font.family,
                    fontSize: 17,
                    fontWeight: t.font.weight.bold,
                    color: t.colors.navy,
                    lineHeight: 1.3,
                    marginBottom: 4,
                  }}
                >
                  {src.title}
                </div>
                <span style={{ ...citationStyle, fontSize: 15, marginTop: 2 }}>{src.url}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Phase 2 --------------------------------------------------------------

const Phase2Takeaway: React.FC<{ frame: number; fps: number; opacity: number }> = ({
  frame,
  fps,
  opacity,
}) => {
  // Phase 2 starts at frame 600 — reveal springs are frame-relative to that.
  const localFrame = frame - PHASE_TRANSITION_START;
  const eyebrowP = spring({ frame: localFrame, fps, config: { damping: 200 } });
  const titleP = spring({ frame: localFrame - 6, fps, config: { damping: 200 } });
  const quoteP = spring({ frame: localFrame - 20, fps, config: { damping: 200 } });
  const stickerP = spring({ frame: localFrame - 36, fps, config: { damping: 200 } });

  const fadeUp = (p: number, d = 20) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  // Section-header-style ending — mirrors Part I/II/III/IV transition layout
  // but on a gray swoosh so it reads as a closing/ending beat.
  const ruleProgress = spring({ frame: localFrame - 14, fps, config: { damping: 200 } });
  const ruleScaleX = interpolate(ruleProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 160px",
        opacity,
      }}
    >
      {/* Small eyebrow — matches section header part-label pattern */}
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 26,
          fontWeight: t.font.weight.semibold,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.85)",
          textShadow: "0 2px 6px rgba(0,0,0,0.25)",
          marginBottom: 24,
          ...fadeUp(eyebrowP, 18),
        }}
      >
        Thanks for Listening
      </div>

      {/* Title "Discussion" — mixed case, white on gray, section-header sized */}
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 130,
          fontWeight: t.font.weight.bold,
          color: t.colors.white,
          lineHeight: 1.05,
          textShadow: "0 3px 12px rgba(0,0,0,0.35)",
          ...fadeUp(titleP, 28),
        }}
      >
        Discussion
      </div>

      {/* Animated rule — matches section header pattern */}
      <div
        style={{
          width: 140,
          height: 3,
          marginTop: 28,
          marginBottom: 30,
          background: "rgba(255,255,255,0.75)",
          borderRadius: 2,
          transform: `scaleX(${ruleScaleX})`,
          transformOrigin: "center center",
        }}
      />

      {/* Subtitle: takeaway quote (italic, lighter weight) */}
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 30,
          fontWeight: t.font.weight.regular,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.92)",
          textShadow: "0 2px 6px rgba(0,0,0,0.3)",
          maxWidth: "32em",
          lineHeight: 1.4,
          ...fadeUp(quoteP, 20),
        }}
      >
        &ldquo;AI clinical services are the practice of medicine. The question is
        whether medicine still belongs to the boards that have always regulated it.&rdquo;
      </div>

      {/* Frank sticker — sized to feel grounded, not dominating */}
      <Img
        src={staticFile("aimsa-bg/frank-sticker.png")}
        style={{
          width: 320,
          height: "auto",
          objectFit: "contain",
          marginTop: 40,
          ...fadeUp(stickerP, 18),
        }}
      />
    </div>
  );
};

import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BriefingContainer } from "./BriefingContainer";
import { fsmbTheme } from "./themes/fsmb";
import { lineIn, revealAt } from "./animations";
import type { Slide } from "../scenes/types";

/**
 * `takeaway_gray_swoosh` slide — final-takeaway layout on a desaturated
 * swoosh background. White text, optional Frank-style sticker, optional
 * pull-quote. Mirrors the Phase-2 beat from AimsaClosing but runs as a
 * standalone scene slide.
 *
 * Props (read from `slide.props`):
 *   - eyebrow:     "THANKS FOR LISTENING" band over the title
 *   - title:       Main takeaway word (mixed-case per Frank's rule)
 *   - quote:       Optional italic pull quote below the rule
 *   - quoteSource: Optional attribution on its own line
 *   - sticker:     Optional asset path (relative to public/), defaults to
 *                  the AIMSA Frank sticker.
 */
export type TakeawayGraySwooshProps = {
  eyebrow?: string;
  title?: string;
  quote?: string;
  quoteSource?: string;
  sticker?: string;
};

export const BriefingTakeawayGraySwoosh: React.FC<{
  slide: Slide;
}> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = fsmbTheme;

  const p = (slide.props as TakeawayGraySwooshProps | undefined) ?? {};
  const eyebrow = p.eyebrow ?? "Thanks for Listening";
  const title = p.title ?? slide.title ?? "Discussion";
  const quote = p.quote;
  const quoteSource = p.quoteSource;
  const stickerPath = p.sticker ?? "aimsa-bg/frank-sticker.png";

  const eyebrowP = revealAt({ frame, fps, damping: 200 });
  const titleP = revealAt({ frame, fps, delay: 6, damping: 200 });
  const ruleP = revealAt({ frame, fps, delay: 14, damping: 200 });
  const quoteP = revealAt({ frame, fps, delay: 20, damping: 200 });
  const stickerP = revealAt({ frame, fps, delay: 36, damping: 200 });

  const ruleScaleX = interpolate(ruleP, [0, 1], [0, 1]);

  return (
    <BriefingContainer background="swoosh-gray" textOnDark padding={0}>
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
        }}
      >
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
            ...lineIn(eyebrowP, { fromY: 18 }),
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 130,
            fontWeight: t.font.weight.bold,
            color: t.colors.white,
            lineHeight: 1.05,
            ...lineIn(titleP, { fromY: 28 }),
          }}
        >
          {title}
        </div>

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

        {quote && (
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
              ...lineIn(quoteP, { fromY: 20 }),
            }}
          >
            {`\u201C${quote}\u201D`}
          </div>
        )}

        {quoteSource && (
          <div
            style={{
              fontFamily: t.font.family,
              fontSize: 22,
              fontWeight: t.font.weight.medium,
              color: "rgba(255,255,255,0.75)",
              marginTop: 14,
              letterSpacing: "0.04em",
              ...lineIn(quoteP, { fromY: 20 }),
            }}
          >
            — {quoteSource}
          </div>
        )}

        {stickerPath && (
          <Img
            src={staticFile(stickerPath)}
            style={{
              width: 320,
              height: "auto",
              objectFit: "contain",
              marginTop: 40,
              ...lineIn(stickerP, { fromY: 18 }),
            }}
          />
        )}
      </div>
    </BriefingContainer>
  );
};

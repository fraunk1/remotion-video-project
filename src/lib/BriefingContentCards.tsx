import React from "react";
import {
  Img,
  staticFile,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { BriefingContainer } from "./BriefingContainer";
import { fsmbTheme, citationStyle } from "./themes/fsmb";
import { lineIn, revealAt } from "./animations";
import type { Slide } from "../scenes/types";

/**
 * `content_cards` slide — grid of uniform cards carrying either a
 * document thumbnail + metadata (AimsaThreeBills pattern) OR a head +
 * bulleted-item column (AimsaFDAGap pattern). The card layout toggles
 * per card based on which fields are present on that card.
 *
 * Grid columns come from `props.columns` (2 or 3). Optional bottom
 * callout uses the left-border orange pattern per DESIGN_GUIDELINES §3.
 */

export type ContentCardBullet = {
  text: string;
  cite?: string;
};

export type ContentCard = {
  accent?: "blue" | "orange" | "navy" | string;
  /** Thumbnail-mode fields */
  short?: string;
  title?: string;
  thumbnail?: string;
  meta?: string[];
  /** Bullet-mode fields */
  head?: string;
  preface?: string;
  bullets?: ContentCardBullet[];
};

export type ContentCardsCallout = {
  label?: string;
  text: string;
  /** Optional dot-plot visualization rendered inline with the callout.
   * Useful for "N of M" ratio facts (e.g., "8 of 15 states passed"). */
  dotPlot?: {
    filled: number;
    total: number;
    /** Color of filled dots (defaults to the callout's accent color). */
    fillColor?: string;
    /** Label shown above the dots, e.g. "8 of 15 states". */
    caption?: string;
  };
};

export type ContentCardsProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  columns?: number;
  layout?: string;
  cards?: ContentCard[];
  callout?: ContentCardsCallout;
};

const resolveAccent = (accent: string | undefined): string => {
  const t = fsmbTheme.colors;
  if (!accent || accent === "navy") return t.navy;
  if (accent === "blue") return t.blue;
  if (accent === "orange") return t.orange;
  return accent;
};

const ThumbnailCard: React.FC<{
  card: ContentCard;
  accent: string;
  frame: number;
  fps: number;
  delay: number;
  assetRoot?: string;
  gridColumnStart?: number;
}> = ({ card, accent, frame, fps, delay, assetRoot = "aimsa-bg", gridColumnStart }) => {
  const t = fsmbTheme;
  const p = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  const enter = {
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(
      p,
      [0, 1],
      [0.96, 1],
    )})`,
  };
  return (
    <div
      style={{
        gridColumnStart,
        background: t.colors.bgCardGray,
        border: `2px solid ${t.colors.bgCardGrayBorder}`,
        borderTop: `6px solid ${accent}`,
        borderRadius: 14,
        padding: "20px 22px",
        boxShadow: t.shadows.card,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: 0,
        ...enter,
      }}
    >
      {card.short && (
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 19,
            fontWeight: t.font.weight.bold,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: 6,
          }}
        >
          {card.short}
        </div>
      )}
      {card.title && (
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 28,
            fontWeight: t.font.weight.bold,
            color: t.colors.navy,
            marginBottom: 14,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {card.title}
        </div>
      )}
      {card.thumbnail && (
        <div
          style={{
            width: "100%",
            aspectRatio: "0.773",
            maxHeight: 340,
            border: `1px solid ${t.colors.border}`,
            borderRadius: 4,
            boxShadow: t.shadows.doc,
            overflow: "hidden",
            background: t.colors.white,
            marginBottom: 14,
            position: "relative",
          }}
        >
          <Img
            src={staticFile(
              card.thumbnail.includes("/")
                ? card.thumbnail
                : `${assetRoot}/${card.thumbnail}`,
            )}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
        </div>
      )}
      {card.meta && card.meta.length > 0 && (
        <div
          style={{
            width: "100%",
            fontFamily: t.font.family,
            fontSize: 20,
            color: t.colors.text,
            lineHeight: 1.5,
          }}
        >
          {card.meta.map((m, mi) => (
            <div key={mi} style={{ marginBottom: 2 }}>
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BulletCard: React.FC<{
  card: ContentCard;
  accent: string;
  frame: number;
  fps: number;
  delay: number;
  gridColumnStart?: number;
}> = ({ card, accent, frame, fps, delay, gridColumnStart }) => {
  const t = fsmbTheme;
  const panelP = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  const bullets = card.bullets ?? [];
  return (
    <div
      style={{
        gridColumnStart,
        background: t.colors.bgCardGray,
        border: `2px solid ${t.colors.bgCardGrayBorder}`,
        borderTop: `6px solid ${accent}`,
        borderRadius: 12,
        padding: "24px 28px",
        boxShadow: t.shadows.card,
        opacity: interpolate(panelP, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(panelP, [0, 1], [32, 0])}px)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {card.head && (
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 26,
            fontWeight: t.font.weight.bold,
            color: accent,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: card.preface ? 8 : 16,
          }}
        >
          {card.head}
        </div>
      )}
      {card.preface && (
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 24,
            color: t.colors.textDim,
            fontStyle: "italic",
            marginBottom: 18,
          }}
          dangerouslySetInnerHTML={{ __html: card.preface }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bullets.map((b, i) => {
          const itemP = spring({
            frame: frame - delay - 10 - i * 8,
            fps,
            config: { damping: 180 },
          });
          return (
            <div
              key={i}
              style={{
                paddingLeft: 22,
                position: "relative",
                opacity: interpolate(itemP, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(itemP, [0, 1], [14, 0])}px)`,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 12,
                  width: 9,
                  height: 9,
                  borderRadius: 5,
                  background: accent,
                }}
              />
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 24,
                  color: t.colors.text,
                  lineHeight: 1.45,
                }}
                dangerouslySetInnerHTML={{ __html: b.text }}
              />
              {b.cite && <span style={citationStyle}>{b.cite}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const BriefingContentCards: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = fsmbTheme;

  const p = (slide.props as ContentCardsProps | undefined) ?? {};
  const eyebrow = p.eyebrow ?? "";
  const title = p.title ?? slide.title ?? "";
  const subtitle = p.subtitle ?? slide.subtitle ?? undefined;
  const columns = p.columns ?? (p.cards ? p.cards.length : 2);
  const cards = p.cards ?? [];
  const callout = p.callout;

  const eyebrowP = revealAt({ frame, fps, damping: 180 });
  const h2P = revealAt({ frame, fps, delay: 6, damping: 180 });
  const subP = revealAt({ frame, fps, delay: 12, damping: 180 });
  const calloutP = revealAt({ frame, fps, delay: 60, damping: 200 });

  return (
    <BriefingContainer background="watermark" logoPath="aimsa-bg/fsmb-logo.png">
      {eyebrow && (
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 26,
            fontWeight: t.font.weight.semibold,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: t.colors.blue,
            ...lineIn(eyebrowP),
          }}
        >
          {eyebrow}
        </div>
      )}
      <div
        style={{
          fontFamily: t.font.family,
          fontSize: 72,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 4,
          lineHeight: 1.05,
          ...lineIn(h2P),
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 24,
            color: t.colors.text,
            marginTop: 8,
            fontStyle: "italic",
            ...lineIn(subP),
          }}
        >
          {subtitle}
        </div>
      )}

      {(() => {
        // Logo clearance (DESIGN_GUIDELINES §4): when cards wrap to a partial
        // last row, shift that row's first card right by one column so it
        // doesn't land on top of the bottom-left FSMB logo. Matches the
        // pattern used in BriefingSourcesGrid.
        const cardsInLastRow = cards.length % columns;
        const needsLogoClearance = cardsInLastRow > 0 && cards.length > columns;
        const lastRowFirstIdx = cards.length - cardsInLastRow;
        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: 24,
              marginTop: 32,
              flex: 1,
              minHeight: 0,
            }}
          >
            {cards.map((card, i) => {
              const accent = resolveAccent(card.accent);
              const gridColumnStart =
                needsLogoClearance && i === lastRowFirstIdx ? 2 : undefined;
              if (card.thumbnail) {
                return (
                  <ThumbnailCard
                    key={i}
                    card={card}
                    accent={accent}
                    frame={frame}
                    fps={fps}
                    delay={10 + i * 12}
                    gridColumnStart={gridColumnStart}
                  />
                );
              }
              return (
                <BulletCard
                  key={i}
                  card={card}
                  accent={accent}
                  frame={frame}
                  fps={fps}
                  delay={16 + i * 8}
                  gridColumnStart={gridColumnStart}
                />
              );
            })}
          </div>
        );
      })()}

      {callout && (
        <div
          style={{
            marginTop: 22,
            background: t.colors.bgCardGray,
            border: `2px solid ${t.colors.bgCardGrayBorder}`,
            borderLeft: `6px solid ${t.colors.orange}`,
            borderRadius: "0 12px 12px 0",
            padding: "22px 32px",
            display: "flex",
            alignItems: callout.label ? "center" : "flex-start",
            gap: 26,
            opacity: interpolate(calloutP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(calloutP, [0, 1], [16, 0])}px)`,
          }}
        >
          {callout.label && (
            <div
              style={{
                flex: "0 0 auto",
                fontFamily: t.font.family,
                fontSize: 18,
                fontWeight: t.font.weight.bold,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: t.colors.orange,
                whiteSpace: "nowrap",
              }}
            >
              {callout.label}
            </div>
          )}
          {callout.dotPlot && (
            <DotPlotRow
              filled={callout.dotPlot.filled}
              total={callout.dotPlot.total}
              fillColor={callout.dotPlot.fillColor ?? t.colors.orange}
              caption={callout.dotPlot.caption}
              frame={frame}
              fps={fps}
            />
          )}
          <div
            style={{
              flex: 1,
              fontFamily: t.font.family,
              fontSize: 24,
              fontStyle: "italic",
              fontWeight: t.font.weight.medium,
              color: t.colors.textBright,
              lineHeight: 1.45,
            }}
            dangerouslySetInnerHTML={{ __html: callout.text }}
          />
        </div>
      )}
    </BriefingContainer>
  );
};

/**
 * Inline N-of-M dot-plot — used inside a ContentCardsCallout to turn a
 * "filled / total" ratio (e.g., "8 of 15 states passed") into a visible
 * proof bar. Filled dots reveal one-by-one over ~1s, drawing the viewer's
 * eye across the ratio.
 */
const DotPlotRow: React.FC<{
  filled: number;
  total: number;
  fillColor: string;
  caption?: string;
  frame: number;
  fps: number;
}> = ({ filled, total, fillColor, caption, frame, fps }) => {
  const t = fsmbTheme;
  // Reveal each dot 4 frames apart, starting at callout reveal + 10 frames
  const startFrame = 70;
  const perDot = 4;
  return (
    <div
      style={{
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        alignItems: "center",
        paddingRight: 14,
        borderRight: `1px solid ${t.colors.bgCardGrayBorder}`,
        marginRight: 8,
      }}
    >
      {caption && (
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 14,
            fontWeight: t.font.weight.bold,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: t.colors.navy,
            marginBottom: 2,
          }}
        >
          {caption}
        </div>
      )}
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {Array.from({ length: total }, (_, i) => {
          const dotP = spring({
            frame: frame - (startFrame + i * perDot),
            fps,
            config: { damping: 180, mass: 0.5 },
          });
          const isFilled = i < filled;
          const scale = interpolate(dotP, [0, 1], [0.3, 1]);
          const opacity = interpolate(dotP, [0, 1], [0, 1]);
          return (
            <span
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: isFilled ? fillColor : t.colors.bgCardGrayBorder,
                border: isFilled ? "none" : `1px solid ${t.colors.bgCardGrayBorder}`,
                display: "inline-block",
                opacity,
                transform: `scale(${scale})`,
                boxShadow: isFilled ? `0 1px 3px ${fillColor}44` : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

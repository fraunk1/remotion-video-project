import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BriefingContainer } from "./BriefingContainer";
import { fsmbTheme, citationStyle } from "./themes/fsmb";
import { lineIn, revealAt } from "./animations";
import type { Slide } from "../scenes/types";

/**
 * `icon_row` slide — row of "bathroom-door" person icons + category
 * legend + optional left-border quote callout. Used for composition
 * visualizations (board seats, who's affected, etc.).
 */

export type IconRowIcon = {
  label: string;
  category: string;
};

export type IconRowLegendChip = {
  category: string;
  count: number;
  label: string;
};

export type IconRowCallout = {
  label?: string;
  text: string;
  /** List of raw cite keys (may render verbatim). */
  cites?: string[];
  /** Resolved cite objects ({label, href}) if pipeline upgraded them. */
  cite_refs?: { label: string; href: string }[];
};

export type IconRowProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  icons?: IconRowIcon[];
  categories?: Record<string, string>;
  legend?: IconRowLegendChip[];
  callout?: IconRowCallout;
};

/**
 * Board-member figure — Phosphor `Person` icon at fill weight (chosen
 * after a side-by-side review of bathroom-door / Person regular / Person
 * bold / UserCircle / PersonArmsSpread on 2026-04-18). Still reads as an
 * unambiguous standing person (not an avatar-circle) while dropping the
 * hand-rolled pictogram stylization for an editorial-grade silhouette.
 *
 * SVG path inlined from @phosphor-icons/react fill weight (v2.1.1, MIT).
 * Inlined rather than imported because the Phosphor React package's ESM
 * exports don't resolve cleanly under Remotion's bundler settings.
 */
const PersonIcon: React.FC<{ color: string; size?: number }> = ({
  color,
  size = 130,
}) => (
  <svg
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill={color}
    aria-hidden
  >
    <path d="M100,36a28,28,0,1,1,28,28A28,28,0,0,1,100,36ZM215.42,140.78l-45.25-51.3a28,28,0,0,0-21-9.48H106.83a28,28,0,0,0-21,9.48l-45.25,51.3a16,16,0,0,0,22.56,22.69L89,142.7l-19.7,74.88a16,16,0,0,0,29.08,13.35L128,180l29.58,51a16,16,0,0,0,29.08-13.35L167,142.7l25.9,20.77a16,16,0,0,0,22.56-22.69Z" />
  </svg>
);

const LegendChip: React.FC<{ color: string; count: number; label: string }> = ({
  color,
  count,
  label,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: fsmbTheme.colors.bgCardGray,
      border: `2px solid ${fsmbTheme.colors.bgCardGrayBorder}`,
      borderRadius: 999,
      padding: "10px 20px",
    }}
  >
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: 999,
        background: color,
        display: "inline-block",
        boxShadow: "0 1px 3px rgba(14, 40, 65, 0.18)",
      }}
    />
    <span
      style={{
        fontFamily: fsmbTheme.font.family,
        fontSize: 24,
        color: fsmbTheme.colors.navy,
      }}
    >
      <strong>{count}</strong> {label}
    </span>
  </div>
);

export const BriefingIconRow: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = fsmbTheme;

  const p = (slide.props as IconRowProps | undefined) ?? {};
  const eyebrow = p.eyebrow ?? "";
  const title = p.title ?? slide.title ?? "";
  const subtitle = p.subtitle ?? slide.subtitle ?? undefined;
  const icons = p.icons ?? [];
  const categories = p.categories ?? {};
  const legend = p.legend ?? [];
  const callout = p.callout;

  // The left-border accent color for the callout defaults to orange (the
  // strongest emphasis beat per DESIGN_GUIDELINES §3) but can be swapped
  // by changing the category of the first legend entry if desired.
  const calloutAccent = t.colors.orange;

  const eyebrowP = revealAt({ frame, fps, damping: 180 });
  const h2P = revealAt({ frame, fps, delay: 6, damping: 180 });
  const subP = revealAt({ frame, fps, delay: 12, damping: 180 });

  const iconDelays = icons.map((_, i) => 16 + i * 5);
  const legendP = revealAt({
    frame,
    fps,
    delay: 16 + icons.length * 5 + 6,
    damping: 180,
  });
  const calloutP = revealAt({
    frame,
    fps,
    delay: 16 + icons.length * 5 + 20,
    damping: 200,
  });

  // Prefer pipeline-resolved cite_refs; fall back to raw cite keys.
  const citeEntries: { label: string; href?: string }[] =
    callout?.cite_refs && callout.cite_refs.length > 0
      ? callout.cite_refs.map((c) => ({ label: c.label, href: c.href }))
      : (callout?.cites ?? []).map((label) => ({ label }));

  return (
    <BriefingContainer background="watermark" logoPath="aimsa-bg/fsmb-logo.png">
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
            fontSize: 80,
            fontWeight: t.font.weight.bold,
            color: t.colors.navy,
            marginTop: 6,
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
              marginTop: 10,
              fontStyle: "italic",
              ...lineIn(subP),
            }}
          >
            {subtitle}
          </div>
        )}

        {icons.length > 0 && (
          <div
            style={{
              marginTop: 56,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 14,
              padding: "0 10px",
            }}
          >
            {icons.map((icon, i) => {
              const pp = spring({
                frame: frame - iconDelays[i],
                fps,
                config: { damping: 14, mass: 0.6 },
              });
              const color = categories[icon.category] ?? t.colors.navy;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: interpolate(pp, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(
                      pp,
                      [0, 1],
                      [22, 0],
                    )}px) scale(${interpolate(pp, [0, 1], [0.7, 1])})`,
                  }}
                >
                  <PersonIcon color={color} size={130} />
                  <div
                    style={{
                      fontFamily: t.font.family,
                      fontSize: 24,
                      fontWeight: t.font.weight.semibold,
                      color: t.colors.textBright,
                      marginTop: 14,
                      textAlign: "center",
                      letterSpacing: "0.02em",
                      maxWidth: 130,
                      lineHeight: 1.2,
                    }}
                  >
                    {icon.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {legend.length > 0 && (
          <div
            style={{
              marginTop: 26,
              display: "flex",
              justifyContent: "center",
              gap: 40,
              opacity: interpolate(legendP, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(legendP, [0, 1], [12, 0])}px)`,
            }}
          >
            {legend.map((chip) => (
              <LegendChip
                key={chip.category}
                color={categories[chip.category] ?? t.colors.navy}
                count={chip.count}
                label={chip.label}
              />
            ))}
          </div>
        )}

        {callout && (
          <div
            style={{
              marginTop: "auto",
              background: t.colors.bgCardGray,
              border: `2px solid ${t.colors.bgCardGrayBorder}`,
              borderLeft: `6px solid ${calloutAccent}`,
              borderRadius: "0 12px 12px 0",
              padding: "22px 32px",
              opacity: interpolate(calloutP, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(calloutP, [0, 1], [16, 0])}px)`,
            }}
          >
            {callout.label && (
              <div
                style={{
                  fontFamily: t.font.family,
                  fontSize: 18,
                  fontWeight: t.font.weight.bold,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: calloutAccent,
                  marginBottom: 8,
                }}
              >
                {callout.label}
              </div>
            )}
            <div
              style={{
                fontFamily: t.font.family,
                fontSize: 24,
                fontStyle: "italic",
                color: t.colors.textBright,
                lineHeight: 1.5,
              }}
              // Content.yaml callout.text may include <strong> markup.
              // The text is author-controlled and lives in version control —
              // safe to pass through.
              dangerouslySetInnerHTML={{ __html: callout.text }}
            />
            {citeEntries.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 22,
                }}
              >
                {citeEntries.map((c) => (
                  <span key={c.label} style={citationStyle}>
                    {c.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </BriefingContainer>
  );
};

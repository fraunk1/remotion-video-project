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
 * `comparative_panels` slide — two mirrored columns with stat headers
 * and bulleted claims. Used for "N of them vs 1 of it" or
 * "preserving vs bypassing" rhetorical structure.
 */

export type ComparativePanelItem = {
  title: string;
  body: string;
  cite?: string;
  /** Pipeline-resolved URL for the cite string. */
  cite_href?: string;
};

export type ComparativePanel = {
  accent?: "blue" | "orange";
  stat?: string;
  stat_label?: string;
  eyebrow?: string;
  title?: string;
  items?: ComparativePanelItem[];
};

export type ComparativePanelsProps = {
  eyebrow?: string;
  title?: string;
  left?: ComparativePanel;
  right?: ComparativePanel;
};

const renderPanel = (opts: {
  panel: ComparativePanel;
  panelP: number;
  itemBaseDelay: number;
  bulletDirection: -12 | 12;
  frame: number;
  fps: number;
}) => {
  const { panel, panelP, itemBaseDelay, bulletDirection, frame, fps } = opts;
  const t = fsmbTheme;
  const accent = panel.accent === "orange" ? t.colors.orange : t.colors.blue;
  const items = panel.items ?? [];

  return (
    <div
      style={{
        background: t.colors.bgCardGray,
        border: `2px solid ${t.colors.bgCardGrayBorder}`,
        borderTop: `6px solid ${accent}`,
        borderRadius: 12,
        padding: "26px 28px",
        boxShadow: t.shadows.card,
        opacity: interpolate(panelP, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(panelP, [0, 1], [32, 0])}px)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {(panel.stat || panel.stat_label) && (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            borderBottom: `1px solid ${t.colors.bgCardGrayBorder}`,
            paddingBottom: 14,
            marginBottom: 18,
          }}
        >
          {panel.stat && (
            <div
              style={{
                fontFamily: t.font.family,
                fontSize: 54,
                fontWeight: t.font.weight.bold,
                color: accent,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {panel.stat}
            </div>
          )}
          {panel.stat_label && (
            <div
              style={{
                fontFamily: t.font.family,
                fontSize: 24,
                fontWeight: t.font.weight.bold,
                color: t.colors.navy,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                lineHeight: 1.25,
                whiteSpace: "pre-line",
              }}
            >
              {panel.stat_label}
            </div>
          )}
        </div>
      )}

      {panel.eyebrow && (
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 16,
            fontWeight: t.font.weight.bold,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: 6,
          }}
        >
          {panel.eyebrow}
        </div>
      )}
      {panel.title && (
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 24,
            fontWeight: t.font.weight.bold,
            color: t.colors.navy,
            marginBottom: 18,
            lineHeight: 1.2,
          }}
        >
          {panel.title}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((a, i) => {
          const itemP = spring({
            frame: frame - itemBaseDelay - i * 24,
            fps,
            config: { damping: 200 },
          });
          return (
            <div
              key={a.title + i}
              style={{
                paddingLeft: 22,
                position: "relative",
                opacity: interpolate(itemP, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(
                  itemP,
                  [0, 1],
                  [bulletDirection, 0],
                )}px)`,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 10,
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
              >
                <span
                  style={{
                    fontWeight: t.font.weight.bold,
                    color: t.colors.navy,
                  }}
                >
                  {a.title}
                </span>{" "}
                —{" "}
                {/* body may include HTML (e.g. <strong>) authored in content.yaml */}
                <span dangerouslySetInnerHTML={{ __html: a.body }} />
              </div>
              {a.cite && (
                <span style={citationStyle}>{a.cite}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const BriefingComparativePanels: React.FC<{ slide: Slide }> = ({
  slide,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = fsmbTheme;

  const p = (slide.props as ComparativePanelsProps | undefined) ?? {};
  const eyebrow = p.eyebrow ?? "";
  const title = p.title ?? slide.title ?? "";
  const left = p.left ?? {};
  const right = p.right ?? {};

  const eyebrowP = revealAt({ frame, fps, damping: 180 });
  const h2P = revealAt({ frame, fps, delay: 6, damping: 180 });
  const leftP = revealAt({ frame, fps, delay: 14, damping: 180 });
  const rightP = revealAt({ frame, fps, delay: 22, damping: 180 });

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
          fontSize: 80,
          fontWeight: t.font.weight.bold,
          color: t.colors.navy,
          marginTop: 6,
          ...lineIn(h2P),
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          marginTop: 36,
          flex: 1,
        }}
      >
        {renderPanel({
          panel: left,
          panelP: leftP,
          itemBaseDelay: 20,
          bulletDirection: -12,
          frame,
          fps,
        })}
        {renderPanel({
          panel: right,
          panelP: rightP,
          itemBaseDelay: 30,
          bulletDirection: 12,
          frame,
          fps,
        })}
      </div>
    </BriefingContainer>
  );
};

import React from "react";
import {
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BriefingContainer } from "./BriefingContainer";
import { fsmbTheme, citationStyle } from "./themes/fsmb";
import { lineIn, revealAt } from "./animations";
import type { Slide } from "../scenes/types";

/**
 * `sources_grid` slide — tile grid of source/citation thumbnails.
 *
 * Layout: 4-column grid. If tile count is 5-7, row 2 is right-shifted by
 * one column so the bottom-left FSMB logo zone stays clear (DESIGN_
 * GUIDELINES.md §4 "Logo clearance"). Counts 1-4 render a single row;
 * count 8 fills both rows exactly.
 */
export type SourcesGridTile = {
  thumbnail: string;
  title: string;
  /** Display URL (shown to viewer). */
  url?: string;
  /** Full href for the link (optional; display `url` is often a shortened form). */
  href?: string;
};

export type SourcesGridProps = {
  eyebrow?: string;
  title?: string;
  tiles?: SourcesGridTile[];
};

export const BriefingSourcesGrid: React.FC<{
  slide: Slide;
}> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = fsmbTheme;

  const p = (slide.props as SourcesGridProps | undefined) ?? {};
  const eyebrow = p.eyebrow ?? "Sources & Further Reading";
  const title = p.title ?? slide.title ?? "The Record";
  const tiles = p.tiles ?? [];

  const eyebrowP = revealAt({ frame, fps, damping: 180 });
  const h2P = revealAt({ frame, fps, delay: 6, damping: 180 });

  // Row-2 right-shift for odd-count grids (5-7 tiles) so the logo column
  // stays empty. Count 8 fills both rows; counts 1-4 render a single row.
  const needsLogoClearance = tiles.length >= 5 && tiles.length <= 7;
  const row2Start = Math.min(4, tiles.length);

  return (
    <BriefingContainer background="watermark" logoPath="aimsa-bg/fsmb-logo.png" padding={0}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding: "60px 90px 36px 90px",
        }}
      >
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 24,
            fontWeight: t.font.weight.semibold,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: t.colors.blue,
            ...lineIn(eyebrowP, { fromY: 14 }),
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 60,
            fontWeight: t.font.weight.bold,
            color: t.colors.navy,
            marginTop: 4,
            marginBottom: 28,
            ...lineIn(h2P, { fromY: 16 }),
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows:
              tiles.length > 4 ? "repeat(2, 1fr)" : "1fr",
            gap: 22,
            flex: 1,
            minHeight: 0,
          }}
        >
          {tiles.map((tile, i) => {
            const tileP = spring({
              frame: frame - (18 + i * 8),
              fps,
              config: { damping: 16, mass: 0.7 },
            });
            // For 5-7-tile grids, push row 2 tiles right by one column.
            const gridColumnStart =
              needsLogoClearance && i === row2Start ? 2 : undefined;
            const displayUrl = tile.url ?? tile.href ?? "";
            return (
              <div
                key={(tile.href ?? tile.title) + i}
                style={{
                  gridColumnStart,
                  background: t.colors.bgCardGray,
                  border: `2px solid ${t.colors.bgCardGrayBorder}`,
                  borderRadius: 12,
                  boxShadow: t.shadows.card,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  opacity: interpolate(tileP, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(
                    tileP,
                    [0, 1],
                    [20, 0],
                  )}px) scale(${interpolate(tileP, [0, 1], [0.94, 1])})`,
                }}
              >
                <div
                  style={{
                    flex: "0 0 68%",
                    overflow: "hidden",
                    position: "relative",
                    background: t.colors.bgSoft,
                    borderBottom: `1px solid ${t.colors.bgCardGrayBorder}`,
                  }}
                >
                  <Img
                    src={staticFile(`aimsa-bg/${tile.thumbnail}`)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: "1 1 auto",
                    background: t.colors.bgCardGray,
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
                    {tile.title}
                  </div>
                  {displayUrl && (
                    <span style={{ ...citationStyle, fontSize: 15, marginTop: 2 }}>
                      {displayUrl}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BriefingContainer>
  );
};

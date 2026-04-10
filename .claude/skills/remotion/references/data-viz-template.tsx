/**
 * Remotion Data Visualization Video Template
 *
 * Animated dashboard with KPI cards, bar chart, and donut chart.
 * Register in Root.tsx with width=1920, height=1080.
 *
 * Customize: Edit THEME, METRICS, CHART_DATA constants.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// ============================================================
// CONSTANTS
// ============================================================

const THEME = {
  bg: "#0f172a",
  surface: "#1e293b",
  surfaceAlt: "#334155",
  primary: "#3b82f6",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#a855f7",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  font: "Inter, system-ui, sans-serif",
};

const METRICS = [
  { label: "Revenue", value: 284500, prefix: "$", suffix: "", change: +12.4, format: "currency" },
  { label: "Users", value: 12847, prefix: "", suffix: "", change: +8.2, format: "number" },
  { label: "Conversion", value: 3.42, prefix: "", suffix: "%", change: -0.8, format: "decimal" },
  { label: "Avg. Order", value: 67.32, prefix: "$", suffix: "", change: +5.1, format: "currency" },
];

const BAR_CHART_DATA = [
  { label: "Jan", value: 42000, color: THEME.primary },
  { label: "Feb", value: 38000, color: THEME.primary },
  { label: "Mar", value: 55000, color: THEME.primary },
  { label: "Apr", value: 47000, color: THEME.primary },
  { label: "May", value: 62000, color: THEME.primary },
  { label: "Jun", value: 71000, color: THEME.success },
];

const DONUT_DATA = [
  { label: "Direct", value: 35, color: THEME.primary },
  { label: "Organic", value: 28, color: THEME.success },
  { label: "Referral", value: 22, color: THEME.purple },
  { label: "Social", value: 15, color: THEME.warning },
];

const DASHBOARD_TITLE = "Monthly Performance Dashboard";

// ============================================================
// ANIMATION HELPERS
// ============================================================

const useAnimatedValue = (
  targetValue: number,
  delay = 0,
  damping = 200
): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping },
  });
  return targetValue * Math.max(0, Math.min(1, progress));
};

const useFadeIn = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
  };
};

// ============================================================
// KPI CARD
// ============================================================

const KPICard: React.FC<{
  label: string;
  value: number;
  prefix: string;
  suffix: string;
  change: number;
  format: string;
  delay: number;
}> = ({ label, value, prefix, suffix, change, format, delay }) => {
  const animatedValue = useAnimatedValue(value, delay);
  const cardStyle = useFadeIn(delay);

  const formatValue = (v: number): string => {
    if (format === "currency") {
      return v >= 1000
        ? `${(v / 1000).toFixed(1)}K`
        : v.toFixed(0);
    }
    if (format === "decimal") return v.toFixed(2);
    if (format === "number") {
      return v >= 1000
        ? `${(v / 1000).toFixed(1)}K`
        : v.toFixed(0);
    }
    return v.toFixed(0);
  };

  const isPositive = change >= 0;

  return (
    <div
      style={{
        backgroundColor: THEME.surface,
        borderRadius: 16,
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        ...cardStyle,
      }}
    >
      <span
        style={{
          fontFamily: THEME.font,
          fontSize: 18,
          fontWeight: 500,
          color: THEME.textMuted,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: THEME.font,
          fontSize: 48,
          fontWeight: 700,
          color: THEME.text,
        }}
      >
        {prefix}
        {formatValue(animatedValue)}
        {suffix}
      </span>
      <span
        style={{
          fontFamily: THEME.font,
          fontSize: 16,
          fontWeight: 600,
          color: isPositive ? THEME.success : THEME.danger,
        }}
      >
        {isPositive ? "\u2191" : "\u2193"} {Math.abs(change)}% vs last month
      </span>
    </div>
  );
};

// ============================================================
// ANIMATED BAR CHART
// ============================================================

const AnimatedBarChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chartStyle = useFadeIn(delay);

  const maxValue = Math.max(...BAR_CHART_DATA.map((d) => d.value));
  const chartHeight = 300;
  const barWidth = 60;
  const gap = 40;

  return (
    <div
      style={{
        backgroundColor: THEME.surface,
        borderRadius: 16,
        padding: 32,
        flex: 1,
        ...chartStyle,
      }}
    >
      <span
        style={{
          fontFamily: THEME.font,
          fontSize: 20,
          fontWeight: 600,
          color: THEME.text,
          marginBottom: 24,
          display: "block",
        }}
      >
        Revenue by Month
      </span>

      <svg
        viewBox={`0 0 ${BAR_CHART_DATA.length * (barWidth + gap)} ${chartHeight + 40}`}
        style={{ width: "100%", height: chartHeight + 40 }}
      >
        {BAR_CHART_DATA.map((d, i) => {
          const barDelay = delay + 10 + i * 5;
          const progress = spring({
            frame: frame - barDelay,
            fps,
            config: { damping: 200 },
          });
          const barHeight = (d.value / maxValue) * chartHeight * Math.max(0, progress);

          return (
            <g key={i}>
              <rect
                x={i * (barWidth + gap) + gap / 2}
                y={chartHeight - barHeight}
                width={barWidth}
                height={barHeight}
                fill={d.color}
                rx={6}
              />
              <text
                x={i * (barWidth + gap) + gap / 2 + barWidth / 2}
                y={chartHeight + 24}
                textAnchor="middle"
                fill={THEME.textMuted}
                fontSize={14}
                fontFamily={THEME.font}
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={0}
          y1={chartHeight}
          x2={BAR_CHART_DATA.length * (barWidth + gap)}
          y2={chartHeight}
          stroke={THEME.surfaceAlt}
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};

// ============================================================
// ANIMATED DONUT CHART
// ============================================================

const AnimatedDonutChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chartStyle = useFadeIn(delay);

  const cx = 130;
  const cy = 130;
  const radius = 100;
  const strokeWidth = 36;
  const circumference = 2 * Math.PI * radius;

  const totalValue = DONUT_DATA.reduce((sum, d) => sum + d.value, 0);

  let cumulativePercent = 0;

  return (
    <div
      style={{
        backgroundColor: THEME.surface,
        borderRadius: 16,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 360,
        ...chartStyle,
      }}
    >
      <span
        style={{
          fontFamily: THEME.font,
          fontSize: 20,
          fontWeight: 600,
          color: THEME.text,
          marginBottom: 24,
          alignSelf: "flex-start",
        }}
      >
        Traffic Sources
      </span>

      <svg viewBox={`0 0 ${cx * 2} ${cy * 2}`} style={{ width: 260, height: 260 }}>
        {DONUT_DATA.map((d, i) => {
          const segmentDelay = delay + 15 + i * 8;
          const progress = spring({
            frame: frame - segmentDelay,
            fps,
            config: { damping: 200 },
          });

          const percent = d.value / totalValue;
          const dashLength = circumference * percent * Math.max(0, progress);
          const dashGap = circumference - dashLength;
          const offset = circumference * cumulativePercent;
          cumulativePercent += percent;

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${dashGap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 20px",
          marginTop: 20,
          justifyContent: "center",
        }}
      >
        {DONUT_DATA.map((d, i) => {
          const legendStyle = useFadeIn(delay + 30 + i * 5);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                ...legendStyle,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: d.color,
                }}
              />
              <span
                style={{
                  fontFamily: THEME.font,
                  fontSize: 14,
                  color: THEME.textMuted,
                }}
              >
                {d.label} ({d.value}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPOSITION
// ============================================================

export const DataDashboard: React.FC = () => {
  const titleStyle = useFadeIn(0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        padding: 60,
        flexDirection: "column",
        gap: 30,
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontFamily: THEME.font,
          fontSize: 36,
          fontWeight: 700,
          color: THEME.text,
          margin: 0,
          ...titleStyle,
        }}
      >
        {DASHBOARD_TITLE}
      </h1>

      {/* KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 20,
        }}
      >
        {METRICS.map((metric, i) => (
          <KPICard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
            change={metric.change}
            format={metric.format}
            delay={5 + i * 8}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "flex", gap: 20, flex: 1 }}>
        <AnimatedBarChart delay={40} />
        <AnimatedDonutChart delay={50} />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// COMPOSITION REGISTRATION (add to Root.tsx)
// ============================================================
//
// <Composition
//   id="DataDashboard"
//   component={DataDashboard}
//   durationInFrames={180}  // 6 seconds — enough for all animations to complete
//   fps={30}
//   width={1920}
//   height={1080}
// />

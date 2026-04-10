/**
 * Data Visualization Video — Animated dashboard with KPIs, bar chart, donut chart.
 * Edit THEME, METRICS, and chart data constants to customize.
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useFadeSlideIn } from "../components/animations";

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
  { label: "Revenue", value: 284500, prefix: "$", suffix: "", change: +12.4, format: "currency" as const },
  { label: "Users", value: 12847, prefix: "", suffix: "", change: +8.2, format: "number" as const },
  { label: "Conversion", value: 3.42, prefix: "", suffix: "%", change: -0.8, format: "decimal" as const },
  { label: "Avg. Order", value: 67.32, prefix: "$", suffix: "", change: +5.1, format: "currency" as const },
];

const BAR_DATA = [
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

// ============================================================
// HELPERS
// ============================================================

const useAnimatedValue = (target: number, delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return target * Math.max(0, Math.min(1, p));
};

const formatValue = (v: number, format: "currency" | "number" | "decimal") => {
  if (format === "decimal") return v.toFixed(2);
  return v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(0);
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
  format: "currency" | "number" | "decimal";
  delay: number;
}> = ({ label, value, prefix, suffix, change, format, delay }) => {
  const animated = useAnimatedValue(value, delay);
  const style = useFadeSlideIn(delay);
  const positive = change >= 0;

  return (
    <div
      style={{
        backgroundColor: THEME.surface,
        borderRadius: 16,
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        ...style,
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
        {formatValue(animated, format)}
        {suffix}
      </span>
      <span
        style={{
          fontFamily: THEME.font,
          fontSize: 16,
          fontWeight: 600,
          color: positive ? THEME.success : THEME.danger,
        }}
      >
        {positive ? "\u2191" : "\u2193"} {Math.abs(change)}% vs last month
      </span>
    </div>
  );
};

// ============================================================
// BAR CHART
// ============================================================

const BarChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const style = useFadeSlideIn(delay);
  const max = Math.max(...BAR_DATA.map((d) => d.value));
  const chartH = 300;
  const barW = 60;
  const gap = 40;

  return (
    <div
      style={{
        backgroundColor: THEME.surface,
        borderRadius: 16,
        padding: 32,
        flex: 1,
        ...style,
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
        viewBox={`0 0 ${BAR_DATA.length * (barW + gap)} ${chartH + 40}`}
        style={{ width: "100%", height: chartH + 40 }}
      >
        {BAR_DATA.map((d, i) => {
          const p = spring({
            frame: frame - (delay + 10 + i * 5),
            fps,
            config: { damping: 200 },
          });
          const h = (d.value / max) * chartH * Math.max(0, p);
          return (
            <g key={i}>
              <rect
                x={i * (barW + gap) + gap / 2}
                y={chartH - h}
                width={barW}
                height={h}
                fill={d.color}
                rx={6}
              />
              <text
                x={i * (barW + gap) + gap / 2 + barW / 2}
                y={chartH + 24}
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
        <line
          x1={0}
          y1={chartH}
          x2={BAR_DATA.length * (barW + gap)}
          y2={chartH}
          stroke={THEME.surfaceAlt}
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};

// ============================================================
// DONUT CHART
// ============================================================

const DonutChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const style = useFadeSlideIn(delay);
  const cx = 130,
    cy = 130,
    r = 100,
    sw = 36;
  const circ = 2 * Math.PI * r;
  const total = DONUT_DATA.reduce((s, d) => s + d.value, 0);
  let cumPct = 0;

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
        ...style,
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
          const p = spring({
            frame: frame - (delay + 15 + i * 8),
            fps,
            config: { damping: 200 },
          });
          const pct = d.value / total;
          const dashLen = circ * pct * Math.max(0, p);
          const dashGap = circ - dashLen;
          const offset = circ * cumPct;
          cumPct += pct;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={sw}
              strokeDasharray={`${dashLen} ${dashGap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}
      </svg>
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
          const ls = useFadeSlideIn(delay + 30 + i * 5);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, ...ls }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: d.color,
                }}
              />
              <span style={{ fontFamily: THEME.font, fontSize: 14, color: THEME.textMuted }}>
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
  const titleStyle = useFadeSlideIn(0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        padding: 60,
        flexDirection: "column",
        gap: 30,
      }}
    >
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
        Monthly Performance Dashboard
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20 }}>
        {METRICS.map((m, i) => (
          <KPICard key={m.label} {...m} delay={5 + i * 8} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, flex: 1 }}>
        <BarChart delay={40} />
        <DonutChart delay={50} />
      </div>
    </AbsoluteFill>
  );
};

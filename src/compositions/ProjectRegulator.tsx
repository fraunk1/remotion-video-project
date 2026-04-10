/**
 * Project Regulator — Explainer Presentation
 * Bold & vibrant style with rich gradients and energetic animations.
 * Edit the THEME, SLIDES array, and slide components to customize.
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
import {
  TransitionSeries,
  springTiming,
  linearTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import {
  FadeIn,
  ScaleIn,
  FloatingParticles,
  ProgressBar,
  useFadeSlideIn,
} from "../components/animations";

// ============================================================
// CONSTANTS — Edit these to customize the presentation
// ============================================================

const THEME = {
  // Bold gradient backgrounds
  bgGradientStart: "#1a0533",
  bgGradientEnd: "#0d1b3e",
  // Accent colors
  primary: "#a855f7",       // vivid purple
  secondary: "#06b6d4",     // cyan
  accent: "#f97316",        // orange
  highlight: "#ec4899",     // pink
  success: "#22c55e",       // green
  // Text
  text: "#ffffff",
  textMuted: "#c4b5fd",
  // Fonts
  font: "Inter, system-ui, sans-serif",
};

const LAYOUT = {
  padding: 80,
  headingSize: 76,
  subheadingSize: 38,
  bodySize: 30,
  bulletSize: 34,
};

const SLIDES = [
  {
    type: "hero" as const,
    title: "Project Regulator",
    subtitle: "Smarter compliance. Faster approvals. Zero guesswork.",
    tagline: "INTRODUCING",
    duration: 180,
  },
  {
    type: "problem" as const,
    title: "The Problem",
    statement: "Regulatory compliance is slow, fragmented, and costly.",
    painPoints: [
      "Manual reviews take weeks, not hours",
      "Rules change faster than teams can adapt",
      "Disconnected tools create blind spots",
    ],
    duration: 240,
  },
  {
    type: "solution" as const,
    title: "How It Works",
    steps: [
      { icon: "1", label: "Ingest", description: "Import regulations, policies & internal rules into one unified engine" },
      { icon: "2", label: "Analyze", description: "AI-powered analysis maps your workflows to compliance requirements" },
      { icon: "3", label: "Automate", description: "Continuous monitoring flags issues before they become violations" },
    ],
    duration: 270,
  },
  {
    type: "features" as const,
    title: "Key Features",
    features: [
      { label: "Real-Time Monitoring", color: THEME.primary },
      { label: "Auto-Generated Reports", color: THEME.secondary },
      { label: "Smart Alerts & Escalation", color: THEME.accent },
      { label: "Audit-Ready Dashboard", color: THEME.highlight },
    ],
    duration: 210,
  },
  {
    type: "stats" as const,
    title: "By the Numbers",
    metrics: [
      { value: "85%", label: "Faster Reviews" },
      { value: "3x", label: "More Coverage" },
      { value: "60%", label: "Cost Reduction" },
      { value: "99.9%", label: "Uptime" },
    ],
    duration: 210,
  },
  {
    type: "closing" as const,
    title: "Get Started Today",
    subtitle: "Project Regulator — Compliance, reinvented.",
    cta: "Request a Demo",
    duration: 150,
  },
];

const TOTAL_DURATION = SLIDES.reduce((sum, s) => sum + s.duration, 0);

// ============================================================
// HELPERS
// ============================================================

const GradientBg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${THEME.bgGradientStart} 0%, ${THEME.bgGradientEnd} 100%)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

const GlowOrb: React.FC<{
  color: string;
  size: number;
  x: string;
  y: string;
  delay?: number;
}> = ({ color, size, x, y, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = spring({
    frame: frame - delay,
    fps,
    config: { damping: 100, stiffness: 20 },
  });
  const scale = interpolate(pulse, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        transform: `scale(${scale})`,
        filter: "blur(40px)",
      }}
    />
  );
};

const AccentLine: React.FC<{ delay?: number; color?: string }> = ({
  delay = 0,
  color = THEME.primary,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const w = interpolate(width, [0, 1], [0, 120]);

  return (
    <div
      style={{
        width: w,
        height: 5,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${color}, ${THEME.secondary})`,
        margin: "24px 0",
      }}
    />
  );
};

// ============================================================
// SLIDE COMPONENTS
// ============================================================

const HeroSlide: React.FC<{
  title: string;
  subtitle: string;
  tagline: string;
}> = ({ title, subtitle, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const taglineStyle = useFadeSlideIn(0);
  const titleStyle = useFadeSlideIn(10);
  const subtitleStyle = useFadeSlideIn(25);

  const shimmer = interpolate(frame, [30, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <GradientBg>
      <GlowOrb color={THEME.primary} size={600} x="10%" y="-10%" />
      <GlowOrb color={THEME.secondary} size={500} x="70%" y="50%" delay={15} />
      <GlowOrb color={THEME.highlight} size={400} x="30%" y="70%" delay={30} />
      <FloatingParticles count={20} color="rgba(168, 85, 247, 0.15)" maxSize={6} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: LAYOUT.padding,
        }}
      >
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div
            style={{
              fontFamily: THEME.font,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 6,
              color: THEME.primary,
              textTransform: "uppercase" as const,
              marginBottom: 20,
              ...taglineStyle,
            }}
          >
            {tagline}
          </div>
          <h1
            style={{
              fontFamily: THEME.font,
              fontSize: 96,
              fontWeight: 800,
              color: THEME.text,
              margin: 0,
              lineHeight: 1.1,
              background: `linear-gradient(135deg, ${THEME.text} ${shimmer * 40}%, ${THEME.primary} ${shimmer * 100}%, ${THEME.secondary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              ...titleStyle,
            }}
          >
            {title}
          </h1>
          <AccentLine delay={20} />
          <p
            style={{
              fontFamily: THEME.font,
              fontSize: LAYOUT.subheadingSize,
              color: THEME.textMuted,
              margin: "0 auto",
              maxWidth: 900,
              lineHeight: 1.5,
              ...subtitleStyle,
            }}
          >
            {subtitle}
          </p>
        </div>
      </AbsoluteFill>
      <ProgressBar color={THEME.primary} height={3} />
    </GradientBg>
  );
};

const ProblemSlide: React.FC<{
  title: string;
  statement: string;
  painPoints: string[];
}> = ({ title, statement, painPoints }) => {
  const titleStyle = useFadeSlideIn(0);
  const statementStyle = useFadeSlideIn(12);

  return (
    <GradientBg>
      <GlowOrb color={THEME.accent} size={500} x="80%" y="-5%" />
      <GlowOrb color={THEME.highlight} size={350} x="5%" y="60%" delay={10} />
      <AbsoluteFill
        style={{
          padding: LAYOUT.padding,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontFamily: THEME.font,
            fontSize: LAYOUT.headingSize,
            fontWeight: 700,
            color: THEME.accent,
            margin: 0,
            ...titleStyle,
          }}
        >
          {title}
        </h2>
        <AccentLine delay={8} color={THEME.accent} />
        <p
          style={{
            fontFamily: THEME.font,
            fontSize: 40,
            fontWeight: 600,
            color: THEME.text,
            lineHeight: 1.4,
            maxWidth: 1200,
            marginBottom: 50,
            ...statementStyle,
          }}
        >
          {statement}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {painPoints.map((point, i) => {
            const itemStyle = useFadeSlideIn(25 + i * 12);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  ...itemStyle,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: THEME.accent,
                    flexShrink: 0,
                    boxShadow: `0 0 12px ${THEME.accent}80`,
                  }}
                />
                <span
                  style={{
                    fontFamily: THEME.font,
                    fontSize: LAYOUT.bulletSize,
                    color: THEME.textMuted,
                    lineHeight: 1.5,
                  }}
                >
                  {point}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </GradientBg>
  );
};

const SolutionSlide: React.FC<{
  title: string;
  steps: { icon: string; label: string; description: string }[];
}> = ({ title, steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleStyle = useFadeSlideIn(0);

  return (
    <GradientBg>
      <GlowOrb color={THEME.secondary} size={500} x="50%" y="-10%" />
      <GlowOrb color={THEME.primary} size={400} x="0%" y="70%" delay={20} />
      <AbsoluteFill
        style={{
          padding: LAYOUT.padding,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontFamily: THEME.font,
            fontSize: LAYOUT.headingSize,
            fontWeight: 700,
            color: THEME.text,
            margin: 0,
            marginBottom: 10,
            ...titleStyle,
          }}
        >
          {title}
        </h2>
        <AccentLine delay={8} />
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 40,
          }}
        >
          {steps.map((step, i) => {
            const cardDelay = 20 + i * 18;
            const cardProgress = spring({
              frame: frame - cardDelay,
              fps,
              config: { damping: 15, stiffness: 80 },
            });
            const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
            const cardY = interpolate(cardProgress, [0, 1], [60, 0]);
            const colors = [THEME.primary, THEME.secondary, THEME.success];

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 24,
                  padding: 40,
                  border: `1px solid ${colors[i]}30`,
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px)`,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}80)`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: THEME.font,
                    fontSize: 28,
                    fontWeight: 800,
                    color: THEME.text,
                    marginBottom: 24,
                    boxShadow: `0 4px 20px ${colors[i]}40`,
                  }}
                >
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontFamily: THEME.font,
                    fontSize: 32,
                    fontWeight: 700,
                    color: THEME.text,
                    margin: "0 0 12px 0",
                  }}
                >
                  {step.label}
                </h3>
                <p
                  style={{
                    fontFamily: THEME.font,
                    fontSize: 22,
                    color: THEME.textMuted,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </GradientBg>
  );
};

const FeaturesSlide: React.FC<{
  title: string;
  features: { label: string; color: string }[];
}> = ({ title, features }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleStyle = useFadeSlideIn(0);

  return (
    <GradientBg>
      <GlowOrb color={THEME.highlight} size={450} x="75%" y="10%" />
      <GlowOrb color={THEME.primary} size={350} x="10%" y="50%" delay={15} />
      <AbsoluteFill
        style={{
          padding: LAYOUT.padding,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontFamily: THEME.font,
            fontSize: LAYOUT.headingSize,
            fontWeight: 700,
            color: THEME.text,
            margin: 0,
            marginBottom: 10,
            ...titleStyle,
          }}
        >
          {title}
        </h2>
        <AccentLine delay={8} color={THEME.highlight} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 30,
            marginTop: 40,
          }}
        >
          {features.map((feature, i) => {
            const delay = 18 + i * 12;
            const progress = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 90 },
            });
            const opacity = interpolate(progress, [0, 1], [0, 1]);
            const scale = interpolate(progress, [0, 1], [0.85, 1]);

            return (
              <div
                key={i}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 20,
                  padding: "36px 40px",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  border: `1px solid ${feature.color}30`,
                  opacity,
                  transform: `scale(${scale})`,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: feature.color,
                    boxShadow: `0 0 16px ${feature.color}60`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: THEME.font,
                    fontSize: 32,
                    fontWeight: 600,
                    color: THEME.text,
                  }}
                >
                  {feature.label}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </GradientBg>
  );
};

const StatsSlide: React.FC<{
  title: string;
  metrics: { value: string; label: string }[];
}> = ({ title, metrics }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleStyle = useFadeSlideIn(0);
  const colors = [THEME.primary, THEME.secondary, THEME.accent, THEME.highlight];

  return (
    <GradientBg>
      <GlowOrb color={THEME.primary} size={500} x="50%" y="40%" />
      <FloatingParticles count={12} color="rgba(6, 182, 212, 0.12)" maxSize={5} />
      <AbsoluteFill
        style={{
          padding: LAYOUT.padding,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: THEME.font,
            fontSize: LAYOUT.headingSize,
            fontWeight: 700,
            color: THEME.text,
            margin: 0,
            marginBottom: 10,
            textAlign: "center",
            ...titleStyle,
          }}
        >
          {title}
        </h2>
        <AccentLine delay={8} />
        <div
          style={{
            display: "flex",
            gap: 50,
            marginTop: 50,
          }}
        >
          {metrics.map((metric, i) => {
            const delay = 15 + i * 10;
            const progress = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 100 },
            });
            const scale = interpolate(progress, [0, 1], [0, 1]);
            const opacity = interpolate(progress, [0, 1], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  opacity,
                  transform: `scale(${scale})`,
                }}
              >
                <div
                  style={{
                    fontFamily: THEME.font,
                    fontSize: 80,
                    fontWeight: 800,
                    color: colors[i % colors.length],
                    lineHeight: 1,
                    textShadow: `0 0 30px ${colors[i % colors.length]}40`,
                  }}
                >
                  {metric.value}
                </div>
                <div
                  style={{
                    fontFamily: THEME.font,
                    fontSize: 24,
                    color: THEME.textMuted,
                    marginTop: 16,
                    fontWeight: 500,
                  }}
                >
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </GradientBg>
  );
};

const ClosingSlide: React.FC<{
  title: string;
  subtitle: string;
  cta: string;
}> = ({ title, subtitle, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleStyle = useFadeSlideIn(0);
  const subtitleStyle = useFadeSlideIn(15);

  const ctaProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.8, 1]);
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1]);

  return (
    <GradientBg>
      <GlowOrb color={THEME.primary} size={600} x="50%" y="30%" />
      <GlowOrb color={THEME.secondary} size={400} x="20%" y="60%" delay={10} />
      <GlowOrb color={THEME.highlight} size={350} x="80%" y="10%" delay={20} />
      <FloatingParticles count={25} color="rgba(168, 85, 247, 0.12)" maxSize={5} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: LAYOUT.padding,
        }}
      >
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <h1
            style={{
              fontFamily: THEME.font,
              fontSize: 88,
              fontWeight: 800,
              color: THEME.text,
              margin: 0,
              lineHeight: 1.1,
              ...titleStyle,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: THEME.font,
              fontSize: LAYOUT.subheadingSize,
              color: THEME.textMuted,
              marginTop: 20,
              marginBottom: 50,
              ...subtitleStyle,
            }}
          >
            {subtitle}
          </p>
          <div
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
              borderRadius: 16,
              padding: "20px 60px",
              opacity: ctaOpacity,
              transform: `scale(${ctaScale})`,
              boxShadow: `0 8px 32px ${THEME.primary}50`,
            }}
          >
            <span
              style={{
                fontFamily: THEME.font,
                fontSize: 32,
                fontWeight: 700,
                color: THEME.text,
              }}
            >
              {cta}
            </span>
          </div>
        </div>
      </AbsoluteFill>
      <ProgressBar color={THEME.primary} height={3} />
    </GradientBg>
  );
};

// ============================================================
// SLIDE RENDERER
// ============================================================

const renderSlide = (s: (typeof SLIDES)[number]) => {
  switch (s.type) {
    case "hero":
      return <HeroSlide title={s.title} subtitle={s.subtitle} tagline={s.tagline} />;
    case "problem":
      return <ProblemSlide title={s.title} statement={s.statement} painPoints={s.painPoints} />;
    case "solution":
      return <SolutionSlide title={s.title} steps={s.steps} />;
    case "features":
      return <FeaturesSlide title={s.title} features={s.features} />;
    case "stats":
      return <StatsSlide title={s.title} metrics={s.metrics} />;
    case "closing":
      return <ClosingSlide title={s.title} subtitle={s.subtitle} cta={s.cta} />;
    default:
      return null;
  }
};

// ============================================================
// MAIN COMPOSITION
// ============================================================

export const ProjectRegulator: React.FC = () => {
  return (
    <TransitionSeries>
      {SLIDES.map((slideData, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={slideData.duration}>
            {renderSlide(slideData)}
          </TransitionSeries.Sequence>
          {i < SLIDES.length - 1 && (
            <TransitionSeries.Transition
              timing={
                i % 2 === 0
                  ? springTiming({ config: { damping: 200 } })
                  : linearTiming({ durationInFrames: 25 })
              }
              presentation={
                i % 2 === 0 ? slide({ direction: "from-right" }) : fade()
              }
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};

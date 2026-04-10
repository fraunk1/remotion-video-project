# Remotion Video Skill

Create programmatic videos using React with Remotion. This skill covers presentation-style videos, social media clips, and data visualization animations.

## When to Use

Trigger this skill when the user asks to:
- Create a video, animation, or motion graphic using code/React
- Make a presentation video or animated slide deck
- Create social media video clips (Instagram Reels, TikTok, LinkedIn)
- Animate charts, dashboards, or data visualizations as video
- Render React components to MP4/WebM

## Project Setup

### New Project (Recommended)

```bash
npx create-video@latest my-video
cd my-video
npm install
```

Choose the **Blank** template and enable **TailwindCSS** when prompted.

### Manual Setup in Existing Project

```bash
npm i --save-exact remotion @remotion/cli @remotion/renderer
```

Additional packages as needed:
```bash
npm i --save-exact @remotion/transitions   # Slide, fade, wipe transitions
npm i --save-exact @remotion/gif           # Animated GIF support
npm i --save-exact @remotion/player        # Embed player in React app
npm i --save-exact @remotion/tailwind      # TailwindCSS integration
```

### Project Structure

```
my-video/
  src/
    index.ts          # Entry point: registerRoot(Root)
    Root.tsx           # Composition definitions
    compositions/
      MyVideo.tsx      # Video component
  public/              # Static assets (images, fonts, audio)
  remotion.config.ts   # Remotion configuration
```

**Entry point** (`src/index.ts`):
```tsx
import { registerRoot } from "remotion";
import { Root } from "./Root";
registerRoot(Root);
```

**Root component** (`src/Root.tsx`):
```tsx
import { Composition } from "remotion";
import { MyVideo } from "./compositions/MyVideo";

export const Root: React.FC = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

## Core API Reference

### Hooks

| Hook | Returns | Usage |
|---|---|---|
| `useCurrentFrame()` | Current frame number (0-indexed) | Drive all animations |
| `useVideoConfig()` | `{ fps, durationInFrames, width, height }` | Access composition metadata |

### Animation Primitives

**`interpolate()`** — Linear value mapping:
```tsx
import { useCurrentFrame, interpolate } from "remotion";

const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

**`spring()`** — Physics-based animation:
```tsx
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const scale = spring({
  frame,
  fps,
  config: { damping: 200, stiffness: 100, mass: 1 },
});
```

Spring parameters:
- `damping` (default 10): Higher = less bounce. Use 200 for no bounce.
- `stiffness` (default 100): Higher = faster animation.
- `mass` (default 1): Higher = more inertia.
- `delay`: Delay in frames before animation starts.
- `durationInFrames`: Stretch to exact duration.
- `reverse: true`: Play animation backwards.

**`random('seed')`** — Deterministic randomness:
```tsx
import { random } from "remotion";
const value = random("my-seed"); // Always returns same value for same seed
```

### CRITICAL RULE: Determinism

Remotion requires ALL React code to be deterministic.
- **NEVER** use `Math.random()`. Use `random('seed')` from remotion instead.
- **NEVER** use `Date.now()` or `new Date()` for animation logic.
- Components must render identically for the same frame number.

### Layout Components

**`<AbsoluteFill>`** — Full-size absolutely positioned container. Layers children on top of each other:
```tsx
import { AbsoluteFill } from "remotion";

<AbsoluteFill style={{ backgroundColor: "#0f0f0f" }}>
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <h1>Centered Text</h1>
  </AbsoluteFill>
</AbsoluteFill>
```

**`<Sequence>`** — Time-shifted content. Children's frame count resets to 0:
```tsx
import { Sequence } from "remotion";

<Sequence from={30} durationInFrames={60}>
  {/* This component sees frame 0 when the parent is at frame 30 */}
  <MyScene />
</Sequence>
```

**`<Series>`** — Sequential layout helper:
```tsx
import { Series } from "remotion";

<Series>
  <Series.Sequence durationInFrames={60}><SceneA /></Series.Sequence>
  <Series.Sequence durationInFrames={90}><SceneB /></Series.Sequence>
  <Series.Sequence durationInFrames={60}><SceneC /></Series.Sequence>
</Series>
```

### Transitions (requires `@remotion/transitions`)

```tsx
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    timing={springTiming({ config: { damping: 200 } })}
    presentation={slide({ direction: "from-right" })}
  />
  <TransitionSeries.Sequence durationInFrames={90}>
    <SceneB />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    timing={linearTiming({ durationInFrames: 20 })}
    presentation={fade()}
  />
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneC />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

Available presentations: `slide()`, `fade()`, `wipe()`, `flip()`, `clockWipe()`, `none()`.

Timing options: `linearTiming({ durationInFrames })`, `springTiming({ config })`.

**Rules**: Transitions cannot exceed adjacent sequence durations. Two transitions cannot be consecutive.

### Media Components

```tsx
import { Img, Audio, Video, staticFile } from "remotion";

// Image (non-animated)
<Img src={staticFile("logo.png")} style={{ width: 200 }} />

// Audio
<Audio src={staticFile("bgm.mp3")} volume={0.5} />

// Video
<Video src={staticFile("clip.mp4")} volume={0} startFrom={30} endAt={120} />
```

`staticFile()` references files in the `public/` directory.

## Design Principles for AI-Generated Video

### Constants-First Design

Declare ALL configurable values at the top of each component:
```tsx
const COLORS = {
  bg: "#0a0a0a",
  primary: "#3b82f6",
  accent: "#f59e0b",
  text: "#ffffff",
};

const TIMING = {
  titleIn: 0,
  titleDuration: 30,
  subtitleDelay: 15,
  contentIn: 45,
};

const FONT = {
  heading: "Inter, sans-serif",
  body: "Inter, sans-serif",
  headingSize: 72,
  bodySize: 28,
};
```

### Aesthetic Defaults

- Use `spring()` with high damping (200) for professional, non-bouncy motion.
- Stagger element entrances by 5-15 frames for visual rhythm.
- Use `interpolate()` with `"clamp"` on both sides to prevent overshoot.
- Subtle scale animations (0.95 to 1.0) feel polished.
- Prefer eased opacity fades (0 to 1 over 20-30 frames).

### Natural Motion

```tsx
// Staggered entrance pattern
const items = ["Item A", "Item B", "Item C"];
{items.map((item, i) => {
  const delay = i * 8;
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const y = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div key={item} style={{ transform: `translateY(${y}px)`, opacity }}>
      {item}
    </div>
  );
})}
```

## Use Case 1: Presentation-Style Videos

See `references/presentation-template.tsx` for a full example.

### Dimensions and Timing

| Format | Width | Height | FPS | Typical Duration |
|---|---|---|---|---|
| Widescreen (16:9) | 1920 | 1080 | 30 | 60-300s |
| Keynote-style | 1920 | 1080 | 30 | 30-120s per slide |

### Slide Architecture

Each slide is a separate React component. Use `<TransitionSeries>` to chain slides with transitions:

```tsx
const Presentation: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={150}>
      <TitleSlide title="My Presentation" subtitle="March 2026" />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      timing={springTiming({ config: { damping: 200 } })}
      presentation={slide({ direction: "from-right" })}
    />
    <TransitionSeries.Sequence durationInFrames={180}>
      <ContentSlide title="Key Point" bullets={["First", "Second", "Third"]} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      timing={linearTiming({ durationInFrames: 20 })}
      presentation={fade()}
    />
    <TransitionSeries.Sequence durationInFrames={120}>
      <ClosingSlide text="Thank You" />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
```

### Patterns

- **Title Slide**: Large heading, subtitle, animated entrance from below with spring.
- **Bullet Slide**: Title + staggered bullet points fading/sliding in.
- **Image Slide**: Full-bleed background image with overlaid text.
- **Two-Column**: Split layout with text on one side, visual on the other.
- **Closing Slide**: Centered CTA or thank-you with fade-in.

## Use Case 2: Social Media Clips

See `references/social-media-template.tsx` for a full example.

### Dimensions and Timing

| Platform | Width | Height | Aspect | FPS | Max Duration |
|---|---|---|---|---|---|
| Instagram Reel / TikTok | 1080 | 1920 | 9:16 | 30 | 90s |
| Instagram Feed | 1080 | 1080 | 1:1 | 30 | 60s |
| LinkedIn Video | 1920 | 1080 | 16:9 | 30 | 600s |
| YouTube Short | 1080 | 1920 | 9:16 | 30 | 60s |
| Twitter/X Video | 1920 | 1080 | 16:9 | 30 | 140s |

### Patterns

- **Hook in first 3 seconds**: Bold text, zoom-in, or flash effect.
- **Fast-paced cuts**: 2-4 second scenes max.
- **Text overlays**: Large, readable, high-contrast. Minimum 48px for vertical video.
- **Progress indicators**: Animated bars or countdowns.
- **CTA at end**: Subscribe, follow, or link prompt.
- **Safe zones**: Keep critical content away from edges (100px inset on all sides for vertical).

### Vertical Video Component Pattern

```tsx
export const SocialClip: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={90}>
          <HookScene text="Did you know?" />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <MainContent />
        </Series.Sequence>
        <Series.Sequence durationInFrames={60}>
          <CallToAction text="Follow for more!" />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
```

## Use Case 3: Data Visualizations

See `references/data-viz-template.tsx` for a full example.

### Animated Chart Patterns

**Bar Chart Animation**: Bars grow from 0 to their value using spring:
```tsx
const barHeight = interpolate(
  spring({ frame, fps, config: { damping: 200 } }),
  [0, 1],
  [0, data.value * scale]
);
```

**Line Chart Animation**: Use `interpolate` to reveal the line progressively:
```tsx
const progress = interpolate(frame, [0, 60], [0, 1], {
  extrapolateRight: "clamp",
});
// Use SVG path with strokeDashoffset based on progress
```

**Number Counter**: Animate a number counting up:
```tsx
const displayValue = Math.round(
  interpolate(
    spring({ frame, fps, config: { damping: 200 } }),
    [0, 1],
    [0, targetValue]
  )
);
```

**Pie/Donut Chart**: Animate arc using SVG with interpolated `strokeDasharray`:
```tsx
const circumference = 2 * Math.PI * radius;
const progress = spring({ frame, fps, config: { damping: 200 } });
const dashArray = `${circumference * progress * percentage} ${circumference}`;
```

### Dashboard Layout Pattern

Compose multiple KPI cards and charts with staggered entrances:
```tsx
const Dashboard: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0f172a", padding: 60 }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 30 }}>
      {metrics.map((metric, i) => (
        <Sequence key={metric.label} from={i * 10}>
          <KPICard label={metric.label} value={metric.value} />
        </Sequence>
      ))}
    </div>
    <Sequence from={40}>
      <AnimatedBarChart data={chartData} />
    </Sequence>
  </AbsoluteFill>
);
```

### SVG-Based Charts

Use inline SVG for charts. This gives full control over animation and renders crisply at any resolution:

```tsx
<svg viewBox="0 0 800 400" style={{ width: "100%", height: "100%" }}>
  {data.map((d, i) => (
    <rect
      key={i}
      x={i * (barWidth + gap)}
      y={400 - barHeight}
      width={barWidth}
      height={barHeight}
      fill={COLORS.primary}
      rx={4}
    />
  ))}
</svg>
```

## Rendering

### Preview (Development)

```bash
npx remotion studio
# or
npm run dev
```

Opens a browser preview at `http://localhost:3000`.

### Render to File (CLI)

```bash
# Render MP4 (default codec: h264)
npx remotion render MyVideo out/video.mp4

# Render WebM
npx remotion render MyVideo out/video.webm --codec=vp8

# Render specific frame range
npx remotion render MyVideo out/clip.mp4 --frames=0-90

# Render a still image
npx remotion still MyVideo out/thumbnail.png --frame=0

# Render with custom props
npx remotion render MyVideo out/video.mp4 --props='{"title":"Hello"}'
```

### Render Programmatically (Node.js)

```tsx
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";

const bundled = await bundle({ entryPoint: "./src/index.ts" });
const compositions = await getCompositions(bundled);
const comp = compositions.find((c) => c.id === "MyVideo")!;

await renderMedia({
  composition: comp,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "out/video.mp4",
});
```

### Render Quality Settings

| Codec | Format | Quality | Use Case |
|---|---|---|---|
| `h264` | MP4 | Good, small file | General delivery, social media |
| `h265` | MP4 | Better, smaller | Modern devices |
| `vp8` | WebM | Good | Web embedding |
| `prores` | MOV | Lossless | Post-production |

Add `--crf=18` for higher quality (lower CRF = better quality, range 0-51, default ~20).

## Common Patterns

### Fade In/Out Wrapper

```tsx
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  return <div style={{ opacity }}>{children}</div>;
};
```

### Slide Up Entrance

```tsx
const SlideUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  const y = interpolate(progress, [0, 1], [50, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div style={{ transform: `translateY(${y}px)`, opacity }}>
      {children}
    </div>
  );
};
```

### Typewriter Text

```tsx
const Typewriter: React.FC<{ text: string; startFrame?: number }> = ({
  text,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.min(
    text.length,
    Math.max(0, Math.floor((frame - startFrame) / 2))
  );
  return <span>{text.slice(0, charsToShow)}</span>;
};
```

### Progress Bar

```tsx
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: "#333" }}>
      <div style={{ width: `${progress}%`, height: "100%", backgroundColor: COLORS.primary }} />
    </div>
  );
};
```

## Checklist Before Rendering

1. **No `Math.random()`** — use `random('seed')` from remotion.
2. **No `Date.now()`** — use frame-based timing only.
3. **All assets in `public/`** — referenced via `staticFile()`.
4. **Composition registered** — check `Root.tsx` has the `<Composition>` entry.
5. **Duration correct** — `durationInFrames` matches intended video length.
6. **Dimensions correct** — width/height match target platform.
7. **FPS set** — typically 30 for web/social, 24 for cinematic.
8. **Test in studio** — run `npx remotion studio` before final render.
9. **Fonts loaded** — use `@remotion/google-fonts` or CSS `@font-face`.

## Troubleshooting

| Issue | Solution |
|---|---|
| Blank/white frames | Check component renders correctly at frame 0 |
| Animations not starting | Verify `useCurrentFrame()` is called, check `from` on Sequences |
| Flickering | Ensure deterministic rendering — no `Math.random()` or side effects |
| Font not loading | Use `@remotion/google-fonts` package or preload fonts |
| Audio out of sync | Use `<Audio>` component, not HTML `<audio>`. Check `startFrom` prop |
| Slow rendering | Reduce resolution for testing; use `--concurrency` flag for parallel rendering |
| "Cannot find module" | Run `npm install` and ensure all `@remotion/*` packages share the same version |

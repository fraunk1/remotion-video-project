# Remotion Video Project — Instructions

## Overview

This project uses [Remotion](https://www.remotion.dev/) to create programmatic videos with React. It ships with three ready-made compositions and a shared animation library, so you can preview, customize, and render videos entirely from code.

**Remotion version:** 4.0.441
**React version:** 19.2.4
**Node requirement:** 18+

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Launch the Remotion Studio (live preview)

```bash
npm run dev
```

This opens a browser at `http://localhost:3000` where you can scrub through frames, switch between compositions, and see changes in real time.

### 3. Render a video to file

```bash
# Render a specific composition
npm run render:presentation     # → out/presentation.mp4
npm run render:social           # → out/social-clip.mp4
npm run render:dashboard        # → out/dashboard.mp4

# Render all three at once
npm run render:all

# Export a thumbnail (still frame)
npm run still:presentation      # → out/presentation-thumb.png
npm run still:dashboard         # → out/dashboard-thumb.png
```

You can also render manually with extra options:

```bash
npx remotion render <CompositionId> out/filename.mp4 --crf=18   # higher quality
npx remotion render SocialClip out/clip.webm --codec=vp8        # WebM format
npx remotion render Presentation out/clip.mp4 --frames=0-150    # partial render
```

---

## Project Structure

```
remotion-video-project/
├── src/
│   ├── index.ts                 # Entry point — registers the Root component
│   ├── Root.tsx                 # Defines all compositions (videos)
│   ├── components/
│   │   └── animations.tsx       # Shared animation utilities & hooks
│   └── compositions/
│       ├── Presentation.tsx     # Slide-deck style video (16:9)
│       ├── SocialClip.tsx       # Vertical social media clip (9:16)
│       └── DataDashboard.tsx    # Animated metrics dashboard (16:9)
├── public/                      # Static assets (images, fonts, audio)
├── remotion.config.ts           # Remotion settings (output format, overwrite)
├── package.json                 # Scripts and dependencies
└── tsconfig.json                # TypeScript configuration
```

---

## Compositions at a Glance

| Composition | ID | Dimensions | FPS | Duration | Description |
|---|---|---|---|---|---|
| Presentation | `Presentation` | 1920 × 1080 | 30 | 810 frames (27s) | Animated slide deck with title, bullets, two-column, quote, and closing slides |
| Social Clip | `SocialClip` | 1080 × 1920 | 30 | 420 frames (14s) | Vertical video with hook → numbered points → CTA, plus progress bar |
| Data Dashboard | `DataDashboard` | 1920 × 1080 | 30 | 180 frames (6s) | KPI cards, bar chart, and donut chart that animate in with staggered timing |

---

## How to Customize Each Composition

All three compositions follow a **constants-first design** — the data and theme live in clearly marked `CONSTANTS` blocks at the top of each file. You rarely need to touch the component logic.

### Presentation (`src/compositions/Presentation.tsx`)

Edit the `THEME` object to change colors and fonts, the `LAYOUT` object for sizing, and the `SLIDES` array to add, remove, or reorder slides. Each slide entry has a `type` (`title`, `bullets`, `twoColumn`, `quote`, or `closing`), its content fields, and a `duration` in frames.

To add a new slide, push another object into `SLIDES` with the matching type and fields. The transitions between slides alternate automatically (slide-from-right and fade).

If total duration changes, update the `durationInFrames` value in `Root.tsx` to match the sum of all slide durations.

### Social Clip (`src/compositions/SocialClip.tsx`)

Edit the `THEME` object for colors/gradient and the `CONTENT` object for the hook text, topic, numbered points, CTA, and handle. The `SAFE` object defines padding to keep text out of platform UI zones.

To add or remove points, just modify the `CONTENT.points` array. Each point gets a 90-frame (3-second) scene. Update `durationInFrames` in `Root.tsx` if the total scene count changes.

### Data Dashboard (`src/compositions/DataDashboard.tsx`)

Edit `METRICS` for the KPI cards (label, value, prefix/suffix, percent change), `BAR_DATA` for the bar chart, and `DONUT_DATA` for the donut chart. All values animate from zero using spring physics.

---

## Shared Animation Library (`src/components/animations.tsx`)

This file exports reusable components and a hook used across compositions:

| Export | Type | What it does |
|---|---|---|
| `FadeIn` | Component | Fade + slide-up entrance. Props: `delay`, `slideDistance`, `damping` |
| `ScaleIn` | Component | Scale-from-zero entrance. Props: `delay`, `bounce` |
| `SlideIn` | Component | Slide in from any direction. Props: `direction`, `delay`, `distance` |
| `Typewriter` | Component | Character-by-character text reveal with blinking cursor |
| `AnimatedCounter` | Component | Counts from 0 to a target number with spring easing |
| `FloatingParticles` | Component | Deterministic floating particle background effect |
| `ProgressBar` | Component | Playback progress bar (top or bottom of frame) |
| `useFadeSlideIn` | Hook | Returns `{ opacity, transform }` style object for fade + slide-up |

---

## Adding a New Composition

1. Create a new file in `src/compositions/`, e.g. `MyNewVideo.tsx`.
2. Export a React component as the default or named export.
3. Register it in `src/Root.tsx`:

```tsx
<Composition
  id="MyNewVideo"
  component={MyNewVideo}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
/>
```

4. Optionally add render scripts in `package.json`:

```json
"render:mynewvideo": "npx remotion render MyNewVideo out/my-new-video.mp4"
```

---

## Key Rules

1. **Determinism is required.** Never use `Math.random()` — use `random('seed')` from the `remotion` package instead. Never use `Date.now()` or `new Date()` for animation logic. Components must produce identical output for the same frame number.

2. **Frame-based animation.** All motion is driven by `useCurrentFrame()`. Use `interpolate()` for linear mappings and `spring()` for physics-based easing. Always pass `extrapolateLeft: "clamp"` and `extrapolateRight: "clamp"` to `interpolate()` when you don't want values to overshoot.

3. **Static assets go in `public/`.** Reference them with `staticFile("filename.png")`. Don't use relative imports for images or audio.

4. **Keep durations in sync.** The `durationInFrames` in `Root.tsx` must match the total frames your composition actually uses. Mismatches cause blank frames or cut-off endings.

---

## Useful Commands Reference

| Command | What it does |
|---|---|
| `npm run dev` | Open Remotion Studio for live preview |
| `npm run render:presentation` | Render the Presentation to MP4 |
| `npm run render:social` | Render the Social Clip to MP4 |
| `npm run render:dashboard` | Render the Data Dashboard to MP4 |
| `npm run render:all` | Render all compositions |
| `npm run still:presentation` | Export a PNG thumbnail of the Presentation |
| `npm run still:dashboard` | Export a PNG thumbnail of the Dashboard |
| `npx remotion studio` | Same as `npm run dev` |
| `npx remotion render <id> <output>` | Render any composition with custom options |

---

## Skill Reference

This project includes a `.claude/skills/remotion/` directory with a detailed SKILL.md file and reference templates covering presentations, social media clips, data visualizations, and common animation patterns. Consult those files when building new compositions or looking for code examples.

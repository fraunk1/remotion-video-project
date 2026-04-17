import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/DMSans";
import { Scene } from "../scenes/types";
import { ChilesTitle } from "../components/chiles/ChilesTitle";
import { ChilesAgenda } from "../components/chiles/ChilesAgenda";
import { ChilesSectionHeader } from "../components/chiles/ChilesSectionHeader";
import { ChilesFacts } from "../components/chiles/ChilesFacts";
import { ChilesHolding } from "../components/chiles/ChilesHolding";
import { ChilesReasoning } from "../components/chiles/ChilesReasoning";
import { ChilesOpinions } from "../components/chiles/ChilesOpinions";
import { ChilesImpact } from "../components/chiles/ChilesImpact";
import { ChilesHypos } from "../components/chiles/ChilesHypos";
import { ChilesClosing } from "../components/chiles/ChilesClosing";

// Load DM Sans once, globally, so child components just use fontFamily:"DM Sans"
loadFont();

const MIN_SLIDE_SECONDS = 3;
const INTRO_BUFFER_FRAMES = 30;   // 1.0s silent intro on slide 1
const OUTRO_BUFFER_FRAMES = 36;   // ~1.2s of visual beat on the closing slide before audio starts

export type ChilesBriefingProps = { sceneData: Scene };

const renderSlide = (slideId: string): React.ReactElement => {
  switch (slideId) {
    case "slide_01": return <ChilesTitle />;
    case "slide_02": return <ChilesAgenda />;
    case "slide_03":
      return <ChilesSectionHeader partLabel="Part I" title="The Case" subtitle="A Colorado counselor, a conversion therapy ban, and three years of litigation" color="blue" />;
    case "slide_04": return <ChilesFacts />;
    case "slide_05":
      return <ChilesSectionHeader partLabel="Part II" title="The Decision" subtitle="Justice Gorsuch for the Court · Kagan concurring · Jackson dissenting" color="orange" />;
    case "slide_06": return <ChilesHolding />;
    case "slide_07": return <ChilesReasoning />;
    case "slide_08": return <ChilesOpinions />;
    case "slide_09":
      return <ChilesSectionHeader partLabel="Part III" title="Impact on State Medical Boards" subtitle="What survives Chiles · where exposure has meaningfully increased" color="blue" />;
    case "slide_10": return <ChilesImpact />;
    case "slide_11":
      return <ChilesSectionHeader partLabel="Part IV" title="Hypotheticals for Discussion" subtitle="Four scenarios to pressure-test the new rule" color="orange" />;
    case "slide_12":
      return <ChilesHypos
        eyebrow="Scenarios 1 & 2"
        h2="Testing the Rule"
        left={{
          tag: "Hypothetical 1",
          title: "The Eating Disorder Counselor",
          facts: "A licensed counselor tells a 16-year-old with anorexia that intuitive eating and weight neutrality are the right path — contrary to the state's standard of care, which calls for supervised nutritional rehabilitation. The parents file a board complaint.",
          question: "Is disciplining the counselor \"regulating a treatment modality\" or \"silencing a disfavored viewpoint\" about recovery?",
        }}
        right={{
          tag: "Hypothetical 2",
          title: "The End-of-Life Conversation",
          facts: "In a jurisdiction without medical aid-in-dying, a psychiatrist tells a terminally ill adult patient that voluntarily stopping eating and drinking is \"a rational and peaceful option.\" A family member reports her to the board.",
          question: "Does Chiles protect this as viewpoint speech? Does the speech-integral-to-unlawful-conduct exit apply — and does it require the underlying conduct to actually be illegal?",
        }}
        rightDelaySec={14}
      />;
    case "slide_13":
      return <ChilesHypos
        eyebrow="Scenarios 3 & 4"
        h2="Testing the Rule, cont."
        left={{
          tag: "Hypothetical 3",
          title: "The Off-Label Advocate",
          facts: "A physician routinely tells patients that an unapproved supplement regimen is more effective than the FDA-approved therapy for their chronic condition. No prescriptions are written; the physician simply counsels. The patients decline standard care and worsen.",
          question: "Is this protected medical speech under Chiles? Does the malpractice breathing-room doctrine (injury + causation) give the board a path? What about consumer-protection fraud?",
        }}
        right={{
          tag: "Hypothetical 4",
          title: "The Mirror-Image Statute",
          facts: "A state enacts a law prohibiting licensed counselors from providing minors with \"gender-affirming\" talk therapy, while expressly permitting talk therapy that explores alignment with biological sex.",
          question: "Under Kagan's concurrence (\"the First Amendment would apply in the identical way\"), is this law any more defensible than Colorado's? What does that symmetry tell regulators about picking sides?",
        }}
        rightDelaySec={22}
      />;
    case "slide_14": return <ChilesClosing />;
    default:
      return <AbsoluteFill style={{ background: "#F5F7FA" }} />;
  }
};

export const ChilesBriefing: React.FC<ChilesBriefingProps> = ({ sceneData }) => {
  const { fps } = useVideoConfig();

  const lastIdx = sceneData.slides.length - 1;
  let runningFrame = 0;
  const ranges = sceneData.slides.map((slide, idx) => {
    const audioSec = slide.audio.duration_seconds || 0;
    const slideSec = Math.max(audioSec, MIN_SLIDE_SECONDS);
    let durationInFrames = Math.max(1, Math.ceil(slideSec * fps));
    if (idx === 0) durationInFrames += INTRO_BUFFER_FRAMES;
    if (idx === lastIdx) durationInFrames += OUTRO_BUFFER_FRAMES;
    const startFrame = runningFrame;
    runningFrame += durationInFrames;
    return { slide, startFrame, durationInFrames };
  });

  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      {ranges.map(({ slide, startFrame, durationInFrames }, idx) => (
        <Sequence key={slide.id} from={startFrame} durationInFrames={durationInFrames}>
          {renderSlide(slide.id)}
          {slide.audio.file && (
            <Sequence from={idx === 0 ? INTRO_BUFFER_FRAMES : (idx === lastIdx ? OUTRO_BUFFER_FRAMES : 0)}>
              <Audio src={staticFile(slide.audio.file)} />
            </Sequence>
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

import React from "react";
import { brand as myBrand } from "../../brand";
import { Avatar } from "../../avatars/Avatar";
import { useMouth } from "../../avatars/useMouth";
import type { PoseCue } from "../../avatars/SpritePlayer";
import { BigNumber, Card, EndCard, Karaoke, Line, ReelFrame, SceneBlock, Title, type ReelProps } from "../../components";
import { AVATAR_BOX, CAPTION_BOTTOM, SAFE, SAFE_BOX } from "../../layout";
import { timing } from "../../timing";
import mouth from "../../../public/reels/habits-over-40/mouth.json";
import words from "../../../public/reels/habits-over-40/captions.words.json";

export const t = timing(words);
export const AUDIO = "reels/habits-over-40/vo.wav";

// Scene boundaries using word timing with fallback seconds (before sync runs)
const S = {
  hook: [0, t.atText("Women", 4.2, 0)],
  sleep: [t.atText("Women", 4.2, 0), t.atText("mindful", 10.5)],
  movement: [t.atText("mindful", 10.5), t.atText("hydration", 17.8)],
  nutrition: [t.atText("hydration", 17.8), t.atText("biggest", 23.5)],
  impact: [t.atText("biggest", 23.5), t.atText("Comment", 28.0)],
  end: [t.atText("Comment", 28.0), t.duration()],
} as const;

// Simple pose cues for flat mascot (ignored by flat style but kept for consistency)
const poseCues: PoseCue[] = [
  { at: 0, pose: "idle" },
  { at: 4.2, pose: "explain" },
  { at: 10.5, pose: "one" },
  { at: 17.8, pose: "two" },
  { at: 23.5, pose: "three" },
  { at: 28.0, pose: "point-down" },
];

export const durationInFrames = t.duration();

export const Reel: React.FC<ReelProps> = ({ brand = myBrand, avatar = "flat", debugSafeZones, probe }) => {
  const m = useMouth(mouth, words);
  return (
    <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
      {/* Scene 1: Hook */}
      <SceneBlock name="hook" from={S.hook[0]} to={S.hook[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: SAFE.top + 60, width: SAFE_BOX.width }}>
          <Title text="Stop doing cardio!" highlight="cardio" at={t.at(0)} size={100} />
          <div style={{ marginTop: 30, color: "white", fontSize: 55, fontWeight: 700, lineHeight: 1.2 }}>
            Women over 40 need these 3 habits instead
          </div>
        </div>
      </SceneBlock>

      {/* Scene 2: Prioritize Sleep */}
      <SceneBlock name="sleep" from={S.sleep[0]} to={S.sleep[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 280, width: SAFE_BOX.width }}>
          <Card at={S.sleep[0]}>
            <BigNumber to={1} at={S.sleep[0] + 5} label="habit" size={160} tracked={false} />
            <div style={{ height: 24 }} />
            <Line first at={t.atText("Prioritize", 4.5)}>Prioritize Sleep</Line>
            <Line at={t.atText("Aim", 5.5)}>Aim for 7 to 9 hours</Line>
            <Line at={t.atText("quality", 6.5)}>Quality sleep = energy, mood, recovery</Line>
          </Card>
        </div>
      </SceneBlock>

      {/* Scene 3: Mindful Movement */}
      <SceneBlock name="movement" from={S.movement[0]} to={S.movement[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 280, width: SAFE_BOX.width }}>
          <Card at={S.movement[0]}>
            <BigNumber to={2} at={S.movement[0] + 5} label="habit" size={160} tracked={false} />
            <div style={{ height: 24 }} />
            <Line first at={t.atText("mindful", 10.5)}>Mindful Movement</Line>
            <Line at={t.atText("Incorporate", 11.5)}>30 minutes daily activity</Line>
            <Line at={t.atText("walk", 13.0)}>Walk, yoga, or dancing</Line>
            <Line at={t.atText("boosts", 14.5)}>Boosts mood and metabolism</Line>
          </Card>
        </div>
      </SceneBlock>

      {/* Scene 4: Hydration & Nutrition */}
      <SceneBlock name="nutrition" from={S.nutrition[0]} to={S.nutrition[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 280, width: SAFE_BOX.width }}>
          <Card at={S.nutrition[0]}>
            <BigNumber to={3} at={S.nutrition[0] + 5} label="habit" size={160} tracked={false} />
            <div style={{ height: 24 }} />
            <Line first at={t.atText("hydration", 17.8)}>Hydration & Nutrition</Line>
            <Line at={t.atText("Drink", 18.5)}>Drink plenty of water</Line>
            <Line at={t.atText("whole", 20.0)}>Focus on whole foods</Line>
            <Line at={t.atText("key", 21.5)}>Key for sustained energy</Line>
          </Card>
        </div>
      </SceneBlock>

      {/* Scene 5: Impact statement */}
      <SceneBlock name="impact" from={S.impact[0]} to={S.impact[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 350, width: SAFE_BOX.width, textAlign: "center" }}>
          <div style={{ color: "white", fontSize: 60, fontWeight: 800, lineHeight: 1.2 }}>
            The biggest impact comes from the simplest, most consistent daily actions
          </div>
        </div>
      </SceneBlock>

      {/* Scene 6: End card */}
      <SceneBlock name="end" from={S.end[0]} to={S.end[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 350, width: SAFE_BOX.width }}>
          <EndCard keyword="HABITS" lead="Want the breakdown?" sub="Comment HABITS and I'll send it" at={t.atText("Comment", 28.0)} />
        </div>
      </SceneBlock>

      {/* Always on: talking character + captions */}
      {avatar !== "none" ? (
        <div style={{ position: "absolute", left: AVATAR_BOX.x, top: AVATAR_BOX.y }}>
          <Avatar style={avatar} mouth={m} cues={poseCues} size={AVATAR_BOX.size} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: SAFE_BOX.x, width: SAFE_BOX.width, bottom: CAPTION_BOTTOM }}>
        <Karaoke words={words} perChunk={4} keywords={["HABITS", "cardio", "Women", "sleep", "movement", "hydration"]} />
      </div>
    </ReelFrame>
  );
};

export default Reel;
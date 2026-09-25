import React from "react";
import { AbsoluteFill, Audio, getStaticFiles, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { brand } from "../../../brand/brand";
import {
  ActionCard,
  BenefitList,
  Bubble,
  CX,
  Checklist,
  Cursor,
  EventPill,
  Notification,
  Field,
  Headline,
  Marked,
  MaskLine,
  Pop,
  POSTER_LEAD,
  PosterLead,
  ResultPill,
  Scene,
  Stage,
  StackHeader,
  TypedMode,
  move,
  slam,
  totalFrames,
  type Timing,
} from "../../src/kit";
import timingJson from "./timing.json";

// Worked example: a ~22s launch demo for the fictional placeholder brand. Copy this
// folder to start a campaign (scripts/new-campaign.mjs does it), then replace the copy
// and surfaces with your product's real ones. All timing lives in timing.json.
//
// Shape: full-frame headline → it docks into a header → product surfaces pop out and
// carry the beat → next scene. Close on benefits, end on the CTA.

const timing = timingJson as Timing;
const S = timing.scenes;
const T = timing.typing;

function Open() {
  const q = S.open.cues;
  return (
    <Scene exitAt={q.exit}>
      <Headline
        typing={T.open}
        blinkBeforeTyping
        dockAt={q.dock}
        dockScale={0.5}
        top={640}
        lines={
          <>
            <MaskLine delay={-30} size={150}>
              Your week,
            </MaskLine>
            <MaskLine delay={4} size={200} italic color={brand.colors.accent}>
              <Marked delay={18}>handled.</Marked>
            </MaskLine>
          </>
        }
      />
      <Pop x={CX} y={720} scale={2.2} delay={q.card} from={[260, -60]} rot={[9, -2]}>
        <ActionCard
          actor="Scheduler"
          badge="Sc"
          title="Book design review"
          rows={[
            ["When", "Thu, 10:00 AM"],
            ["Who", "Priya, Marco, you"],
          ]}
          doneAt={q.stamp}
        />
      </Pop>
      <Pop x={CX} y={1080} scale={2.4} delay={q.pill} from={[-420, 0]} rot={[-8, -3]}>
        <ResultPill badges={["Sc", "Dl", "Hn"]} text="3 things done before standup" />
      </Pop>
      <Pop x={CX} y={1420} scale={2.1} delay={q.note} from={[0, 360]} rot={[10, 2.5]}>
        <Notification app={brand.name} title="Standup moved to 9:30" body="Everyone's calendar is updated. Nobody had to ask." />
      </Pop>
    </Scene>
  );
}

const teammates = [
  { badge: "De", text: "Design joined — reviewing the mocks" },
  { badge: "En", text: "Eng joined — scoping Friday's release" },
  { badge: "Su", text: "Support joined — drafting the FAQ" },
];

function Team() {
  const q = S.team.cues;
  const joinedAt = teammates.map((_, k) => q.pills + k * q.pillGap);
  return (
    <Scene exitAt={q.exit}>
      <Headline
        typing={T.team}
        dockAt={q.dock}
        dockScale={0.52}
        top={660}
        lines={
          <>
            <MaskLine size={150}>They work</MaskLine>
            <MaskLine delay={5} size={180} italic color={brand.colors.accent}>
              <Marked delay={15} oval>
                together.
              </Marked>
            </MaskLine>
          </>
        }
      />
      <Pop x={CX} y={385} scale={2.45} delay={q.header} from={[0, -200]} rot={[-3, 0]}>
        <StackHeader title="Friday launch" badges={teammates.map((t) => t.badge)} joinedAt={joinedAt} noun="team" empty="New thread" />
      </Pop>
      <Pop x={CX + 40} y={590} scale={2.3} delay={q.bubble} from={[500, 0]} rot={[4, 0]} shadow>
        <Bubble text="Can we still ship Friday? Mocks aren't final and nobody's told support." />
      </Pop>
      {teammates.map((t, k) => (
        <Pop key={t.badge} x={CX + (k % 2 ? 14 : -14)} y={820 + k * 112} scale={2.4} delay={joinedAt[k]} from={[k % 2 ? 520 : -520, 0]} rot={[k % 2 ? 6 : -6, k % 2 ? 1.2 : -1.2]} shadow radius={999}>
          <EventPill badge={t.badge} i={k} text={t.text} />
        </Pop>
      ))}
      <Pop x={CX} y={1380} scale={2.3} delay={q.card} from={[0, 420]} rot={[-9, -2]}>
        <ActionCard actor="Planner" badge="Pl" i={2} title="Launch moved to Fri, 4 PM" rows={[["Design", "Mocks final Thu"], ["Support", "FAQ by Fri noon"]]} doneAt={q.card + 14} doneLabel="Shared" />
      </Pop>
    </Scene>
  );
}

function List() {
  const q = S.list.cues;
  return (
    <Scene exitAt={q.exit}>
      <Headline
        typing={T.list}
        dockAt={q.dock}
        dockScale={0.52}
        top={660}
        lines={
          <>
            <MaskLine size={160}>Deadlines,</MaskLine>
            <MaskLine delay={5} size={200} italic color={brand.colors.accent}>
              <Marked delay={14}>caught.</Marked>
            </MaskLine>
          </>
        }
      />
      <Pop x={CX} y={900} scale={2.6} delay={q.card} from={[0, 420]} rot={[8, 2]}>
        <Checklist
          title="Friday launch"
          items={["Final mocks", "Release notes", "Support FAQ", "Status page", "Changelog"]}
          preChecked={2}
          ticks={[q.tick1, q.tick2, q.tick3]}
          action={{ label: "Share update", doneLabel: "Update sent", pressAt: q.press }}
        />
        <Cursor left={176} top={206} delay={q.cursor} press={q.press} />
      </Pop>
    </Scene>
  );
}

function Close() {
  const q = S.close.cues;
  return (
    <Scene exitAt={q.exit}>
      <Headline
        typing={T.close}
        top={380}
        lines={
          <>
            <MaskLine delay={4} size={170}>
              Less
            </MaskLine>
            <MaskLine delay={9} size={190} italic color={brand.colors.accent}>
              <Marked delay={20}>busywork.</Marked>
            </MaskLine>
          </>
        }
      />
      <div style={{ position: "absolute", left: 70, top: 900 }}>
        <BenefitList items={brand.messaging.proofPoints} at={q.items} gap={q.itemGap} />
      </div>
    </Scene>
  );
}

function Cta() {
  const f = useCurrentFrame();
  const q = S.cta.cues;
  const icon = move(f, 0, 16);
  return (
    <AbsoluteFill>
      {brand.assets.icon ? (
        <Img
          src={staticFile(brand.assets.icon)}
          style={{
            position: "absolute",
            left: CX,
            top: 520,
            width: 250,
            height: 250,
            borderRadius: "22.4%",
            boxShadow: "0 30px 60px -24px rgba(20,16,10,.45)",
            opacity: icon,
            transform: `translate(-50%,0) translateY(${(1 - icon) * 60}px) scale(${slam(f, 0)})`,
          }}
        />
      ) : null}
      <Headline
        typing={T.cta}
        top={860}
        lines={
          <>
            <MaskLine delay={8} size={130}>
              Get your week
            </MaskLine>
            <MaskLine delay={13} size={200} italic color={brand.colors.accent}>
              <Marked delay={26}>back.</Marked>
            </MaskLine>
          </>
        }
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1350, textAlign: "center", font: `600 44px ${brand.typography.body}`, color: brand.colors.muted, opacity: move(f, q.name, q.name + 12) }}>
        {brand.name}
      </div>
    </AbsoluteFill>
  );
}

const scenes = [
  { key: "open", C: Open },
  { key: "team", C: Team },
  { key: "list", C: List },
  { key: "close", C: Close },
  { key: "cta", C: Cta },
] as const;

// Generated by `npm run score -- launch-demo` (optional; the video renders silent without it).
const SCORE = "campaigns/launch-demo/score.wav";

function Timeline({ withAudio }: { withAudio: boolean }) {
  const hasScore = getStaticFiles().some((f) => f.name === SCORE);
  return (
    <>
      {withAudio && hasScore ? <Audio src={staticFile(SCORE)} /> : null}
      {scenes.map(({ key, C }) => (
        <Sequence key={key} from={S[key].from} durationInFrames={S[key].dur} layout="none">
          <C />
        </Sequence>
      ))}
    </>
  );
}

export const launchDemoFrames = totalFrames(timing);

export const LaunchDemo: React.FC<{ typed?: boolean; muted?: boolean }> = ({ typed = true, muted = false }) => (
  <Stage background={<Field />}>
    <PosterLead
      frames={typed ? POSTER_LEAD : 0}
      settledAt={S.open.cues.dock - 2}
      poster={<Timeline withAudio={false} />}
    >
      <TypedMode.Provider value={typed}>
        <Timeline withAudio={!muted} />
      </TypedMode.Provider>
    </PosterLead>
  </Stage>
);

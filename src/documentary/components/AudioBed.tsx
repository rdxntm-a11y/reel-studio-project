import { Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { toFrames } from "../motion";
import type { AudioBed as AudioBedConfig } from "../types";

type AudioBedProps = {
  bed?: AudioBedConfig;
  duration: number;
  fps?: number;
  debug?: boolean;
};

const envelope = (frame: number, duration: number, gain: number, fadeIn: number, fadeOut: number) => {
  const inGain = interpolate(frame, [0, Math.max(1, fadeIn)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outGain = interpolate(frame, [Math.max(0, duration - fadeOut), duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.max(0, Math.min(1, gain * Math.min(inGain, outGain)));
};

export const AudioBed: React.FC<AudioBedProps> = ({ bed, duration, fps = 30, debug = false }) => {
  const frame = useCurrentFrame();
  if (!bed) return null;
  const voice = bed.voiceover;
  const music = bed.music;

  return (
    <>
      {voice ? (
        <Audio
          src={staticFile(voice.src)}
          volume={(f) => envelope(f, duration, voice.gain ?? 1, voice.fadeInFrames ?? 2, voice.fadeOutFrames ?? 8)}
        />
      ) : null}
      {music ? (
        <Audio
          src={staticFile(music.src)}
          volume={(f) => envelope(f, duration, music.gain ?? 0.22, music.fadeInFrames ?? 30, music.fadeOutFrames ?? 45)}
        />
      ) : null}
      {bed.sfx?.map((cue, index) => {
        const start = toFrames(cue.at, fps);
        const cueDuration = cue.src ? 90 : 18;
        return (
          <Sequence key={`${cue.name}-${index}`} from={start} durationInFrames={cueDuration} layout="none">
            {cue.src ? (
              <Audio src={staticFile(cue.src)} volume={(f) => envelope(f, cueDuration, cue.gain ?? 0.7, 1, 8)} />
            ) : (
              <div
                data-sound-cue={cue.name}
                data-note={cue.note ?? ""}
                data-frame={frame}
                style={{ position: "absolute", width: 0, height: 0, opacity: debug ? 0.001 : 0 }}
              />
            )}
          </Sequence>
        );
      })}
    </>
  );
};

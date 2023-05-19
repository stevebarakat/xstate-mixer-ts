import { useRef } from "react";
import { Reverb, FeedbackDelay, Destination } from "tone";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Sends from "./Sends";
import Fader from "./Fader";
import TrackLabel from "./TrackLabel";
import type { Track } from "../types/global";
import type { Channel } from "tone";
import { array as fx } from "../utils";

type Props = {
  track: Track;
  trackIndex: number;
  channels: Channel[];
};

function ChannelStrip({ track, trackIndex, channels }: Props) {
  const channel = channels[trackIndex];
  const reverb = useRef<Reverb | null>(null);
  const delay = useRef<FeedbackDelay | null>(null);

  function setTrackFx(e: React.FormEvent<HTMLInputElement>): void {
    console.log("e.target.value", e.currentTarget.value);
    switch (e.currentTarget.value) {
      case "nofx":
        channel.disconnect();
        channel.connect(Destination);
        break;
      case "reverb":
        channel.disconnect();
        reverb.current = new Reverb(8).toDestination();
        channel.connect(reverb.current).toDestination();
        break;
      case "delay":
        channel.disconnect();
        delay.current = new FeedbackDelay().toDestination();
        channel.connect(delay.current).toDestination();
        break;
      default:
        break;
    }
  }

  return (
    <div className="channel">
      <>
        {fx(2).map((_, fxIndex) => (
          <select
            key={fxIndex}
            id={`track${trackIndex}fx${fxIndex}`}
            onChange={setTrackFx}
            // value={state.context.currentTrackFx[trackIndex][fxIndex]}
          >
            <option value={"nofx"}>{`FX ${fxIndex + 1}`}</option>
            <option value={"reverb"}>Reverb</option>
            <option value={"delay"}>Delay</option>
          </select>
        ))}
      </>
      <Sends trackIndex={trackIndex} channels={channels} />
      <Pan trackIndex={trackIndex} channel={channel} />
      <Fader trackIndex={trackIndex} channel={channel} />
      <SoloMute trackIndex={trackIndex} channel={channel} />
      <TrackLabel trackName={track.name} />
    </div>
  );
}

export default ChannelStrip;

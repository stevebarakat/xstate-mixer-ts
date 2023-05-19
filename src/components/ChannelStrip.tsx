import { useRef, useState } from "react";
import { Reverb, FeedbackDelay, Destination } from "tone";
import TrackReverber from "./Fx/TrackReverber";
import TrackDelay from "./Fx/TrackDelay";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Sends from "./Sends";
import Fader from "./Fader";
import TrackLabel from "./TrackLabel";
import type { Track } from "../types/global";
import type { Channel } from "tone";
import { array as fx } from "../utils";
import { Rnd } from "react-rnd";

const defaults = {
  x: 0,
  y: 0,
  width: 320,
  height: "auto",
};

type Props = {
  track: Track;
  trackIndex: number;
  channels: Channel[];
};

function ChannelStrip({ track, trackIndex, channels }: Props) {
  const channel = channels[trackIndex];
  const reverb = useRef<Reverb>(new Reverb(8).toDestination());
  const delay = useRef<FeedbackDelay>(new FeedbackDelay().toDestination());

  const [panel, setPanel] = useState<JSX.Element | null>(null);

  function setTrackFx(e: React.FormEvent<HTMLSelectElement>) {
    console.log("e.target.value", e.currentTarget.value);

    switch (e.currentTarget.value) {
      case "nofx":
        channel.disconnect();
        channel.connect(Destination);
        setPanel(null);
        break;

      case "reverb":
        channel.disconnect();
        channel.connect(reverb.current).toDestination();
        setPanel(
          <Rnd className="fx-panel" default={defaults} cancel="input">
            <TrackReverber reverb={reverb.current} trackIndex={trackIndex} />
          </Rnd>
        );
        break;

      case "delay":
        channel.disconnect();
        channel.connect(delay.current).toDestination();

        setPanel(
          <Rnd className="fx-panel" default={defaults} cancel="input">
            <TrackDelay delay={delay.current} trackIndex={trackIndex} />
          </Rnd>
        );
        break;

      default:
        break;
    }
  }

  return (
    <div className="channel">
      <>
        {panel}
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

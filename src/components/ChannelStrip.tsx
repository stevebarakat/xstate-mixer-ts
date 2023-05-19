import { useRef, useState, useEffect } from "react";
import { Reverb, FeedbackDelay, Destination } from "tone";
import TrackReverber from "./Fx/TrackReverber";
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

  function changeReverbMix(e: React.FormEvent<HTMLInputElement>): void {
    reverb.current.wet.value = parseFloat(e.currentTarget.value);
  }

  function changeReverbPreDelay(e: React.FormEvent<HTMLInputElement>): void {
    reverb.current.preDelay = parseFloat(e.currentTarget.value);
  }

  function changeReverbDecay(e: React.FormEvent<HTMLInputElement>): void {
    reverb.current.decay = parseFloat(e.currentTarget.value);
  }

  function setTrackFx(e: React.FormEvent<HTMLSelectElement>) {
    console.log("e.target.value", e.currentTarget.value);

    switch (e.currentTarget.value) {
      case "nofx":
        channel.disconnect();
        channel.connect(Destination);
        break;
      case "reverb":
        channel.disconnect();
        channel.connect(reverb.current).toDestination();
        setPanel(
          <TrackReverber reverb={reverb.current} trackIndex={trackIndex} />
        );
        // setPanel(
        //   <>
        //     <input
        //       type="range"
        //       min={0}
        //       max={1}
        //       step={0.01}
        //       onChange={changeReverbMix}
        //     />
        //     <input
        //       type="range"
        //       min={0}
        //       max={1}
        //       step={0.01}
        //       onChange={changeReverbPreDelay}
        //     />
        //     <input
        //       type="range"
        //       min={0.1}
        //       max={20}
        //       step={0.1}
        //       onChange={changeReverbDecay}
        //     />
        //   </>
        // );
        break;
      case "delay":
        channel.disconnect();
        channel.connect(delay.current).toDestination();

        setPanel(<input type="range" />);
        break;
      default:
        break;
    }
  }

  return (
    <div className="channel">
      <>
        <Rnd className="fx-panel" default={defaults} cancel="input">
          {panel}
        </Rnd>
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

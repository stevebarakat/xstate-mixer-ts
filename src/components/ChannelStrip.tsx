import { useRef, useState } from "react";
import { Reverb, FeedbackDelay, PitchShift, Destination } from "tone";
import TrackReverber from "./Fx/TrackReverber";
import TrackDelay from "./Fx/TrackDelay";
import PitchShifter from "./Fx/PitchShifter";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Sends from "./Sends";
import Fader from "./Fader";
import TrackLabel from "./TrackLabel";
import type { Track } from "../types/global";
import type { Channel } from "tone";
import { array as fx } from "../utils";
import { Rnd } from "react-rnd";
import { MixerMachineContext } from "../App";

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
  const [state, send] = MixerMachineContext.useActor();
  const channel = channels[trackIndex];
  const reverb = useRef<Reverb>(new Reverb(8).toDestination());
  const delay = useRef<FeedbackDelay>(new FeedbackDelay().toDestination());
  const pitchShift = useRef<PitchShift>(new PitchShift().toDestination());

  const [panel1, setPanel1] = useState<JSX.Element | null>(null);
  const [panel2, setPanel2] = useState<JSX.Element | null>(null);

  function setTrackFx(e: React.FormEvent<HTMLSelectElement>) {
    send({
      type: "SET_TRACK_FX",
      trackIndex,
      target: e.currentTarget,
    });
    const id = parseInt(e.currentTarget.id.at(-1), 10);
    switch (e.currentTarget.value) {
      case "nofx":
        channel.disconnect();
        channel.connect(Destination);
        id === 0 ? setPanel1(null) : setPanel2(null);

        break;

      case "reverb":
        channel.disconnect();
        channel.connect(reverb.current).toDestination();

        id === 0
          ? setPanel1(<TrackReverber reverb={reverb.current} trackIndex={0} />)
          : setPanel2(<TrackReverber reverb={reverb.current} trackIndex={1} />);
        break;

      case "delay":
        channel.disconnect();
        channel.connect(delay.current).toDestination();

        id === 0
          ? setPanel1(<TrackDelay delay={delay.current} trackIndex={0} />)
          : setPanel2(<TrackDelay delay={delay.current} trackIndex={1} />);
        break;

      case "pitchShift":
        channel.disconnect();
        channel.connect(pitchShift.current).toDestination();

        id === 0
          ? setPanel1(
              <PitchShifter pitchShift={pitchShift.current} trackIndex={0} />
            )
          : setPanel2(
              <PitchShifter pitchShift={pitchShift.current} trackIndex={1} />
            );
        break;

      default:
        break;
    }
  }

  function getTrackPanels() {
    if (!panel1 && !panel2) {
      return null;
    } else {
      return (
        <Rnd className="fx-panel" default={defaults} cancel="input">
          {panel1}
          {panel2}
        </Rnd>
      );
    }
  }

  return (
    <div className="channel">
      <>
        {getTrackPanels()}
        {fx(2).map((_, fxIndex) => (
          <select
            key={fxIndex}
            id={`track${trackIndex}fx${fxIndex}`}
            onChange={setTrackFx}
            value={state.context.currentTrackFx[trackIndex][fxIndex]}
          >
            <option value={"nofx"}>{`FX ${fxIndex + 1}`}</option>
            <option value={"reverb"}>Reverb</option>
            <option value={"delay"}>Delay</option>
            <option value={"pitchShift"}>Pitch Shift</option>
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

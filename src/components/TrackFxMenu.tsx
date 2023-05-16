import { useRef } from "react";
import { Reverb, FeedbackDelay, Channel } from "tone";
import { array as fx } from "../utils";
// import { shallowEqual } from "@xstate/react";
import { MixerMachineContext } from "../App";

type Props = {
  trackIndex: number;
  channel: Channel;
};

function TrackFxMenu({ trackIndex, channel }: Props) {
  const [state, send] = MixerMachineContext.useActor();
  // const currentTrackFx = MixerMachineContext.useSelector((state) => {
  //   const { currentTrackFx } = state.context;
  //   return currentTrackFx;
  // }, shallowEqual);

  const reverb = useRef<Reverb | null>(null);
  const delay = useRef<FeedbackDelay | null>(null);

  function setTrackFx(e: React.FormEvent<HTMLSelectElement>): void {
    fx(2).forEach(() => {
      switch (e.currentTarget.value) {
        case "nofx":
          channel.disconnect();
          channel.toDestination();
          break;

        case "reverb":
          reverb.current = new Reverb().toDestination();
          if (!reverb.current) return;
          channel.disconnect();
          channel.connect(reverb.current);
          break;

        case "delay":
          delay.current = new FeedbackDelay().toDestination();
          if (!delay.current) return;
          channel.disconnect();
          channel.connect(delay.current);
          break;

        default:
          break;
      }
    });
  }

  return (
    <>
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
        </select>
      ))}
    </>
  );
}

export default TrackFxMenu;

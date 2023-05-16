import { useEffect, useRef } from "react";
import { Reverb, FeedbackDelay, Channel } from "tone";
import { array } from "../utils";
import { shallowEqual } from "@xstate/react";
import { MixerMachineContext } from "../App";

function useTrackFx(channel: Channel, trackIndex: number) {
  const currentTrackFx = MixerMachineContext.useSelector((state) => {
    const { currentTrackFx } = state.context;
    return currentTrackFx;
  }, shallowEqual);

  const reverb = useRef<Reverb | null>(null);
  const delay = useRef<FeedbackDelay | null>(null);

  useEffect(() => {
    array(2).forEach((_, i) => {
      switch (currentTrackFx[trackIndex][i]) {
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
  }, [currentTrackFx, trackIndex, channel]);

  return [channel, currentTrackFx];
}

export default useTrackFx;

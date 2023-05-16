import { useEffect, useRef } from "react";
import { Reverb, FeedbackDelay, Channel } from "tone";
import { array } from "../utils";
import { shallowEqual } from "@xstate/react";
import { MixerMachineContext } from "../App";

function useTrackFx(channel: Channel) {
  const currentTrackFx = MixerMachineContext.useSelector((state) => {
    const { currentTrackFx } = state.context;
    return currentTrackFx;
  }, shallowEqual);

  const reverb1 = useRef(new Reverb().toDestination());
  const reverb2 = useRef(new Reverb().toDestination());
  const delay1 = useRef(new FeedbackDelay().toDestination());
  const delay2 = useRef(new FeedbackDelay().toDestination());

  useEffect(() => {
    array(2).forEach((_, i) => {
      switch (currentTrackFx[`bus${i + 1}fx${i + 1}`]) {
        case "nofx1":
          channel.disconnect();
          channel.toDestination();
          break;
        case "nofx2":
          channel.disconnect();
          channel.toDestination();
          break;
        case "reverb1":
          channel.disconnect();
          channel.connect(reverb1.current);
          break;
        case "reverb2":
          channel.disconnect();
          channel.connect(reverb2.current);
          break;
        case "delay1":
          console.log("channel", channel);
          channel.disconnect();
          channel.connect(delay1.current);
          break;
        case "delay2":
          channel.disconnect();
          channel.connect(delay2.current);
          break;
        default:
          break;
      }
    });
  }, [currentTrackFx, channel]);

  return [channel, currentTrackFx];
}

export default useTrackFx;

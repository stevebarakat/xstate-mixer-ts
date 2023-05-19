import { array } from "./../utils";
import { Rnd } from "react-rnd";
import CloseButton from "./Buttons/CloseButton";
import Reverber from "./TrackFx/Reverber";
import Delay from "./TrackFx/Delay";
import { MixerMachineContext } from "./../App";
import type { FeedbackDelay, Reverb } from "tone";
import { shallowEqual } from "@xstate/react";

type Props = {
  trackIndex: number;
  fxChoice: string;
  // currentTrackFx: string[];
  reverb: Reverb;
  delay: FeedbackDelay;
};

const defaults = {
  x: 0,
  y: 0,
  width: 320,
  height: "auto",
};

function TrackPanel({ trackIndex, fxChoice, reverb, delay }: Props) {
  const [state, send] = MixerMachineContext.useActor();
  // const { send } = MixerMachineContext.useActorRef();
  // const currentTrackFx = MixerMachineContext.useSelector((state) => {
  //   const { currentTrackFx } = state.context;
  //   return currentTrackFx;
  // }, shallowEqual);
  return (
    <div>
      <Rnd className="fx-panel" default={defaults} cancel="input">
        <CloseButton
          id="track-panel"
          onClick={() => {
            send({
              type: "TOGGLE_TRACK_PANEL",
              trackIndex,
            });
          }}
        >
          X
        </CloseButton>

        {array(2).map((_, i) => {
          switch (fxChoice) {
            case "nofx":
              break;
            case "reverb":
              return (
                <Reverber
                  key={`track${trackIndex}reverb${i}`}
                  reverb={reverb}
                  trackIndex={trackIndex}
                />
              );
            case "delay":
              return (
                <Delay
                  key={`track${trackIndex}delay${i}`}
                  delay={delay}
                  trackIndex={trackIndex}
                />
              );
            default:
              break;
          }
        })}
      </Rnd>
    </div>
  );
}

export default TrackPanel;

import { array } from "./../utils";
import { Rnd } from "react-rnd";
import CloseButton from "./Buttons/CloseButton";
import Reverber from "./TrackFx/Reverber";
import Delay from "./TrackFx/Delay";
import { MixerMachineContext } from "./../App";
import type { FeedbackDelay, Reverb } from "tone";

type Props = {
  trackIndex: number;
  disabled: boolean;
  currentTrackFx: string[];
  fx: {
    reverb: Reverb;
    delay: FeedbackDelay;
  };
};

const defaults = {
  x: 0,
  y: 0,
  width: 320,
  height: "auto",
};

function TrackPanel({ trackIndex, currentTrackFx, fx, disabled }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  return (
    <div>
      <Rnd className="fx-panel" default={defaults} cancel="input">
        <CloseButton
          id="bus-panel-1"
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
          switch (currentTrackFx[trackIndex][i]) {
            // switch ("reverb") {
            case "nofx":
              break;
            case "reverb":
              return (
                <Reverber
                  key={`track${trackIndex}reverb${i}`}
                  reverb={fx.reverb}
                  trackIndex={trackIndex}
                />
              );
            case "delay":
              return (
                <Delay
                  key={`track${trackIndex}delay${i}`}
                  delay={fx.delay}
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

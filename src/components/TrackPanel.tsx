import { array } from "./../utils";
import { Rnd } from "react-rnd";
import CloseButton from "./Buttons/CloseButton";
import Reverber from "./TrackFx/Reverber";
import Delay from "./Fx/Delay";
import { MixerMachineContext } from "./../App";
import type { FeedbackDelay, Reverb } from "tone";

type Props = {
  trackIndex: number;
  disabled: boolean;
  currentTrackFx: string[];
  fx: React.MutableRefObject<{
    reverb: Reverb;
    delay: FeedbackDelay;
  }>;
};

const defaults = {
  x: 0,
  y: 0,
  width: 320,
  height: 200,
};

function TrackPanel({ trackIndex, currentTrackFx, fx, disabled }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  return (
    <div>
      <Rnd className="fx-panel" default={defaults} cancel="input">
        hello
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
        {/* <Reverber
          key={`track${0}reverb${0}`}
          reverb={fx.current.reverb}
          trackIndex={trackIndex}
        /> */}
        {array(2).map((_, i) => {
          let ubu;
          console.log("currentTrackFx", Array.isArray(currentTrackFx));
          switch (currentTrackFx[trackIndex][i]) {
            // switch ("reverb") {
            case "reverb":
              ubu = (
                <Reverber
                  key={`track${trackIndex}reverb${i}`}
                  reverb={fx.current.reverb}
                  trackIndex={trackIndex}
                />
              );
              break;
            case "delay":
              ubu = (
                <Delay
                  key={`track${trackIndex}delay${i}`}
                  delay={fx.current.delay}
                  busIndex={0}
                  fxIndex={0}
                />
              );
              break;
            default:
              break;
          }
          return ubu;
        })}
      </Rnd>
    </div>
  );
}

export default TrackPanel;

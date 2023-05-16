import { array } from "./../utils";
import { Rnd } from "react-rnd";
import CloseButton from "./Buttons/CloseButton";
import Reverber from "./Fx/Reverber";
import Delay from "./Fx/Delay";
import { MixerMachineContext } from "./../App";
import type { FeedbackDelay, Reverb } from "tone";

type Props = {
  disabled: boolean;
  currentTrackFx: {
    reverb1: Reverb;
    reverb2: Reverb;
    delay1: FeedbackDelay;
    delay2: FeedbackDelay;
  };
  fx: React.MutableRefObject<{
    reverb1: Reverb;
    reverb2: Reverb;
    delay1: FeedbackDelay;
    delay2: FeedbackDelay;
  }>;
};

const defaults = {
  x: 0,
  y: 0,
  width: 320,
  height: 200,
};

const disabled = false;

function TrackPanel({ currentTrackFx, fx, disabled }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  return (
    <div>
      <Rnd className="fx-panel" default={defaults} cancel="input">
        <CloseButton
          id="bus-panel-1"
          onClick={() => {
            send({
              type: "TOGGLE_BUS_PANEL",
              trackIndex: 0,
            });
          }}
        >
          X
        </CloseButton>

        {array(2).map((_, i) => {
          switch (currentTrackFx[`bus1fx${i + 1}`]) {
            case "reverb1":
              return (
                <Reverber
                  key={`bus1reverb${i}`}
                  reverb={fx.current.reverb1}
                  busIndex={0}
                  fxIndex={0}
                />
              );
            case "delay1":
              return (
                <Delay
                  key={`bus1delay${i}`}
                  delay={fx.current.delay1}
                  busIndex={0}
                  fxIndex={0}
                />
              );
            default:
              break;
          }
          return null;
        })}
      </Rnd>
    </div>
  );
}

export default TrackPanel;

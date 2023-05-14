import { array } from "../utils";
import { Rnd } from "react-rnd";
import CloseButton from "./Buttons/CloseButton";
import Reverber from "./Fx/Reverber";
import Delay from "./Fx/Delay";
import { MixerMachineContext } from "../App";
import { FeedbackDelay, Reverb } from "tone";

type Props = {
  fx: any;
  busFx: Reverb | FeedbackDelay;
  disabled: { panel1: boolean; panel2: boolean };
};

function BusPanels({ fx, busFx, disabled }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const bpOpen0 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsOpen[0]
  );
  const bpOpen1 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsOpen[1]
  );

  const bpPos0 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsPosition[0]
  );
  const bpPos1 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsPosition[1]
  );

  const bpSize0 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsSize[0]
  );
  const bpSize1 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsSize[1]
  );

  return (
    <div>
      {bpOpen0 && !disabled.panel1 ? (
        <Rnd
          className="fx-panel"
          position={bpPos0}
          onDragStop={(_, d) => {
            send({
              type: "SAVE_BUS_PANELS_POSITION",
              busIndex: 0,
              position: { x: d.x, y: d.y },
            });
          }}
          size={bpSize0}
          minWidth="200px"
          onResizeStop={(_, __, ref) => {
            send({
              type: "SAVE_BUS_PANELS_SIZE",
              busIndex: 0,
              size: { width: ref.style.width, height: ref.style.height },
            });
          }}
          cancel="input"
        >
          <CloseButton
            id="bus-panel-1"
            onClick={() => {
              send({
                type: "TOGGLE_BUS_PANEL",
                busIndex: 0,
              });
            }}
          >
            X
          </CloseButton>

          {array(2).map((_, i) => {
            switch (busFx[`bus1fx${i + 1}`]) {
              case "reverb1":
                return (
                  <Reverber
                    key={`bus1reverb${i}`}
                    reverb={fx.reverb1}
                    busIndex={0}
                    fxIndex={0}
                  />
                );
              case "delay1":
                return (
                  <Delay
                    key={`bus1delay${i}`}
                    delay={fx.delay1}
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
      ) : (
        "ubu!"
      )}
      {bpOpen1 && !disabled.panel2 && (
        <Rnd
          className="fx-panel"
          position={bpPos1}
          onDragStop={(_, d) => {
            send({
              type: "SAVE_BUS_PANELS_POSITION",
              busIndex: 1,
              position: { x: d.x, y: d.y },
            });
          }}
          size={bpSize1}
          minWidth="200px"
          onResizeStop={(_, __, ref) => {
            send({
              type: "SAVE_BUS_PANELS_SIZE",
              busIndex: 1,
              size: { width: ref.style.width, height: ref.style.height },
            });
          }}
          cancel="input"
        >
          <CloseButton
            id="bus-panel-1"
            onClick={() => {
              send({
                type: "TOGGLE_BUS_PANEL",
                busIndex: 1,
              });
            }}
          >
            X
          </CloseButton>

          {array(2).map((_, i) => {
            switch (busFx[`bus2fx${i + 1}`]) {
              case "reverb2":
                return (
                  <Reverber
                    key={`bus2reverb${i}`}
                    reverb={fx.reverb2}
                    busIndex={0}
                    fxIndex={0}
                  />
                );
              case "delay2":
                return (
                  <Delay
                    key={`bus2delay${i}`}
                    delay={fx.delay2}
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
      )}
    </div>
  );
}

export default BusPanels;

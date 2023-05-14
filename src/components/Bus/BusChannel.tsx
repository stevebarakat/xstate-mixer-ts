import { MixerMachineContext } from "../../App";
import BusFxMenu from "./BusFxMenu";
import ChannelButton from "../Buttons/ChannelButton";
import type { Channel } from "tone";

type Props = {
  busChannels: React.MutableRefObject<Channel[]>;
  busIndex: number;
  disabled: { panel1: boolean; panel2: boolean };
};

function BusChannel({ busChannels, busIndex, disabled }: Props) {
  const [state, send] = MixerMachineContext.useActor();

  return (
    <div>
      <ChannelButton
        id={`bus-panel-${busIndex}`}
        onClick={() => {
          send({
            type: "TOGGLE_BUS_PANEL",
            busIndex,
          });
        }}
      >
        {disabled[`panel${busIndex + 1}`]
          ? "No"
          : state.context.busPanelsOpen[busIndex]
          ? "Close"
          : "Open"}
        FX
      </ChannelButton>

      <BusFxMenu busIndex={busIndex} />
      <div className="channel">
        <div className="window">{`${state.context.busVolumes[busIndex].toFixed(
          0
        )} dB`}</div>
        <input
          type="range"
          id={`busVol${busIndex}`}
          className="range-y"
          min={-100}
          max={12}
          step={0.1}
          value={state.context.busVolumes[busIndex]}
          onChange={(e) => {
            send({
              type: "CHANGE_BUS_VOLUME",
              value: parseFloat(e.target.value),
              channel: busChannels.current[busIndex],
              busIndex,
            });
          }}
        />
        <label htmlFor={`busVol${busIndex}`}>{`Bus ${busIndex + 1}`}</label>
      </div>
    </div>
  );
}

export default BusChannel;

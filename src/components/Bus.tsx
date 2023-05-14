import { MixerMachineContext } from "../App";
import { array as fx } from "../utils";
import ChannelButton from "./Buttons/ChannelButton";
import type { Channel } from "tone";

type Props = {
  busChannels: React.MutableRefObject<Channel[]>;
  busIndex: number;
  disabled: { panel1: boolean; panel2: boolean };
};

function Bus({ busChannels, busIndex, disabled }: Props) {
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

      {fx(2).map((_, fxIndex) => {
        return (
          <select
            key={fxIndex}
            id={`bus${busIndex}fx${fxIndex}`}
            onChange={(e: React.FormEvent<HTMLSelectElement>): void => {
              send({
                type: "SET_BUS_FX",
                value: e.currentTarget.value,
                busIndex,
                fxIndex,
              });
            }}
            value={
              state.context.currentBusFx[`bus${busIndex + 1}fx${fxIndex + 1}`]
            }
          >
            <option value={`nofx${busIndex + 1}`}>{`FX ${fxIndex + 1}`}</option>
            <option value={`reverb${busIndex + 1}`}>Reverb</option>
            <option value={`delay${busIndex + 1}`}>Delay</option>
          </select>
        );
      })}
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
        <span>{`Bus ${busIndex + 1}`}</span>
      </div>
    </div>
  );
}

export default Bus;

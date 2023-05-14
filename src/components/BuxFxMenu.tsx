import { MixerMachineContext } from "../App";
import { array as fx } from "../utils";

type Props = {
  busIndex: number;
};

function BuxFxMenu({ busIndex }: Props) {
  const [state, send] = MixerMachineContext.useActor();

  return (
    <>
      {fx(2).map((_, fxIndex) => (
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
      ))}
    </>
  );
}

export default BuxFxMenu;

import { MixerMachineContext } from "../App";
import { array as fx } from "../utils";

type Props = {
  trackIndex: number;
};

function TrackFxMenu({ trackIndex }: Props) {
  const [state, send] = MixerMachineContext.useActor();

  return (
    <>
      {fx(2).map((_, fxIndex) => (
        <select
          key={fxIndex}
          id={`track${trackIndex}fx${fxIndex}`}
          onChange={(e: React.FormEvent<HTMLSelectElement>): void => {
            send({
              type: "SET_TRACK_FX",
              value: e.currentTarget.value,
              trackIndex,
              fxIndex,
            });
          }}
          value={
            state.context.currentTrackFx[
              `track${trackIndex + 1}fx${fxIndex + 1}`
            ]
          }
        >
          <option value={`nofx${trackIndex + 1}`}>{`FX ${fxIndex + 1}`}</option>
          <option value={`reverb${trackIndex + 1}`}>Reverb</option>
          <option value={`delay${trackIndex + 1}`}>Delay</option>
        </select>
      ))}
    </>
  );
}

export default TrackFxMenu;

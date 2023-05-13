import { MixerMachineContext } from "../App";
import type { Channel } from "tone";

type Props = {
  trackIndex: number;
  channel: Channel;
};

function Solo({ trackIndex, channel }: Props) {
  const [state, send] = MixerMachineContext.useActor();
  const solo = state.context.solo[trackIndex];

  return (
    <>
      <input
        id={`trackSolo${trackIndex}`}
        type="checkbox"
        onChange={(e) => {
          send({
            type: "TOGGLE_SOLO",
            checked: e.target.checked,
            trackIndex,
            channel,
          });
        }}
        checked={solo}
      />
      <label htmlFor={`trackSolo${trackIndex}`}>S</label>
    </>
  );
}

export default Solo;

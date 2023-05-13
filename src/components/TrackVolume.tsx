import { MixerMachineContext } from "../App";
import type { Channel } from "tone";

type Props = {
  trackIndex: number;
  channel: Channel;
};

function TrackVolume({ channel, trackIndex }: Props) {
  const [state, send] = MixerMachineContext.useActor();
  const volume = parseFloat(state.context.volume[trackIndex]);

  return (
    <>
      <div className="window">{`${volume.toFixed(0)} dB`}</div>
      <input
        type="range"
        id={`trackVol${trackIndex}`}
        className="range-y"
        min={-100}
        max={12}
        step={0.1}
        value={volume}
        onChange={(e) => {
          send({
            type: "CHANGE_VOLUME",
            value: parseFloat(e.target.value),
            trackIndex,
            channel,
          });
        }}
      />
    </>
  );
}

export default TrackVolume;

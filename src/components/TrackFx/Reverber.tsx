import { MixerMachineContext } from "../../App";
import { powerIcon } from "../../assets/icons";
import type { Reverb } from "tone";
import { shallowEqual } from "@xstate/react";

type Props = {
  reverb: Reverb;
  trackIndex: number;
};

export default function Reverber({ reverb, trackIndex }: Props) {
  // const [state, send] = MixerMachineContext.useActor();
  const { send } = MixerMachineContext.useActorRef();
  const trackFxData = MixerMachineContext.useSelector((state) => {
    const { trackFxData } = state.context;
    return trackFxData;
  }, shallowEqual);

  console.log("trackFxData", trackFxData);

  const disabled = !trackFxData[trackIndex].reverbsBypass;

  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <input
            id={`bus${trackIndex}reverbBypass`}
            type="checkbox"
            className="power-btn"
            value={trackFxData[trackIndex].reverbsBypass[trackIndex]}
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              send({
                type: "BYPASS_TRACK_REVERB",
                checked: e.currentTarget.checked,
                reverb,
                trackIndex,
              });
            }}
            checked={trackFxData[trackIndex].reverbsBypass[trackIndex]}
          />
          <label htmlFor={`bus${trackIndex}reverbBypass`}>{powerIcon}</label>
        </div>
      </div>
      <div className="flex-y">
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          className="simple-range"
          name="mix"
          min={0}
          max={1}
          step={0.01}
          value={trackFxData[trackIndex].reverbsMix[trackIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_TRACK_REVERBS_MIX",
              value: parseFloat(e.currentTarget.value),
              reverb,
              trackIndex,
            });
          }}
        />
      </div>
      {/* <div className="flex-y">
        <label htmlFor="pre-delay">Pre Delay:</label>
        <input
          type="range"
          className="simple-range"
          name="pre-delay"
          min={0}
          max={1}
          step={0.01}
          value={trackFxData.reverbsPreDelay[trackIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_REVERBS_PREDELAY",
              value: parseFloat(e.currentTarget.value),
              reverb,
              trackIndex,
            });
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="decay">Decay:</label>
        <input
          type="range"
          className="simple-range"
          name="decay"
          min={0.1}
          max={20}
          step={0.1}
          value={trackFxData.reverbsDecay[trackIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_REVERBS_DECAY",
              value: parseFloat(e.currentTarget.value),
              reverb,
              trackIndex,
            });
          }}
        />
      </div> */}
    </div>
  );
}

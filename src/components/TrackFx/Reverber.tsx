import { MixerMachineContext } from "../../App";
import { powerIcon } from "../../assets/icons";
import type { Reverb } from "tone";

type Props = {
  reverb: Reverb;
  trackIndex: number;
};

export default function Reverber({ reverb, trackIndex }: Props) {
  const [state, send] = MixerMachineContext.useActor();

  const disabled = state.context.busFxData.reverbsBypass[trackIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <input
            id={`bus${trackIndex}reverbBypass`}
            type="checkbox"
            className="power-btn"
            value={state.context.busFxData.reverbsBypass[trackIndex]}
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              send({
                type: "BYPASS_REVERB",
                checked: e.currentTarget.checked,
                reverb,
                trackIndex,
              });
            }}
            checked={state.context.busFxData.reverbsBypass[trackIndex]}
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
          value={state.context.busFxData.reverbsMix[trackIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_REVERBS_MIX",
              value: parseFloat(e.currentTarget.value),
              reverb,
              trackIndex,
            });
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="pre-delay">Pre Delay:</label>
        <input
          type="range"
          className="simple-range"
          name="pre-delay"
          min={0}
          max={1}
          step={0.01}
          value={state.context.busFxData.reverbsPreDelay[trackIndex]}
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
          value={state.context.busFxData.reverbsDecay[trackIndex]}
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
      </div>
    </div>
  );
}
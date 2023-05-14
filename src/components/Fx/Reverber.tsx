import { MixerMachineContext } from "../../App";
import { powerIcon } from "../../assets/icons";
import type { Reverb } from "tone";

type Props = {
  reverb: Reverb;
  busIndex: number;
  fxIndex: number;
};

export default function Reverber({ reverb, busIndex, fxIndex }: Props) {
  const [state, send] = MixerMachineContext.useActor();

  console.log(
    "state.context.busFxData.reverbsBypass[busIndex]",
    state.context.busFxData.reverbsBypass[busIndex]
  );
  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <input
            id={`bus${busIndex}reverbBypass`}
            type="checkbox"
            className="power-btn"
            value={state.context.busFxData.reverbsBypass[busIndex]}
            onChange={(e) => {
              send({
                type: "BYPASS_REVERB",
                checked: e.target.checked,
                reverb,
                busIndex,
                fxIndex,
              });
            }}
            checked={state.context.busFxData.reverbsBypass[busIndex][fxIndex]}
          />
          <label htmlFor={`bus${busIndex}reverbBypass`}>{powerIcon}</label>
        </div>
      </div>
      <div className="flex-y">
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          disabled={state.context.busFxData.reverbsBypass[busIndex]}
          className="simple-range"
          name="mix"
          min={0}
          max={1}
          step={0.01}
          value={state.context.busFxData.reverbsMix[busIndex][fxIndex]}
          onChange={(e) => {
            send({
              type: "CHANGE_REVERBS_MIX",
              target: e.target,
              reverb,
              busIndex,
              fxIndex,
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
          value={state.context.busFxData.reverbsPreDelay[busIndex][fxIndex]}
          onChange={(e) => {
            send({
              type: "CHANGE_REVERBS_PREDELAY",
              target: e.target,
              reverb,
              busIndex,
              fxIndex,
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
          value={state.context.busFxData.reverbsDecay[busIndex][fxIndex]}
          onChange={(e) => {
            send({
              type: "CHANGE_REVERBS_DECAY",
              target: e.target,
              reverb,
              busIndex,
              fxIndex,
            });
          }}
        />
      </div>
    </div>
  );
}

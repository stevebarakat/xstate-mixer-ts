import { MixerMachineContext } from "../../App";
import { powerIcon } from "../../assets/icons";
import type { PitchShift } from "tone";

type Props = {
  pitchShift: PitchShift;
  trackIndex: number;
};

export default function PitchShifter({ pitchShift, trackIndex }: Props) {
  const [state, send] = MixerMachineContext.useActor();

  const disabled =
    state.context.trackFxData[trackIndex].delaysBypass[trackIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Pitch Shift</h3>
        <div className="power-button">
          <input
            id={`bus${trackIndex}delayBypass`}
            type="checkbox"
            value={
              state.context.trackFxData[trackIndex].delaysBypass[trackIndex]
            }
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              send({
                type: "BYPASS_TRACK_PITCHSHIFT",
                checked: e.currentTarget.checked,
                pitchShift,
                trackIndex,
              });
            }}
            checked={
              state.context.trackFxData[trackIndex].pitchShiftsBypass[
                trackIndex
              ]
            }
          />
          <label htmlFor={`bus${trackIndex}delayBypass`}>{powerIcon}</label>
        </div>
      </div>
      <div className="flex-y">
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          className="simple-range"
          id="mix"
          min={0}
          max={1}
          step={0.01}
          disabled={disabled}
          value={
            state.context.trackFxData[trackIndex].pitchShiftsMix[trackIndex]
          }
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_TRACK_PITCHSHIFT_MIX",
              value: parseFloat(e.currentTarget.value),
              pitchShift,
              trackIndex,
            });
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="mix">Pitch:</label>
        <input
          type="range"
          className="simple-range"
          name="pitch"
          min={-48}
          max={48}
          step={1}
          disabled={disabled}
          value={
            state.context.trackFxData[trackIndex].pitchShiftsPitch[trackIndex]
          }
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_TRACK_PITCHSHIFT_PITCH",
              value: parseFloat(e.currentTarget.value),
              pitchShift,
              trackIndex,
            });
          }}
        />
      </div>
    </div>
  );
}

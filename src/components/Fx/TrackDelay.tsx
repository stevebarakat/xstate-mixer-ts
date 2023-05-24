import { MixerMachineContext } from "../../App";
import { powerIcon } from "../../assets/icons";
import type { FeedbackDelay } from "tone";

type Props = {
  delay: FeedbackDelay;
  trackIndex: number;
};

export default function TrackDelay({ delay, trackIndex }: Props) {
  const [state, send] = MixerMachineContext.useActor();

  const disabled =
    state.context.trackFxData[trackIndex].delaysBypass[trackIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Delay</h3>
        <div className="power-button">
          <input
            id={`bus${trackIndex}delayBypass`}
            type="checkbox"
            value={
              state.context.trackFxData[trackIndex].delaysBypass[trackIndex]
            }
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              send({
                type: "BYPASS_TRACK_DELAY",
                checked: e.currentTarget.checked,
                delay,
                trackIndex,
              });
            }}
            checked={
              state.context.trackFxData[trackIndex].delaysBypass[trackIndex]
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
          value={state.context.trackFxData[trackIndex].delaysMix[trackIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_TRACK_DELAY_MIX",
              value: parseFloat(e.currentTarget.value),
              delay,
              trackIndex,
            });
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="delay-time">Delay Time:</label>
        <input
          type="range"
          className="simple-range"
          id="delay-time"
          min={0}
          max={1}
          step={0.01}
          disabled={disabled}
          value={state.context.trackFxData[trackIndex].delaysTime[trackIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_TRACK_DELAY_TIME",
              value: parseFloat(e.currentTarget.value),
              delay,
              trackIndex,
            });
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="feedback">Feedback:</label>
        <input
          type="range"
          className="simple-range"
          name="feedback"
          min={0}
          max={1}
          step={0.01}
          disabled={disabled}
          value={
            state.context.trackFxData[trackIndex].delaysFeedback[trackIndex]
          }
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_TRACK_DELAY_FEEDBACK",
              value: parseFloat(e.currentTarget.value),
              delay,
              trackIndex,
            });
          }}
        />
      </div>
    </div>
  );
}

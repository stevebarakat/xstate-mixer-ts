import { MixerMachineContext } from "../App";

function MainVolume() {
  const [state, send] = MixerMachineContext.useActor();

  return (
    <div className="channel">
      <div className="window">
        {`${state.context.mainVolume.toFixed(0)} dB`}
      </div>
      <div className="range-y">
        <input
          type="range"
          id="main"
          min={-100}
          max={12}
          step={0.1}
          value={state.context.mainVolume}
          onChange={(e) => {
            send({
              type: "CHANGE_MAIN_VOLUME",
              value: parseFloat(e.target.value),
            });
          }}
        />
      </div>
      <label htmlFor="main">Main</label>
    </div>
  );
}

export default MainVolume;

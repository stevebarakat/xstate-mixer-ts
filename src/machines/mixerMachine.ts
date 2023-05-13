import { createMachine, assign } from "xstate";
import { pure } from "xstate/lib/actions";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Destination,
  Transport as t,
} from "tone";
import { dBToPercent, scale } from "../utils/scale";
import { getSong } from "../utils/getSong";
import { roxanne } from "../songs";
import type { TrackSettings } from "../types/global";

const actx = getAudioContext();
const [song, currentMix, currentTracks] = getSong(roxanne);
const initialVolumes = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.volume
);
const initialBusVolumes = currentMix.busVolumes.map((volume: number) => volume);
const initialPans = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.pan
);
const initialMutes = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.mute
);
const initialSolos = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.solo
);

export const mixerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAxAJQFEBlAgFQG0AGAXUVAAcB7WVAF1UYDs6R1EA2AIwAWAHQBOYeIBMggBwB2AKwAaEAE9EAWgViAzIP7DK-aUoC+5tWky5CAdQCSAOQAiVWkhBMW7Ljz4EYSUlUTlxOWE9ZTVNBC1ouVFBM0trDGwcADEsjx4fNg5uL0DpPWlRJUo9cRMzWO1E5NSrEBtMgGEACQBBZwBxAgB9ADUAeQAZAFUAWQI8rwK-YtBA8P5k-gVxfkVVDW1BJUFRKX5KcWiLVvbcbr7BoZmel1HJ2fmafOZC-xLEORKMSUQSCBTyGIHeJ6c6iMw1OrXdK2HD3AbDABCUyIb2mcwWDB+ywC2mEKVOZOMpn2cT05UqCOpaTaGVwJFIQyxREEQyyAA1BATvESiiTodtRHphAp+EpqQ14mVKAzakybqycOzOdiefzpEKlqL-tD+BsqfUocETkZEczbqjeuihgAFPoGkV-VYAygKU5KAwW2lyDYKKVXO0a0hjfr9CbDIiTMbu3xGr0IQEbfjiGQQmnaaTK4RmBRyFJIlkoqMxuNPKakT6eQkpz28AF6ULCSJXBURSolssRlFox6EEYEPAYnEzRx85O-Fat8VJeVQwTiE7B8F7QedR0jghjic452EVwECY9ACac+Jxq0xj0FP9ZYVwg2NWCAfL9uHw1H48nIYzw6K8b1TRd71BJ8vwVHR9EMc1v1ZUQABtGAAQwgVBOCgHAJjGHoz3cL5Fg9BdAmMZVpGo2UVziLQUiSGVxGfFpkWwUR6BQ9D1Gw3DXWxBtvmbcjECkE5ZD2WDTAkQQQTlNiKw4rieL40RsPQgBjdgADcwBwKtYyE0iRLFCVTD0Sg3ykqFpF2ZJOyiZQdywTjuN4nDRC03T9MMuMwJbQJ5HEUQfRohS8wQOykhELtnPVWxRFgVhGHoehIBwZ0L2vEim3nMVDBC8oi1zaSKnXeS1XY1zktS9KIHUzhvNQPSDOjIyAtEoJpWSOR20uSE4mkXQ-QUaoBwSjjarSyAvO0lrfPa-zcuFUzjSBDYIjkaRS0DRAdo3CInOuVpOEYCA4B4W5hPyu9DElZjWMirRhpCqp+0U25UIwrCcJu2802MUJg3KXbnrXCpKB9MGXLc1S-pM260wMUQLKs3ZBsQUFfWzST4uquGPKgRrmr0-7wKCy5kjXEREQVOkTnDSbXJUom5p88nAsQWpkkufru1sygOxzbdmaSlKZogTmupqEL5H5zGEBSfQoY+pDEum+qSfmsnEYBxcQhOapjgi+m3zCdHRYJzXZtJsBpbFN9ga2UrbKguRVZhyxzCAA */
    id: "mixer",
    initial: "loading",
    tsTypes: {} as import("./mixerMachine.typegen").Typegen0,
    context: {
      start: song?.start,
      end: song?.end,
      currentTime: t.seconds,
      mainVolume: currentMix.mainVolume,
      busVolumes: initialBusVolumes,
      volume: initialVolumes,
      pan: initialPans,
      solo: initialSolos,
      mute: initialMutes,
      busFx: currentMix.busFx,
      busPanelsOpen: currentMix.busPanelsOpen,
      busFxData: {
        reverbsBypass: currentMix.busFxData.reverbsBypass,
        reverbsMix: currentMix.busFxData.reverbsMix,
        reverbsPreDelay: currentMix.busFxData.reverbsPreDelay,
        reverbsDecay: currentMix.busFxData.reverbsDecay,
        delaysBypass: currentMix.busFxData.delaysBypass,
        delaysMix: currentMix.busFxData.delaysMix,
        delaysTime: currentMix.busFxData.delaysTime,
        delaysFeedback: currentMix.busFxData.delaysFeedback,
      },
    },
    on: {
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      CHANGE_VOLUME: { actions: "changeVolume" },
      CHANGE_MAIN_VOLUME: { actions: "changeMainVolume" },
      CHANGE_BUS_VOLUME: { actions: "changeBusVolume" },
      SET_BUS_FX: { actions: "setBusFx" },
      SAVE_BUS_PANELS_OPEN: { actions: "saveBusPanelsOpen" },
      CHANGE_PAN: { actions: "changePan" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
      BYPASS_REVERB: { actions: "bypassReverb" },
      CHANGE_REVERBS_MIX: { actions: "changeReverbsMix" },
      CHANGE_REVERBS_PREDELAY: { actions: "changeReverbsPredelay" },
      CHANGE_REVERBS_DECAY: { actions: "changeReverbsDecay" },
      BYPASS_DELAY: { actions: "bypassDelay" },
      CHANGE_DELAYS_MIX: { actions: "changeDelaysMix" },
      CHANGE_DELAYS_TIME: { actions: "changeDelaysTime" },
      CHANGE_DELAYS_FEEDBACK: { actions: "changeDelaysFeedback" },
    },
    states: {
      loading: { on: { LOADED: "stopped" } },
      playing: {
        entry: "play",
        on: {
          PAUSE: { target: "stopped", actions: "pause" },
        },
      },
      stopped: {
        on: {
          PLAY: { target: "playing" },
        },
      },
    },
    schema: {
      events: {} as
        | { type: "RESET" }
        | { type: "REWIND" }
        | { type: "FF" }
        | { type: "CHANGE_VOLUME" }
        | { type: "CHANGE_MAIN_VOLUME" }
        | { type: "CHANGE_BUS_VOLUME" }
        | { type: "SET_BUS_FX" }
        | { type: "SAVE_BUS_PANELS_OPEN" }
        | { type: "CHANGE_PAN" }
        | { type: "TOGGLE_SOLO" }
        | { type: "TOGGLE_MUTE" }
        | { type: "BYPASS_REVERB" }
        | { type: "CHANGE_REVERBS_MIX" }
        | { type: "CHANGE_REVERBS_PREDELAY" }
        | { type: "CHANGE_REVERBS_DECAY" }
        | { type: "BYPASS_DELAY" }
        | { type: "CHANGE_DELAYS_MIX" }
        | { type: "CHANGE_DELAYS_TIME" }
        | { type: "CHANGE_DELAYS_FEEDBACK" }
        | { type: "LOADED" }
        | { type: "PAUSE" }
        | { type: "PLAY" },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },

  {
    actions: {
      reset: () => t.stop(),
      pause: () => t.pause(),
      play: () => (actx.state === "suspended" ? initializeAudio : t.start()),

      fastForward: assign((context) => {
        t.seconds = t.seconds < context.end - 10 ? t.seconds + 10 : context.end;
      }),

      rewind: assign((context) => {
        t.seconds =
          t.seconds > 10 + context.start ? t.seconds - 10 : context.start;
      }),

      changeMainVolume: pure((_, { value }) => {
        const scaled = dBToPercent(scale(value));
        const volume = () => {
          Destination.volume.value = scaled;
        };
        currentMix.mainVolume = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ mainVolume: value }), volume];
      }),

      changeBusVolume: pure((context, { busIndex, value, channel }) => {
        const scaled = dBToPercent(scale(value));
        const volume = () => {
          channel.volume.value = scaled;
        };
        const tempBusVols = context.busVolumes;
        tempBusVols[busIndex] = value;
        currentMix.busVolumes[busIndex] = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ busVolumes: tempBusVols }), volume];
      }),

      changeVolume: pure((context, { value, trackIndex, channel }) => {
        const scaled = dBToPercent(scale(parseFloat(value)));
        const channelVolume = () => {
          channel.volume.value = scaled;
        };
        const tempVols = context.volume;
        tempVols[trackIndex] = parseFloat(value);
        currentTracks[trackIndex].volume = value;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ volume: tempVols }), channelVolume];
      }),

      changePan: pure((context, { value, trackIndex, channel }) => {
        const channelPan = () => {
          channel.pan.value = value;
        };
        const tempPans = context.pan;
        tempPans[trackIndex] = value;
        currentTracks[trackIndex].pan = value;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ pan: tempPans }), channelPan];
      }),

      toggleMute: pure((context, { trackIndex, checked, channel }) => {
        const muteChannel = () => {
          channel.mute = checked;
        };
        const tempMutes = context.mute;
        tempMutes[trackIndex] = checked;
        currentTracks[trackIndex].mute = checked;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ mute: tempMutes }), muteChannel];
      }),

      toggleSolo: pure((context, { trackIndex, checked, channel }) => {
        const soloChannel = () => {
          channel.solo = checked;
        };
        const tempSolos = context.solo;
        tempSolos[trackIndex] = checked;
        currentTracks[trackIndex].solo = checked;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ solo: tempSolos }), soloChannel];
      }),

      setBusFx: assign((context, { value, busIndex, fxIndex }) => {
        context.busFx = {
          ...context.busFx,
          [`bus${busIndex + 1}fx${fxIndex + 1}`]: value,
        };
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            busFx: {
              ...context.busFx,
              [`bus${busIndex + 1}fx${fxIndex + 1}`]: value,
            },
          })
        );
      }),

      saveBusPanelsOpen: pure((context, { busIndex }) => {
        const tempBusPanelsOpen = context.busPanelsOpen;
        tempBusPanelsOpen[busIndex] = !tempBusPanelsOpen[busIndex];
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            busPanelsOpen: tempBusPanelsOpen,
          })
        );
        return [assign({ busPanelsOpen: tempBusPanelsOpen })];
      }),

      bypassReverb: pure((context, { checked, reverb, busIndex }) => {
        const tempReverbsBypass = context.busFxData.reverbsBypass;
        tempReverbsBypass[busIndex] = checked;
        currentMix.busFxData.reverbsBypass[busIndex] = checked;
        if (checked) {
          reverb.disconnect();
        } else {
          reverb.connect(Destination);
        }
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ reverbsBypass: tempReverbsBypass })];
      }),

      changeReverbsMix: pure(
        (context, { target, reverb, busIndex, fxIndex }) => {
          const value = parseFloat(target.value);
          reverb.wet.value = value;
          const tempReverbsMix = context.busFxData.reverbsMix;
          tempReverbsMix[busIndex][fxIndex] = value;
          currentMix.busFxData.reverbsMix[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ reverbsMix: tempReverbsMix })];
        }
      ),

      changeReverbsPredelay: pure(
        (context, { target, reverb, busIndex, fxIndex }) => {
          const value = parseFloat(target.value);
          reverb.preDelay = value;
          const tempReverbsPreDelay = context.busFxData.reverbsPreDelay;
          tempReverbsPreDelay[busIndex][fxIndex] = value;
          currentMix.busFxData.reverbsPreDelay[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ reverbsPreDelay: tempReverbsPreDelay })];
        }
      ),

      changeReverbsDecay: pure(
        (context, { target, reverb, busIndex, fxIndex }) => {
          const value = parseFloat(target.value);
          reverb.decay = value;
          const tempReverbsDecay = context.busFxData.reverbsDecay;
          tempReverbsDecay[busIndex][fxIndex] = value;
          currentMix.busFxData.reverbsDecay[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ reverbsDecay: tempReverbsDecay })];
        }
      ),

      bypassDelay: pure((context, { checked, delay, busIndex }) => {
        const tempDelaysBypass = context.busFxData.delaysBypass;
        tempDelaysBypass[busIndex] = checked;
        currentMix.busFxData.delaysBypass[busIndex] = checked;
        if (checked) {
          delay.disconnect();
        } else {
          delay.connect(Destination);
        }
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ delaysBypass: tempDelaysBypass })];
      }),

      changeDelaysMix: pure((context, { target, delay, busIndex, fxIndex }) => {
        const value = parseFloat(target.value);
        delay.wet.value = value;
        const tempDelaysMix = context.busFxData.delaysMix;
        tempDelaysMix[busIndex][fxIndex] = value;
        currentMix.busFxData.delaysMix[busIndex][fxIndex] = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ delaysMix: tempDelaysMix })];
      }),

      changeDelaysTime: pure(
        (context, { target, delay, busIndex, fxIndex }) => {
          const value = parseFloat(target.value);
          delay.delayTime.value = value;
          const tempDelaysTime = context.busFxData.delaysTime;
          tempDelaysTime[busIndex][fxIndex] = value;
          currentMix.busFxData.delaysTime[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ delaysTime: tempDelaysTime })];
        }
      ),

      changeDelaysFeedback: pure(
        (context, { target, delay, busIndex, fxIndex }) => {
          const value = parseFloat(target.value);
          delay.feedback.value = value;
          const tempDelaysFeedback = context.busFxData.delaysFeedback;
          tempDelaysFeedback[busIndex][fxIndex] = value;
          currentMix.busFxData.delaysFeedback[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ delaysFeedback: tempDelaysFeedback })];
        }
      ),
    },
  }
);

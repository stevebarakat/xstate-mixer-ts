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
const initialTrackFx = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.fx
);
const initialTrackFxData = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.trackFxData
);
console.log("initialTrackFxData", initialTrackFxData);
export const mixerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAxAJQFEBlAgFQG0AGAXUVAAcB7WVAF1UYDs6R1EA2AIwAWAHQBOYeIBMggBwB2AKwAaEAE9EAWgViAzIP7DK-aUoC+5tWky5CAdQCSAOQAiVWkhBMW7Ljz4EYSUlUTlxOWE9ZTVNBC1ouVFBM0trDGwcADEsjx4fNg5uL0DpPWlRJUo9cRMzWO1E5NSrEBtMgGEACQBBZwBxAgB9ADUAeQAZAFUAWQI8rwK-YtBA8P5k-gVxfkVVDW1BJUFRKX5KcWiLVvbcbr7BoZmel1HJ2fmafOZC-xLEORKMSUQSCBTyGIHeJ6c6iMw1OrXdK2HD3AbDABCUyIb2mcwWDB+ywC2mEKVOZOMpn2cT05UqCOpaTaGVwJFIQyxOKyAA0Cd4iUUeHEtNJtpVKAo5Cl9mtdpUxXoospmbdUb10UMAAp9flLIX-BBySWnJQGepQvRyDYKJVXVWsnCkMb9foTYZESZjPWCv6rAFKDb8cQyCE07TSSinMxSmUOlHO13up5TUifTyE3wG-1GvShYSRK4NBARSqxlrIzIYgCaOqIOMIIwIeAxPqzfqhovFVXLsoB8qUiuVSJZKLRj0bzYxOJmjj5X0WvpWvEaUtE1OLgnEJ2t4L28c6GonBCbLZxWsIrgIEx61bbv2XgS0xj0FLNMuLwg2NWC5pHavHYZJzPIYrw6W972JQ1n1BN8-2LHR9EMKkK1HKtax6etQOvCCF0zB9hQjbtJWlC05SSQdbWHA87iPYYrxvasZznSDs07MVxAlXs1HIhUqPtG5HUA7DGJxUhHHxPCBXbZcRQ4rjSL7I0ByHATK1oh56JwpihiyAgCFcDEeg6ABpViOzk4juJXZSKNUlVBNsUQABtGAAQwgVBOCgHAJjGHor3cKT9Q7QJjCjaRIv4QMLRFFIkgUYN31Q25RHoZy3PULyfJ1bF02+GSSSCbc4TDBDTAkQQQRi-9WTSjKsu80QvLcgBjdgADcwBwIgeibTlsW1PprxxMYtQIZxzMfRA9EoMRBzNWoNyhMkkjKObdgc9T6sy7LRDazrut6-quSG5wRqGMaJqmorZG-WaSI-KFZB3ShHpSurYFYRh6HoSAcC1RibsNQxOPKYRZD2cqKm3aqmUc7BRC+n6-ogZrOAO1Aup6vrMUGnVzomUbxsm4Kl0IhAlQ2Y0vyhmzEpOapjhqmike+37IH29qsaO3GBvPYaicukngdAOIXrCN7rMCfh+FfSgymo5lOEYCA4B4W4CoI6DQmNWWUPDeJ5J7RTWdcjzsq1qCc2MXW5ekRSEK3CopdNhGsB2xqoCttiwoqLc6SUS5ITiBQoxDSGtrQj30t2pqWu5rqfdCxAA+SLcRERYs6RONTo89vbMaTxdCsNWpkkuPNg8NyN81Dfd3bZlHIGT6agjBMItjKqEUn0V240b5GObRhPDtboqQkZvMjmW2kv0l2mo9SofUa5seS+1m3os7vcQ8QCXjXe65LCAA */
    id: "mixer",
    initial: "loading",
    tsTypes: {} as import("./mixerMachine.typegen").Typegen0,
    context: {
      start: song.start,
      end: song.end,
      currentTime: t.seconds,
      mainVolume: currentMix.mainVolume,
      busVolumes: initialBusVolumes,
      volume: initialVolumes,
      pan: initialPans,
      solo: initialSolos,
      mute: initialMutes,
      currentTrackFx: initialTrackFx,
      currentBusFx: currentMix.currentBusFx,
      busPanelsOpen: currentMix.busPanelsOpen,
      busPanelsPosition: currentMix.busPanelsPosition,
      busPanelsSize: currentMix.busPanelsSize,
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
      trackFxData: initialTrackFxData,
    },
    on: {
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      CHANGE_VOLUME: { actions: "changeVolume" },
      CHANGE_MAIN_VOLUME: { actions: "changeMainVolume" },
      CHANGE_BUS_VOLUME: { actions: "changeBusVolume" },
      SET_BUS_FX: { actions: "setBusFx" },
      SET_TRACK_FX: { actions: "setTrackFx" },
      CHANGE_PAN: { actions: "changePan" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
      BYPASS_REVERB: { actions: "bypassReverb" },
      BYPASS_TRACK_REVERB: { actions: "bypassTrackReverb" },
      CHANGE_REVERBS_MIX: { actions: "changeReverbsMix" },
      CHANGE_TRACK_REVERBS_MIX: { actions: "changeTrackReverbsMix" },
      CHANGE_REVERBS_PREDELAY: { actions: "changeReverbsPredelay" },
      CHANGE_TRACK_REVERBS_PREDELAY: { actions: "changeTrackReverbsPredelay" },
      CHANGE_REVERBS_DECAY: { actions: "changeReverbsDecay" },
      CHANGE_TRACK_REVERBS_DECAY: { actions: "changeTrackReverbsDecay" },
      BYPASS_DELAY: { actions: "bypassDelay" },
      CHANGE_DELAYS_MIX: { actions: "changeDelaysMix" },
      CHANGE_TRACK_DELAYS_MIX: { actions: "changeTrackDelaysMix" },
      CHANGE_DELAYS_TIME: { actions: "changeDelaysTime" },
      CHANGE_TRACK_DELAYS_TIME: { actions: "changeTrackDelaysTime" },
      CHANGE_DELAYS_FEEDBACK: { actions: "changeDelaysFeedback" },
      CHANGE_TRACK_DELAYS_FEEDBACK: { actions: "changeTrackDelaysFeedback" },
      SAVE_BUS_PANELS_POSITION: { actions: "saveBusPanelsPosition" },
      SAVE_BUS_PANELS_SIZE: { actions: "saveBusPanelsSize" },
      TOGGLE_TRACK_PANEL: { actions: "toggleTrackPanel" },
    },
    states: {
      loading: { on: { LOADED: "stopped" } },
      playing: {
        initial: "active",
        entry: "play",
        states: {
          inactive: {
            on: {
              TOGGLE_BUS_PANEL: {
                target: "active",
                actions: "toggleBusPanel",
              },
            },
          },
          active: {
            on: {
              TOGGLE_BUS_PANEL: {
                target: "inactive",
                actions: "toggleBusPanel",
              },
            },
          },
        },
        on: {
          PAUSE: { target: "stopped", actions: "pause" },
        },
      },
      stopped: {
        initial: "active",
        states: {
          inactive: {
            on: {
              TOGGLE_BUS_PANEL: {
                target: "active",
                actions: "toggleBusPanel",
              },
            },
          },
          active: {
            on: {
              TOGGLE_BUS_PANEL: {
                target: "inactive",
                actions: "toggleBusPanel",
              },
            },
          },
        },
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
        | { type: "SET_TRACK_FX" }
        | { type: "TOGGLE_BUS_PANEL" }
        | { type: "CHANGE_PAN" }
        | { type: "TOGGLE_SOLO" }
        | { type: "TOGGLE_MUTE" }
        | { type: "BYPASS_REVERB" }
        | { type: "BYPASS_TRACK_REVERB" }
        | { type: "CHANGE_REVERBS_MIX" }
        | { type: "CHANGE_TRACK_REVERBS_MIX" }
        | { type: "CHANGE_REVERBS_PREDELAY" }
        | { type: "CHANGE_TRACK_REVERBS_PREDELAY" }
        | { type: "CHANGE_REVERBS_DECAY" }
        | { type: "CHANGE_TRACK_REVERBS_DECAY" }
        | { type: "BYPASS_DELAY" }
        | { type: "CHANGE_DELAYS_MIX" }
        | { type: "CHANGE_DELAYS_TIME" }
        | { type: "CHANGE_TRACK_DELAYS_TIME" }
        | { type: "CHANGE_DELAYS_FEEDBACK" }
        | { type: "CHANGE_TRACK_DELAYS_FEEDBACK" }
        | { type: "LOADED" }
        | { type: "PAUSE" }
        | { type: "PLAY" }
        | { type: "SAVE_BUS_PANELS_POSITION" }
        | { type: "SAVE_BUS_PANELS_SIZE" }
        | { type: "CHANGE_TRACK_DELAYS_MIX" }
        | { type: "TOGGLE_TRACK_PANEL" },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },

  {
    actions: {
      play: () => {
        if (actx.state === "suspended") {
          initializeAudio();
          t.start();
        } else {
          t.start();
        }
      },
      pause: () => t.pause(),
      reset: () => {
        t.stop();
        t.seconds = song.start ?? 0;
      },
      fastForward: () =>
        (t.seconds =
          t.seconds < song.end - 10 ? t.seconds + 10 : (t.seconds = song.end)),
      rewind: () =>
        (t.seconds = t.seconds > 10 + song.start ? t.seconds - 10 : song.start),

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

      setTrackFx: pure((context, { target, trackIndex }) => {
        // const currentTracksString = localStorage.getItem("currentTracks");
        // const currentTracks =
        //   currentTracksString && JSON.parse(currentTracksString);
        const id = target.id.at(-1);
        const tempTrackFx = context.currentTrackFx;
        tempTrackFx[trackIndex][id] = target.value;
        currentTracks[trackIndex].fx[id] = target.value;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ currentTrackFx: tempTrackFx }), currentTracks];
      }),

      setBusFx: assign((context, { value, busIndex, fxIndex }) => {
        context.currentBusFx = {
          ...context.currentBusFx,
          [`bus${busIndex + 1}fx${fxIndex + 1}`]: value,
        };
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            currentBusFx: {
              ...context.currentBusFx,
              [`bus${busIndex + 1}fx${fxIndex + 1}`]: value,
            },
          })
        );
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

      bypassTrackReverb: pure((context, { checked, reverb, trackIndex }) => {
        console.log("reverb", reverb);
        const tempReverbsBypass = context.trackFxData[trackIndex].reverbsBypass;
        tempReverbsBypass[trackIndex] = checked;
        currentTracks[trackIndex].trackFxData.reverbsBypass[trackIndex] =
          checked;
        if (checked) {
          reverb.disconnect();
        } else {
          reverb.connect(Destination);
        }
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ reverbsBypass: tempReverbsBypass })];
      }),

      changeReverbsMix: pure(
        (context, { value, reverb, busIndex, fxIndex }) => {
          reverb.wet.value = value;
          const tempReverbsMix = context.busFxData.reverbsMix;
          tempReverbsMix[busIndex][fxIndex] = value;
          currentMix.busFxData.reverbsMix[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ reverbsMix: tempReverbsMix })];
        }
      ),

      changeTrackReverbsMix: pure((context, { value, reverb, trackIndex }) => {
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);
        reverb.wet.value = value;
        console.log("reverb.mix", reverb.wet.value);
        const tempReverbsMix = context.trackFxData[trackIndex].reverbsMix;
        tempReverbsMix[trackIndex] = value;
        currentTracks[trackIndex].trackFxData.reverbsMix[trackIndex] = value;
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ reverbsMix: tempReverbsMix })];
      }),

      changeTrackReverbsPredelay: pure(
        (context, { value, reverb, trackIndex }) => {
          const currentTracksString = localStorage.getItem("currentTracks");
          const currentTracks =
            currentTracksString && JSON.parse(currentTracksString);
          reverb.preDelay = value;
          console.log("reverb.preDealy", reverb.preDelay);
          const tempReverbsPreDelay =
            context.trackFxData[trackIndex].reverbsPreDelay;
          tempReverbsPreDelay[trackIndex] = value;
          currentTracks[trackIndex].trackFxData.reverbsPreDelay[trackIndex] =
            value;
          localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
          return [assign({ reverbsPreDelay: tempReverbsPreDelay })];
        }
      ),

      changeTrackReverbsDecay: pure(
        (context, { value, reverb, trackIndex }) => {
          const currentTracksString = localStorage.getItem("currentTracks");
          const currentTracks =
            currentTracksString && JSON.parse(currentTracksString);
          reverb.decay = value;
          console.log("reverb.decay", reverb.decay);
          const tempReverbsDecay = context.trackFxData[trackIndex].reverbsDecay;
          tempReverbsDecay[trackIndex] = value;
          currentTracks[trackIndex].trackFxData.reverbsDecay[trackIndex] =
            value;
          localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
          return [assign({ reverbsDecay: tempReverbsDecay })];
        }
      ),

      changeReverbsPredelay: pure(
        (context, { value, reverb, busIndex, fxIndex }) => {
          reverb.preDelay = value;
          const tempReverbsPreDelay = context.busFxData.reverbsPreDelay;
          tempReverbsPreDelay[busIndex][fxIndex] = value;
          currentMix.busFxData.reverbsPreDelay[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ reverbsPreDelay: tempReverbsPreDelay })];
        }
      ),

      changeReverbsDecay: pure(
        (context, { value, reverb, busIndex, fxIndex }) => {
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

      changeDelaysMix: pure((context, { value, delay, busIndex, fxIndex }) => {
        delay.wet.value = value;
        const tempDelaysMix = context.busFxData.delaysMix;
        tempDelaysMix[busIndex][fxIndex] = value;
        currentMix.busFxData.delaysMix[busIndex][fxIndex] = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ delaysMix: tempDelaysMix })];
      }),

      changeDelaysTime: pure((context, { value, delay, busIndex, fxIndex }) => {
        delay.delayTime.value = value;
        const tempDelaysTime = context.busFxData.delaysTime;
        tempDelaysTime[busIndex][fxIndex] = value;
        currentMix.busFxData.delaysTime[busIndex][fxIndex] = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ delaysTime: tempDelaysTime })];
      }),

      changeDelaysFeedback: pure(
        (context, { value, delay, busIndex, fxIndex }) => {
          delay.feedback.value = value;
          const tempDelaysFeedback = context.busFxData.delaysFeedback;
          tempDelaysFeedback[busIndex][fxIndex] = value;
          currentMix.busFxData.delaysFeedback[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ delaysFeedback: tempDelaysFeedback })];
        }
      ),

      changeTrackDelaysMix: pure((context, { value, delay, trackIndex }) => {
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);
        delay.wet.value = value;
        console.log("delay.mix", delay.wet.value);
        const tempDelaysMix = context.trackFxData[trackIndex].delaysMix;
        tempDelaysMix[trackIndex] = value;
        currentTracks[trackIndex].trackFxData.delaysMix[trackIndex] = value;
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ delaysMix: tempDelaysMix })];
      }),

      toggleBusPanel: pure((context, { busIndex }) => {
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

      toggleTrackPanel: pure((context, { trackIndex }) => {
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

      saveBusPanelsPosition: pure((context, { busIndex, position }) => {
        const tempBusPanelsPosition = context.busPanelsPosition;
        tempBusPanelsPosition[busIndex] = position;
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            busPanelsPosition: tempBusPanelsPosition,
          })
        );
        return [assign({ busPanelsPosition: tempBusPanelsPosition })];
      }),

      saveBusPanelsSize: pure((context, { busIndex, size }) => {
        const tempBusPanelsSize = context.busPanelsSize;
        tempBusPanelsSize[busIndex] = size;
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            busPanelsSize: tempBusPanelsSize,
          })
        );
        return [assign({ busPanelsSize: tempBusPanelsSize })];
      }),
    },
  }
);

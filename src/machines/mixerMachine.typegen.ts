// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    bypassDelay: "BYPASS_DELAY";
    bypassReverb: "BYPASS_REVERB";
    bypassTrackDelay: "BYPASS_TRACK_DELAY";
    bypassTrackReverb: "BYPASS_TRACK_REVERB";
    changeBusVolume: "CHANGE_BUS_VOLUME";
    changeDelaysFeedback: "CHANGE_DELAYS_FEEDBACK";
    changeDelaysMix: "CHANGE_DELAYS_MIX";
    changeDelaysTime: "CHANGE_DELAYS_TIME";
    changeMainVolume: "CHANGE_MAIN_VOLUME";
    changePan: "CHANGE_PAN";
    changeReverbsDecay: "CHANGE_REVERBS_DECAY";
    changeReverbsMix: "CHANGE_REVERBS_MIX";
    changeReverbsPredelay: "CHANGE_REVERBS_PREDELAY";
    changeTrackDelaysFeedback: "CHANGE_TRACK_DELAYS_FEEDBACK";
    changeTrackDelaysMix: "CHANGE_TRACK_DELAYS_MIX";
    changeTrackDelaysTime: "CHANGE_TRACK_DELAYS_TIME";
    changeTrackReverbsDecay: "CHANGE_TRACK_REVERBS_DECAY";
    changeTrackReverbsMix: "CHANGE_TRACK_REVERBS_MIX";
    changeTrackReverbsPredelay: "CHANGE_TRACK_REVERBS_PREDELAY";
    changeVolume: "CHANGE_VOLUME";
    fastForward: "FF";
    pause: "PAUSE";
    play: "PLAY";
    reset: "RESET";
    rewind: "REWIND";
    saveBusPanelsPosition: "SAVE_BUS_PANELS_POSITION";
    saveBusPanelsSize: "SAVE_BUS_PANELS_SIZE";
    setBusFx: "SET_BUS_FX";
    setTrackFx: "SET_TRACK_FX";
    toggleBusPanel: "TOGGLE_BUS_PANEL";
    toggleMute: "TOGGLE_MUTE";
    toggleSolo: "TOGGLE_SOLO";
    toggleTrackPanel: "TOGGLE_TRACK_PANEL";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | "loading"
    | "playing"
    | "playing.active"
    | "playing.inactive"
    | "stopped"
    | "stopped.active"
    | "stopped.inactive"
    | { playing?: "active" | "inactive"; stopped?: "active" | "inactive" };
  tags: never;
}

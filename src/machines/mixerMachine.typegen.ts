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
    changeBusVolume: "CHANGE_BUS_VOLUME";
    changeDelaysFeedback: "CHANGE_DELAYS_FEEDBACK";
    changeDelaysMix: "CHANGE_DELAYS_MIX";
    changeDelaysTime: "CHANGE_DELAYS_TIME";
    changeMainVolume: "CHANGE_MAIN_VOLUME";
    changePan: "CHANGE_PAN";
    changeReverbsDecay: "CHANGE_REVERBS_DECAY";
    changeReverbsMix: "CHANGE_REVERBS_MIX";
    changeReverbsPredelay: "CHANGE_REVERBS_PREDELAY";
    changeVolume: "CHANGE_VOLUME";
    fastForward: "FF";
    pause: "PAUSE";
    play: "PLAY";
    reset: "RESET";
    rewind: "REWIND";
    saveBusPanelsOpen: "SAVE_BUS_PANELS_OPEN";
    setBusFx: "SET_BUS_FX";
    toggleMute: "TOGGLE_MUTE";
    toggleSolo: "TOGGLE_SOLO";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates: "loading" | "playing" | "stopped";
  tags: never;
}

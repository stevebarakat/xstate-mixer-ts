export type Song = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  year: string;
  studio: string;
  location: string;
  bpm: number;
  start: number;
  end: number;
  tracks: Track[];
};

export type BusFxPanels = {
  bus1FxPanel: {
    position: { x: number; y: number };
    width: number;
    isOpen: boolean;
  };
  bus2FxPanel: {
    position: { x: number; y: number };
    width: number;
    isOpen: boolean;
  };
};

export type Track = {
  id: string;
  name: string;
  path: string;
};

export type MixSettings = {
  id: string;
  songSlug: string;
  masterVolume: number;
  bussesVolume: number;
  busFxChoices: string[][];
  delaysMix: number;
  delaysTime: number;
  delaysFeedback: number;
  reverbsMix: number;
  reverbsPreDelay: number;
  reverbsDecay: number;
  pitchShiftsMix: number;
  pitchShiftsPitch: number;
  pitchShiftsDelayTime: number;
  pitchShiftsSize: number;
  pitchShiftsFeedback: number;
  chebyshevsMix: number;
  chebyshevsOrder: number;
  freqShiftsMix: number;
  freqShiftsFreq: number;
  compressorsThreshold: number;
  compressorsRatio: number;
  compressorsKnee: number;
  compressorsAttack: number;
  compressorsRelease: number;
  trackSettings: TrackSettings;
};

export type TrackSettings = {
  id: string;
  volume: number;
  solo: boolean;
  mute: boolean;
  pan: number;
  activeBusses: boolean;
  trackFxChoices: string[];
  eqHi: number;
  eqMid: number;
  eqLow: number;
  delaysMix: number;
  delaysTime: number;
  delaysFeedback: number;
  reverbsMix: number;
  reverbsPreDelay: number;
  reverbsDecay: number;
  pitchShiftsMix: number;
  pitchShiftsPitch: number;
  pitchShiftsDelayTime: number;
  pitchShiftsSize: number;
  pitchShiftsFeedback: number;
  chebyshevsMix: number;
  chebyshevsOrder: number;
  freqShiftsMix: number;
  freqShiftsFreq: number;
  compressorsThreshold: number;
  compressorsRatio: number;
  compressorsKnee: number;
  compressorsAttack: number;
  compressorsRelease: number;
  fx: string[];
};

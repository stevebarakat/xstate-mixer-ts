import type { Song } from "../types/global";

export const defaultCurrentMix = {
  mainVolume: -32,
  busVolumes: [-32, -32],
  currentBusFx: {
    bus1fx1: "nofx",
    bus1fx2: "nofx",
    bus2fx1: "nofx",
    bus2fx2: "nofx",
  },
  currentTrackFx: ["nofx", "nofx"],
  busPanelActive: [true, true],
  busPanelPosition: { x: 0, y: 0 },
  busPanelSize: { width: "325px", height: "auto" },
  busFxData: {
    reverbsBypass: [false, false],
    reverbsMix: [
      [0.5, 0.5],
      [0.5, 0.5],
    ],
    reverbsPreDelay: [
      [0.5, 0.5],
      [0.5, 0.5],
    ],
    reverbsDecay: [
      [0.5, 0.5],
      [0.5, 0.5],
    ],
    delaysBypass: [false, false],
    delaysMix: [
      [0.5, 0.5],
      [0.5, 0.5],
    ],
    delaysTime: [
      [0.5, 0.5],
      [0.5, 0.5],
    ],
    delaysFeedback: [
      [0.5, 0.5],
      [0.5, 0.5],
    ],
  },
};

export function getSong(defaultSong: Song) {
  const defaultSongString = JSON.stringify(defaultSong);
  const songString = localStorage.getItem("song");
  const parsedSong = songString && JSON.parse(songString);

  const defaultCurrentTracks = defaultSong.tracks.map((track) => ({
    name: track.name,
    path: track.path,
    volume: -32,
    pan: 0,
    mute: false,
    solo: false,
    fx: ["nofx", "nofx"],
    trackPanelActive: true,
    trackPanelPosition: { x: 0, y: 0 },
    trackPanelSize: { width: "325px", height: "auto" },
    // trackPanelData: {
    //   active: [true, true, true, true],
    //   position: [
    //     { x: 0, y: 0 },
    //     { x: 0, y: 0 },
    //     { x: 0, y: 0 },
    //     { x: 0, y: 0 },
    //   ],
    //   size: [
    //     { width: "325px", height: "auto" },
    //     { width: "325px", height: "auto" },
    //     { width: "325px", height: "auto" },
    //     { width: "325px", height: "auto" },
    //   ],
    // },
    trackFxData: {
      reverbsBypass: [false, false, false, false],
      reverbsMix: [0.5, 0.5, 0.5, 0.5],
      reverbsPreDelay: [0.5, 0.5, 0.5, 0.5],
      reverbsDecay: [0.5, 0.5, 0.5, 0.5],
      delaysBypass: [false, false, false, false],
      delaysMix: [0.5, 0.5, 0.5, 0.5],
      delaysTime: [0.5, 0.5, 0.5, 0.5],
      delaysFeedback: [0.5, 0.5, 0.5, 0.5],
      pitchShiftsBypass: [false, false, false, false],
      pitchShiftsMix: [0.5, 0.5, 0.5, 0.5],
      pitchShiftsPitch: [0, 0, 0, 0],
    },
  }));

  let song;
  if (parsedSong) {
    song = parsedSong;
  } else {
    localStorage.setItem("song", defaultSongString);
    song = defaultSong;
  }

  const currentMixString = localStorage.getItem("currentMix");
  let currentMix = currentMixString && JSON.parse(currentMixString);
  const currentTracksString = localStorage.getItem("currentTracks");
  let currentTracks = currentTracksString && JSON.parse(currentTracksString);

  if (!currentMix) {
    currentMix = defaultCurrentMix;
    localStorage.setItem("currentMix", JSON.stringify(currentMix));
  }

  if (!currentTracks) {
    currentTracks = defaultCurrentTracks;
    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
  }

  return [song, currentMix, currentTracks];
}

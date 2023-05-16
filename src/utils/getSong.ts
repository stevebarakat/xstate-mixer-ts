import type { Song } from "../types/global";

export function getSong(defaultSong: Song) {
  const defaultSongString = JSON.stringify(defaultSong);
  const songString = localStorage.getItem("song");

  const song =
    (songString && JSON.parse(songString)) ??
    localStorage.setItem("song", defaultSongString);

  const currentMixString = localStorage.getItem("currentMix");
  let currentMix = currentMixString && JSON.parse(currentMixString);
  const currentTracksString = localStorage.getItem("currentTracks");
  let currentTracks = currentTracksString && JSON.parse(currentTracksString);

  if (!currentMix) {
    currentMix = {
      mainVolume: -32,
      busVolumes: [-32, -32],
      currentBusFx: {
        bus1fx1: "nofx",
        bus1fx2: "nofx",
        bus2fx1: "nofx",
        bus2fx2: "nofx",
      },
      currentTrackFx: ["nofx", "nofx"],
      busPanelsOpen: [true, true],
      busPanelsPosition: { x: 0, y: 0 },
      busPanelsSize: { width: "325px", height: "auto" },
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
    localStorage.setItem("currentMix", JSON.stringify(currentMix));
  }

  if (!currentTracks) {
    currentTracks = defaultSong.tracks.map((track) => ({
      name: track.name,
      path: track.path,
      volume: -32,
      pan: 0,
      mute: false,
      solo: false,
      fx: ["nofx", "nofx"],
    }));
    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
  }

  return [song, currentMix, currentTracks];
}

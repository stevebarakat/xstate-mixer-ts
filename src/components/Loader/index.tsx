import { MixerMachineContext } from "../../App";
import { loaded } from "tone";
import type { Song } from "../../types/global";
import "./loader.css";

type Props = {
  song: Song;
};
const Spinner = ({ song }: Props) => {
  const [, send] = MixerMachineContext.useActor();
  loaded().then(() => send("LOADED"));

  return (
    <div className="loader">
      <span>
        Loading: {song.artist} - {song.title}
      </span>
      <div className="spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default Spinner;

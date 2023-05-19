import { useRef, Fragment } from "react";
import { Reverb, FeedbackDelay } from "tone";
import useChannelStrip from "../hooks/useChannelStrip";
import useBusFx from "../hooks/useBusFx";
import Transport from "./Transport";
import BusPanels from "./Bus/BusPanels";
import TrackPanel from "./TrackPanel";
import Loader from "./Loader";
import SongInfo from "./SongInfo";
import ChannelStrip from "./ChannelStrip";
import Main from "./Main";
import BusChannel from "./Bus/BusChannel";
import { MixerMachineContext } from "../App";
import type { Song } from "../types/global";

type Props = {
  song: Song;
};

export const Mixer = ({ song }: Props) => {
  const [state, send] = MixerMachineContext.useActor();
  const isLoading = MixerMachineContext.useSelector((state) =>
    state.matches("loading")
  );
  const tracks = song.tracks;
  const channels = useChannelStrip({ tracks });

  const [busChannels, busFx, currentBusFx, disabled] = useBusFx();

  const fx = useRef({
    reverb: new Reverb().toDestination(),
    delay: new FeedbackDelay().toDestination(),
  });

  return isLoading ? (
    <Loader song={song} />
  ) : (
    <div className="mixer">
      <SongInfo song={song} />
      <BusPanels
        busFx={busFx}
        currentBusFx={currentBusFx}
        disabled={disabled}
      />
      <div className="channels">
        {tracks.map((track, i) => {
          console.log(
            "state.context.currentTrackFx",
            state.context.currentTrackFx[i]
          );
          const disabled = state.context.currentTrackFx[i].every(
            (fx) => fx === "nofx"
          );

          return (
            <Fragment key={track.id}>
              {!disabled && (
                <TrackPanel
                  trackIndex={i}
                  disabled={disabled}
                  currentTrackFx={state.context.currentTrackFx}
                  fx={fx}
                />
              )}
              <ChannelStrip
                trackName={track.name}
                trackIndex={i}
                channels={channels.current}
              />
            </Fragment>
          );
        })}
        {busChannels.current.map((_: void, i: number) => (
          <BusChannel
            key={i}
            busChannels={busChannels}
            busIndex={i}
            disabled={disabled}
          />
        ))}
        <Main />
      </div>
      <Transport song={song} />
    </div>
  );
};

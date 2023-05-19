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
import { shallowEqual } from "@xstate/react";

type Props = {
  song: Song;
};

export const Mixer = ({ song }: Props) => {
  // const [state, send] = MixerMachineContext.useActor();
  // const currentTrackFx = MixerMachineContext.useSelector((state) => {
  //   const { currentTrackFx } = state.context;
  //   return currentTrackFx;
  // }, shallowEqual);

  const reverb = useRef<Reverb | null>(null);
  const delay = useRef<FeedbackDelay | null>(null);
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
          // console.log(".currentTrackFx[i]", currentTrackFx[i]);
          // const disabled = currentTrackFx[i].every((fx) => fx === "nofx");

          return (
            <Fragment key={track.id}>
              {!disabled && (
                <TrackPanel
                  trackIndex={i}
                  disabled={disabled}
                  fx={fx.current}
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

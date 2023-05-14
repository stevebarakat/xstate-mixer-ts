import { useState, useEffect, useRef } from "react";
import { array } from "../utils";
import { Channel, Reverb, FeedbackDelay } from "tone";
import useChannelStrip from "../hooks/useChannelStrip";
import Transport from "./Transport";
import BusPanels from "./BusPanels";
import Loader from "./Loader";
import ChannelStrip from "./ChannelStrip";
import MainVolume from "./MainVolume";
import Bus from "./Bus";
import { MixerMachineContext } from "../App";
import { shallowEqual } from "@xstate/react";
import type { Song } from "../types/global";

type Props = {
  song: Song;
};

export const Mixer = ({ song }: Props) => {
  const isLoading = MixerMachineContext.useSelector(
    (state) => state.value === "loading"
  );
  const tracks = song.tracks;
  const [channels] = useChannelStrip({ tracks });

  const busChannels = useRef([new Channel(), new Channel()]);

  const fx = useRef({
    reverb1: new Reverb().toDestination(),
    delay1: new FeedbackDelay().toDestination(),
    reverb2: new Reverb().toDestination(),
    delay2: new FeedbackDelay().toDestination(),
  });

  const busFx = MixerMachineContext.useSelector((state) => {
    const { busFx } = state.context;
    return busFx;
  }, shallowEqual);

  const [disabled, setDisabled] = useState({
    panel1: busFx.bus1fx1 === "nofx" && busFx.bus1fx2 === "nofx",
    panel2: busFx.bus2fx1 === "nofx" && busFx.bus2fx2 === "nofx",
  });

  useEffect(() => {
    setDisabled({
      panel1: busFx.bus1fx1 === "nofx" && busFx.bus1fx2 === "nofx",
      panel2: busFx.bus2fx1 === "nofx" && busFx.bus2fx2 === "nofx",
    });
  }, [busFx]);

  useEffect(() => {
    array(2).forEach((_, i) => {
      switch (busFx[`bus${i + 1}fx${i + 1}`]) {
        case "nofx1":
          busChannels.current[0].disconnect();
          busChannels.current[0] = new Channel();
          break;
        case "nofx2":
          busChannels.current[1].disconnect();
          busChannels.current[1] = new Channel();
          break;
        case "reverb1":
          busChannels.current[0].disconnect();
          busChannels.current[0] = new Channel().connect(fx.current.reverb1);
          busChannels.current[0].receive("reverb1");
          break;
        case "reverb2":
          busChannels.current[1].disconnect();
          busChannels.current[1] = new Channel().connect(fx.current.reverb2);
          busChannels.current[1].receive("reverb2");
          break;
        case "delay1":
          busChannels.current[0].disconnect();
          busChannels.current[0] = new Channel().connect(fx.current.delay1);
          busChannels.current[0].receive("delay1");
          break;
        case "delay2":
          busChannels.current[1].disconnect();
          busChannels.current[1] = new Channel().connect(fx.current.delay2);
          busChannels.current[1].receive("delay2");
          break;
        default:
          break;
      }
    });
  }, [busFx]);

  return isLoading ? (
    <Loader song={song} />
  ) : (
    <div className="mixer">
      <div>
        {song.artist} - {song.title}
      </div>
      <BusPanels fx={fx.current} busFx={busFx} disabled={disabled} />

      <div className="channels">
        <div>
          {tracks.map((track, i) => (
            <ChannelStrip
              key={track.path}
              track={track}
              trackIndex={i}
              channel={channels.current[i]}
              channels={channels.current}
            />
          ))}
        </div>
        {busChannels.current.map((_, i) => (
          <Bus
            key={i}
            busChannels={busChannels}
            busIndex={i}
            disabled={disabled}
          />
        ))}
        <MainVolume />
      </div>
      <Transport song={song} />
    </div>
  );
};

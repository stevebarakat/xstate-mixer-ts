import { useEffect, useRef } from "react";
import { array } from "../utils";
import { Channel, Reverb, FeedbackDelay } from "tone";
import useChannelStrip from "../hooks/useChannelStrip";
import Transport from "./Transport";
import Loader from "./Loader";
import ChannelStrip from "./ChannelStrip";
import CloseButton from "./Buttons/CloseButton";
import Reverber from "./Fx/Reverber";
import Delay from "./Fx/Delay";
import MainVolume from "./MainVolume";
import Bus from "./Bus";
import { Rnd } from "react-rnd";
import { MixerMachineContext } from "../App";
import { shallowEqual } from "@xstate/react";
import type { Song } from "../types/global";
import type { ReactNode } from "react";

type Props = {
  song: Song;
};

export const Mixer = ({ song }: Props) => {
  const bpOpen0 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsOpen[0]
  );
  const bpOpen1 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsOpen[1]
  );

  const bpPos0 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsPosition[0]
  );
  const bpPos1 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsPosition[1]
  );

  const bpSize0 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsSize[0]
  );
  const bpSize1 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelsSize[1]
  );

  const { send } = MixerMachineContext.useActorRef();
  const busFx = MixerMachineContext.useSelector((state) => {
    const { busFx } = state.context;
    return busFx;
  }, shallowEqual);

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

  const currentMixString = localStorage.getItem("currentMix");
  const currentMix = currentMixString && JSON.parse(currentMixString);

  useEffect(() => {
    array(2).forEach((_, i) => {
      array(2).forEach((_, j) => {
        switch (currentMix.busFx[`bus${i + 1}fx${j + 1}`]) {
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
    });
  }, [currentMix.busFx]);

  return isLoading ? (
    <Loader song={song} />
  ) : (
    <div className="mixer">
      <div>
        {song.artist} - {song.title}
      </div>
      {bpOpen0 && (
        <Rnd
          className="fx-panel"
          position={bpPos0}
          onDragStop={(e, d) => {
            send({
              type: "SAVE_BUS_PANELS_POSITION",
              busIndex: 0,
              position: { x: d.x, y: d.y },
            });
          }}
          size={bpSize0}
          minWidth="200px"
          onResizeStop={(e, direction, ref, delta, position) => {
            send({
              type: "SAVE_BUS_PANELS_SIZE",
              busIndex: 0,
              size: { width: ref.style.width, height: ref.style.height },
            });
          }}
          cancel="input"
        >
          <CloseButton
            id="bus-panel-1"
            onClick={() => {
              send({
                type: "TOGGLE_BUS_PANEL",
                busIndex: 0,
              });
            }}
          >
            X
          </CloseButton>

          {array(2).map((_, i) => {
            let currentFx: ReactNode | null = null;
            switch (busFx[`bus1fx${i + 1}`]) {
              case "reverb1":
                currentFx = (
                  <Reverber
                    key={`bus1reverb${i}`}
                    reverb={fx.current.reverb1}
                    busIndex={0}
                    fxIndex={0}
                  />
                );
                break;
              case "delay1":
                currentFx = (
                  <Delay
                    key={`bus1delay${i}`}
                    delay={fx.current.delay1}
                    busIndex={0}
                    fxIndex={0}
                  />
                );
                break;
              default:
                break;
            }
            return currentFx;
          })}
        </Rnd>
      )}
      {bpOpen1 && (
        <Rnd
          className="fx-panel"
          position={bpPos1}
          onDragStop={(e, d) => {
            send({
              type: "SAVE_BUS_PANELS_POSITION",
              busIndex: 1,
              position: { x: d.x, y: d.y },
            });
          }}
          size={bpSize1}
          minWidth="200px"
          onResizeStop={(e, direction, ref, delta, position) => {
            send({
              type: "SAVE_BUS_PANELS_SIZE",
              busIndex: 1,
              size: { width: ref.style.width, height: ref.style.height },
            });
          }}
          cancel="input"
        >
          <CloseButton
            id="bus-panel-1"
            onClick={() => {
              send({
                type: "TOGGLE_BUS_PANEL",
                busIndex: 1,
              });
            }}
          >
            X
          </CloseButton>

          {array(2).map((_, i) => {
            let currentFx: ReactNode | null = null;
            switch (busFx[`bus2fx${i + 1}`]) {
              case "reverb2":
                currentFx = (
                  <Reverber
                    key={`bus2reverb${i}`}
                    reverb={fx.current.reverb2}
                    busIndex={1}
                    fxIndex={1}
                  />
                );
                break;
              case "delay2":
                currentFx = (
                  <Delay
                    key={`bus2delay${i}`}
                    delay={fx.current.delay2}
                    busIndex={1}
                    fxIndex={1}
                  />
                );
                break;
              default:
                break;
            }
            return currentFx;
          })}
        </Rnd>
      )}
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
          <Bus key={i} busChannels={busChannels} busIndex={i} />
        ))}
        <MainVolume />
      </div>
      <Transport song={song} />
    </div>
  );
};

import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Sends from "./Sends";
import Fader from "./Fader";
import TrackLabel from "./TrackLabel";
import TrackFxMenu from "./TrackFxMenu";
// import useTrackFx from "../hooks/useTrackFx";
import type { Channel } from "tone";

type Props = {
  trackName: string;
  trackIndex: number;
  channels: Channel[];
};

function ChannelStrip({ trackName, trackIndex, channels }: Props) {
  const channel = channels[trackIndex];
  // const [trackFx, currentTrackFx] = useTrackFx(channel, trackIndex);
  return (
    <div className="channel">
      <TrackFxMenu trackIndex={trackIndex} channel={channel} />
      <Sends trackIndex={trackIndex} channels={channels} />
      <Pan trackIndex={trackIndex} channel={channel} />
      <Fader trackIndex={trackIndex} channel={channel} />
      <SoloMute trackIndex={trackIndex} channel={channel} />
      <TrackLabel trackName={trackName} />
    </div>
  );
}

export default ChannelStrip;

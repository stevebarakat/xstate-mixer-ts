import Pan from "./Pan";
import Solo from "./Solo";
import Mute from "./Mute";
import TrackVolume from "./TrackVolume";
import Sends from "./Sends";
import type { Track } from "../types/global";
import type { Channel } from "tone";

type Props = {
  track: Track;
  trackIndex: number;
  channels: Channel[];
};

function ChannelStrip({ track, trackIndex, channels }: Props) {
  const channel = channels[trackIndex];
  return (
    <div>
      <div className="channel">
        <Sends trackIndex={trackIndex} channels={channels} />
        <Pan trackIndex={trackIndex} channel={channel} />
        <TrackVolume trackIndex={trackIndex} channel={channel} />
        <div className="chan-strip-btn">
          <Solo trackIndex={trackIndex} channel={channel} />
          <Mute trackIndex={trackIndex} channel={channel} />
        </div>
        <div className="track-label">{track.name}</div>
      </div>
    </div>
  );
}

export default ChannelStrip;

import Pan from "./Pan";
import Solo from "./Solo";
import Mute from "./Mute";
import TrackVolume from "./TrackVolume";
import { Destination } from "tone";
import type { Track } from "../types/global";
import type { Channel } from "tone";

type Props = {
  track: Track;
  trackIndex: number;
  channel: Channel;
  channels: Channel[];
};

function ChannelStrip({ track, trackIndex, channel, channels }: Props) {
  return (
    <div>
      <div className="bus-btn">
        <input
          id={`bus1${trackIndex}`}
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              channels[trackIndex].send("reverb1");
              channels[trackIndex].send("delay1");
            } else {
              channels[trackIndex].disconnect();
              channels[trackIndex].connect(Destination);
            }
          }}
        />
        <label htmlFor={`bus1${trackIndex}`}>1</label>
        <input
          id={`bus2${trackIndex}`}
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              channels[trackIndex].send("reverb2");
              channels[trackIndex].send("delay2");
            } else {
              channels[trackIndex].disconnect();
              channels[trackIndex].connect(Destination);
            }
          }}
        />
        <label htmlFor={`bus2${trackIndex}`}>2</label>
      </div>
      <div className="channel">
        <div className="chan-strip-btn">
          <Solo trackIndex={trackIndex} channel={channel} />
          <Mute trackIndex={trackIndex} channel={channel} />
        </div>
        <Pan trackIndex={trackIndex} channel={channel} />
        <TrackVolume trackIndex={trackIndex} channel={channel} />
        <span>{track.name}</span>
      </div>
    </div>
  );
}

export default ChannelStrip;

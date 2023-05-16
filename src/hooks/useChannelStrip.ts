import { useEffect, useRef } from "react";
import { Channel, Player, Transport as t, Destination } from "tone";
import type { Track } from "../types/global";

type Props = {
  tracks: Track[];
};

function useChannelStrip({ tracks }: Props) {
  const channels = useRef<Channel[] | []>([]);
  const players = useRef<Player[] | []>([]);

  useEffect(() => {
    tracks.forEach((_, i) => {
      channels.current = [...channels.current, new Channel()];
      players.current = [...players.current, new Player(tracks[i].path)];
    });

    players.current?.forEach((player, i) => {
      channels.current &&
        player.chain(channels.current[i]).toDestination().sync().start("+0.5");
    });

    return () => {
      t.stop();
      players.current?.forEach((player, i) => {
        player.disconnect();
        channels.current && channels.current[i].disconnect();
      });
      players.current = [];
      channels.current = [];
    };
  }, [tracks]);

  return channels;
}

export default useChannelStrip;

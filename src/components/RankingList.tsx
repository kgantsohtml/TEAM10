import { Track } from "@/types";
import { RankingRow } from "./RankingRow";
import styles from "./RankingList.module.css";

type Props = {
  tracks: Track[];
  onAirCode?: string;
};

export function RankingList(props: Props) {
  return (
    <div className={styles.list}>
      {props.tracks.map(function (track, index) {
        const rank = index + 1;
        return (
          <RankingRow
            key={track.id}
            rank={rank}
            track={track}
            onAir={props.onAirCode === track.code}
          />
        );
      })}
    </div>
  );
}

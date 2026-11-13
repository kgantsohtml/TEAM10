import { Track } from "@/types";
import { TrackTile } from "./TrackTile";
import styles from "./TrackGrid.module.css";

type Props = {
  tracks: Track[];
  onAirCode?: string;
};

export function TrackGrid(props: Props) {
  return (
    <div className={styles.grid}>
      {props.tracks.map(function (track) {
        return (
          <TrackTile
            key={track.id}
            track={track}
            onAir={props.onAirCode === track.code}
          />
        );
      })}
    </div>
  );
}

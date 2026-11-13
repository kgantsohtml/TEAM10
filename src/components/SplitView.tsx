import { Track } from "@/types";
import { SongPanel } from "./SongPanel";
import { ArtistPanel } from "./ArtistPanel";
import styles from "./SplitView.module.css";

type Props = {
  track: Track;
  otherTracks: Track[];
  totalLikes: number;
  bestRankLabel: string;
  onAirCode?: string;
};

export function SplitView(props: Props) {
  return (
    <div className={styles.split}>
      <SongPanel track={props.track} />
      <ArtistPanel
        track={props.track}
        otherTracks={props.otherTracks}
        totalLikes={props.totalLikes}
        bestRankLabel={props.bestRankLabel}
        onAirCode={props.onAirCode}
      />
    </div>
  );
}

import Link from "next/link";
import { Track } from "@/types";
import { TrackGrid } from "./TrackGrid";
import styles from "./SplitView.module.css";

type Props = {
  track: Track;
  otherTracks: Track[];
  totalLikes: number;
  bestRankLabel: string;
  onAirCode?: string;
};

export function ArtistPanel(props: Props) {
  const track = props.track;

  return (
    <section className={styles.panel}>
      <div className={styles.artistName}>{track.credit_name}</div>
      {track.credit_link ? (
        <a
          href={track.credit_link}
          className={styles.social}
          target="_blank"
          rel="noreferrer"
        >
          LINK
        </a>
      ) : null}
      <div className={styles.stat}>{props.totalLikes} LIKES</div>
      <div className={styles.stat}>{props.bestRankLabel}</div>

      <div className={styles.otherLabel}>OTHER</div>
      <TrackGrid tracks={props.otherTracks} onAirCode={props.onAirCode} />

      <Link href={"/artist/" + track.artist_slug} className={styles.artistLink}>
        ARTIST
      </Link>
    </section>
  );
}

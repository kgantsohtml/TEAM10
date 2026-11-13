import Link from "next/link";
import { Track } from "@/types";
import { Waveform } from "./Waveform";
import styles from "./RankingRow.module.css";

type Props = {
  rank: number;
  track: Track;
  onAir?: boolean;
};

export function RankingRow(props: Props) {
  const track = props.track;
  let rowClass = styles.row;
  if (props.rank % 2 === 0) {
    rowClass += " " + styles.stripe;
  }
  if (props.rank === 1) {
    rowClass += " " + styles.first;
  }
  if (props.onAir) {
    rowClass += " " + styles.onAir;
  }

  return (
    <Link href={"/mix/" + track.code} className={rowClass}>
      <div className={styles.rank}>{props.rank}</div>
      <img
        src={track.cover_url}
        alt=""
        className={styles.cover}
        width={48}
        height={48}
      />
      <div className={styles.info}>
        <div className={styles.title}>{track.title}</div>
        <div className={styles.sub}>
          {track.credit_name} · {track.feeling}
        </div>
      </div>
      <div className={styles.likes}>{track.likes_this_month}</div>
      <div className={styles.wave}>
        <Waveform values={track.waveform} />
      </div>
    </Link>
  );
}

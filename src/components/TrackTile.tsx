import Link from "next/link";
import { Track } from "@/types";
import styles from "./TrackTile.module.css";

type Props = {
  track: Track;
  onAir?: boolean;
};

function shortTitle(title: string): string {
  if (title.length <= 18) return title;
  return title.slice(0, 16) + "…";
}

export function TrackTile(props: Props) {
  const track = props.track;
  const codeClass = props.onAir
    ? styles.code + " " + styles.onAir
    : styles.code;

  return (
    <Link href={"/mix/" + track.code} className={styles.tile}>
      <img
        src={track.cover_url}
        alt=""
        className={styles.cover}
        width={400}
        height={400}
      />
      <div className={codeClass}>{track.code}</div>
      <div className={styles.title}>{shortTitle(track.title)}</div>
      <div className={styles.hover}>
        <div>{track.title}</div>
        <div className={styles.meta}>{track.feeling}</div>
        <div className={styles.meta}>{track.likes} LIKES</div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { Pick, Track } from "@/types";
import { SpotifyEmbed } from "./SpotifyEmbed";
import { AppleMusicEmbed } from "./AppleMusicEmbed";
import styles from "./PickTile.module.css";

type Props = {
  pick: Pick;
  track?: Track;
  onAir?: boolean;
};

export function PickTile(props: Props) {
  const pick = props.pick;

  if (pick.source === "BIN" && props.track) {
    const track = props.track;
    const codeClass = props.onAir
      ? styles.code + " " + styles.onAir
      : styles.code;

    return (
      <div className={styles.tile}>
        <Link href={"/mix/" + track.code} className={styles.binLink}>
          <img
            src={track.cover_url}
            alt=""
            className={styles.cover}
            width={400}
            height={400}
          />
          <div className={codeClass}>{track.code}</div>
          <div className={styles.title}>{track.title}</div>
        </Link>
        <div className={styles.tags}>
          <span className={styles.tag}>BIN</span>
          <span className={styles.by}>PICKED BY {pick.picked_by}</span>
        </div>
        {pick.note ? <div className={styles.note}>{pick.note}</div> : null}
      </div>
    );
  }

  return (
    <div className={styles.tile + " " + styles.external}>
      <div className={styles.tags}>
        <span className={styles.tag}>{pick.source}</span>
        <span className={styles.by}>PICKED BY {pick.picked_by}</span>
      </div>
      <div className={styles.externalLabel}>CURATED · EXTERNAL</div>
      {pick.source === "SPOTIFY" ? (
        <SpotifyEmbed url={pick.external_url} />
      ) : (
        <AppleMusicEmbed url={pick.external_url} />
      )}
      {pick.note ? <div className={styles.note}>{pick.note}</div> : null}
    </div>
  );
}

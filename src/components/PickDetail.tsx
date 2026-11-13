"use client";

import { Waveform } from "./Waveform";
import { SpotifyEmbed } from "./SpotifyEmbed";
import { AppleMusicEmbed } from "./AppleMusicEmbed";
import { COVER_PLACEHOLDER, PickDisplay } from "@/lib/pick-display";
import styles from "./PickDetail.module.css";

type Props = {
  display: PickDisplay;
};

export function PickDetail(props: Props) {
  const d = props.display;
  const cover = d.cover_url || COVER_PLACEHOLDER;

  return (
    <aside className={styles.panel}>
      <img
        src={cover}
        alt=""
        className={styles.cover}
        width={200}
        height={200}
      />

      <div className={styles.sourceRow}>
        <span className={styles.source}>{d.source}</span>
        <span className={styles.by}>PICKED BY {d.picked_by}</span>
      </div>

      <h2 className={styles.title}>{d.title}</h2>
      <div className={styles.artist}>{d.artist}</div>

      {d.note ? <p className={styles.note}>{d.note}</p> : null}

      <div className={styles.player}>
        {d.source === "BIN" && d.track ? (
          <>
            <Waveform values={d.track.waveform} />
            <audio
              controls
              controlsList="nodownload"
              onContextMenu={function (e) {
                e.preventDefault();
              }}
              className={styles.audio}
            />
          </>
        ) : null}

        {d.source === "SPOTIFY" ? (
          <>
            <SpotifyEmbed url={d.external_url} />
            <a
              href={d.external_url}
              className={styles.open}
              target="_blank"
              rel="noreferrer"
            >
              OPEN IN SPOTIFY
            </a>
          </>
        ) : null}

        {d.source === "APPLE" ? (
          <>
            <AppleMusicEmbed url={d.external_url} />
            <a
              href={d.external_url}
              className={styles.open}
              target="_blank"
              rel="noreferrer"
            >
              OPEN IN APPLE
            </a>
          </>
        ) : null}
      </div>
    </aside>
  );
}

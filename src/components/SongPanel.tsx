"use client";

import { useState } from "react";
import { Track } from "@/types";
import { Waveform } from "./Waveform";
import { LikeButton } from "./LikeButton";
import { DropButton } from "./DropButton";
import styles from "./SplitView.module.css";

type Props = {
  track: Track;
};

export function SongPanel(props: Props) {
  const track = props.track;
  const [vote, setVote] = useState("");

  return (
    <section className={styles.panel}>
      <img
        src={track.cover_url}
        alt=""
        className={styles.cover}
        width={480}
        height={480}
      />
      <div className={styles.code}>{track.code}</div>
      <h1 className={styles.title}>{track.title}</h1>
      <div className={styles.feeling}>{track.feeling}</div>
      {track.description ? (
        <p className={styles.description}>{track.description}</p>
      ) : null}

      <div className={styles.player}>
        <Waveform values={track.waveform} />
        <audio
          controls
          controlsList="nodownload"
          onContextMenu={function (e) {
            e.preventDefault();
          }}
          className={styles.audio}
        >
          {/* Phase 1: no real audio URL yet */}
        </audio>
      </div>

      <div className={styles.votes}>
        <LikeButton
          active={vote === "like"}
          onClick={function () {
            setVote(vote === "like" ? "" : "like");
          }}
        />
        <DropButton
          active={vote === "drop"}
          onClick={function () {
            setVote(vote === "drop" ? "" : "drop");
          }}
        />
        {track.download_allowed ? (
          <span className={styles.downloadNote}>DOWNLOAD ON</span>
        ) : (
          <span className={styles.downloadNote}>STREAM ONLY</span>
        )}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Track } from "@/types";
import { LikeButton } from "./LikeButton";
import { DropButton } from "./DropButton";
import styles from "./NowPlayingStrip.module.css";

type Props = {
  track: Track;
  listenerCount: number;
};

export function NowPlayingStrip(props: Props) {
  const track = props.track;
  const [muted, setMuted] = useState(true);
  const [vote, setVote] = useState("");

  return (
    <div className={styles.strip} role="region" aria-label="Now playing">
      <Link href={"/mix/" + track.code} className={styles.main}>
        <img
          src={track.cover_url}
          alt=""
          className={styles.cover}
          width={56}
          height={56}
        />
        <div className={styles.meta}>
          <div className={styles.code}>{track.code}</div>
          <div className={styles.title}>{track.title}</div>
          <div className={styles.credit}>{track.credit_name}</div>
        </div>
      </Link>

      <div className={styles.actions}>
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
        <span className={styles.listeners} title="listeners">
          {props.listenerCount}
        </span>
        <button
          type="button"
          className={styles.mute}
          onClick={function () {
            setMuted(!muted);
          }}
          title={muted ? "play" : "mute"}
          aria-label={muted ? "play" : "mute"}
        >
          {muted ? "PLAY" : "MUTE"}
        </button>
      </div>
    </div>
  );
}

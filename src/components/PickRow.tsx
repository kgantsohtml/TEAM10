"use client";

import Link from "next/link";
import { COVER_PLACEHOLDER, PickDisplay } from "@/lib/pick-display";
import styles from "./PickRow.module.css";

type Props = {
  display: PickDisplay;
  selected: boolean;
  stripe: boolean;
  // Desktop: select in place. Mobile: navigate to /waste/[id].
  href?: string;
  onSelect?: () => void;
};

export function PickRow(props: Props) {
  const d = props.display;
  const cover = d.cover_url || COVER_PLACEHOLDER;

  let rowClass = styles.row;
  if (props.stripe) rowClass += " " + styles.stripe;
  if (props.selected) rowClass += " " + styles.selected;

  const titleClass = d.on_air
    ? styles.title + " " + styles.onAir
    : styles.title;

  const muted =
    d.artist + (d.note ? ' · "' + d.note + '"' : "");

  const inner = (
    <>
      <img
        src={cover}
        alt=""
        className={styles.cover}
        width={44}
        height={44}
      />
      <div className={styles.info}>
        <div className={titleClass}>{d.title}</div>
        <div className={styles.meta}>{muted}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.source}>{d.source}</div>
        <div className={styles.by}>PICKED BY {d.picked_by}</div>
      </div>
    </>
  );

  if (props.href) {
    return (
      <Link href={props.href} className={rowClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={rowClass} onClick={props.onSelect}>
      {inner}
    </button>
  );
}

"use client";

import styles from "./VoteButtons.module.css";

type Props = {
  active?: boolean;
  onClick?: () => void;
};

export function DropButton(props: Props) {
  const className = props.active
    ? styles.btn + " " + styles.dropActive
    : styles.btn;

  return (
    <button
      type="button"
      className={className}
      onClick={props.onClick}
      title="drop"
      aria-label="drop"
    >
      <span aria-hidden="true">✕</span>
      <span className="sr-only">drop</span>
    </button>
  );
}

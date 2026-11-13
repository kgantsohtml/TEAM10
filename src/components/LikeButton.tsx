"use client";

import styles from "./VoteButtons.module.css";

type Props = {
  active?: boolean;
  onClick?: () => void;
};

export function LikeButton(props: Props) {
  const className = props.active
    ? styles.btn + " " + styles.likeActive
    : styles.btn;

  return (
    <button
      type="button"
      className={className}
      onClick={props.onClick}
      title="like"
      aria-label="like"
    >
      <span aria-hidden="true">♥</span>
      <span className="sr-only">like</span>
    </button>
  );
}

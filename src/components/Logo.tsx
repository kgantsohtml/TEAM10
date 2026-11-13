import Link from "next/link";
import styles from "./Logo.module.css";

export function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label="BASS BIN home">
      BASS BIN
    </Link>
  );
}

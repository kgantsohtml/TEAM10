import Link from "next/link";
import { Logo } from "./Logo";
import styles from "./TopBar.module.css";

export function TopBar() {
  return (
    <header className={styles.bar}>
      <Logo />
      <nav className={styles.nav} aria-label="Main">
        <Link href="/">BIN</Link>
        <Link href="/ranking">RANKING</Link>
        <Link href="/waste">WASTE</Link>
        <Link href="/upload">UPLOAD</Link>
      </nav>
    </header>
  );
}

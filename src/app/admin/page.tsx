import { AdminInvite } from "@/components/AdminInvite";
import { DUMMY_TRACKS } from "@/data/dummy-tracks";
import { DUMMY_PICKS } from "@/data/dummy-picks";
import styles from "./admin.module.css";

export default function AdminPage() {
  return (
    <main className="page">
      <h1 className="page-title">ADMIN</h1>
      <p className={styles.note}>OWNER TOOLS · PHASE 1 UI ONLY</p>

      <section className={styles.section}>
        <h2 className={styles.h2}>INVITE</h2>
        <AdminInvite />
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>MANAGERS</h2>
        <ul className={styles.list}>
          <li>OWNER</li>
          <li>MANAGER A · REMOVE</li>
          <li>MANAGER B · REMOVE</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>TRACKS</h2>
        <ul className={styles.list}>
          {DUMMY_TRACKS.slice(0, 8).map(function (t) {
            return (
              <li key={t.id}>
                {t.code} {t.title} · DELETE
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>PICKS</h2>
        <ul className={styles.list}>
          {DUMMY_PICKS.map(function (p) {
            return (
              <li key={p.id}>
                {p.source} · {p.picked_by} · DELETE
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

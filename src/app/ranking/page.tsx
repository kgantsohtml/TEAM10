import { RankingList } from "@/components/RankingList";
import { DUMMY_TRACKS, ON_AIR_CODE } from "@/data/dummy-tracks";
import Link from "next/link";

export default function RankingPage() {
  const ranked = DUMMY_TRACKS.slice().sort(function (a, b) {
    return b.likes_this_month - a.likes_this_month;
  });

  // Brief: month label + resets in N days (Phase 1 static).
  const monthLabel = "OCT 2026";
  const resetsIn = 8;

  return (
    <main className="page">
      <h1 className="page-title">BIN RANKING</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "12px",
          fontSize: "12px",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        <span>{monthLabel}</span>
        <span style={{ color: "var(--muted)" }}>RESETS IN {resetsIn} DAYS</span>
        <Link href="/ranking/archive" style={{ borderBottom: "1px solid #000" }}>
          ARCHIVE
        </Link>
      </div>
      <RankingList tracks={ranked} onAirCode={ON_AIR_CODE} />
    </main>
  );
}

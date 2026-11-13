import { RankingList } from "@/components/RankingList";
import { DUMMY_TRACKS, ON_AIR_CODE } from "@/data/dummy-tracks";
import { Track } from "@/types";

type MonthBlock = {
  label: string;
  tracks: Track[];
};

export default function RankingArchivePage() {
  // Phase 1 fake past months (top 10 each). Real data in Phase 4.
  const sep = DUMMY_TRACKS.slice()
    .sort(function (a, b) {
      return b.likes - a.likes;
    })
    .slice(0, 10);

  const aug = DUMMY_TRACKS.slice()
    .sort(function (a, b) {
      return a.likes - b.likes;
    })
    .slice(0, 10);

  const months: MonthBlock[] = [
    { label: "SEP 2026", tracks: sep },
    { label: "AUG 2026", tracks: aug },
  ];

  return (
    <main className="page">
      <h1 className="page-title">ARCHIVE</h1>
      {months.map(function (month) {
        return (
          <section key={month.label} style={{ marginBottom: "32px" }}>
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "14px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              {month.label} · TOP 10
            </h2>
            <RankingList tracks={month.tracks} onAirCode={ON_AIR_CODE} />
          </section>
        );
      })}
    </main>
  );
}

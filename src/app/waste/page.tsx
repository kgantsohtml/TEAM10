import { WasteBrowser } from "@/components/WasteBrowser";
import { DUMMY_PICKS } from "@/data/dummy-picks";
import { DUMMY_TRACKS, ON_AIR_CODE } from "@/data/dummy-tracks";
import { Track } from "@/types";

export default function WastePage() {
  const tracksById: Record<string, Track> = {};
  DUMMY_TRACKS.forEach(function (t) {
    tracksById[t.id] = t;
  });

  return (
    <main className="page">
      <h1 className="page-title">WASTE MANAGEMENT</h1>
      <WasteBrowser
        picks={DUMMY_PICKS}
        tracksById={tracksById}
        onAirCode={ON_AIR_CODE}
      />
    </main>
  );
}

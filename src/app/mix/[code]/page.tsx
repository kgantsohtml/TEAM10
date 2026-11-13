import { notFound } from "next/navigation";
import { SplitView } from "@/components/SplitView";
import {
  getTrackByCode,
  getTracksByArtist,
  ON_AIR_CODE,
} from "@/data/dummy-tracks";

type Props = {
  params: Promise<{ code: string }>;
};

export default async function MixPage(props: Props) {
  const params = await props.params;
  const track = getTrackByCode(params.code);
  if (!track) notFound();

  const artistTracks = getTracksByArtist(track.artist_slug);
  const others = artistTracks.filter(function (t) {
    return t.id !== track.id;
  });

  let totalLikes = 0;
  artistTracks.forEach(function (t) {
    totalLikes += t.likes;
  });

  // Phase 1 placeholder for "#1 OCT" style tag (real ranks in Phase 4).
  const bestRankLabel =
    track.likes_this_month >= 20 ? "#1 OCT" : "BEST —";

  return (
    <main className="page">
      <SplitView
        track={track}
        otherTracks={others}
        totalLikes={totalLikes}
        bestRankLabel={bestRankLabel}
        onAirCode={ON_AIR_CODE}
      />
    </main>
  );
}

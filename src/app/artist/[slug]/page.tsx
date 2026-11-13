import { notFound } from "next/navigation";
import { TrackGrid } from "@/components/TrackGrid";
import { getTracksByArtist, ON_AIR_CODE } from "@/data/dummy-tracks";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArtistPage(props: Props) {
  const params = await props.params;
  const tracks = getTracksByArtist(params.slug);
  if (tracks.length === 0) notFound();

  const name = tracks[0].credit_name;
  let totalLikes = 0;
  tracks.forEach(function (t) {
    totalLikes += t.likes;
  });

  const top = tracks.slice().sort(function (a, b) {
    return b.likes_this_month - a.likes_this_month;
  })[0];
  const bestTag =
    top && top.likes_this_month >= 20 ? "#1 OCT" : "BEST —";

  return (
    <main className="page">
      <h1
        style={{
          margin: "0 0 8px",
          fontSize: "28px",
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          fontWeight: 400,
        }}
      >
        {name}
      </h1>
      <p className="page-title">
        {totalLikes} LIKES · {bestTag}
      </p>
      <TrackGrid tracks={tracks} onAirCode={ON_AIR_CODE} />
    </main>
  );
}

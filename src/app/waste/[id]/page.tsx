import Link from "next/link";
import { notFound } from "next/navigation";
import { PickDetail } from "@/components/PickDetail";
import { getPickById } from "@/data/dummy-picks";
import { DUMMY_TRACKS, ON_AIR_CODE } from "@/data/dummy-tracks";
import { getPickDisplay } from "@/lib/pick-display";
import { Track } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WastePickPage(props: Props) {
  const params = await props.params;
  const pick = getPickById(params.id);
  if (!pick) notFound();

  const tracksById: Record<string, Track> = {};
  DUMMY_TRACKS.forEach(function (t) {
    tracksById[t.id] = t;
  });

  const display = getPickDisplay(pick, tracksById, ON_AIR_CODE);

  return (
    <main className="page">
      <Link
        href="/waste"
        style={{
          display: "inline-block",
          marginBottom: "12px",
          fontSize: "12px",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          borderBottom: "1px solid #000",
        }}
      >
        BACK
      </Link>
      <PickDetail display={display} />
    </main>
  );
}

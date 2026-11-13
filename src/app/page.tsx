import { BinBrowser } from "@/components/BinBrowser";
import { DUMMY_TRACKS, ON_AIR_CODE } from "@/data/dummy-tracks";

export default function DumpsterDivingPage() {
  return (
    <main className="page">
      <h1 className="page-title">DUMPSTER DIVING</h1>
      <BinBrowser tracks={DUMMY_TRACKS} onAirCode={ON_AIR_CODE} />
    </main>
  );
}

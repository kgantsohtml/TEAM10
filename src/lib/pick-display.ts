import { Pick, Track } from "@/types";

export type PickDisplay = {
  id: string;
  source: Pick["source"];
  title: string;
  artist: string;
  cover_url: string;
  note: string;
  picked_by: string;
  external_url: string;
  track: Track | undefined;
  on_air: boolean;
};

// Grey music-note placeholder when a pick has no cover.
export const COVER_PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">` +
      `<rect width="200" height="200" fill="#D0D0D0"/>` +
      `<g fill="#000000">` +
      `<circle cx="78" cy="140" r="18"/>` +
      `<circle cx="128" cy="128" r="18"/>` +
      `<rect x="92" y="48" width="10" height="92"/>` +
      `<rect x="142" y="36" width="10" height="92"/>` +
      `<path d="M102 48 L152 36 L152 52 L102 64 Z"/>` +
      `</g></svg>`
  );

export function getPickDisplay(
  pick: Pick,
  tracksById: Record<string, Track>,
  onAirCode: string
): PickDisplay {
  const track = pick.track_id ? tracksById[pick.track_id] : undefined;

  if (pick.source === "BIN" && track) {
    return {
      id: pick.id,
      source: pick.source,
      title: track.title,
      artist: track.credit_name,
      cover_url: track.cover_url,
      note: pick.note,
      picked_by: pick.picked_by,
      external_url: "",
      track: track,
      on_air: track.code === onAirCode,
    };
  }

  return {
    id: pick.id,
    source: pick.source,
    title: pick.title,
    artist: pick.artist,
    cover_url: pick.cover_url,
    note: pick.note,
    picked_by: pick.picked_by,
    external_url: pick.external_url,
    track: undefined,
    on_air: false,
  };
}

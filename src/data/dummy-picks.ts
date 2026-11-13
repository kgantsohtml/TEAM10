import { Pick } from "@/types";

export const DUMMY_PICKS: Pick[] = [
  {
    id: "pick-1",
    source: "BIN",
    track_id: "track-001",
    external_url: "",
    title: "",
    artist: "",
    cover_url: "",
    note: "Opener energy.",
    picked_by: "OWNER",
    created_at: "2026-10-10T10:00:00Z",
  },
  {
    id: "pick-2",
    source: "BIN",
    track_id: "track-007",
    external_url: "",
    title: "",
    artist: "",
    cover_url: "",
    note: "Keeper cut.",
    picked_by: "MANAGER A",
    created_at: "2026-10-12T10:00:00Z",
  },
  {
    id: "pick-3",
    source: "SPOTIFY",
    track_id: "",
    external_url: "https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl",
    title: "CUT LOOSE",
    artist: "STUDIO LINK",
    cover_url: "",
    note: "External only.",
    picked_by: "OWNER",
    created_at: "2026-10-14T10:00:00Z",
  },
  {
    id: "pick-4",
    source: "APPLE",
    track_id: "",
    external_url:
      "https://music.apple.com/us/album/example/1440764762?i=1440764763",
    title: "NIGHT SHIFT EDIT",
    artist: "PRESS GANG",
    cover_url: "",
    note: "Curated link.",
    picked_by: "MANAGER A",
    created_at: "2026-10-15T10:00:00Z",
  },
  {
    id: "pick-5",
    source: "BIN",
    track_id: "track-015",
    external_url: "",
    title: "",
    artist: "",
    cover_url: "",
    note: "After hours.",
    picked_by: "MANAGER B",
    created_at: "2026-10-18T10:00:00Z",
  },
  {
    id: "pick-6",
    source: "BIN",
    track_id: "track-023",
    external_url: "",
    title: "",
    artist: "",
    cover_url: "",
    note: "Freight heat.",
    picked_by: "OWNER",
    created_at: "2026-10-20T10:00:00Z",
  },
];

export function getPickById(id: string): Pick | undefined {
  return DUMMY_PICKS.find(function (p) {
    return p.id === id;
  });
}

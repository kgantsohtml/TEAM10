// Simple types matching the brief data model (section 7).

export type TrackStatus = "active" | "binned" | "removed";

export type Track = {
  id: string;
  code: string;
  title: string;
  description: string;
  feeling: string;
  credit_name: string;
  credit_link: string;
  artist_slug: string;
  cover_url: string;
  duration_sec: number;
  waveform: number[];
  download_allowed: boolean;
  status: TrackStatus;
  likes: number;
  drops: number;
  likes_this_month: number;
  created_at: string;
};

export type PickSource = "BIN" | "SPOTIFY" | "APPLE";

export type Pick = {
  id: string;
  source: PickSource;
  track_id: string;
  external_url: string;
  // For SPOTIFY / APPLE (and optional overrides). BIN usually uses the track.
  title: string;
  artist: string;
  cover_url: string;
  note: string;
  picked_by: string;
  created_at: string;
};

export type SortMode = "newest" | "most_liked" | "random";

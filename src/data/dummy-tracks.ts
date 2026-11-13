import { Track } from "@/types";
import { toArtistSlug } from "@/lib/slug";
import { makePlaceholderWaveform } from "@/lib/waveform";

// Solid colour covers for Phase 1 (no real art files yet).
const COVERS = [
  "#1a1a1a",
  "#2d2d2d",
  "#111111",
  "#3a3a3a",
  "#0d0d0d",
  "#222222",
  "#181818",
  "#2a2a2a",
];

function coverDataUrl(hex: string, code: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">` +
    `<rect width="400" height="400" fill="${hex}"/>` +
    `<text x="20" y="380" fill="#F1F1F1" font-family="Impact,sans-serif" font-size="28">${code}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

type Seed = {
  title: string;
  feeling: string;
  credit: string;
  likes: number;
  drops: number;
  monthLikes: number;
  link?: string;
  description?: string;
};

const SEEDS: Seed[] = [
  { title: "BASEMENT CUT 01", feeling: "3am drive", credit: "K. GANT", likes: 42, drops: 2, monthLikes: 18, description: "Late room take. No edits." },
  { title: "WAREHOUSE LOOP", feeling: "dry heat", credit: "VOID ROOM", likes: 31, drops: 4, monthLikes: 12 },
  { title: "DUMPSTER TAPE A", feeling: "rust", credit: "BIN CREW", likes: 27, drops: 1, monthLikes: 9 },
  { title: "UNRELEASED 014", feeling: "fog", credit: "LOW SIGNAL", likes: 55, drops: 3, monthLikes: 22, link: "https://instagram.com" },
  { title: "CRATE DIG MIX", feeling: "dusty", credit: "ANALOGUE KID", likes: 19, drops: 0, monthLikes: 7 },
  { title: "NIGHT SHIFT", feeling: "cold floor", credit: "SHIFT WORK", likes: 38, drops: 5, monthLikes: 14 },
  { title: "ACID BIN EDIT", feeling: "sharp", credit: "GREEN ROOM", likes: 61, drops: 2, monthLikes: 28 },
  { title: "LOADING DOCK", feeling: "diesel", credit: "DOCK HANDS", likes: 14, drops: 1, monthLikes: 4 },
  { title: "STATIC HOUR", feeling: "empty", credit: "NO STATION", likes: 23, drops: 6, monthLikes: 8 },
  { title: "CONCRETE PRESS", feeling: "hard", credit: "PRESS GANG", likes: 47, drops: 2, monthLikes: 16 },
  { title: "OFFCUTS VOL 2", feeling: "raw", credit: "OFFCUTS", likes: 12, drops: 0, monthLikes: 3 },
  { title: "BIN LINER", feeling: "sticky", credit: "LINER NOTES", likes: 33, drops: 4, monthLikes: 11 },
  { title: "GRID LOCK", feeling: "tight", credit: "GRID UNIT", likes: 29, drops: 1, monthLikes: 10 },
  { title: "TAPE HISS", feeling: "warm hiss", credit: "HISS LAB", likes: 18, drops: 2, monthLikes: 5 },
  { title: "AFTER HOURS", feeling: "closed", credit: "SHUTTERS", likes: 51, drops: 3, monthLikes: 20 },
  { title: "PALLET JACK", feeling: "heavy", credit: "FLOOR TEAM", likes: 9, drops: 0, monthLikes: 2 },
  { title: "SKIP MIX", feeling: "fast cut", credit: "SKIP CREW", likes: 36, drops: 7, monthLikes: 13 },
  { title: "METAL SHELF", feeling: "clang", credit: "SHELF LIFE", likes: 21, drops: 1, monthLikes: 6 },
  { title: "BACK ALLEY", feeling: "wet asphalt", credit: "ALLEY CAT", likes: 44, drops: 2, monthLikes: 17 },
  { title: "LABELLESS", feeling: "blank", credit: "NO LABEL", likes: 16, drops: 3, monthLikes: 4 },
  { title: "RACK ROOM", feeling: "echo", credit: "RACK OPS", likes: 40, drops: 1, monthLikes: 15 },
  { title: "INK STAMP", feeling: "pressed", credit: "STAMP WORKS", likes: 25, drops: 0, monthLikes: 9 },
  { title: "FREIGHT MIX", feeling: "long haul", credit: "FREIGHT", likes: 58, drops: 4, monthLikes: 25 },
  { title: "END OF REEL", feeling: "fade", credit: "REEL END", likes: 11, drops: 2, monthLikes: 3 },
];

function padCode(n: number): string {
  const text = String(n);
  if (text.length >= 3) return text;
  return ("000" + text).slice(-3);
}

export const DUMMY_TRACKS: Track[] = SEEDS.map(function (seed, index) {
  const num = index + 1;
  const code = "MX-" + padCode(num);
  const cover = COVERS[index % COVERS.length];

  return {
    id: "track-" + padCode(num),
    code: code,
    title: seed.title,
    description: seed.description || "",
    feeling: seed.feeling,
    credit_name: seed.credit,
    credit_link: seed.link || "",
    artist_slug: toArtistSlug(seed.credit),
    cover_url: coverDataUrl(cover, code),
    duration_sec: 1800 + (index % 10) * 120,
    waveform: makePlaceholderWaveform(num * 97),
    download_allowed: index % 7 === 0,
    status: "active",
    likes: seed.likes,
    drops: seed.drops,
    likes_this_month: seed.monthLikes,
    created_at: "2026-10-" + padCode((index % 20) + 1) + "T12:00:00Z",
  };
});

// Phase 1: pretend this track is on air.
export const ON_AIR_CODE = "MX-007";

export function getTrackByCode(code: string): Track | undefined {
  const upper = code.toUpperCase();
  return DUMMY_TRACKS.find(function (t) {
    return t.code === upper;
  });
}

export function getTracksByArtist(slug: string): Track[] {
  return DUMMY_TRACKS.filter(function (t) {
    return t.artist_slug === slug;
  });
}

export function getOnAirTrack(): Track {
  const track = getTrackByCode(ON_AIR_CODE);
  if (track) return track;
  return DUMMY_TRACKS[0];
}

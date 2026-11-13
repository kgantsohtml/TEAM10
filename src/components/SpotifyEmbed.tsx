type Props = {
  url: string;
};

// Official Spotify embed only — never host released audio (brief 5 + 10).
export function SpotifyEmbed(props: Props) {
  const trackId = extractSpotifyTrackId(props.url);
  if (!trackId) {
    return <p>BAD SPOTIFY LINK</p>;
  }

  const src = "https://open.spotify.com/embed/track/" + trackId;

  return (
    <iframe
      title="Spotify"
      src={src}
      width="100%"
      height="152"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style={{ border: "1px solid #000", display: "block" }}
    />
  );
}

function extractSpotifyTrackId(url: string): string {
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  if (!match) return "";
  return match[1];
}

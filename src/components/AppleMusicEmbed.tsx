type Props = {
  url: string;
};

// Official Apple Music embed only — links, never uploaded files.
export function AppleMusicEmbed(props: Props) {
  const embedUrl = toAppleEmbed(props.url);
  if (!embedUrl) {
    return <p>BAD APPLE LINK</p>;
  }

  return (
    <iframe
      title="Apple Music"
      allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
      height="175"
      style={{
        width: "100%",
        maxWidth: "660px",
        overflow: "hidden",
        border: "1px solid #000",
        display: "block",
      }}
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
      src={embedUrl}
    />
  );
}

function toAppleEmbed(url: string): string {
  if (url.indexOf("music.apple.com") === -1) return "";
  return url.replace("music.apple.com", "embed.music.apple.com");
}

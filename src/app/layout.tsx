import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anton } from "next/font/google";
import { TopBar } from "@/components/TopBar";
import { NowPlayingStrip } from "@/components/NowPlayingStrip";
import { getOnAirTrack } from "@/data/dummy-tracks";
import { TAKEDOWN_EMAIL } from "@/config";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "BASS BIN",
  description: "Community radio. One bin. Same moment.",
};

export default function RootLayout(props: { children: ReactNode }) {
  const onAir = getOnAirTrack();

  return (
    <html lang="en">
      <body className={anton.variable}>
        <div className="app-shell">
          <TopBar />
          {props.children}
          <footer
            style={{
              padding: "16px",
              fontSize: "11px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--muted)",
              borderTop: "1px solid var(--line)",
            }}
          >
            TAKEDOWN {TAKEDOWN_EMAIL}
          </footer>
          <NowPlayingStrip track={onAir} listenerCount={12} />
        </div>
      </body>
    </html>
  );
}

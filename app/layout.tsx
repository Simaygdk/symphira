import "./globals.css";
import { PlayerProvider } from "./context/PlayerContext";
import { AudioPlayerProvider } from "./components/AudioPlayerContext";
import PlayerBar from "./components/PlayerBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">

        <AudioPlayerProvider>
          <PlayerProvider>
            {children}
            <PlayerBar />
          </PlayerProvider>
        </AudioPlayerProvider>

      </body>
    </html>
  );
}

import "./globals.css";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider";
import AudioPlayer from "./components/AudioPlayer";

export const metadata = {
  title: "Symphira",
  description: "Music platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AudioPlayerProvider>
          {children}
          <AudioPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}

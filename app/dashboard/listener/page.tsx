"use client";

import { useMemo, useState } from "react";
import { Search, Play } from "lucide-react";

type Track = {
  trackId: string;
  storagePath: string;
  title: string;
  artist: string;
};

export default function ListenerPage() {
  const [query, setQuery] = useState("");

  const tracks: Track[] = [
    {
      trackId: "listener-1",
      storagePath: "/test.mp3",
      title: "Listener Track 1",
      artist: "Symphira",
    },
    {
      trackId: "listener-2",
      storagePath: "/test.mp3",
      title: "Listener Track 2",
      artist: "Symphira",
    },
    {
      trackId: "listener-3",
      storagePath: "/test.mp3",
      title: "Listener Track 3",
      artist: "Symphira",
    },
  ];

  const filteredTracks = useMemo(() => {
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, tracks]);

  const playFromListener = (startIndex: number) => {
    window.dispatchEvent(
      new CustomEvent("symphira:setQueue", {
        detail: {
          queue: filteredTracks,
          startIndex,
          autoplay: true,
        },
      })
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-8 py-16">
        <h1 className="mb-8 text-3xl font-semibold">Discover Music</h1>

        <div className="mb-12 max-w-md">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 backdrop-blur-xl">
            <Search size={18} className="text-white/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by track or artist"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTracks.map((track, index) => (
            <div
              key={track.trackId}
              className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-white/10"
            >
              <div className="mb-4 h-40 w-full rounded-xl bg-gradient-to-br from-purple-700/40 to-black" />

              <h2 className="text-lg font-medium">{track.title}</h2>
              <p className="mb-4 text-sm text-white/60">{track.artist}</p>

              <button
                onClick={() => playFromListener(index)}
                className="flex items-center gap-2 rounded-lg bg-purple-600/30 px-4 py-2 text-sm text-purple-200 ring-1 ring-purple-400 hover:bg-purple-600/40"
              >
                <Play size={16} />
                Play
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

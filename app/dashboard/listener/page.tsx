"use client";

type Track = {
  trackId: string;
  storagePath: string;
  title: string;
  artist: string;
};

export default function ListenerPage() {
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

  const playFromListener = (startIndex: number) => {
    window.dispatchEvent(
      new CustomEvent("symphira:setQueue", {
        detail: {
          queue: tracks,
          startIndex,
          autoplay: true,
        },
      })
    );
  };

  return (
    <div className="min-h-screen bg-black px-8 py-16 text-white">
      <h1 className="mb-6 text-3xl font-semibold">
        Discover
      </h1>

      <div className="space-y-3">
        {tracks.map((track, index) => (
          <button
            key={track.trackId}
            onClick={() => playFromListener(index)}
            className="w-full rounded-xl bg-white/5 px-4 py-3 text-left ring-1 ring-white/10 hover:bg-white/10"
          >
            <p className="text-sm font-medium">
              {track.title}
            </p>
            <p className="text-xs text-white/60">
              {track.artist}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

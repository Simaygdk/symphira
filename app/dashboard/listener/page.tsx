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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-white">
        <h1 className="mb-2 text-3xl font-semibold">
          Discover
        </h1>
        <p className="mb-10 text-white/60">
          Explore tracks shared on Symphira.
        </p>

        <div className="space-y-4">
          {tracks.map((track, index) => (
            <button
              key={track.trackId}
              onClick={() => playFromListener(index)}
              className="group w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left backdrop-blur-xl transition hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {track.title}
                  </p>
                  <p className="text-xs text-white/60">
                    {track.artist}
                  </p>
                </div>

                <span className="text-xs text-white/40 group-hover:text-white">
                  ▶ Play
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

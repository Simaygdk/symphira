"use client";

import { useAudioPlayer } from "@/app/context/AudioPlayerContext";

export default function QueuePanel() {
  const { queue, currentTrack, playTrack } = useAudioPlayer();

  if (!currentTrack || queue.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 w-72 bg-black/90 border border-white/10 rounded-xl p-4 text-white">
      <h3 className="font-semibold mb-3">Up Next</h3>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {queue.map((track) => (
          <button
            key={track.id}
            onClick={() => playTrack(track)}
            className={`w-full text-left p-2 rounded transition ${
              currentTrack.id === track.id
                ? "bg-purple-600/40"
                : "hover:bg-white/10"
            }`}
          >
            <p className="text-sm font-medium">{track.title}</p>
            <p className="text-xs text-white/50">
              {track.artistName}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

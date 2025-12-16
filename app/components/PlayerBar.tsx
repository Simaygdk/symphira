"use client";

import { useState } from "react";
import { useAudioPlayer } from "@/app/context/AudioPlayerContext";
import QueuePanel from "./QueuePanel";

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    prev,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
  } = useAudioPlayer();

  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-black text-white p-4 flex items-center gap-4">
        <div>
          <p className="font-semibold">{currentTrack.title}</p>
          <p className="text-sm opacity-60">
            {currentTrack.artistName}
          </p>
        </div>

        <button onClick={toggleShuffle}>
          {shuffle ? "🔀 ON" : "🔀"}
        </button>

        <button onClick={prev}>⏮</button>

        <button onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button onClick={next}>⏭</button>

        <button onClick={toggleRepeat}>
          {repeat ? "🔁 ON" : "🔁"}
        </button>

        <button
          onClick={() => setShowQueue((q) => !q)}
          className="ml-auto"
        >
          📜
        </button>
      </div>

      {showQueue && <QueuePanel />}
    </>
  );
}

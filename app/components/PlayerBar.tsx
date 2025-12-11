"use client";

import Image from "next/image";
import { usePlayer } from "../context/PlayerContext";

export default function PlayerBar() {
  const { currentTrack, isPlaying, togglePlay, progress, audioRef } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 p-3 px-6 flex items-center gap-4 z-50">
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/10">
        <Image
          src={currentTrack.coverURL || "/default-cover.png"}
          width={100}
          height={100}
          alt="cover"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col">
        <p className="font-medium">{currentTrack.title}</p>
        <p className="text-white/50 text-sm">{currentTrack.artistName}</p>
      </div>

      <button
        onClick={togglePlay}
        className="ml-auto bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}

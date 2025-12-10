"use client";

import { useAudioPlayer } from "@/app/providers/AudioPlayerProvider";

export default function AudioPlayer() {
  const { currentTrack } = useAudioPlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-xl 
      bg-white/10 border border-white/20 backdrop-blur-xl p-4 rounded-2xl shadow-2xl z-50">
      <audio src={currentTrack} controls autoPlay className="w-full" />
    </div>
  );
}

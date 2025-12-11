"use client";

import { useAudioPlayer } from "../providers/AudioPlayerProvider";

export default function AudioPlayer() {
  const { currentTrack } = useAudioPlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/70 backdrop-blur-xl border-t border-white/10 flex items-center px-6 z-50">
      <audio src={currentTrack} controls autoPlay className="w-full" />
    </div>
  );
}
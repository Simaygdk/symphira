"use client";

import { createContext, useContext, useState } from "react";

type AudioPlayerContextType = {
  currentTrack: string | null;
  setTrack: (url: string) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        setTrack: (url) => setCurrentTrack(url),
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used inside AudioPlayerProvider");
  return ctx;
}

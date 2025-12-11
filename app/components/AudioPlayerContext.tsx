"use client";

import { createContext, useContext, useState, useRef, useCallback } from "react";

export type Track = {
  id: string;
  title: string;
  artistName: string;
  coverURL: string;
  audioURL: string;
};

type PlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);

    if (!audioRef.current) {
      audioRef.current = new Audio(track.audioURL);
    } else {
      audioRef.current.src = track.audioURL;
    }

    audioRef.current.play();
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        togglePlay,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used inside AudioPlayerProvider");
  return ctx;
}

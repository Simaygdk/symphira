"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

/* Tüm uygulamada kullanılacak tek Track tipi */
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

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Firestore play sayısını artırır
  const incrementPlayCount = async (trackId: string) => {
    await updateDoc(doc(db, "tracks", trackId), {
      plays: increment(1),
    });
  };

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);

    if (!audioRef.current) {
      audioRef.current = new Audio(track.audioURL);
    } else {
      audioRef.current.src = track.audioURL;
    }

    audioRef.current.play();
    setIsPlaying(true);

    incrementPlayCount(track.id);
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
      value={{ currentTrack, isPlaying, playTrack, togglePlay }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }
  return ctx;
}

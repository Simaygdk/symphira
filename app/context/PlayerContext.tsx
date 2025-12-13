"use client";

import { createContext, useContext, useState, useRef, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

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

  // 🔥 FIRESTORE PLAY COUNTER
  const incrementPlayCount = async (trackId: string) => {
    const ref = doc(db, "tracks", trackId);
    await updateDoc(ref, {
      plays: increment(1),
    });
  };

  const playTrack = useCallback(
    (track: Track) => {
      setCurrentTrack(track);

      if (!audioRef.current) {
        audioRef.current = new Audio(track.audioURL);
      } else {
        audioRef.current.src = track.audioURL;
      }

      audioRef.current.play();
      setIsPlaying(true);

      // 🔥 her oynatmada Firestore play counter artar
      incrementPlayCount(track.id);
    },
    []
  );

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

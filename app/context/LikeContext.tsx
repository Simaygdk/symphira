"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type LikeContextType = {
  likedTrackIds: Set<string>;
  isLiked: (trackId: string) => boolean;
  toggleLike: (trackId: string) => Promise<void>;
};

const LikeContext = createContext<LikeContextType | null>(null);

export function LikeProvider({ children }: { children: React.ReactNode }) {
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserId(null);
        setLikedTrackIds(new Set());
        return;
      }

      setUserId(user.uid);

      const snap = await getDocs(
        collection(db, "users", user.uid, "likedTracks")
      );

      const ids = new Set<string>();
      snap.forEach((d) => ids.add(d.id));
      setLikedTrackIds(ids);
    });

    return () => unsub();
  }, []);

  const isLiked = (trackId: string) => {
    return likedTrackIds.has(trackId);
  };

  const toggleLike = async (trackId: string) => {
    if (!userId) return;

    const ref = doc(db, "users", userId, "likedTracks", trackId);

    if (likedTrackIds.has(trackId)) {
      await deleteDoc(ref);
      setLikedTrackIds((prev) => {
        const next = new Set(prev);
        next.delete(trackId);
        return next;
      });
    } else {
      await setDoc(ref, {
        trackId,
        likedAt: serverTimestamp()
      });

      setLikedTrackIds((prev) => new Set(prev).add(trackId));
    }
  };

  return (
    <LikeContext.Provider value={{ likedTrackIds, isLiked, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLikes() {
  const ctx = useContext(LikeContext);
  if (!ctx) {
    throw new Error("useLikes must be used inside LikeProvider");
  }
  return ctx;
}

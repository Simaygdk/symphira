"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import LikeButton from "@/app/components/LikeButton";

type LikedTrack = {
  trackId: string;
};

export default function LikedSongsPage() {
  const [tracks, setTracks] = useState<LikedTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setTracks([]);
        setLoading(false);
        return;
      }

      const snap = await getDocs(
        collection(db, "users", user.uid, "likedTracks")
      );

      const data: LikedTrack[] = snap.docs.map((d) => ({
        trackId: d.id
      }));

      setTracks(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-8 py-16">
      <h1 className="mb-8 text-3xl font-semibold text-white">
        Liked Songs
      </h1>

      {tracks.length === 0 && (
        <p className="text-white/50">
          You haven’t liked any songs yet.
        </p>
      )}

      <ul className="space-y-4">
        {tracks.map((track) => (
          <li
            key={track.trackId}
            className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
          >
            <span className="text-white">
              {track.trackId}
            </span>

            <LikeButton trackId={track.trackId} />
          </li>
        ))}
      </ul>
    </div>
  );
}

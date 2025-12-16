"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Track = {
  trackId: string;
  title?: string;
  artist?: string;
};

export default function RecommendationsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserId(null);
        setTracks([]);
        setLoading(false);
        return;
      }

      setUserId(user.uid);

      // 1️⃣ Most listened tracks
      const analyticsSnap = await getDocs(
        query(
          collection(db, "trackAnalytics"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(20)
        )
      );

      const listenedTrackIds = analyticsSnap.docs.map(
        (d) => d.data().trackId
      );

      // 2️⃣ Liked tracks
      const likedSnap = await getDocs(
        collection(db, "users", user.uid, "likedTracks")
      );

      const likedTrackIds = likedSnap.docs.map(
        (d) => d.data().trackId
      );

      const seedTrackIds = Array.from(
        new Set([...listenedTrackIds, ...likedTrackIds])
      );

      // 3️⃣ Recommend similar tracks
      const recommendedSnap = await getDocs(
        query(
          collection(db, "tracks"),
          where("relatedTo", "array-contains-any", seedTrackIds.slice(0, 10)),
          limit(20)
        )
      );

      const recs: Track[] = recommendedSnap.docs.map((d) => ({
        trackId: d.id,
        title: d.data().title,
        artist: d.data().artist
      }));

      setTracks(recs);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Loading recommendations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-8 py-16 text-white">
      <h1 className="mb-8 text-3xl font-semibold">
        Recommended For You
      </h1>

      {tracks.length === 0 && (
        <p className="text-white/50">
          Not enough data yet. Listen more music 🎧
        </p>
      )}

      <ul className="space-y-4">
        {tracks.map((t) => (
          <li
            key={t.trackId}
            className="rounded-xl bg-white/5 px-5 py-4 ring-1 ring-white/10 hover:bg-white/10"
          >
            <p className="text-white">
              {t.title || t.trackId}
            </p>
            <p className="text-sm text-white/50">
              {t.artist || "Unknown Artist"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

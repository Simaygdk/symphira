"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Track = {
  trackId: string;
  storagePath: string;
  title: string;
  artist: string;
};

export default function ExplorePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      const q = query(
        collection(db, "tracks"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const data: Track[] = snap.docs.map((d) => ({
        trackId: d.id,
        storagePath: d.data().storagePath,
        title: d.data().title,
        artist: d.data().artist,
      }));

      setTracks(data);
      setLoading(false);
    };

    loadTracks();
  }, []);

  const playFromExplore = (startIndex: number) => {
    window.dispatchEvent(
      new CustomEvent("symphira:setQueue", {
        detail: {
          queue: tracks,
          startIndex,
          autoplay: true,
        },
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-8 py-16 text-white">
      <h1 className="mb-6 text-3xl font-semibold">
        Explore
      </h1>

      {tracks.length === 0 && (
        <p className="text-white/50">
          No tracks found.
        </p>
      )}

      <div className="space-y-3">
        {tracks.map((track, index) => (
          <button
            key={track.trackId}
            onClick={() => playFromExplore(index)}
            className="w-full rounded-xl bg-white/5 px-4 py-3 text-left ring-1 ring-white/10 hover:bg-white/10"
          >
            <p className="text-sm font-medium">
              {track.title}
            </p>
            <p className="text-xs text-white/60">
              {track.artist}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

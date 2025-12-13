"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function ArtistTracksPage() {
  const user = auth.currentUser;

  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tracks"),
      where("artistId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setTracks(list);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen flex justify-center items-center text-white">
        Please log in.
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16 text-white max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold">My Tracks</h1>

        <Link
          href="/dashboard/artist/upload"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
        >
          + Upload New Track
        </Link>
      </div>

      {loading ? (
        <p className="text-white/60">Loading your tracks...</p>
      ) : tracks.length === 0 ? (
        <p className="text-white/60 italic">
          You haven't uploaded any tracks yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition"
            >
              <div className="aspect-square rounded overflow-hidden mb-4">
                <Image
                  src={track.coverURL}
                  alt={track.title}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>

              <h2 className="text-xl font-semibold">{track.title}</h2>
              <p className="text-sm text-white/60">{track.genre || "Unknown genre"}</p>

              <p className="text-white/50 text-sm mt-2">
                Plays: {track.plays ?? 0}
              </p>

              <Link
                href={`/dashboard/artist/tracks/${track.id}`}
                className="mt-4 inline-block px-3 py-2 bg-purple-500 rounded hover:bg-purple-600 text-sm"
              >
                Manage Track
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

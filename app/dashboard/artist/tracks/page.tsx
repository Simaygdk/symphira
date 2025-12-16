"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useAudioPlayer } from "@/app/context/AudioPlayerContext";

type Track = {
  id: string;
  title: string;
  genre?: string;
  coverURL: string;
  audioURL: string;
  artistName: string;
  plays?: number;
};

export default function ArtistTracksPage() {
  const user = auth.currentUser;
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useAudioPlayer();

  useEffect(() => {
    if (!user) return;

    // Sadece kullanıcının own track'lerini çeker
    const q = query(
      collection(db, "tracks"),
      where("artistId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Track, "id">),
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
    <main className="min-h-screen px-6 py-16 text-white max-w-4xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold">My Tracks</h1>

        <Link
          href="/dashboard/artist/upload"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
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
              <p className="text-sm text-white/60">
                {track.genre || "Unknown genre"}
              </p>

              <p className="text-white/50 text-sm mt-2">
                Plays: {track.plays ?? 0}
              </p>

              <div className="flex gap-2 mt-4">
                {/* Play butonu global player'ı tetikler */}
                <button
                  onClick={() =>
                    playTrack({
                      id: track.id,
                      title: track.title,
                      artistName: track.artistName,
                      coverURL: track.coverURL,
                      audioURL: track.audioURL,
                    })
                  }
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                >
                  ▶ Play
                </button>

                <Link
                  href={`/dashboard/artist/tracks/${track.id}`}
                  className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded text-sm text-center"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

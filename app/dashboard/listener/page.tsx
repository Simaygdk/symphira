"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Play } from "lucide-react";
import { db } from "../../../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

type Track = {
  id: string;
  title: string;
  artistName: string;
  coverURL: string;
  audioURL: string;
  ownerId: string;
};

export default function ListenerPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [queryText, setQueryText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "tracks"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list: Track[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Track, "id">),
      }));
      setTracks(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filteredTracks = useMemo(() => {
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(queryText.toLowerCase()) ||
        track.artistName.toLowerCase().includes(queryText.toLowerCase())
    );
  }, [tracks, queryText]);

  const playFromListener = (startIndex: number) => {
    window.dispatchEvent(
      new CustomEvent("symphira:setQueue", {
        detail: {
          queue: filteredTracks,
          startIndex,
          autoplay: true,
        },
      })
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-8 py-16">
        <h1 className="mb-8 text-3xl font-semibold">Discover Music</h1>

        <div className="mb-12 max-w-md">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 backdrop-blur-xl">
            <Search size={18} className="text-white/50" />
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Search by track or artist"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {loading && (
          <p className="text-white/60">Loading tracks...</p>
        )}

        {!loading && filteredTracks.length === 0 && (
          <p className="text-white/60 italic">
            No tracks found.
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTracks.map((track, index) => (
            <div
              key={track.id}
              className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-white/10"
            >
              <div
                className="mb-4 h-40 w-full rounded-xl bg-cover bg-center"
                style={{
                  backgroundImage: `url(${track.coverURL})`,
                }}
              />

              <h2 className="text-lg font-medium">
                {track.title}
              </h2>
              <p className="mb-4 text-sm text-white/60">
                {track.artistName}
              </p>

              <button
                onClick={() => playFromListener(index)}
                className="flex items-center gap-2 rounded-lg bg-purple-600/30 px-4 py-2 text-sm text-purple-200 ring-1 ring-purple-400 hover:bg-purple-600/40"
              >
                <Play size={16} />
                Play
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

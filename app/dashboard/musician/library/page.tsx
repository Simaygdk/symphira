"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db, storage } from "../../../../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { Trash2 } from "lucide-react";

type Track = {
  id: string;
  title: string;
  artistName: string;
  coverURL: string;
  audioURL: string;
};

export default function MusicLibraryPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "tracks"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Track, "id">),
      }));
      setTracks(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const deleteTrack = async (track: Track) => {
    const yes = confirm(`Delete "${track.title}"?`);
    if (!yes) return;

    try {
      setDeleting(track.id);

      if (track.coverURL) {
        const coverRef = ref(storage, track.coverURL);
        await deleteObject(coverRef).catch(() => {});
      }

      if (track.audioURL) {
        const audioRef = ref(storage, track.audioURL);
        await deleteObject(audioRef).catch(() => {});
      }

      await deleteDoc(doc(db, "tracks", track.id));
      setDeleting(null);
    } catch {
      setDeleting(null);
      alert("Failed to delete track.");
    }
  };

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">
      <h1 className="text-4xl font-bold mb-10 text-purple-300 drop-shadow-[0_0_25px_rgba(180,50,255,0.35)]">
        Your Library
      </h1>

      {loading && (
        <p className="text-neutral-400 text-lg">Loading tracks...</p>
      )}

      {!loading && tracks.length === 0 && (
        <p className="text-neutral-400 text-lg italic">
          No tracks uploaded yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {tracks.map((track) => (
          <motion.div
            key={track.id}
            whileHover={{ scale: 1.03 }}
            className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(150,70,255,0.15)] transition"
          >
            <img
              src={track.coverURL}
              alt={track.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <h2 className="text-xl font-semibold">{track.title}</h2>
            <p className="text-neutral-400 text-sm">{track.artistName}</p>

            <div className="flex justify-end mt-4">
              <button
                disabled={deleting === track.id}
                onClick={() => deleteTrack(track)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 transition"
              >
                <Trash2 size={18} />
                {deleting === track.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

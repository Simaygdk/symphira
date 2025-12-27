"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../../../../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Trash2 } from "lucide-react";

type Track = {
  id: string;
  title: string;
  artistName: string;
  coverURL: string;
  audioURL: string;
  ownerId: string;
};

export default function MusicLibraryPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeTracks: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setTracks([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "tracks"),
        where("ownerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      unsubscribeTracks = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Track, "id">),
        }));
        setTracks(list);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeTracks) unsubscribeTracks();
    };
  }, []);

  const deleteTrack = async (track: Track) => {
    const yes = confirm(`Delete "${track.title}"?`);
    if (!yes) return;

    try {
      setDeleting(track.id);
      await deleteDoc(doc(db, "tracks", track.id));
    } catch {
      alert("Failed to delete track.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">
      <h1 className="text-4xl font-bold mb-10 text-purple-300">
        Your Library
      </h1>

      {loading && <p className="text-neutral-400">Loading tracks...</p>}

      {!loading && tracks.length === 0 && (
        <p className="text-neutral-400 italic">
          No tracks uploaded yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {tracks.map((track) => (
          <motion.div
            key={track.id}
            whileHover={{ scale: 1.03 }}
            className="p-4 rounded-2xl bg-white/10 border border-white/20"
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-300"
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

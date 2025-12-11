"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { HeartOff, PlayCircle } from "lucide-react";
import { useAudioPlayer } from "../../../components/AudioPlayerContext";
import Link from "next/link";

export default function LikedSongsPage() {
  const [liked, setLiked] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useAudioPlayer();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "likedSongs"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const tracks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLiked(tracks);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const removeLike = async (id: string) => {
    await deleteDoc(doc(db, "likedSongs", id));
  };

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#0a0618] via-[#170d2b] to-[#2d1242] text-white">

      <h1 className="text-4xl font-bold text-purple-200 drop-shadow-[0_0_22px_rgba(150,50,255,0.35)] text-center mb-8">
        Liked Songs
      </h1>

      {loading ? (
        <p className="text-center text-neutral-400">Loading...</p>
      ) : liked.length === 0 ? (
        <p className="text-center text-neutral-400 italic">
          You haven't liked any songs yet.
        </p>
      ) : (
        <div className="space-y-5 max-w-3xl mx-auto">

          {liked.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.coverURL || "https://placehold.co/80x80"}
                  className="w-14 h-14 rounded object-cover"
                />

                <div>
                  <p className="text-lg font-semibold text-purple-200">
                    {item.title}
                  </p>
                  <p className="text-neutral-400 text-sm">{item.artistName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">

                <button
                  onClick={() => playTrack(item)}
                  className="text-purple-300 hover:text-purple-100"
                >
                  <PlayCircle size={28} />
                </button>

                <button
                  onClick={() => removeLike(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <HeartOff size={22} />
                </button>

              </div>
            </motion.div>
          ))}

        </div>
      )}
    </main>
  );
}

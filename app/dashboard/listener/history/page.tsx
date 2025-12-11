"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { Clock, PlayCircle } from "lucide-react";
import { useAudioPlayer } from "../../../components/AudioPlayerContext";

export default function ListeningHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const { playTrack } = useAudioPlayer();

  const load = () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "history"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("playedAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setHistory(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });
  };

  useEffect(() => {
    const unsub = load();
    return () => unsub && unsub();
  }, []);

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#0b0618] via-[#170d2b] to-[#2d1242] text-white">

      <h1 className="text-4xl font-bold text-purple-200 drop-shadow-[0_0_22px_rgba(150,50,255,0.35)] text-center mb-12">
        Listening History
      </h1>

      {history.length === 0 ? (
        <p className="text-center text-neutral-400">No listening activity yet.</p>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">

          {history.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.coverURL || "https://placehold.co/80x80"}
                  className="w-14 h-14 object-cover rounded"
                />

                <div>
                  <p className="text-lg font-semibold text-purple-200">{item.title}</p>
                  <p className="text-neutral-400 text-sm">{item.artistName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    playTrack({
                      id: item.trackId,
                      title: item.title,
                      artistName: item.artistName,
                      coverURL: item.coverURL,
                      audioURL: item.audioURL || "",
                    })
                  }
                  className="text-purple-300 hover:text-purple-100"
                >
                  <PlayCircle size={28} />
                </button>

                <Clock size={20} className="text-neutral-400" />
              </div>
            </motion.div>
          ))}

        </div>
      )}
    </main>
  );
}

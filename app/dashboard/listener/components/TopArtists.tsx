"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

export default function TopArtists() {
  const user = auth.currentUser;

  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "history"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => d.data());

      const counts: Record<string, { artist: string; cover: string; plays: number }> = {};

      data.forEach((item) => {
        if (!counts[item.artistName]) {
          counts[item.artistName] = {
            artist: item.artistName,
            cover: item.coverURL || "https://placehold.co/200x200",
            plays: 0,
          };
        }
        counts[item.artistName].plays += 1;
      });

      const sorted = Object.values(counts)
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 6);

      setArtists(sorted);
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto mt-16">
      <h2 className="text-xl font-semibold text-purple-200 mb-4">Top Artists</h2>

      {artists.length === 0 ? (
        <p className="text-neutral-400 text-sm">No enough data yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {artists.map((artist, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.06 }}
              className="text-center cursor-pointer"
            >
              <div className="relative group">
                <img
                  src={artist.cover}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover mx-auto border border-white/20 shadow-lg group-hover:shadow-purple-500/30 transition"
                />
              </div>

              <p className="mt-3 text-sm font-semibold text-purple-200 truncate">
                {artist.artist}
              </p>
              <p className="text-neutral-400 text-xs">{artist.plays} plays</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

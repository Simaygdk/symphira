"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { useAudioPlayer } from "../../../components/AudioPlayerContext";
import { Play } from "lucide-react";

export default function DailyMixes() {
  const user = auth.currentUser;
  const { playTrack } = useAudioPlayer();

  const [mixes, setMixes] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "history"),
      where("userId", "==", user.uid),
      orderBy("playedAt", "desc"),
      limit(30)
    );

    const unsub = onSnapshot(q, (snap) => {
      const pastSongs = snap.docs.map((d) => d.data());

      // En çok dinlenen sanatçılar
      const artistCount: Record<string, number> = {};
      pastSongs.forEach((s) => {
        if (!artistCount[s.artistName]) artistCount[s.artistName] = 0;
        artistCount[s.artistName]++;
      });

      const topArtists = Object.keys(artistCount)
        .sort((a, b) => artistCount[b] - artistCount[a])
        .slice(0, 3);

      // Mix oluşturma
      const generatedMixes = topArtists.map((artist, i) => {
        const songs = pastSongs
          .filter((s) => s.artistName === artist)
          .slice(0, 5);

        return {
          id: i + 1,
          title: `Daily Mix ${i + 1}`,
          artist,
          songs,
          cover: songs[0]?.coverURL || "https://placehold.co/300x300",
        };
      });

      setMixes(generatedMixes);
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto mt-14">
      <h2 className="text-xl font-semibold text-purple-200 mb-4">
        Daily Mixes
      </h2>

      {mixes.length === 0 ? (
        <p className="text-neutral-400 text-sm">
          Not enough listening history to generate mixes.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mixes.map((mix) => (
            <motion.div
              key={mix.id}
              whileHover={{ scale: 1.04 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-xl shadow-lg cursor-pointer"
              onClick={() => {
                if (mix.songs.length > 0) playTrack(mix.songs[0]);
              }}
            >
              <div className="relative">
                <img
                  src={mix.cover}
                  className="w-full h-40 rounded-xl object-cover shadow-lg"
                />

                <Play
                  size={32}
                  className="absolute bottom-3 right-3 text-purple-200 drop-shadow-[0_0_10px_rgba(150,50,255,0.5)]"
                />
              </div>

              <p className="mt-4 text-lg font-semibold text-purple-200">
                {mix.title}
              </p>
              <p className="text-neutral-400 text-sm">{mix.artist}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useAudioPlayer } from "../../../../app/components/AudioPlayerContext";

export default function TopTracks() {
  const user = auth.currentUser;
  const { playTrack } = useAudioPlayer();

  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "history"), where("userId", "==", user.uid));

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => d.data());

      const count: Record<
        string,
        {
          id: string;
          title: string;
          artistName: string;
          coverURL: string;
          audioURL: string;
          plays: number;
        }
      > = {};

      items.forEach((t) => {
        if (!count[t.trackId]) {
          count[t.trackId] = {
            id: t.trackId,
            title: t.title,
            artistName: t.artistName,
            coverURL: t.coverURL || "https://placehold.co/300x300",
            audioURL: t.audioURL || "",
            plays: 0,
          };
        }
        count[t.trackId].plays += 1;
      });

      const sorted = Object.values(count)
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 6);

      setTracks(sorted);
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto mt-16">
      <h2 className="text-xl font-semibold text-purple-200 mb-4">
        Top Tracks
      </h2>

      {tracks.length === 0 ? (
        <p className="text-neutral-400 text-sm">No enough data yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {tracks.map((track, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              onClick={() =>
                playTrack({
                  id: track.id,
                  title: track.title,
                  artistName: track.artistName,
                  coverURL: track.coverURL,
                  audioURL: track.audioURL,
                })
              }
              className="bg-white/10 border border-white/20 rounded-xl p-3 backdrop-blur-xl shadow-lg cursor-pointer"
            >
              <div className="relative">
                <img
                  src={track.coverURL}
                  className="w-full h-28 object-cover rounded-lg"
                />
                <Play
                  size={30}
                  className="absolute bottom-2 right-2 text-purple-200 drop-shadow-[0_0_10px_rgba(150,50,255,0.5)]"
                />
              </div>

              <p className="mt-3 text-sm font-semibold text-purple-200 truncate">
                {track.title}
              </p>
              <p className="text-neutral-400 text-xs truncate">
                {track.artistName}
              </p>
              <p className="text-neutral-500 text-xs mt-1">{track.plays} plays</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

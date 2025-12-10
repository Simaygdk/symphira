"use client";

import { useEffect, useState } from "react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useAudioPlayer } from "@/app/providers/AudioPlayerProvider";
import { motion } from "framer-motion";
import { Music, PlayCircle } from "lucide-react";

export default function MusicLibraryPage() {
  const [tracks, setTracks] = useState<{ name: string; url: string }[]>([]);
  const { setTrack } = useAudioPlayer(); // 🎧 Global Player bağlantısı

  // Şimdilik manuel sanatçı, sonra auth ile dinamik olacak:
  const artistName = "Simay";

  useEffect(() => {
    async function fetchMusic() {
      try {
        const folderRef = ref(storage, `music/${artistName}`);
        const result = await listAll(folderRef);

        const fileData = await Promise.all(
          result.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return { name: item.name, url };
          })
        );

        setTracks(fileData);
      } catch (error) {
        console.error("Failed to load tracks:", error);
      }
    }

    fetchMusic();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-[#f5d36e] mb-10">
        Music Library
      </h1>

      {/* Track Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tracks.length === 0 ? (
          <p className="text-neutral-400 text-center col-span-full">
            No uploaded music found.
          </p>
        ) : (
          tracks.map((track) => (
            <motion.div
              key={track.name}
              whileHover={{ scale: 1.03 }}
              className="p-5 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl shadow-[0_0_20px_rgba(245,211,110,0.25)]"
            >
              {/* Track Info */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-[#f5d36e]">
                  {track.name.replace(".mp3", "")}
                </h3>
                <Music size={20} />
              </div>

              {/* Play Button */}
              <button
                onClick={() => setTrack(track.url)} // 🎧 Global Player’a track gönderme
                className="w-full py-2 mt-2 rounded-xl bg-[#f5d36e]/20 border border-[#f5d36e]/40 text-[#f5d36e] hover:bg-[#f5d36e]/30 transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle size={18} />
                Play
              </button>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}

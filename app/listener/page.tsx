"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cormorant_Garamond, Cinzel_Decorative, Poppins } from "next/font/google";
import { Music2, Heart, PlayCircle } from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function ListenerPage() {
  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a1f] via-[#1b1035] to-[#2b1140] text-white px-4 pb-20">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: [1, 0.9, 1],
          scale: [1, 1.03, 1],
          textShadow: [
            "0 0 25px rgba(245,211,110,0.4)",
            "0 0 45px rgba(245,211,110,0.8)",
            "0 0 25px rgba(245,211,110,0.4)",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`${cinzel.className} text-6xl sm:text-7xl text-[#f5d36e] font-bold mt-24 drop-shadow-[0_0_25px_rgba(245,211,110,0.3)]`}
      >
        Discover the Sound Within
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className={`${cormorant.className} text-lg sm:text-xl text-neutral-300 mt-6 italic text-center`}
      >
        Dive into the world of creators, melodies, and emotion.
      </motion.p>

      {/* Artists Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-16 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {[
          { name: "Simay", genre: "Indie Pop", track: "Golden Hour" },
          { name: "Aiden Cross", genre: "Alternative", track: "Echoes in the Rain" },
          { name: "Luna Mae", genre: "Ambient", track: "Celestial Waves" },
          { name: "Ravi Sol", genre: "Jazz Fusion", track: "Velvet Horizon" },
          { name: "Mira Elen", genre: "Classical", track: "Eternal Bloom" },
          { name: "Noa Hale", genre: "Soul", track: "Shadow Lights" },
        ].map(({ name, genre, track }) => (
          <Link href={`/musician?artist=${encodeURIComponent(name)}`} key={name}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl shadow-[0_0_25px_rgba(245,211,110,0.15)] hover:shadow-[0_0_35px_rgba(245,211,110,0.3)] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`${poppins.className} text-xl font-semibold text-[#f5d36e]`}>
                  {name}
                </h3>
                <button className="text-neutral-400 hover:text-[#f5d36e] transition-all">
                  <Heart size={20} />
                </button>
              </div>

              <p className="text-neutral-300 mb-2 text-sm">{genre}</p>
              <p className="text-neutral-400 mb-4 text-xs italic">“{track}”</p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center w-full py-2 rounded-full bg-[#f5d36e]/10 border border-[#f5d36e]/40 text-[#f5d36e] hover:bg-[#f5d36e]/20 transition-all gap-2"
              >
                <PlayCircle size={18} />
                Listen
              </motion.button>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </main>
  );
}

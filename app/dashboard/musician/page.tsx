"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Upload, Library, User } from "lucide-react";

export default function MusicianDashboard() {
  const cards = [
    {
      title: "Upload Music",
      desc: "Share your sounds with the world.",
      href: "/dashboard/musician/upload",
      icon: <Upload size={30} />,
    },
    {
      title: "Your Library",
      desc: "Manage and edit your released tracks.",
      href: "/dashboard/musician/library",
      icon: <Library size={30} />,
    },
    {
      title: "Profile",
      desc: "Update your artist details and portfolio.",
      href: "/dashboard/musician/profile",
      icon: <User size={30} />,
    },
  ];

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">
      <h1 className="text-5xl font-bold text-center text-purple-300 drop-shadow-[0_0_25px_rgba(180,50,255,0.35)]">
        Musician Dashboard
      </h1>

      <p className="text-center mt-3 text-neutral-300 max-w-md mx-auto">
        Upload tracks, manage your music, and grow your presence.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
        {cards.map((card) => (
          <Link href={card.href} key={card.title}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20
              shadow-[0_0_20px_rgba(150,70,255,0.15)] hover:shadow-[0_0_30px_rgba(150,70,255,0.3)]
              transition cursor-pointer"
            >
              <div className="text-purple-300 mb-4">{card.icon}</div>
              <h2 className="text-2xl font-semibold">{card.title}</h2>
              <p className="text-neutral-300 mt-2 text-sm">{card.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </main>
  );
}

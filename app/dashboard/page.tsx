"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Music, Briefcase, ShoppingCart, Headphones } from "lucide-react";

export default function DashboardHome() {
  const cards = [
    {
      title: "Musician",
      desc: "Upload your tracks, manage your library and build your profile.",
      icon: <Music size={32} />,
      href: "/dashboard/musician",
    },
    {
      title: "Employer",
      desc: "Create offers, find musicians and manage your collaborations.",
      icon: <Briefcase size={32} />,
      href: "/dashboard/employer",
    },
    {
      title: "Seller",
      desc: "Sell beats, stems, sound packs and digital music assets.",
      icon: <ShoppingCart size={32} />,
      href: "/dashboard/seller",
    },
    {
      title: "Listener",
      desc: "Discover new music and enjoy curated playlists.",
      icon: <Headphones size={32} />,
      href: "/dashboard/listener",
    },
  ];

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#0a0714] via-[#1a0f2b] to-[#2a1342] text-white">
      <h1 className="text-5xl font-bold text-center text-purple-300 drop-shadow-[0_0_35px_rgba(180,50,255,0.4)]">
        Welcome to Symphira
      </h1>

      <p className="text-center text-neutral-300 mt-3 max-w-xl mx-auto">
        Select how you want to explore Symphira today.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
        {cards.map((card) => (
          <Link href={card.href} key={card.title}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 
              shadow-[0_0_25px_rgba(150,70,255,0.2)] hover:shadow-[0_0_35px_rgba(150,70,255,0.35)] 
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

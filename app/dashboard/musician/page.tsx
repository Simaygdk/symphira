"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Upload, Library, Users, BarChart3 } from "lucide-react";

export default function MusicianDashboardPage() {
  const items = [
    {
      title: "Upload Music",
      desc: "Upload your tracks and grow your portfolio.",
      icon: <Upload size={36} />,
      href: "/dashboard/musician/upload",
      color: "from-purple-500/40 to-purple-700/40",
    },
    {
      title: "Music Library",
      desc: "View, manage and play your uploaded songs.",
      icon: <Library size={36} />,
      href: "/dashboard/musician/library",
      color: "from-blue-500/40 to-blue-700/40",
    },
    {
      title: "Offers for You",
      desc: "See opportunities created by employers.",
      icon: <Users size={36} />,
      href: "/dashboard/musician/offers",
      color: "from-yellow-500/40 to-yellow-700/40",
    },
    {
      title: "Analytics",
      desc: "Track plays, popularity & engagement.",
      icon: <BarChart3 size={36} />,
      href: "/dashboard/musician/analytics",
      color: "from-green-500/40 to-green-700/40",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 py-16">
      <h1 className="text-5xl font-bold text-center text-[#f5d36e] drop-shadow-lg">
        Musician Space
      </h1>

      <p className="text-center text-neutral-300 mt-3">
        Manage your music, discover offers, and grow your presence.
      </p>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {items.map((item) => (
          <Link key={item.title} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`cursor-pointer p-8 rounded-3xl border border-white/20 backdrop-blur-xl shadow-xl transition bg-gradient-to-br ${item.color}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-white drop-shadow-xl">{item.icon}</div>

                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {item.title}
                  </h2>

                  <p className="text-neutral-300 text-sm mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </main>
  );
}

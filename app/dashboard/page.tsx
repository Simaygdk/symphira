"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Music,
  Briefcase,
  ShoppingBag,
  Headphones,
} from "lucide-react";

export default function DashboardPage() {
  const modules = [
    {
      title: "Musician",
      desc: "Upload music, manage your library, view offers.",
      icon: <Music size={40} />,
      href: "/dashboard/musician",
      color: "from-purple-500/40 to-purple-700/40",
    },
    {
      title: "Employer",
      desc: "Create offers, manage applications, discover talent.",
      icon: <Briefcase size={40} />,
      href: "/dashboard/employer",
      color: "from-yellow-500/40 to-yellow-700/40",
    },
    {
      title: "Seller",
      desc: "Sell samples, presets, merch & digital products.",
      icon: <ShoppingBag size={40} />,
      href: "/dashboard/seller",
      color: "from-green-500/40 to-green-700/40",
    },
    {
      title: "Listener",
      desc: "Discover artists, browse music & enjoy playlists.",
      icon: <Headphones size={40} />,
      href: "/dashboard/listener",
      color: "from-blue-500/40 to-blue-700/40",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 py-16">
      <h1 className="text-5xl font-bold text-center text-[#f5d36e] drop-shadow-lg">
        Welcome to Symphira
      </h1>

      <p className="text-center text-neutral-300 mt-3">
        Choose any module — no roles, no limits. Create your world.
      </p>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {modules.map((mod) => (
          <Link key={mod.title} href={mod.href}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`
                cursor-pointer p-8 rounded-3xl border border-white/20 backdrop-blur-xl 
                shadow-xl transition bg-gradient-to-br ${mod.color}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="text-white drop-shadow-xl">{mod.icon}</div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {mod.title}
                  </h2>
                  <p className="text-neutral-300 text-sm mt-1">{mod.desc}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </main>
  );
}

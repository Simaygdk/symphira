"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SparkleBurst from "../components/SparkleBurst";

const modules = [
  {
    title: "Musician Space",
    desc: "Showcase your sound, connect with listeners.",
    icon: "🎸",
    route: "/musician",
  },
  {
    title: "Collaboration Hub",
    desc: "Find talent or get discovered for your next project.",
    icon: "💼",
    route: "/employer",
  },
  {
    title: "Marketplace",
    desc: "Buy & sell instruments, samples, and digital assets.",
    icon: "🛍️",
    route: "/seller",
  },
  {
    title: "Discover Music",
    desc: "Explore artists, genres, and Symphira-exclusive tracks.",
    icon: "🎧",
    route: "/listener",
  },
];

export default function HomePage() {
  const router = useRouter();
  const handleClick = (route: string) => router.push(route);

  return (
    <div className="min-h-screen bg-[#0a0714] flex flex-col items-center text-white px-6 pt-20">
      <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-yellow-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-xl">
        What Would You Like To Explore Today?
      </h1>

      <p className="text-gray-300 mb-12 text-lg">
        Choose freely — Symphira is your creative universe.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl w-full">
        {modules.map((mod, i) => (
          <motion.button
            key={i}
            onClick={() => handleClick(mod.route)}
            whileHover={{ scale: 1.03 }}
            className="
              relative p-8 rounded-3xl text-left transition 
              backdrop-blur-xl bg-white/5 border border-white/10
              hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,230,140,0.4)]
            "
          >
            <SparkleBurst />

            <div className="text-4xl mb-3">{mod.icon}</div>

            <h2 className="text-3xl font-semibold text-yellow-300">
              {mod.title}
            </h2>

            <p className="text-gray-300 mt-2 text-md">{mod.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

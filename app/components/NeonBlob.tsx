"use client";

import { motion } from "framer-motion";

interface NeonBlobProps {
  icon: string;
  label: string;
  sub: string;
  onClick: () => void;
}

export default function NeonBlob({
  icon,
  label,
  sub,
  onClick,
}: NeonBlobProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative w-64 h-48 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 backdrop-blur-xl flex flex-col items-center justify-center gap-3 text-center hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition"
    >
      <div className="text-4xl">{icon}</div>
      <h2 className="text-xl font-semibold text-white">{label}</h2>
      <p className="text-sm text-white/70">{sub}</p>
    </motion.button>
  );
}

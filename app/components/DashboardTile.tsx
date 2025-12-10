"use client";

import { motion } from "framer-motion";

interface DashboardTileProps {
  title: string;
  desc: string;
  icon: string;
  onClick: () => void;
}

export default function DashboardTile({
  title,
  desc,
  icon,
  onClick,
}: DashboardTileProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="
        relative p-8 rounded-3xl text-left transition
        backdrop-blur-xl bg-white/5 border border-white/10
        hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,230,140,0.4)]
        overflow-hidden
      "
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,200,0.25), rgba(0,0,0,0))",
        }}
      />

      <div className="text-4xl mb-3 relative z-10">{icon}</div>

      <h2 className="text-2xl font-semibold text-yellow-300 relative z-10">
        {title}
      </h2>

      <p className="text-gray-300 mt-2 text-sm relative z-10">
        {desc}
      </p>
    </motion.button>
  );
}

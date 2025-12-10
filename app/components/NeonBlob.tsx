"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface NeonBlobProps {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick?: () => void;
}

export default function NeonBlob({ icon, label, sub, onClick }: NeonBlobProps) {
  const [clicked, setClicked] = useState(false);

  return (
    <motion.div
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 500);
        if (onClick) onClick();
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.92 }}
      className="
        relative w-44 h-44 rounded-3xl p-[2px]
        cursor-pointer select-none
        transition-all duration-300
      "
    >
      {/* 🔮 Outer Glow Aura */}
      <div
        className="
          absolute inset-0 rounded-3xl blur-2xl opacity-60
        "
        style={{
          background:
            "radial-gradient(circle, rgba(190,0,255,0.6), rgba(90,0,255,0.35), rgba(0,0,40,0.5))",
        }}
      />

      {/* ✨ Spark Burst When Clicked */}
      {clicked && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          initial={{ opacity: 0.9, scale: 0.4 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0))",
          }}
        />
      )}

      {/* 🟣 Inner Glass Panel */}
      <motion.div
        animate={{
          rotate: [0, 6, -6, 0],
          scale: [1, 1.03, 0.97, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          relative z-10 flex flex-col items-center justify-center w-full h-full
          rounded-3xl backdrop-blur-xl
          border border-white/10
          shadow-[0_0_40px_rgba(190,0,255,0.55)]
          bg-[rgba(20,0,40,0.45)]
        "
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="text-5xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        >
          {icon}
        </motion.div>

        {/* Label */}
        <p className="mt-3 text-base font-semibold tracking-wide text-purple-200">
          {label}
        </p>

        {/* Sub label (optional) */}
        {sub && (
          <p className="text-xs text-purple-300/70 mt-1">
            {sub}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

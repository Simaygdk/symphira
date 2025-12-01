"use client";

import { motion } from "framer-motion";

interface NeonBlobProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export default function NeonBlob({ icon, label, onClick }: NeonBlobProps) {
  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="
        relative w-32 h-32 rounded-full flex flex-col items-center justify-center
        cursor-pointer select-none
        backdrop-blur-xl
        border border-white/10
        shadow-[0_0_30px_rgba(180,0,255,0.5)]
      "
      style={{
        background:
          "radial-gradient(circle at 30% 30%, rgba(255,0,200,0.5), rgba(90,0,255,0.45), rgba(20,0,60,0.6))",
      }}
      animate={{
        rotate: [0, 4, -4, 0],
        scale: [1, 1.05, 0.97, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="text-4xl">{icon}</div>
      <p className="text-sm mt-2">{label}</p>
    </motion.div>
  );
}

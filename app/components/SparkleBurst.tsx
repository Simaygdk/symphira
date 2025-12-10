"use client";

import { motion } from "framer-motion";

interface SparkleBurstProps {
  size?: number;
}

export default function SparkleBurst({ size = 180 }: SparkleBurstProps) {
  return (
    <motion.div
      initial={{ opacity: 0.8, scale: 0.3 }}
      animate={{ opacity: 0, scale: 1.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0))",
          borderRadius: "50%",
          filter: "blur(12px)",
        }}
      />
    </motion.div>
  );
}

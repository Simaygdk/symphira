"use client";
import { motion } from "framer-motion";
import { Cinzel_Decorative, Cormorant_Garamond, Poppins } from "next/font/google";
import { ShoppingBag, Tag, DollarSign, Heart, ShoppingCart } from "lucide-react";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function SellerPage() {
  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a1f] via-[#132c29] to-[#2e604c] text-white px-4 pb-20">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: [1, 0.9, 1],
          scale: [1, 1.03, 1],
          textShadow: [
            "0 0 25px rgba(245,211,110,0.4)",
            "0 0 45px rgba(245,211,110,0.8)",
            "0 0 25px rgba(245,211,110,0.4)",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`${cinzel.className} text-6xl sm:text-7xl text-[#f5d36e] font-bold mt-24 drop-shadow-[0_0_25px_rgba(245,211,110,0.3)]`}
      >
        Symphira Market
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className={`${cormorant.className} text-lg sm:text-xl text-neutral-300 mt-6 italic text-center`}
      >
        Your sound. Your craft. Your value.
      </motion.p>

      {/* Product Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-16 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {[
          { name: "Golden Strings Pack", price: "$35", type: "Guitar Samples" },
          { name: "Lunar Vocals Vol.1", price: "$25", type: "Vocal FX" },
          { name: "Soul Resonance Kit", price: "$40", type: "Drum Loops" },
          { name: "Celestial Merch Hoodie", price: "$60", type: "Apparel" },
          { name: "Dreamscape Synth Pack", price: "$30", type: "Synth Presets" },
          { name: "Symphira Poster", price: "$15", type: "Art Print" },
        ].map(({ name, price, type }) => (
          <motion.div
            key={name}
            whileHover={{ scale: 1.05 }}
            className="relative bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl shadow-[0_0_25px_rgba(245,211,110,0.15)] hover:shadow-[0_0_35px_rgba(245,211,110,0.3)] transition-all"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className={`${poppins.className} text-xl font-semibold text-[#f5d36e]`}>
                {name}
              </h3>
              <button className="text-neutral-400 hover:text-[#f5d36e] transition-all">
                <Heart size={20} />
              </button>
            </div>

            <div className="text-neutral-400 text-sm flex items-center gap-2 mb-2">
              <Tag size={14} /> {type}
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-[#f5d36e] font-semibold">{price}</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f5d36e]/10 border border-[#f5d36e]/40 text-[#f5d36e] hover:bg-[#f5d36e]/20 transition-all text-sm font-semibold"
              >
                <ShoppingCart size={16} /> Add to Cart
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}

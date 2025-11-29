"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import { Music, CalendarDays, DollarSign, Eye, CheckCircle } from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import Link from "next/link";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function MusicianPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [artistName, setArtistName] = useState("Simay"); // ileride auth ile değiştirilecek

  // 🔸 Firestore'dan sadece bu müzisyene ait teklifler
  useEffect(() => {
    const q = query(
      collection(db, "offers"),
      where("artist", "==", artistName),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOffers(fetched);
    });
    return () => unsubscribe();
  }, [artistName]);

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-5 pb-24">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`${cinzel.className} text-4xl sm:text-5xl md:text-6xl text-[#f5d36e] font-bold mt-16 text-center`}
      >
        Musician Dashboard
      </motion.h1>

      <p className="text-neutral-300 mt-3 text-center text-sm sm:text-base max-w-md">
        View offers created for you and manage your opportunities 🎶
      </p>

      {/* OFFERS GRID */}
      <div className="mt-10 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {offers.length === 0 ? (
          <p className="col-span-full text-center text-neutral-400 italic text-sm">
            No offers yet for you, {artistName}.
          </p>
        ) : (
          offers.map((offer) => (
            <motion.div
              key={offer.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_0_20px_rgba(245,211,110,0.15)] hover:shadow-[0_0_25px_rgba(245,211,110,0.3)] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3
                  className={`${poppins.className} text-lg font-semibold text-[#f5d36e]`}
                >
                  {offer.title}
                </h3>
                <Music size={18} className="text-[#f5d36e]" />
              </div>

              <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                {offer.description}
              </p>

              <div className="flex flex-col gap-2 text-neutral-300 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} />
                  <span>{offer.budget}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} />
                  <span>{offer.deadline}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <Link href={`/employer/${offer.id}`} className="w-full">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 rounded-full bg-[#f5d36e]/10 border border-[#f5d36e]/40 text-[#f5d36e] hover:bg-[#f5d36e]/20 transition-all text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <Eye size={14} /> View Offer
                  </motion.button>
                </Link>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-2 rounded-full bg-[#4caf50]/20 border border-[#4caf50]/40 text-[#4caf50] hover:bg-[#4caf50]/30 transition-all text-sm font-semibold flex items-center justify-center gap-1"
                >
                  <CheckCircle size={14} /> Apply
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#f5d36e]/10 rounded-full blur-3xl" />
      </div>
    </main>
  );
}

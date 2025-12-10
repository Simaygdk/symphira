"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { db } from "../../../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import {
  Music,
  DollarSign,
  CalendarDays,
  ArrowRight,
  User,
} from "lucide-react";

export default function MyOffersPage() {
  const musicianName = "Simay"; // 🔥 Sonradan Auth ile değiştirilecek

  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "offers");

    const q = query(
      ref,
      where("artist", "==", musicianName),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOffers(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 py-12">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center text-[#f5d36e] mb-2">
        My Offers
      </h1>
      <p className="text-neutral-300 text-center mb-10">
        All offers created for you 🎶
      </p>

      {loading ? (
        <div className="text-center mt-20 text-neutral-400">Loading...</div>
      ) : offers.length === 0 ? (
        <div className="text-center mt-20 text-neutral-400 italic">
          No offers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_0_18px_rgba(245,211,110,0.15)] hover:shadow-[0_0_25px_rgba(245,211,110,0.3)] transition"
            >
              {/* Title + Icon */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[#f5d36e] text-xl font-semibold">
                  {offer.title}
                </h2>
                <Music size={20} className="text-[#f5d36e]" />
              </div>

              {/* Description */}
              <p className="text-neutral-300 text-sm line-clamp-3 mb-4">
                {offer.description}
              </p>

              {/* Offer Info */}
              <div className="space-y-2 text-neutral-400 text-sm">

                <div className="flex items-center gap-2">
                  <DollarSign size={14} />
                  <span>{offer.budget}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={14} />
                  <span>{offer.deadline}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span className="text-neutral-300">
                    From: <span className="text-[#f5d36e]">{offer.employer || "Unknown"}</span>
                  </span>
                </div>
              </div>

              {/* Button */}
              <Link href={`/employer/${offer.id}`}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-5 py-2 rounded-full bg-[#f5d36e]/20 border border-[#f5d36e]/40 text-[#f5d36e] hover:bg-[#f5d36e]/30 transition flex items-center justify-center gap-2 font-medium"
                >
                  View Offer <ArrowRight size={16} />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}

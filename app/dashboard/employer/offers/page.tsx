"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import Link from "next/link";
import { db } from "../../../../lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { DollarSign, CalendarDays, Users } from "lucide-react";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function EmployerOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);

  // Firestore listener — tüm teklifleri çekiyoruz
  useEffect(() => {
    const q = query(
      collection(db, "offers"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(data);
    });

    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 pt-20 pb-24">

      {/* HEADER */}
      <h1
        className={`${cinzel.className} text-5xl text-[#f5d36e] font-bold text-center mb-2 drop-shadow-[0_0_25px_rgba(245,211,110,0.3)]`}
      >
        Your Offers
      </h1>

      <p className="text-center text-neutral-300">
        Manage all the offers you’ve created.
      </p>

      {/* CREATE OFFER BUTTON */}
      <div className="flex justify-center mt-8">
        <Link href="/dashboard/employer/create-offer">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-[#f5d36e]/20 border border-[#f5d36e]/40 text-[#f5d36e] font-semibold hover:bg-[#f5d36e]/30 transition-all"
          >
            + Create New Offer
          </motion.button>
        </Link>
      </div>

      {/* OFFER CARDS */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {offers.length === 0 ? (
          <p className="col-span-full text-center text-neutral-400 italic">
            No offers created yet. Start by creating your first one!
          </p>
        ) : (
          offers.map((offer) => (
            <motion.div
              key={offer.id}
              whileHover={{ scale: 1.03 }}
              className="relative bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl shadow-[0_0_25px_rgba(245,211,110,0.15)] hover:shadow-[0_0_35px_rgba(245,211,110,0.3)] transition-all"
            >
              {/* Title */}
              <h3
                className={`${poppins.className} text-xl font-semibold text-[#f5d36e] mb-3`}
              >
                {offer.title}
              </h3>

              {/* Budget */}
              <div className="flex items-center gap-2 text-neutral-300 text-sm mb-2">
                <DollarSign size={16} />
                {offer.budget}
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-2 text-neutral-300 text-sm mb-2">
                <CalendarDays size={16} />
                {offer.deadline || "No deadline"}
              </div>

              {/* Artist */}
              <div className="flex items-center gap-2 text-neutral-300 text-sm">
                <Users size={16} />
                {offer.artist || "Unspecified"}
              </div>

              {/* VIEW DETAILS BUTTON */}
              <Link href={`/dashboard/employer/offer-details/${offer.id}`}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-5 py-2 rounded-full bg-[#f5d36e]/10 border border-[#f5d36e]/40 text-[#f5d36e] font-semibold hover:bg-[#f5d36e]/20 transition-all"
                >
                  View Details
                </motion.button>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}

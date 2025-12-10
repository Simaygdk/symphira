"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { CalendarDays, DollarSign, Music, Info } from "lucide-react";

export default function OfferDetailPage() {
  const { id } = useParams();
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOffer = async () => {
      const ref = doc(db, "offers", id as string);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        setOffer({ id: snapshot.id, ...snapshot.data() });
      } else {
        setOffer(null);
      }
      setLoading(false);
    };

    fetchOffer();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-purple-300 text-xl"
        >
          Loading...
        </motion.div>
      </main>
    );
  }

  if (!offer) {
    return (
      <main className="min-h-screen flex justify-center items-center text-red-400 text-xl">
        Offer not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0714] via-[#1a0f2b] to-[#2a1342] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">

        {/* Title */}
        <h1 className="text-4xl font-bold text-purple-300 flex items-center gap-3 mb-6">
          <Music size={32} />
          {offer.title}
        </h1>

        {/* Description */}
        <p className="text-neutral-300 text-lg mb-8">{offer.description}</p>

        {/* Details */}
        <div className="space-y-4 text-neutral-200">
          <div className="flex items-center gap-3">
            <DollarSign size={20} className="text-purple-300" />
            <span className="text-lg">Budget: {offer.budget}</span>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays size={20} className="text-purple-300" />
            <span className="text-lg">Deadline: {offer.deadline}</span>
          </div>

          <div className="flex items-center gap-3">
            <Info size={20} className="text-purple-300" />
            <span className="text-lg">Artist: {offer.artist}</span>
          </div>
        </div>

        {/* BACK BUTTON */}
        <motion.a
          href="/dashboard/employer"
          whileTap={{ scale: 0.95 }}
          className="mt-10 inline-block px-6 py-3 rounded-full bg-purple-600/30 border border-purple-400 text-purple-300 hover:bg-purple-600/40 transition"
        >
          Back to Offers
        </motion.a>
      </div>
    </main>
  );
}

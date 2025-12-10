"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import { db } from "../../../../../lib/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, DollarSign, CalendarDays, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

// Şimdilik sabit, sonra auth'tan otomatik gelecek
const ARTIST_NAME = "Simay";

export default function MusicianOfferDetailsPage() {
  const { id } = useParams();
  const [offer, setOffer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // Load offer details
  useEffect(() => {
    const fetchOffer = async () => {
      const ref = doc(db, "offers", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setOffer({ id: snap.id, ...snap.data() });
      }

      setLoading(false);
    };

    fetchOffer();
  }, [id]);

  // 🔥 APPLY NOW → Başvuru ekle
  const handleApply = async () => {
    if (!offer) return;
    try {
      setApplying(true);

      await addDoc(collection(db, "applications"), {
        offerId: offer.id,
        artist: ARTIST_NAME,
        employer: offer.employer || "Unknown",
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("🎉 Your application has been submitted!");
    } catch (err) {
      console.error(err);
      alert("An error occurred while applying.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading offer...
      </main>
    );
  }

  if (!offer) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-white">
        <p className="text-red-400">Offer not found.</p>
        <Link href="/dashboard/musician/my-offers" className="mt-4 underline">
          Back to My Offers
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#09061c] via-[#1a0f33] to-[#321653] text-white px-6 pt-20 pb-24">

      <Link href="/dashboard/musician/my-offers">
        <button className="flex items-center gap-2 text-[#f5d36e] hover:text-[#ffeb9c] transition mb-6">
          <ArrowLeft size={20} />
          Back to My Offers
        </button>
      </Link>

      <h1 className={`${cinzel.className} text-4xl sm:text-5xl text-[#f5d36e] font-bold mb-3`}>
        {offer.title}
      </h1>

      <p className="text-neutral-300 max-w-xl">{offer.description}</p>

      <div className="mt-10 bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-2xl max-w-xl">

        <div className="flex items-center gap-2 text-neutral-200 text-lg mb-3">
          <DollarSign className="text-[#f5d36e]" /> {offer.budget}
        </div>

        <div className="flex items-center gap-2 text-neutral-200 text-lg mb-3">
          <CalendarDays className="text-[#f5d36e]" /> {offer.deadline}
        </div>

        <div className="flex items-center gap-2 text-neutral-200 text-lg">
          <Users className="text-[#f5d36e]" /> Employer: {offer.employer || "Unknown"}
        </div>
      </div>

      {/* APPLY BUTTON */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={applying}
        onClick={handleApply}
        className="mt-10 px-6 py-3 rounded-xl bg-[#f5d36e]/20 border border-[#f5d36e]/40 text-[#f5d36e] hover:bg-[#f5d36e]/30 transition-all font-semibold max-w-xs flex items-center justify-center gap-2"
      >
        <CheckCircle size={18} />
        {applying ? "Submitting..." : "Apply Now"}
      </motion.button>
    </main>
  );
}

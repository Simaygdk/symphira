"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import { db } from "../../../../../lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import {
  DollarSign,
  CalendarDays,
  Users,
  ArrowLeft,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function OfferDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [offer, setOffer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch offer data
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

  const confirmDelete = async () => {
    try {
      setDeleting(true);

      await deleteDoc(doc(db, "offers", id as string));

      setDeleting(false);
      alert("Offer deleted successfully!");
      router.push("/dashboard/employer/offers");
    } catch (err) {
      console.error(err);
      alert("Failed to delete offer.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
        Loading offer details...
      </main>
    );
  }

  if (!offer) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <p className="text-red-400 text-lg">Offer not found.</p>
        <Link href="/dashboard/employer/offers" className="mt-4 underline">
          Go back
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 pt-20 pb-24">

      {/* BACK BUTTON */}
      <Link href="/dashboard/employer/offers">
        <button className="flex items-center gap-2 text-[#f5d36e] hover:text-[#ffeb9c] mb-6 transition">
          <ArrowLeft size={20} />
          Back to Offers
        </button>
      </Link>

      {/* HEADER */}
      <h1
        className={`${cinzel.className} text-4xl sm:text-5xl text-[#f5d36e] font-bold mb-3 drop-shadow-[0_0_30px_rgba(245,211,110,0.4)]`}
      >
        {offer.title}
      </h1>

      <p className="text-neutral-300 max-w-xl">{offer.description}</p>

      {/* INFORMATION CARD */}
      <div className="mt-10 bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-xl max-w-xl">

        <div className="flex items-center gap-3 text-lg mb-4">
          <DollarSign className="text-[#f5d36e]" />
          <span className="text-neutral-200">{offer.budget}</span>
        </div>

        <div className="flex items-center gap-3 text-lg mb-4">
          <CalendarDays className="text-[#f5d36e]" />
          <span className="text-neutral-200">{offer.deadline}</span>
        </div>

        <div className="flex items-center gap-3 text-lg">
          <Users className="text-[#f5d36e]" />
          <span className="text-neutral-200">{offer.artist}</span>
        </div>
      </div>

      {/* DELETE BUTTON */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpenDeleteModal(true)}
        className="mt-10 px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-semibold hover:bg-red-500/30 transition-all max-w-xs flex items-center justify-center gap-2"
      >
        <Trash2 size={18} />
        Delete Offer
      </motion.button>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {openDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              className="bg-[#1b1035] p-6 rounded-2xl border border-white/20 max-w-sm w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-400">Delete Offer</h2>
                <button
                  onClick={() => setOpenDeleteModal(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-neutral-300 mb-6">
                Are you sure you want to delete <span className="text-red-300 font-semibold">{offer.title}</span>?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setOpenDeleteModal(false)}
                  className="flex-1 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


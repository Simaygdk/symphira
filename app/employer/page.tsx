"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import {
  PlusCircle,
  Users,
  DollarSign,
  CalendarDays,
  X,
  ChevronDown,
} from "lucide-react";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function EmployerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    deadline: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);

  const artists = [
    "Simay",
    "Aiden Cross",
    "Luna Mae",
    "Ravi Sol",
    "Mira Elen",
    "Noa Hale",
  ];

  // 🔸 Firestore listener
  useEffect(() => {
    const q = query(collection(db, "offers"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOffers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(fetchedOffers);
    });
    return () => unsubscribe();
  }, []);

  // 🔸 Input Handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔸 Submit to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.budget || !formData.deadline) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, "offers"), {
        ...formData,
        artist: selectedArtist || "Unspecified",
        createdAt: serverTimestamp(),
      });
      alert("✅ Offer successfully created!");
      setIsModalOpen(false);
      setFormData({ title: "", budget: "", deadline: "", description: "" });
      setSelectedArtist("");
    } catch (err) {
      console.error("❌ Error adding document:", err);
      alert("Something went wrong! Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-5 pb-24">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          textShadow: [
            "0 0 20px rgba(245,211,110,0.3)",
            "0 0 35px rgba(245,211,110,0.6)",
            "0 0 20px rgba(245,211,110,0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        className={`${cinzel.className} text-4xl sm:text-5xl md:text-6xl text-[#f5d36e] font-bold mt-16 text-center`}
      >
        Employer Dashboard
      </motion.h1>

      <p className="text-neutral-300 mt-4 text-center text-sm sm:text-base max-w-md">
        Manage your offers and connect with artists on Symphira
      </p>

      {/* CREATE OFFER BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="mt-8 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f5d36e]/20 border border-[#f5d36e]/40 text-[#f5d36e] rounded-full hover:bg-[#f5d36e]/30 transition-all text-sm sm:text-base font-semibold"
      >
        <PlusCircle size={18} />
        Create New Offer
      </motion.button>

      {/* OFFERS GRID */}
      <div className="mt-10 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-2">
        {offers.length === 0 ? (
          <p className="col-span-full text-center text-neutral-400 italic text-sm">
            No offers yet. Create your first one!
          </p>
        ) : (
          offers.map((offer) => (
            <motion.div
              key={offer.id}
              whileHover={{ scale: 1.02 }}
              className="relative p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_0_25px_rgba(245,211,110,0.15)] hover:shadow-[0_0_35px_rgba(245,211,110,0.3)] transition-all"
            >
              <h3
                className={`${poppins.className} text-lg font-semibold text-[#f5d36e] mb-2`}
              >
                {offer.title}
              </h3>
              <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2">
                <DollarSign size={14} />
                <span>{offer.budget}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2">
                <CalendarDays size={14} />
                <span>{offer.deadline}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400 text-sm">
                <Users size={14} />
                <span>{offer.artist}</span>
              </div>

              <Link href={`/employer/${offer.id}`}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full py-2 rounded-full bg-[#f5d36e]/10 border border-[#f5d36e]/40 text-[#f5d36e] hover:bg-[#f5d36e]/20 transition-all text-sm font-medium"
                >
                  View Details
                </motion.button>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#1b1035]/95 border border-[#f5d36e]/30 rounded-3xl p-6 w-full max-w-md shadow-[0_0_25px_rgba(245,211,110,0.3)] overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#f5d36e]/70 hover:text-[#f5d36e]"
              >
                <X size={20} />
              </button>

              <h2
                className={`${poppins.className} text-xl sm:text-2xl font-semibold text-[#f5d36e] mb-5 text-center`}
              >
                Create New Offer
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="title"
                  type="text"
                  placeholder="Offer Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#f5d36e]/50"
                />

                {/* Artist Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#f5d36e]/50"
                  >
                    <span>
                      {selectedArtist
                        ? `Artist: ${selectedArtist}`
                        : "Select Artist"}
                    </span>
                    <ChevronDown size={18} className="text-[#f5d36e]" />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 mt-2 w-full bg-[#1b1035]/95 border border-[#f5d36e]/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(245,211,110,0.2)]"
                      >
                        {artists.map((artist) => (
                          <li
                            key={artist}
                            onClick={() => {
                              setSelectedArtist(artist);
                              setIsDropdownOpen(false);
                            }}
                            className="px-4 py-2 text-sm text-white hover:bg-[#f5d36e]/20 cursor-pointer"
                          >
                            {artist}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <input
                  name="budget"
                  type="text"
                  placeholder="Budget (e.g. $300)"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#f5d36e]/50"
                />

                <input
                  name="deadline"
                  type="text"
                  placeholder="Deadline (e.g. Nov 15, 2025)"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#f5d36e]/50"
                />

                <textarea
                  name="description"
                  placeholder="Description..."
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#f5d36e]/50 resize-none"
                />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#f5d36e]/30 to-[#f5d36e]/40 border border-[#f5d36e]/50 text-[#f5d36e] hover:from-[#f5d36e]/40 hover:to-[#f5d36e]/60 transition-all font-semibold"
                >
                  {isSubmitting ? "Submitting..." : "Submit Offer"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import { db } from "../../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ChevronDown, X, CheckCircle } from "lucide-react";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

const ARTIST_LIST = [
  "Simay",
  "Aiden Cross",
  "Luna Mae",
  "Ravi Sol",
  "Mira Elen",
  "Noa Hale",
];

export default function CreateOfferPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    budget: "",
    deadline: "",
    description: "",
  });

  const [selectedArtist, setSelectedArtist] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.budget || !selectedArtist) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "offers"), {
        ...form,
        artist: selectedArtist,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/employer/offers");
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating the offer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 pt-20 pb-32 relative">
      
      {/* Header */}
      <h1
        className={`${cinzel.className} text-5xl text-[#f5d36e] font-bold text-center drop-shadow-[0_0_25px_rgba(245,211,110,0.3)]`}
      >
        Create Offer
      </h1>

      <p className="text-center text-neutral-300 mt-3">
        Fill out the fields below to create a new collaboration offer.
      </p>

      <div className="max-w-xl mx-auto mt-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(245,211,110,0.15)]">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <input
            name="title"
            type="text"
            placeholder="Offer Title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:border-[#f5d36e]/50 outline-none"
            required
          />

          {/* Artist Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-4 py-3 flex items-center justify-between rounded-xl bg-white/10 border border-white/20 text-white"
            >
              {selectedArtist ? `Artist: ${selectedArtist}` : "Select Artist"}
              <ChevronDown size={20} className="text-[#f5d36e]" />
            </button>

            {dropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute z-10 mt-2 w-full bg-[#1b1035]/95 border border-[#f5d36e]/30 rounded-xl overflow-hidden"
              >
                {ARTIST_LIST.map((artist) => (
                  <li
                    key={artist}
                    onClick={() => {
                      setSelectedArtist(artist);
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-[#f5d36e]/20 cursor-pointer"
                  >
                    {artist}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Budget */}
          <input
            name="budget"
            type="text"
            placeholder="Budget (e.g. $300)"
            value={form.budget}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:border-[#f5d36e]/50 outline-none"
            required
          />

          {/* Deadline */}
          <input
            name="deadline"
            type="text"
            placeholder="Deadline (e.g. Jan 25, 2026)"
            value={form.deadline}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:border-[#f5d36e]/50 outline-none"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Project Description..."
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 resize-none focus:border-[#f5d36e]/50 outline-none"
          />

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#f5d36e]/20 border border-[#f5d36e]/40 text-[#f5d36e] font-semibold hover:bg-[#f5d36e]/30 transition-all"
          >
            {submitting ? "Submitting..." : "Create Offer"}
          </motion.button>
        </form>
      </div>

      {/* Success Popup */}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#1b1035] border border-[#4caf50]/40 text-[#4caf50] px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
        >
          <CheckCircle size={20} />
          Offer successfully created!
        </motion.div>
      )}
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import { db } from "../../../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function EditOfferPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    deadline: "",
    description: "",
    artist: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch offer data
  useEffect(() => {
    const fetchOffer = async () => {
      const ref = doc(db, "offers", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as any;
        setFormData({
          title: data.title || "",
          budget: data.budget || "",
          deadline: data.deadline || "",
          description: data.description || "",
          artist: data.artist || "",
        });
      }

      setLoading(false);
    };

    fetchOffer();
  }, [id]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    const ref = doc(db, "offers", id as string);

    try {
      setSaving(true);

      await updateDoc(ref, {
        title: formData.title,
        budget: formData.budget,
        deadline: formData.deadline,
        description: formData.description,
        artist: formData.artist,
      });

      alert("Offer updated successfully!");
      router.push(`/dashboard/employer/offer-details/${id}`);
    } catch (err) {
      alert("Something went wrong while saving changes.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 pt-20 pb-24">

      {/* Back Button */}
      <Link href={`/dashboard/employer/offer-details/${id}`}>
        <button className="flex items-center gap-2 text-[#f5d36e] hover:text-[#ffeb9c] mb-6 transition">
          <ArrowLeft size={20} />
          Back to Details
        </button>
      </Link>

      {/* Header */}
      <h1
        className={`${cinzel.className} text-4xl sm:text-5xl text-[#f5d36e] font-bold drop-shadow-[0_0_30px_rgba(245,211,110,0.4)] mb-10`}
      >
        Edit Offer
      </h1>

      {/* FORM */}
      <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-2xl max-w-xl">

        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Offer Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <input
            type="text"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <input
            type="text"
            name="deadline"
            placeholder="Deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <input
            type="text"
            name="artist"
            placeholder="Artist"
            value={formData.artist}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          {/* SAVE BUTTON */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={saving}
            onClick={saveChanges}
            className="mt-5 w-full py-3 rounded-xl bg-[#f5d36e]/20 border border-[#f5d36e]/40 text-[#f5d36e] font-semibold hover:bg-[#f5d36e]/30 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../../../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {
  CalendarDays,
  DollarSign,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function ApplicationsPage() {
  const musicianName = "Simay"; // Sonradan Auth'a bağlanacak

  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // applications → offerId + musicianName + status kaydediyorsun
    const q = query(
      collection(db, "applications"),
      where("musician", "==", musicianName)
    );

    const unsub = onSnapshot(q, async (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setApps(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-[#f5d36e] mb-2">
        Applications
      </h1>
      <p className="text-neutral-300 text-center mb-10">
        Offers you have applied to 🎵
      </p>

      {loading ? (
        <div className="text-center mt-20 text-neutral-400">Loading...</div>
      ) : apps.length === 0 ? (
        <div className="text-center mt-20 text-neutral-400 italic">
          No applications yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {apps.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_0_20px_rgba(245,211,110,0.2)] transition"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-[#f5d36e] font-semibold">
                  {app.offerTitle}
                </h3>
                <CheckCircle size={20} className="text-green-400" />
              </div>

              <div className="flex items-center gap-2 text-neutral-300 mb-2">
                <DollarSign size={15} /> {app.budget}
              </div>

              <div className="flex items-center gap-2 text-neutral-300">
                <CalendarDays size={15} /> {app.deadline}
              </div>

              <Link href={`/employer/${app.offerId}`}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-5 py-2 rounded-full bg-[#f5d36e]/10 border border-[#f5d36e]/40 text-[#f5d36e] font-medium flex justify-center items-center gap-2"
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

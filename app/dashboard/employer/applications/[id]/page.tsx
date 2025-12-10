"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import { db } from "../../../../../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Users, CalendarDays, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function ApplicationsDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "applications"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setApplications(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 pt-20 pb-24">

      {/* HEADER */}
      <h1
        className={`${cinzel.className} text-5xl text-center text-[#f5d36e] font-bold drop-shadow-[0_0_25px_rgba(245,211,110,0.3)]`}
      >
        Applications Dashboard
      </h1>

      <p className="text-center mt-3 text-neutral-300">
        View all applications submitted by artists
      </p>

      {/* LOADING */}
      {loading && (
        <p className="text-center mt-10 text-neutral-400">Loading applications...</p>
      )}

      {/* CARDS GRID */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {!loading && applications.length === 0 && (
          <p className="col-span-full text-center text-neutral-400 italic">
            No applications yet.
          </p>
        )}

        {applications.map((app) => (
          <motion.div
            key={app.id}
            whileHover={{ scale: 1.03 }}
            className="relative p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_0_25px_rgba(245,211,110,0.15)] hover:shadow-[0_0_35px_rgba(245,211,110,0.3)] transition-all"
          >
            {/* Artist */}
            <div className="flex items-center gap-2 text-[#f5d36e] text-lg font-semibold mb-3">
              <Users size={18} />
              {app.artist}
            </div>

            {/* Offer Title */}
            <div className="flex items-center gap-2 text-neutral-300 text-sm mb-2">
              <FileText size={16} />
              Offer: <span className="text-white ml-1">{app.offerId}</span>
            </div>

            {/* Employer */}
            <div className="flex items-center gap-2 text-neutral-300 text-sm mb-2">
              <Users size={16} />
              Employer: {app.employer}
            </div>

            {/* Created At */}
            <div className="flex items-center gap-2 text-neutral-300 text-sm">
              <CalendarDays size={16} />
              {app.createdAt?.toDate
                ? app.createdAt.toDate().toLocaleString()
                : "Unknown date"}
            </div>

            {/* DETAILS BUTTON */}
            <Link href={`/dashboard/employer/application/${app.id}`}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-5 w-full py-2 rounded-full bg-[#f5d36e]/10 border border-[#f5d36e]/40 text-[#f5d36e] hover:bg-[#f5d36e]/20 transition-all flex items-center justify-center gap-2"
              >
                View Application
                <ArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

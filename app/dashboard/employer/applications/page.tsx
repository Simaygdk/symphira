"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../../../../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import { CalendarDays, User, FileText, Check, XCircle, Eye } from "lucide-react";
import Link from "next/link";

const cinzel = Cinzel_Decorative({ subsets: ["latin"], weight: ["700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600"] });

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);

  // Firestore'dan başvuruları dinle
  useEffect(() => {
    const q = query(
      collection(db, "applications"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplications(list);
    });

    return () => unsub();
  }, []);

  // STATUS UPDATE
  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "applications", appId), {
        status: newStatus,
      });
      alert("Başvuru durumu güncellendi!");
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 pb-24 pt-20">
      <h1
        className={`${cinzel.className} text-5xl text-center text-[#f5d36e] font-bold`}
      >
        Incoming Applications
      </h1>
      <p className="text-neutral-300 text-center mt-2">
        Artists who applied to your offers 🎵
      </p>

      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.length === 0 ? (
          <p className="text-neutral-400 italic col-span-full text-center">
            No applications yet.
          </p>
        ) : (
          applications.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg"
            >
              <div className="mb-3">
                <p className="flex items-center gap-2 text-[#f5d36e] text-lg font-semibold">
                  <User size={18} /> {app.artist}
                </p>
              </div>

              <p className="text-neutral-300 text-sm mb-3 flex items-center gap-2">
                <FileText size={14} /> {app.message || "No message provided"}
              </p>

              <p className="text-neutral-300 text-sm mb-2 flex items-center gap-2">
                <CalendarDays size={14} />{" "}
                {app.createdAt?.toDate
                  ? app.createdAt.toDate().toLocaleString()
                  : "-"}
              </p>

              {/* STATUS */}
              <p className="text-sm mb-4">
                <span
                  className={
                    app.status === "pending"
                      ? "text-yellow-400"
                      : app.status === "accepted"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  Status: {app.status}
                </span>
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => updateStatus(app.id, "accepted")}
                  className="w-full py-2 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500/30 flex items-center justify-center gap-1"
                >
                  <Check size={16} /> Accept
                </button>

                <button
                  onClick={() => updateStatus(app.id, "rejected")}
                  className="w-full py-2 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 flex items-center justify-center gap-1"
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>

              <Link
                href={`/dashboard/employer/${app.offerId}`}
                className="block mt-4"
              >
                <button className="w-full py-2 rounded-full bg-[#f5d36e]/10 border border-[#f5d36e]/40 text-[#f5d36e] hover:bg-[#f5d36e]/20 flex items-center justify-center gap-1">
                  <Eye size={14} /> View Offer
                </button>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}

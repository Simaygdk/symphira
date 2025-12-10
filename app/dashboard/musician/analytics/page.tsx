"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../../../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Line, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const musicianName = "Simay";

  const [plays, setPlays] = useState<number[]>([]);
  const [songs, setSongs] = useState<string[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "music"),
      where("artist", "==", musicianName)
    );

    const unsub = onSnapshot(q, (snap) => {
      const fetchedPlays = snap.docs.map((d) => d.data().plays || 0);
      const fetchedTitles = snap.docs.map((d) => d.data().title || "Unknown");
      setPlays(fetchedPlays);
      setSongs(fetchedTitles);
    });

    return () => unsub();
  }, []);

  const lineData = {
    labels: songs,
    datasets: [
      {
        label: "Plays",
        data: plays,
        borderColor: "#f5d36e",
        backgroundColor: "rgba(245,211,110,0.3)",
      },
    ],
  };

  return (
    <main className="min-h-screen px-6 py-12 text-white bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560]">
      <h1 className="text-4xl font-bold text-center text-[#f5d36e] mb-8">
        Analytics
      </h1>

      <div className="max-w-4xl mx-auto bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-xl">
        <h2 className="text-xl text-[#f5d36e] mb-4">Total Plays</h2>
        <Line data={lineData} />
      </div>

      <div className="max-w-4xl mx-auto mt-10 bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-xl">
        <h2 className="text-xl text-[#f5d36e] mb-4">Song Performance</h2>
        <Bar data={lineData} />
      </div>
    </main>
  );
}

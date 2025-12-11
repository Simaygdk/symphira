"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../../lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

export default function WeeklySummary() {
  const user = auth.currentUser;

  const [dailyCounts, setDailyCounts] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const [trend, setTrend] = useState<"up" | "down" | "same">("same");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "history"),
      where("userId", "==", user.uid),
      orderBy("playedAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => d.data());

      const days: Record<string, number> = {};

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split("T")[0];
        days[key] = 0;
      }

      items.forEach((item) => {
        if (!item.playedAt) return;

        const playedDate = new Date(item.playedAt.seconds * 1000)
          .toISOString()
          .split("T")[0];

        if (days[playedDate] !== undefined) {
          days[playedDate] += 1;
        }
      });

      const array = Object.values(days).reverse();
      setDailyCounts(array);

      const newTotal = array.reduce((a, b) => a + b, 0);
      setTotal(newTotal);

      if (array.length >= 2) {
        const diff = array[array.length - 1] - array[array.length - 2];
        if (diff > 0) setTrend("up");
        else if (diff < 0) setTrend("down");
        else setTrend("same");
      }
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto mt-16 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
      <h2 className="text-xl font-semibold text-purple-200 mb-2">
        Weekly Listening Summary
      </h2>

      <p className="text-neutral-400 text-sm">
        Total Plays (Last 7 Days):{" "}
        <span className="text-purple-300 font-semibold">{total}</span>
      </p>

      <div className="flex gap-3 mt-6 h-28 items-end">
        {dailyCounts.map((value, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="flex-1 bg-purple-400/40 rounded-lg"
            style={{
              height: `${value * 10 + 10}px`,
            }}
          ></motion.div>
        ))}
      </div>

      <div className="mt-4 text-sm text-neutral-300">
        Trend:{" "}
        {trend === "up" ? (
          <span className="text-green-400">▲ Increasing</span>
        ) : trend === "down" ? (
          <span className="text-red-400">▼ Decreasing</span>
        ) : (
          <span className="text-neutral-400">– Stable</span>
        )}
      </div>
    </div>
  );
}

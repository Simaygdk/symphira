"use client";

import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

export default function SellerMarketPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filtered =
    filter === "all"
      ? products
      : products.filter((p) => p.type === filter);

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#0e0619] via-[#1b1031] to-[#31144d] text-white">
      <h1 className="text-4xl font-bold text-center text-purple-300 drop-shadow-[0_0_30px_rgba(180,50,255,0.35)]">
        Symphira Marketplace
      </h1>

      <p className="text-neutral-300 text-center mt-3 mb-8">
        Discover beats, sound packs, loops and stems created by Symphira sellers.
      </p>

      {/* FILTER BUTTONS */}
      <div className="flex justify-center gap-3 mb-10">
        {["all", "beat", "loop", "pack", "stem"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl border transition ${
              filter === t
                ? "bg-purple-600 border-purple-400"
                : "bg-white/10 border-white/20 hover:bg-white/20"
            }`}
          >
            {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-neutral-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-neutral-400 italic">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-xl shadow-xl"
            >
              <div className="w-full h-44 rounded-xl overflow-hidden bg-black/20 mb-4">
                <img
                  src={
                    p.coverURL ||
                    "https://placehold.co/600x400/1a0f2d/ffffff?text=No+Cover"
                  }
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-lg font-semibold text-purple-200 truncate">
                {p.title}
              </h2>

              <p className="text-neutral-400 text-sm">{p.type.toUpperCase()}</p>

              <p className="text-purple-300 text-xl font-semibold mt-2">
                ${p.price}
              </p>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => {
                    const audio = new Audio(p.audioURL);
                    audio.play();
                  }}
                  className="flex items-center gap-1 text-green-300 hover:text-green-400 transition"
                >
                  <PlayCircle size={20} />
                  Play
                </button>

                <Link
                  href={`/dashboard/seller/market/${p.id}`}
                  className="text-blue-300 hover:text-blue-400 transition"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

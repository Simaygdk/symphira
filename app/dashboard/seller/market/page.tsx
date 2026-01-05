"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "../../../../lib/firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { PlayCircle } from "lucide-react";

type Product = {
  id: string;
  title: string;
  price: number;
  type: string;
  coverURL?: string;
  audioURL?: string;
  status?: string;
};

export default function SellerMarketPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  useEffect(() => {
    return onSnapshot(collection(db, "products"), snap => {
      const data: Product[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Product, "id">)
      }));
      setProducts(data);
    });
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p: Product) => {
      if (!p.coverURL && p.price === 0) return false;
      if (category !== "all" && p.type !== category) return false;

      if (priceRange === "r1" && (p.price < 100 || p.price > 1000)) return false;
      if (priceRange === "r2" && (p.price < 1000 || p.price > 5000)) return false;
      if (priceRange === "r3" && (p.price < 5000 || p.price > 10000)) return false;
      if (priceRange === "r4" && (p.price < 10000 || p.price > 20000)) return false;
      if (priceRange === "r5" && p.price < 20000) return false;

      return true;
    });
  }, [products, category, priceRange]);

  const buy = async (id: string) => {
    await updateDoc(doc(db, "products", id), { status: "sold" });
    alert("Purchase successful");
  };

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#0e0619] via-[#1b1031] to-[#31144d] text-white">
      <h1 className="text-4xl font-bold text-center text-purple-300 mb-8">
        Symphira Marketplace
      </h1>

      <div className="flex justify-center gap-4 mb-10">
        <select
          onChange={e => setCategory(e.target.value)}
          className="bg-[#1b1031] text-white border border-white/20 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option className="bg-[#1b1031] text-white" value="all">All</option>
          <option className="bg-[#1b1031] text-white" value="beat">Strings</option>
          <option className="bg-[#1b1031] text-white" value="loop">Percussion</option>
          <option className="bg-[#1b1031] text-white" value="pack">Wind</option>
          <option className="bg-[#1b1031] text-white" value="stem">Electronic</option>
        </select>

        <select
          onChange={e => setPriceRange(e.target.value)}
          className="bg-[#1b1031] text-white border border-white/20 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option className="bg-[#1b1031] text-white" value="all">All Prices</option>
          <option className="bg-[#1b1031] text-white" value="r1">100 - 1000</option>
          <option className="bg-[#1b1031] text-white" value="r2">1000 - 5000</option>
          <option className="bg-[#1b1031] text-white" value="r3">5000 - 10000</option>
          <option className="bg-[#1b1031] text-white" value="r4">10000 - 20000</option>
          <option className="bg-[#1b1031] text-white" value="r5">20000+</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filtered.map((p: Product) => {
          const status = p.status || "active";

          return (
            <div
              key={p.id}
              className={`relative bg-white/10 border border-white/20 rounded-2xl p-4 ${
                status === "sold" ? "grayscale opacity-70" : ""
              }`}
            >
              {status === "sold" && (
                <span className="absolute top-3 left-3 bg-red-600 text-xs px-3 py-1 rounded-full">
                  SOLD OUT
                </span>
              )}

              <img
                src={p.coverURL}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <h2 className="text-lg font-semibold">{p.title}</h2>

              {p.price > 0 && (
                <p className="text-purple-300">₺{p.price}</p>
              )}

              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => p.audioURL && new Audio(p.audioURL).play()}
                  className="text-green-300"
                >
                  <PlayCircle size={18} />
                </button>

                {status === "active" && (
                  <button
                    onClick={() => buy(p.id)}
                    className="bg-purple-600 px-3 py-1 rounded"
                  >
                    Buy
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { PlayCircle, User, DollarSign } from "lucide-react";

export default function MarketProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      const snap = await getDoc(doc(db, "products", id as string));
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-300">
        Product not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#0c0516] via-[#170d28] to-[#2a1344] text-white flex justify-center">
      <div className="w-full max-w-4xl">

        {/* COVER IMAGE */}
        <div className="w-full h-72 rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-black/30">
          <img
            src={
              product.coverURL ||
              "https://placehold.co/600x400/1a0f2d/ffffff?text=No+Cover"
            }
            className="w-full h-full object-cover"
          />
        </div>

        {/* TITLE + PRICE */}
        <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-4xl font-bold text-purple-300">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-purple-200">
            <DollarSign size={20} />
            <span className="text-2xl font-semibold">${product.price}</span>
          </div>
        </div>

        {/* TYPE + SELLER */}
        <div className="mt-3 flex items-center gap-6 text-neutral-300 flex-wrap">
          <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-sm">
            {product.type.toUpperCase()}
          </span>

          <div className="flex items-center gap-2">
            <User size={16} className="text-purple-300" />
            <span className="text-sm">Seller: {product.sellerId}</span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-6 text-neutral-300 leading-relaxed">
          {product.description || "No description provided."}
        </p>

        {/* ACTION BUTTONS */}
        <div className="mt-10 flex items-center gap-4 flex-wrap">

          <button
            onClick={() => {
              const audio = new Audio(product.audioURL);
              audio.play();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600/40 border border-purple-400 rounded-xl hover:bg-purple-600/50 transition"
          >
            <PlayCircle size={22} />
            Play Preview
          </button>

          <button
            className="px-6 py-3 bg-green-600/40 border border-green-400 rounded-xl hover:bg-green-600/50 transition text-green-200"
          >
            Buy Now
          </button>

        </div>

      </div>
    </main>
  );
}

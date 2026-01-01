"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type Product = {
  id: string;
  title: string;
  price: number;
  coverURL?: string;
};

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "products"),
        where("sellerId", "==", user.uid)
      );

      const unsubscribeProducts = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        setProducts(list);
        setLoading(false);
      });

      return () => unsubscribeProducts();
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    await deleteDoc(doc(db, "products", id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-300">
        Loading...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        No products found
      </div>
    );
  }

  return (
    <main className="min-h-screen px-10 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">
      <h1 className="text-4xl font-bold text-purple-300 mb-12">
        Your Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl"
          >
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-black/30 mb-4">
              <img
                src={
                  product.coverURL ||
                  "https://placehold.co/600x400/1b0f2d/ffffff?text=No+Image"
                }
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-xl font-semibold text-purple-200">
              {product.title}
            </h2>

            <p className="text-purple-300 mt-1">
              {product.price} TL
            </p>

            <button
              onClick={() => handleDelete(product.id)}
              className="mt-4 w-full py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

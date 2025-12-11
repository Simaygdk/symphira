"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "../../../../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Trash2, Edit3, PlayCircle } from "lucide-react";

export default function SellerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "products"),
      where("sellerId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const deleteProduct = async (id: string, audioURL: string, coverURL: string) => {
    const ok = confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "products", id));

      if (audioURL) await deleteObject(ref(storage, audioURL));
      if (coverURL) await deleteObject(ref(storage, coverURL));

      alert("Product deleted.");
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#10081b] via-[#1b0f2d] to-[#2b1142] text-white">
      <h1 className="text-4xl font-bold text-purple-300 mb-10 text-center">
        Your Products
      </h1>

      {loading ? (
        <p className="text-center text-neutral-400">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-neutral-400 italic">
          You haven't uploaded any products yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-5 shadow-xl"
            >
              <div className="relative w-full h-44 mb-4 rounded-lg overflow-hidden bg-black/30">
                <img
                  src={
                    p.coverURL ||
                    "https://placehold.co/600x400/1b0f2d/ffffff?text=No+Cover"
                  }
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-xl font-semibold text-purple-200 truncate">
                {p.title}
              </h2>

              <p className="text-neutral-400 text-sm mt-1 line-clamp-2">
                {p.description}
              </p>

              <p className="text-purple-300 text-lg font-semibold mt-2">
                ${p.price}
              </p>

              <div className="mt-4 flex items-center gap-3">
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

                <button
                  onClick={() => router.push(`/dashboard/seller/products/${p.id}`)}
                  className="flex items-center gap-1 text-blue-300 hover:text-blue-400 transition"
                >
                  <Edit3 size={18} />
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(p.id, p.audioURL, p.coverURL)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

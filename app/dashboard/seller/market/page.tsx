"use client";
// Bu sayfa client componenttir çünkü Firestore, state ve etkileşimli UI içerir.

import { useEffect, useMemo, useState } from "react";
// Ürün listesi, filtreleme ve modal kontrolü için hook'lar.

import { db } from "../../../../lib/firebase";
// Firestore veritabanı erişimi.

import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// Ürünleri dinlemek ve satın alma durumunu güncellemek için.

import { PlayCircle, X } from "lucide-react";
// Önizleme ve modal kapatma ikonları.

// Market sayfasında kullanılan ürün tipi
type Product = {
  id: string;
  title: string;
  description?: string;
  price: number;
  type: string;
  coverURL?: string;
  audioURL?: string;
  status?: string;
};

export default function SellerMarketPage() {
  // Firestore’dan gelen tüm ürünler
  const [products, setProducts] = useState<Product[]>([]);

  // Filtreler
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Açıklaması görüntülenecek ürün (modal için)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Ürünleri Firestore’dan gerçek zamanlı dinle
  useEffect(() => {
    return onSnapshot(collection(db, "products"), (snap) => {
      const data: Product[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Product, "id">),
      }));
      setProducts(data);
    });
  }, []);

  // Filtrelenmiş ürün listesi
  const filtered = useMemo(() => {
    return products.filter((p) => {
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

  // Satın alma işlemi
  const buy = async (id: string) => {
    await updateDoc(doc(db, "products", id), { status: "sold" });
    alert("Purchase successful");
  };

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#0e0619] via-[#1b1031] to-[#31144d] text-white">

      <h1 className="text-4xl font-bold text-center text-purple-300 mb-8">
        Symphira Marketplace
      </h1>

      {/* FİLTRELER */}
      <div className="flex justify-center gap-4 mb-10">
        <select onChange={(e) => setCategory(e.target.value)} className="bg-[#1b1031] border border-white/20 rounded px-4 py-2">
          <option value="all">All</option>
          <option value="beat">Strings</option>
          <option value="loop">Percussion</option>
          <option value="pack">Wind</option>
          <option value="stem">Electronic</option>
        </select>

        <select onChange={(e) => setPriceRange(e.target.value)} className="bg-[#1b1031] border border-white/20 rounded px-4 py-2">
          <option value="all">All Prices</option>
          <option value="r1">100 - 1000</option>
          <option value="r2">1000 - 5000</option>
          <option value="r3">5000 - 10000</option>
          <option value="r4">10000 - 20000</option>
          <option value="r5">20000+</option>
        </select>
      </div>

      {/* ÜRÜN KARTLARI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filtered.map((p) => {
          const status = p.status || "active";

          return (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`relative bg-white/10 border border-white/20 rounded-2xl p-4 cursor-pointer ${
                status === "sold" ? "grayscale opacity-70" : ""
              }`}
            >
              {status === "sold" && (
                <span className="absolute top-3 left-3 bg-red-600 text-xs px-3 py-1 rounded-full">
                  SOLD OUT
                </span>
              )}

              <img src={p.coverURL} className="w-full h-40 object-cover rounded mb-3" />

              <h2 className="text-lg font-semibold">{p.title}</h2>

              {/* KISA AÇIKLAMA */}
              {p.description && (
                <p className="text-sm text-white/60 mt-1 line-clamp-3">
                  {p.description}
                </p>
              )}

              {p.price > 0 && <p className="text-purple-300 mt-2">₺{p.price}</p>}

              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    p.audioURL && new Audio(p.audioURL).play();
                  }}
                  className="text-green-300"
                >
                  <PlayCircle size={18} />
                </button>

                {status === "active" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      buy(p.id);
                    }}
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

      {/* 🔥 AÇIKLAMA MODALI */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1b1031] max-w-lg w-full rounded-2xl p-6 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedProduct.title}
            </h2>

            <p className="text-white/80 whitespace-pre-line">
              {selectedProduct.description || "No description provided."}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

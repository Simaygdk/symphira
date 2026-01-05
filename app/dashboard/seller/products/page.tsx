"use client";
// Bu sayfa client componenttir çünkü state, effect ve Firebase kullanır.

import { useEffect, useState } from "react";
// Ürün listesi ve loading durumu için state kullanılır.

import { auth, db } from "@/lib/firebase";
// Firebase Auth (kullanıcı bilgisi) ve Firestore erişimi.

import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
// Ürünleri çekmek ve silmek için Firestore fonksiyonları.

import { onAuthStateChanged } from "firebase/auth";
// Kullanıcının giriş durumunu dinlemek için kullanılır.

// Satıcının ürünleri için kullanılan tip
type Product = {
  id: string;
  // Firestore doküman ID’si

  title: string;
  // Ürün başlığı

  price: number;
  // Ürün fiyatı

  coverURL?: string;
  // Ürün kapak görseli (opsiyonel)
};

export default function SellerProductsPage() {
  // Satıcıya ait ürünler
  const [products, setProducts] = useState<Product[]>([]);

  // Ürünler yükleniyor mu?
  const [loading, setLoading] = useState(true);

  // Sayfa açıldığında çalışır
  useEffect(() => {
    // Kullanıcı giriş/çıkış durumunu dinler
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Kullanıcı yoksa listeleme yapılmaz
      if (!user) {
        setLoading(false);
        return;
      }

      // Sadece giriş yapan satıcıya ait ürünler çekilir
      const q = query(
        collection(db, "products"),
        where("sellerId", "==", user.uid)
      );

      // Ürünler Firestore’dan gerçek zamanlı dinlenir
      const unsubscribeProducts = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        setProducts(list);
        setLoading(false);
      });

      // Auth değiştiğinde ürün dinleyicisi kapatılır
      return () => unsubscribeProducts();
    });

    // Sayfadan çıkıldığında auth dinleyicisi kapatılır
    return () => unsubscribeAuth();
  }, []);

  // Ürün silme işlemi
  const handleDelete = async (id: string) => {
    // Kullanıcıdan silme onayı alınır
    const ok = confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    // Firestore’dan ürün dokümanı silinir
    await deleteDoc(doc(db, "products", id));
  };

  // Ürünler yüklenirken gösterilen ekran
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-300">
        Loading...
      </div>
    );
  }

  // Hiç ürün yoksa gösterilen ekran
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        No products found
      </div>
    );
  }

  return (
    <main className="min-h-screen px-10 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">

      {/* Sayfa başlığı */}
      <h1 className="text-4xl font-bold text-purple-300 mb-12">
        Your Products
      </h1>

      {/* Ürün kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl"
          >
            {/* Ürün görseli */}
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

            {/* Ürün başlığı */}
            <h2 className="text-xl font-semibold text-purple-200">
              {product.title}
            </h2>

            {/* Ürün fiyatı */}
            <p className="text-purple-300 mt-1">
              {product.price} TL
            </p>

            {/* Silme butonu */}
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

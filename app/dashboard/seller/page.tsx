"use client";
// Bu sayfa client componenttir çünkü animasyon ve client-side navigation kullanır.

import { motion } from "framer-motion";
// Kartlara hover ve tap animasyonları eklemek için kullanılır.

import Link from "next/link";
// Sayfalar arası yönlendirme için Next.js Link bileşeni.

import { Package, PlusCircle, ShoppingBag } from "lucide-react";
// Dashboard kartlarında kullanılan ikonlar.

export default function SellerDashboard() {
  // Satıcıya gösterilecek dashboard kartları
  const cards = [
    {
      title: "Upload Product",
      // Satıcının yeni ürün eklediği sayfa
      desc: "Sell beats, loops, sound packs or stems.",
      icon: <PlusCircle size={30} />,
      href: "/dashboard/seller/upload",
    },
    {
      title: "My Products",
      // Satıcının kendi ürünlerini yönettiği sayfa
      desc: "Manage, edit or delete your listed products.",
      icon: <Package size={30} />,
      href: "/dashboard/seller/products",
    },
    {
      title: "Marketplace",
      // Ürünlerin alıcı tarafında nasıl göründüğünü inceleme
      desc: "View how your products appear in Symphira store.",
      icon: <ShoppingBag size={30} />,
      href: "/dashboard/seller/market",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden text-white">

      {/* Arka plan için gradient katman */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />

      {/* Üst kısımda dekoratif mor blur efekti */}
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      {/* İçerik alanı */}
      <div className="relative z-10 px-6 py-16">

        {/* Sayfa başlığı */}
        <h1 className="text-5xl font-bold text-purple-300 text-center drop-shadow-[0_0_30px_rgba(180,50,255,0.35)]">
          Seller Dashboard
        </h1>

        {/* Açıklama metni */}
        <p className="text-neutral-300 text-center mt-3 max-w-lg mx-auto">
          Upload and manage your digital music products.
        </p>

        {/* Dashboard kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          {cards.map((card) => (
            <Link key={card.title} href={card.href}>
              <motion.div
                // Hover ve tıklama animasyonları
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20
                shadow-[0_0_20px_rgba(150,70,255,0.15)] hover:shadow-[0_0_30px_rgba(150,70,255,0.35)]
                transition cursor-pointer"
              >
                {/* Kart ikonu */}
                <div className="text-purple-300 mb-4">
                  {card.icon}
                </div>

                {/* Kart başlığı */}
                <h2 className="text-2xl font-semibold">
                  {card.title}
                </h2>

                {/* Kart açıklaması */}
                <p className="text-neutral-300 mt-2 text-sm">
                  {card.desc}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

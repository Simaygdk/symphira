"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, PlusCircle, ShoppingBag } from "lucide-react";

export default function SellerDashboard() {
  const cards = [
    {
      title: "Upload Product",
      desc: "Sell beats, loops, sound packs or stems.",
      icon: <PlusCircle size={30} />,
      href: "/dashboard/seller/upload",
    },
    {
      title: "My Products",
      desc: "Manage, edit or delete your listed products.",
      icon: <Package size={30} />,
      href: "/dashboard/seller/products",
    },
    {
      title: "Marketplace",
      desc: "View how your products appear in Symphira store.",
      icon: <ShoppingBag size={30} />,
      href: "/dashboard/seller/market",
    },
  ];

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#10091e] via-[#1a0f30] to-[#2c154a] text-white">
      <h1 className="text-5xl font-bold text-purple-300 text-center drop-shadow-[0_0_30px_rgba(180,50,255,0.35)]">
        Seller Dashboard
      </h1>

      <p className="text-neutral-300 text-center mt-3 max-w-lg mx-auto">
        Upload and manage your digital music products.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20
              shadow-[0_0_20px_rgba(150,70,255,0.15)] hover:shadow-[0_0_30px_rgba(150,70,255,0.35)]
              transition cursor-pointer"
            >
              <div className="text-purple-300 mb-4">{card.icon}</div>
              <h2 className="text-2xl font-semibold">{card.title}</h2>
              <p className="text-neutral-300 mt-2 text-sm">{card.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </main>
  );
}

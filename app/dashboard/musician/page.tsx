"use client";
// Bu sayfa client componenttir çünkü animasyon ve etkileşimli UI içerir.

import { motion } from "framer-motion";
// Kartlara hover ve tıklama animasyonu eklemek için kullanılır.

import Link from "next/link";
// Dashboard kartlarından ilgili sayfalara yönlendirme yapmak için.

import { Upload, Library, User } from "lucide-react";
// Dashboard kartlarında kullanılan ikonlar.

export default function MusicianDashboard() {
  // Dashboard üzerinde gösterilecek kartların listesi
  const cards = [
    {
      title: "Upload Music",
      // Kullanıcının yeni track yüklemesini anlatır
      desc: "Share your sounds with the world.",
      // Kart tıklandığında gidilecek sayfa
      href: "/dashboard/musician/upload",
      // Kart üzerinde gösterilen ikon
      icon: <Upload size={30} />,
    },
    {
      title: "Your Library",
      // Kullanıcının yüklediği trackleri görüp silebildiği alan
      desc: "Manage and edit your released tracks.",
      href: "/dashboard/musician/library",
      icon: <Library size={30} />,
    },
    {
      title: "Profile",
      // Müzisyenin profil bilgilerini yönettiği alan
      desc: "Update your artist details and portfolio.",
      href: "/dashboard/musician/profile",
      icon: <User size={30} />,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden text-white">

      {/* Arka plan gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />

      {/* Üst kısımda dekoratif blur efekti */}
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-6 py-16">

        {/* Sayfa başlığı */}
        <h1 className="text-5xl font-bold text-center text-purple-300 drop-shadow-[0_0_25px_rgba(180,50,255,0.35)]">
          Musician Dashboard
        </h1>

        {/* Açıklama metni */}
        <p className="text-center mt-3 text-neutral-300 max-w-md mx-auto">
          Upload tracks, manage your music, and grow your presence.
        </p>

        {/* Dashboard kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          {cards.map((card) => (
            <Link href={card.href} key={card.title}>
              <motion.div
                // Üzerine gelince büyüme animasyonu
                whileHover={{ scale: 1.04 }}
                // Tıklayınca küçülme animasyonu
                whileTap={{ scale: 0.96 }}
                className="
                  p-6 rounded-2xl backdrop-blur-xl
                  bg-white/10 border border-white/20
                  shadow-[0_0_20px_rgba(150,70,255,0.15)]
                  hover:shadow-[0_0_30px_rgba(150,70,255,0.3)]
                  transition cursor-pointer
                "
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

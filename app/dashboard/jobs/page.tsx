"use client"; 
// Bu dosyanın client component olduğunu belirtir.
// Çünkü animasyon (framer-motion) ve etkileşimli yapı kullanılıyor.

import { motion } from "framer-motion";
// Kartlara hover ve tıklama animasyonu eklemek için kullanılır.

import Link from "next/link";
// Sayfalar arası client-side geçiş yapmak için kullanılır.

import { Briefcase, PlusCircle, Search } from "lucide-react";
// Kartlar üzerinde gösterilecek ikonlar.

export default function JobsDashboardPage() {
  // Dashboard üzerinde gösterilecek kartların bilgileri
  // Her kart bir yönlendirme (link) temsil eder
  const cards = [
    {
      title: "Post Job", 
      // Kart başlığı

      desc: "Create a new job listing and find collaborators.",
      // Kart açıklaması

      icon: <PlusCircle size={30} />,
      // Kartta gösterilecek ikon

      href: "/dashboard/jobs/post",
      // Kart tıklandığında gidilecek sayfa
    },
    {
      title: "My Job Posts",
      desc: "View and manage the jobs you have posted.",
      icon: <Briefcase size={30} />,
      href: "/dashboard/jobs/mine",
    },
    {
      title: "Job Marketplace",
      desc: "Browse all jobs and apply to opportunities.",
      icon: <Search size={30} />,
      href: "/dashboard/jobs/market",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Sayfanın arka planında kullanılan gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />

      {/* Arka planda görsel derinlik veren blur efekti */}
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-6 py-16">
        {/* Sayfa başlığı */}
        <h1 className="text-5xl font-bold text-purple-300 text-center drop-shadow-[0_0_30px_rgba(180,50,255,0.35)]">
          Jobs Dashboard
        </h1>

        {/* Başlık altı açıklama */}
        <p className="text-neutral-300 text-center mt-3 max-w-lg mx-auto">
          Post job listings, manage your opportunities and apply to roles.
        </p>

        {/* Kartların grid yapısı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          {/* cards dizisi üzerinden kartlar tek tek oluşturuluyor */}
          {cards.map((card) => (
            <Link key={card.title} href={card.href}>
              {/* motion.div sayesinde kartlara animasyon ekleniyor */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                // Üzerine gelince kart hafif büyür

                whileTap={{ scale: 0.96 }}
                // Tıklanınca kart hafif küçülür

                className="
                  p-6 rounded-2xl backdrop-blur-xl
                  bg-white/10 border border-white/20
                  shadow-[0_0_20px_rgba(150,70,255,0.15)]
                  hover:shadow-[0_0_30px_rgba(150,70,255,0.35)]
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

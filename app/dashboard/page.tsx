"use client";
// Bu sayfa client componenttir çünkü auth kontrolü ve router kullanır.

import { useEffect } from "react";
// Sayfa yüklendiğinde auth kontrolü yapmak için useEffect kullanılır.

import Link from "next/link";
// Dashboard içindeki modüllere yönlendirme için kullanılır.

import { useRouter } from "next/navigation";
// Kullanıcıyı login sayfasına yönlendirmek için router kullanılır.

import { onAuthStateChanged } from "firebase/auth";
// Kullanıcının giriş yapıp yapmadığını dinler.

import { auth } from "@/lib/firebase";
// Firebase Authentication instance’ı.

export default function DashboardPage() {
  // Sayfa yönlendirmeleri için router
  const router = useRouter();

  // Sayfa açıldığında kullanıcı giriş kontrolü yapılır
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Eğer kullanıcı giriş yapmamışsa login sayfasına gönderilir
      if (!user) {
        router.replace("/login");
      }
    });

    // Sayfadan çıkıldığında auth listener temizlenir
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Arka plan için gradient katman */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-black" />

      {/* Üstten gelen dekoratif radial ışık efekti */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_60%)]" />

      {/* Sayfa içeriği */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-white">

        {/* Karşılama başlığı */}
        <h1 className="mb-4 text-4xl font-semibold">
          Welcome to Symphira
        </h1>

        {/* Açıklama metni */}
        <p className="mb-14 max-w-xl text-white/60">
          Continue with one of the sections below.
        </p>

        {/* Modül kartları */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Jobs modülü */}
          <Link
            href="/dashboard/jobs"
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
          >
            {/* Hover durumunda arka plan efekti */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#22c55e]/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <h2 className="relative mb-2 text-xl font-medium">
              Jobs & Opportunities
            </h2>
            <p className="relative text-sm text-white/60">
              Browse job listings, post opportunities and apply.
            </p>
          </Link>

          {/* Musician modülü */}
          <Link
            href="/dashboard/musician"
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/15 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <h2 className="relative mb-2 text-xl font-medium">
              Musician
            </h2>
            <p className="relative text-sm text-white/60">
              Upload demos, manage offers and build your music profile.
            </p>
          </Link>

          {/* Listener modülü */}
          <Link
            href="/dashboard/listener"
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#E6C87A]/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <h2 className="relative mb-2 text-xl font-medium">
              Listener
            </h2>
            <p className="relative text-sm text-white/60">
              Discover music and explore new artists.
            </p>
          </Link>

          {/* Seller modülü */}
          <Link
            href="/dashboard/seller"
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/15 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <h2 className="relative mb-2 text-xl font-medium">
              Seller
            </h2>
            <p className="relative text-sm text-white/60">
              Sell and manage second-hand music equipment.
            </p>
          </Link>

        </div>
      </div>
    </div>
  );
}

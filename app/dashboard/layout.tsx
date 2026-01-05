"use client";
// Bu layout client componenttir çünkü auth kontrolü, effect ve router kullanır.

import { ReactNode, useEffect } from "react";
// children prop’u ve yan etkiler için kullanılır.

import Link from "next/link";
// Dashboard içindeki sayfalar arası geçiş için kullanılır.

import { usePathname, useRouter } from "next/navigation";
// Aktif sayfayı tespit etmek ve yönlendirme yapmak için kullanılır.

import { onAuthStateChanged } from "firebase/auth";
// Kullanıcının giriş yapıp yapmadığını dinlemek için kullanılır.

import { auth } from "@/lib/firebase";
// Firebase Authentication instance’ı.

import MiniPlayer from "@/app/components/MiniPlayer";
// Sayfanın alt kısmında her zaman görünen müzik oynatıcı.

import { Cinzel_Decorative } from "next/font/google";
// SYMPHIRA logosunda kullanılan Google fontu.

// Logo font ayarları
const symphiraFont = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Sayfa yönlendirmeleri için router
  const router = useRouter();

  // Aktif URL bilgisini almak için
  const pathname = usePathname();

  // Sayfa açıldığında kullanıcı giriş kontrolü yapılır
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // Kullanıcı giriş yapmamışsa login sayfasına yönlendirilir
      if (!user) {
        router.replace("/login");
      }
    });

    // Component kapanırken auth listener temizlenir
    return () => unsub();
  }, [router]);

  // Dashboard üst menüde gösterilecek modüller
  const navItems = [
    { label: "Jobs", href: "/dashboard/jobs" },
    { label: "Listener", href: "/dashboard/listener" },
    { label: "Musician", href: "/dashboard/musician" },
    { label: "Seller", href: "/dashboard/seller" },
  ];

  return (
    <>
      {/* Üst sabit navigasyon bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-purple-900/40 via-black/30 to-black/20">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo alanı */}
          <Link href="/dashboard">
            <span
              className={`${symphiraFont.className} text-2xl tracking-wider bg-gradient-to-r from-purple-200 via-[#E6C87A] to-purple-300 bg-clip-text text-transparent`}
            >
              SYMPHIRA
            </span>
          </Link>

          {/* Navigasyon linkleri */}
          <div className="flex gap-8 text-sm">
            {navItems.map((item) => {
              // Aktif sayfa kontrolü
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative pb-1 transition-colors duration-300 ${
                    active
                      // Aktif sekme görünümü
                      ? "text-[#E6C87A] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:bg-gradient-to-r after:from-[#D4AF37]/0 after:via-[#D4AF37] after:to-[#D4AF37]/0 after:scale-x-100"
                      // Pasif sekme görünümü
                      : "text-white/60 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:bg-gradient-to-r after:from-[#D4AF37]/0 after:via-[#D4AF37] after:to-[#D4AF37]/0 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Dashboard alt sayfalarının render edildiği alan */}
      <div className="pt-12">
        {children}
      </div>

      {/* Sayfanın alt kısmında her zaman görünen mini müzik oynatıcı */}
      <MiniPlayer />
    </>
  );
}

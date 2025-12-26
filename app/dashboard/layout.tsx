"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import MiniPlayer from "@/app/components/MiniPlayer";
import { LikeProvider } from "@/app/context/LikeContext";
import { Cinzel_Decorative } from "next/font/google";

const symphiraFont = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
    });

    return () => unsub();
  }, [router]);

  const navItems = [
    { label: "Listener", href: "/dashboard/listener" },
    { label: "Musician", href: "/dashboard/musician" },
    { label: "Seller", href: "/dashboard/seller" },
    { label: "Employer", href: "/dashboard/employer" },
  ];

  const linkBase = "relative pb-1 transition-colors duration-300";

  const goldUnderline =
    "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:bg-gradient-to-r after:from-[#D4AF37]/0 after:via-[#D4AF37] after:to-[#D4AF37]/0 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";

  const activeGold = "after:scale-x-100 text-[#E6C87A]";

  return (
    <LikeProvider>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-purple-900/40 via-black/30 to-black/20">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard">
            <span
              className={`${symphiraFont.className} text-2xl tracking-wider bg-gradient-to-r from-purple-200 via-[#E6C87A] to-purple-300 bg-clip-text text-transparent hover:opacity-90 transition`}
            >
              SYMPHIRA
            </span>
          </Link>

          <div className="flex gap-8 text-sm">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${linkBase} ${goldUnderline} ${
                    active
                      ? activeGold
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <div className="pt-12">{children}</div>

      <MiniPlayer />
    </LikeProvider>
  );
}

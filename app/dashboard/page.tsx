"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-white">
        <h1 className="mb-4 text-4xl font-semibold">
          Welcome to Symphira
        </h1>
        <p className="mb-14 max-w-xl text-white/60">
          Continue with one of the sections below.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/jobs"
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#22c55e]/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <h2 className="relative mb-2 text-xl font-medium">
              Jobs & Opportunities
            </h2>
            <p className="relative text-sm text-white/60">
              Browse job listings, post opportunities and apply.
            </p>
          </Link>

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

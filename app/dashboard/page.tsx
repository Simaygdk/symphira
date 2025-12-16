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
      // Login yoksa login sayfasına atar
      if (!user) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <h1 className="mb-3 text-4xl font-semibold text-white">
          Welcome to Symphira
        </h1>
        <p className="mb-10 max-w-xl text-white/60">
          Choose how you want to experience sound.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/dashboard/artist"
            className="group rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10 hover:ring-purple-500"
          >
            <h2 className="mb-2 text-xl font-medium text-white">
              Artist
            </h2>
            <p className="text-sm text-white/60">
              Upload, manage and share your music.
            </p>
          </Link>

          <Link
            href="/dashboard/listener"
            className="group rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10 hover:ring-purple-500"
          >
            <h2 className="mb-2 text-xl font-medium text-white">
              Listener
            </h2>
            <p className="text-sm text-white/60">
              Discover new sounds and artists.
            </p>
          </Link>

          <Link
            href="/dashboard/library"
            className="group rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10 hover:ring-purple-500"
          >
            <h2 className="mb-2 text-xl font-medium text-white">
              Library
            </h2>
            <p className="text-sm text-white/60">
              Your liked tracks and playlists.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">

      {/* Animated Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[140px] animate-lightFlow -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <section className="relative text-center z-10 max-w-2xl px-6">

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 heading-font">
          Symphira
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
          Where every sound becomes a story.
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-6">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-medium shadow-lg shadow-purple-700/30"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 rounded-xl border border-white/30 hover:border-white/70 transition font-medium"
          >
            Login
          </Link>
        </div>

      </section>

    </main>
  );
}

"use client";

export default function HomePage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-black pointer-events-none" />

      <div className="text-center z-10 max-w-2xl px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Symphira
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
          Where music finds purpose. Connect musicians, employers and listeners
          in one powerful platform.
        </p>

        <div className="flex justify-center gap-6">
          <a
            href="/register"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-medium"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="px-6 py-3 rounded-xl border border-white/20 hover:border-white/50 transition font-medium"
          >
            Login
          </a>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard");
    } catch {
      // Hatalı giriş durumunda kullanıcıya net geri bildirim
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_60%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white/5 p-8 backdrop-blur ring-1 ring-white/10 shadow-2xl">
          <h1 className="mb-2 text-center text-3xl font-semibold text-white">
            Welcome back
          </h1>

          <p className="mb-8 text-center text-sm text-white/60">
            Sign in to continue to Symphira
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-black/60 px-3 py-2 text-white placeholder-white/40 outline-none ring-1 ring-white/10 transition focus:ring-purple-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-black/60 px-3 py-2 text-white placeholder-white/40 outline-none ring-1 ring-white/10 transition focus:ring-purple-500"
            />

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="mt-6 w-full rounded-md bg-purple-600 py-2 font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-white/40">
            Where every sound becomes a story.
          </p>
        </div>
      </div>
    </div>
  );
}

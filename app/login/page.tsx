"use client";
// Bu sayfa client componenttir çünkü state, router ve Firebase Auth kullanır.

import { useState } from "react";
// Email, password, loading ve error gibi değerleri tutmak için state kullanılır.

import { useRouter } from "next/navigation";
// Giriş başarılı olunca dashboard’a yönlendirmek için router kullanılır.

import { signInWithEmailAndPassword } from "firebase/auth";
// Firebase üzerinde email + şifre ile giriş yapmak için kullanılır.

import { auth } from "@/lib/firebase";
// Firebase Authentication instance’ı.

export default function LoginPage() {
  // Sayfa yönlendirmeleri için router
  const router = useRouter();

  // Kullanıcının girdiği email
  const [email, setEmail] = useState("");

  // Kullanıcının girdiği şifre
  const [password, setPassword] = useState("");

  // Giriş işlemi devam ediyor mu?
  const [loading, setLoading] = useState(false);

  // Hata mesajı (yanlış email / şifre gibi)
  const [error, setError] = useState("");

  // Login butonuna basıldığında çalışan fonksiyon
  const handleLogin = async () => {
    // Eğer zaten giriş işlemi sürüyorsa tekrar çalıştırılmaz
    if (loading) return;

    setLoading(true);
    // Önceki hata mesajı temizlenir
    setError("");

    try {
      // Firebase üzerinden email ve şifre ile giriş yapılır
      await signInWithEmailAndPassword(auth, email, password);

      // Giriş başarılıysa dashboard sayfasına yönlendirilir
      router.replace("/dashboard");
    } catch {
      // Giriş başarısızsa kullanıcıya hata mesajı gösterilir
      setError("Invalid email or password");
    } finally {
      // İşlem bitince loading kapatılır
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">

      {/* Arka plan gradient katmanı */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-black" />

      {/* Üstten gelen dekoratif ışık efekti */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_60%)]" />

      {/* Login kartının ortalanması */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

        {/* Login form kartı */}
        <div className="w-full max-w-sm rounded-2xl bg-white/5 p-8 backdrop-blur ring-1 ring-white/10 shadow-2xl">

          {/* Başlık */}
          <h1 className="mb-2 text-center text-3xl font-semibold text-white">
            Welcome back
          </h1>

          {/* Açıklama */}
          <p className="mb-8 text-center text-sm text-white/60">
            Sign in to continue to Symphira
          </p>

          {/* Form alanları */}
          <div className="space-y-4">

            {/* Email input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-black/60 px-3 py-2 text-white placeholder-white/40 outline-none ring-1 ring-white/10 transition focus:ring-purple-500"
            />

            {/* Password input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-black/60 px-3 py-2 text-white placeholder-white/40 outline-none ring-1 ring-white/10 transition focus:ring-purple-500"
            />

            {/* Hata mesajı */}
            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Login butonu */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="mt-6 w-full rounded-md bg-purple-600 py-2 font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>

          {/* Alt slogan */}
          <p className="mt-8 text-center text-xs text-white/40">
            Where every sound becomes a story.
          </p>
        </div>
      </div>
    </div>
  );
}

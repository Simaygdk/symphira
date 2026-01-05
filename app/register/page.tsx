"use client";

// React state yönetimi için useState
import { useState } from "react";

// Sayfalar arası yönlendirme için Link
import Link from "next/link";

// Firebase auth ve firestore bağlantıları
import { auth, db } from "../../lib/firebase";

// Firebase Authentication: kullanıcı oluşturma
import { createUserWithEmailAndPassword } from "firebase/auth";

// Firestore: doküman oluşturma ve zaman damgası
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Next.js router (kayıt sonrası yönlendirme için)
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  // Sayfa yönlendirmesi için router
  const router = useRouter();

  // Form alanları için state'ler
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Kayıt işlemi devam ediyor mu?
  const [loading, setLoading] = useState(false);

  // Hata mesajı
  const [error, setError] = useState("");

  // Register formu submit edildiğinde çalışır
  const handleRegister = async (e: React.FormEvent) => {
    // Sayfanın yenilenmesini engeller
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Firebase Authentication ile kullanıcı oluşturulur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Oluşturulan kullanıcı bilgisi
      const user = userCredential.user;

      // Firestore users koleksiyonuna kullanıcı profili yazılır
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        roles: ["musician"], // Varsayılan rol
        createdAt: serverTimestamp(), // Oluşturulma zamanı
      });

      // Kayıt başarılı → dashboard'a yönlendir
      router.push("/dashboard");
    } catch (err: any) {
      // Genel hata mesajı
      let message = "Registration failed.";

      // Firebase hata kodlarına göre özel mesajlar
      if (err.code === "auth/email-already-in-use")
        message = "Email is already in use.";

      if (err.code === "auth/weak-password")
        message = "Password must be at least 6 characters.";

      if (err.code === "auth/invalid-email")
        message = "Invalid email address.";

      setError(message);
    } finally {
      // İşlem bitti
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-300">
          Create Account
        </h1>

        {/* Kayıt formu */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Kullanıcı adı */}
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 outline-none focus:border-purple-500 transition"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 outline-none focus:border-purple-500 transition"
            required
          />

          {/* Şifre */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 outline-none focus:border-purple-500 transition"
            required
          />

          {/* Register butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-medium transition"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {/* Hata mesajı */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}
        </form>

        {/* Login sayfasına yönlendirme */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

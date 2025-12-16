"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Firebase logout
      await signOut(auth);

      // Session cookie silinir
      document.cookie = "session=; path=/; max-age=0";

      // Login sayfasına yönlendirme
      router.push("/login");
    } catch (error) {
      alert("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 transition font-semibold"
    >
      Logout
    </button>
  );
}

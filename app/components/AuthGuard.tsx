//MVP DIŞINDA
"use client";
// Bu componentin tarayıcı tarafında çalışacağını belirtir

import { useEffect, useState } from "react";
// React hookları: lifecycle ve state yönetimi için

import { useRouter } from "next/navigation";
// Next.js yönlendirme işlemleri için 

import { onAuthStateChanged } from "firebase/auth";
// Firebase'de kullanıcının giriş durumunu dinlemek için kullanılır

import { auth } from "@/lib/firebase";
// Firebase authentication nesnesi

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  // Bu component içine sarılan sayfaları koruma altına alır

  const router = useRouter();
  // Sayfa yönlendirmeleri için router nesnesi

  const [ready, setReady] = useState(false);
  // Kullanıcının giriş durumu kontrol edildi mi bilgisini tutar

  useEffect(() => {
    // Kullanıcının giriş durumunu dinler

    const unsub = onAuthStateChanged(auth, (user) => {
      // Kullanıcı giriş yapmamışsa

      if (!user) {
        router.replace("/login");
        // Login sayfasına yönlendirir
      } else {
        setReady(true);
        // Kullanıcı giriş yaptıysa içeriği göstermeye izin verir
      }
    });

    return () => unsub();
    // Component unmount olunca dinlemeyi durdurur
  }, [router]);

  if (!ready) {
    // Kullanıcı durumu henüz belli değilse loading ekranı gösterilir
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Kullanıcı giriş yaptıysa alt componentleri render eder
  return <>{children}</>;
}

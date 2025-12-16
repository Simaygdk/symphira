"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import MiniPlayer from "@/app/components/MiniPlayer";
import { LikeProvider } from "@/app/context/LikeContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
    });

    return () => unsub();
  }, [router]);

  return (
    <LikeProvider>
      {children}
      <MiniPlayer />
    </LikeProvider>
  );
}

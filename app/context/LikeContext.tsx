//MVP DIŞI
"use client";
// Bu context yapısının client (tarayıcı) tarafında çalışacağını belirtir

import { createContext, useContext, useEffect, useState } from "react";
// React context ve state yönetimi için gerekli hooklar

import { auth, db } from "@/lib/firebase";
// Firebase authentication ve Firestore bağlantıları

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
// Firestore üzerinde beğeni (like) verilerini okumak ve yazmak için

import { onAuthStateChanged } from "firebase/auth";
// Kullanıcının login / logout durumunu dinlemek için

type LikeContextType = {
  likedTrackIds: Set<string>;
  isLiked: (trackId: string) => boolean;
  toggleLike: (trackId: string) => Promise<void>;
};
// LikeContext üzerinden dışarıya sunulacak fonksiyon ve state tipleri

const LikeContext = createContext<LikeContextType | null>(null);
// Like bilgilerini tutacak React Context

export function LikeProvider({ children }: { children: React.ReactNode }) {
  // Tüm uygulamayı saran ve like state’ini yöneten provider componenti

  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  // Kullanıcının beğendiği track ID’lerini tutar

  const [userId, setUserId] = useState<string | null>(null);
  // Aktif kullanıcının userId bilgisi

  useEffect(() => {
    // Kullanıcının login / logout durumunu takip eder

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Kullanıcı çıkış yaptıysa state sıfırlanır
        setUserId(null);
        setLikedTrackIds(new Set());
        return;
      }

      // Kullanıcı giriş yaptıysa userId kaydedilir
      setUserId(user.uid);

      // Kullanıcının daha önce beğendiği şarkılar Firestore’dan çekilir
      const snap = await getDocs(
        collection(db, "users", user.uid, "likedTracks")
      );

      // Beğenilen track ID’leri Set içine alınır
      const ids = new Set<string>();
      snap.forEach((d) => ids.add(d.id));
      setLikedTrackIds(ids);
    });

    return () => unsub();
  }, []);

  const isLiked = (trackId: string) => {
    // Verilen trackId kullanıcının beğendiği listede var mı kontrol eder
    return likedTrackIds.has(trackId);
  };

  const toggleLike = async (trackId: string) => {
    // Track için beğeni ekleme / kaldırma işlemini yapar

    if (!userId) return;

    const ref = doc(db, "users", userId, "likedTracks", trackId);
    // Kullanıcının likedTracks alt koleksiyonundaki ilgili döküman referansı

    if (likedTrackIds.has(trackId)) {
      // Eğer track zaten beğenilmişse → beğeni kaldırılır
      await deleteDoc(ref);

      setLikedTrackIds((prev) => {
        const next = new Set(prev);
        next.delete(trackId);
        return next;
      });
    } else {
      // Eğer track beğenilmemişse → beğeni eklenir
      await setDoc(ref, {
        trackId,
        likedAt: serverTimestamp()
      });

      setLikedTrackIds((prev) => new Set(prev).add(trackId));
    }
  };

  return (
    // Like state ve fonksiyonlarını tüm alt componentlere sağlar
    <LikeContext.Provider value={{ likedTrackIds, isLiked, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLikes() {
  // LikeContext’e erişmek için kullanılan custom hook

  const ctx = useContext(LikeContext);
  if (!ctx) {
    // Eğer provider dışında kullanılırsa hata fırlatır
    throw new Error("useLikes must be used inside LikeProvider");
  }
  return ctx;
}

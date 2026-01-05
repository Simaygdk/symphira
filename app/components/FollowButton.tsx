//MVP İÇİ GELİŞTİRİLECEK
"use client";
// Bu componentin tarayıcı tarafında çalışacağını belirtir

import { useEffect, useState } from "react";
// React hookları: state ve lifecycle yönetimi için

import { auth, db } from "@/lib/firebase";
// Firebase authentication ve veritabanı nesneleri

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
// Firestore belge okuma, yazma, silme ve dinleme fonksiyonları

export default function FollowButton({ artistId }: { artistId: string }) {
  // Sanatçı takip / takipten çıkma işlemlerini yöneten component

  const user = auth.currentUser;
  // Giriş yapmış kullanıcı bilgisi

  const [isFollowing, setIsFollowing] = useState(false);
  // Kullanıcı bu sanatçıyı takip ediyor mu bilgisini tutar

  const [followerCount, setFollowerCount] = useState(0);
  // Sanatçının takipçi sayısını tutar

  useEffect(() => {
    // Kullanıcının bu sanatçıyı takip edip etmediğini kontrol eder

    if (!user) return;
    // Kullanıcı yoksa işlem yapılmaz

    const ref = doc(db, "following", user.uid, "artists", artistId);
    // Kullanıcının takip ettiği sanatçılar alt koleksiyonu

    const unsub = onSnapshot(ref, (snap) => {
      setIsFollowing(snap.exists());
      // Belge varsa takip ediliyor demektir
    });

    return () => unsub();
    // Dinlemeyi durdurur
  }, [user, artistId]);

  useEffect(() => {
    // Sanatçının toplam takipçi sayısını dinler

    const ref = doc(db, "followers", artistId);
    // Her sanatçı için tutulmuş follower sayısı belgesi

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      setFollowerCount(data?.count || 0);
      // Takipçi sayısını state'e yazar
    });

    return () => unsub();
    // Dinlemeyi kapatır
  }, [artistId]);

  const follow = async () => {
    // Kullanıcının sanatçıyı takip etmesini sağlar

    if (!user) return;

    await setDoc(
      doc(db, "following", user.uid, "artists", artistId),
      { followedAt: Date.now() }
    );
    // Kullanıcının takip listesine sanatçıyı ekler

    await setDoc(
      doc(db, "followers", artistId),
      { count: followerCount + 1 },
      { merge: true }
    );
    // Sanatçının takipçi sayısını artırır
  };

  const unfollow = async () => {
    // Kullanıcının sanatçıyı takipten çıkmasını sağlar

    if (!user) return;

    await deleteDoc(doc(db, "following", user.uid, "artists", artistId));
    // Takip belgesini siler

    await setDoc(
      doc(db, "followers", artistId),
      { count: Math.max(0, followerCount - 1) },
      { merge: true }
    );
    // Takipçi sayısını güvenli şekilde azaltır
  };

  return (
    <div className="flex items-center gap-3 mt-4">
      {isFollowing ? (
        // Takip ediyorsa Unfollow butonu gösterilir
        <button
          onClick={unfollow}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Unfollow
        </button>
      ) : (
        // Takip etmiyorsa Follow butonu gösterilir
        <button
          onClick={follow}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
        >
          Follow
        </button>
      )}

      <span className="text-white/70 text-sm">
        {followerCount} followers
      </span>
      {/* Anlık takipçi sayısı */}
    </div>
  );
}

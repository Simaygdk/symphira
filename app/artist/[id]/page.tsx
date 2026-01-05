//MVP DIŞI
"use client";
// Bu dosyanın tarayıcıda (client-side) çalışacağını belirtir

import { useEffect, useState } from "react";
// React hookları: state tutmak ve yan etkileri yönetmek için

import { db, auth } from "../../../lib/firebase";
// Firebase veritabanı ve kimlik doğrulama nesneleri

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
// Firestore'dan veri okuma, dinleme, ekleme ve silme işlemleri için gerekli fonksiyonlar

import { motion } from "framer-motion";
// Animasyonlu componentler oluşturmak için kullanılır

export default function ArtistPage({ params }: { params: { id: string } }) {
  // Dinamik route üzerinden gelen artist id'yi alıyoruz

  const { id: artistId } = params;
  // URL'den gelen id'yi artistId olarak kullanıyoruz

  const user = auth.currentUser;
  // Giriş yapmış olan kullanıcıyı alıyoruz

  const [artist, setArtist] = useState<any>(null);
  // Sanatçının bilgilerini tutacak state

  const [tracks, setTracks] = useState<any[]>([]);
  // Sanatçıya ait şarkıları tutacak state

  const [isFollowing, setIsFollowing] = useState(false);
  // Kullanıcı bu sanatçıyı takip ediyor mu bilgisini tutar

  const [followDocId, setFollowDocId] = useState<string | null>(null);
  // Takip belgesinin Firestore id'sini tutar

  const [followersCount, setFollowersCount] = useState(0);
  // Sanatçının toplam takipçi sayısı


  useEffect(() => {
    // Sanatçı bilgilerini Firestore'dan çekmek için çalışır

    const ref = doc(db, "musicians", artistId);
    // musicians koleksiyonundaki ilgili sanatçının referansı

    getDoc(ref).then((snap) => {
      // Sanatçı belgesini getirir

      if (snap.exists()) setArtist(snap.data());
      // Eğer belge varsa state'e kaydeder
    });
  }, [artistId]);
  // artistId değiştiğinde tekrar çalışır

 
  useEffect(() => {
    // Sanatçının şarkılarını dinlemek için çalışır

    const q = query(
      collection(db, "tracks"),
      where("artistId", "==", artistId)
    );
    // Sadece bu sanatçıya ait şarkıları filtreler

    const unsub = onSnapshot(q, (snap) => {
      // Gerçek zamanlı olarak şarkıları dinler

      setTracks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      // Gelen verileri state'e aktarır
    });

    return () => unsub();
    // Component unmount olunca dinlemeyi durdurur
  }, [artistId]);

 
  useEffect(() => {
    // Kullanıcının bu sanatçıyı takip edip etmediğini kontrol eder

    if (!user) return;
    // Kullanıcı yoksa çalışmaz

    const q = query(
      collection(db, "followers"),
      where("artistId", "==", artistId),
      where("listenerId", "==", user.uid)
    );
    // Bu kullanıcı bu sanatçıyı takip ediyor mu diye sorgular

    const unsub = onSnapshot(q, (snap) => {
      // Gerçek zamanlı takip durumu dinlenir

      if (snap.docs.length > 0) {
        // Takip belgesi varsa
        setIsFollowing(true);
        setFollowDocId(snap.docs[0].id);
      } else {
        // Takip etmiyorsa
        setIsFollowing(false);
        setFollowDocId(null);
      }
    });

    return () => unsub();
    // Dinlemeyi durdurur
  }, [artistId, user]);

 
  useEffect(() => {
    // Sanatçının toplam takipçi sayısını hesaplar

    const q = query(
      collection(db, "followers"),
      where("artistId", "==", artistId)
    );
    // Bu sanatçıya ait tüm takip kayıtlarını alır

    const unsub = onSnapshot(q, (snap) => {
      setFollowersCount(snap.docs.length);
      // Takipçi sayısını state'e yazar
    });

    return () => unsub();
    // Dinlemeyi kapatır
  }, [artistId]);

  const follow = async () => {
    // Kullanıcının sanatçıyı takip etmesini sağlar

    if (!user) return;
    // Kullanıcı yoksa işlem yapılmaz

    await addDoc(collection(db, "followers"), {
      artistId,
      listenerId: user.uid,
      followedAt: new Date(),
    });
    // followers koleksiyonuna yeni takip kaydı ekler
  };

  const unfollow = async () => {
    // Kullanıcının sanatçıyı takipten çıkmasını sağlar

    if (!followDocId) return;
    // Takip belgesi yoksa işlem yapılmaz

    await deleteDoc(doc(db, "followers", followDocId));
    // İlgili takip belgesini siler
  };

  if (!artist)
    // Sanatçı bilgileri henüz gelmediyse loading gösterilir
    return (
      <div className="text-center text-neutral-400 mt-20">Loading artist…</div>
    );

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6">
          <img
            src={artist.photoURL || "https://placehold.co/300x300"}
            // Sanatçının fotoğrafı yoksa placeholder gösterilir
            className="w-40 h-40 object-cover rounded-full border border-white/20"
          />

          <div>
            <h1 className="text-4xl font-bold text-purple-200 mb-2">
              {artist.name}
            </h1>

            <p className="text-neutral-400 text-sm mb-2">
              {followersCount} followers
            </p>

            {isFollowing ? (
              // Eğer takip ediyorsa unfollow butonu gösterilir
              <button
                onClick={unfollow}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl"
              >
                Unfollow
              </button>
            ) : (
              // Takip etmiyorsa follow butonu gösterilir
              <button
                onClick={follow}
                className="px-4 py-2 bg-purple-500 rounded-xl"
              >
                Follow
              </button>
            )}
          </div>
        </div>

        <h2 className="mt-12 text-xl font-semibold text-purple-200">
          Tracks
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-4">
          {tracks.map((track) => (
            <motion.div
              key={track.id}
              // Her bir şarkı için animasyonlu kart
              className="bg-white/10 p-3 rounded-xl backdrop-blur-xl"
            >
              <img
                src={track.coverURL}
                // Şarkının kapak görseli
                className="w-full h-32 object-cover rounded-lg"
              />
              <p className="mt-2 text-sm text-purple-200 font-semibold truncate">
                {track.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

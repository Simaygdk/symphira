"use client";
// Bu sayfa client componenttir çünkü state, effect ve Firebase kullanır.

import { useEffect, useState } from "react";
// Track listesi, yüklenme durumu ve silme durumu için kullanılır.

import { motion } from "framer-motion";
// Track kartlarına hover animasyonu vermek için kullanılır.

import { auth, db } from "../../../../lib/firebase";
// Giriş yapan kullanıcıyı ve Firestore veritabanını kullanmak için.

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
// Trackleri listelemek ve silmek için Firestore fonksiyonları.

import { onAuthStateChanged } from "firebase/auth";
// Kullanıcı giriş / çıkış durumunu dinlemek için kullanılır.

import { Trash2 } from "lucide-react";
// Silme butonunda kullanılan çöp kutusu ikonu.

type Track = {
  id: string;
  // Track dokümanının Firestore ID'si

  title: string;
  // Track adı

  artistName: string;
  // Artist adı

  coverURL: string;
  // Kapak görseli URL'i

  audioURL: string;
  // Müzik dosyası URL'i

  ownerId: string;
  // Track’i yükleyen kullanıcının ID’si
};

export default function MusicLibraryPage() {
  // Müzisyenin kendi track listesini tutar
  const [tracks, setTracks] = useState<Track[]>([]);

  // Trackler yüklenirken kullanılan loading durumu
  const [loading, setLoading] = useState(true);

  // Hangi track siliniyorsa onun ID’sini tutar
  const [deleting, setDeleting] = useState<string | null>(null);

  // Sayfa açıldığında çalışır
  useEffect(() => {
    let unsubscribeTracks: (() => void) | null = null;

    // Kullanıcının giriş durumunu dinler
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Kullanıcı çıkış yaptıysa
      if (!user) {
        setTracks([]);
        setLoading(false);
        return;
      }

      // Sadece giriş yapan kullanıcıya ait trackler çekilir
      const q = query(
        collection(db, "tracks"),
        where("ownerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      // Trackler gerçek zamanlı dinlenir
      unsubscribeTracks = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Track, "id">),
        }));

        setTracks(list);
        setLoading(false);
      });
    });

    // Sayfadan çıkıldığında tüm dinleyiciler kapatılır
    return () => {
      unsubscribeAuth();
      if (unsubscribeTracks) unsubscribeTracks();
    };
  }, []);

  // Bir track silinmek istendiğinde çalışır
  const deleteTrack = async (track: Track) => {
    // Kullanıcıdan onay alınır
    const yes = confirm(`Delete "${track.title}"?`);
    if (!yes) return;

    try {
      // Silinen track’in ID’si state’e yazılır
      setDeleting(track.id);

      // Firestore’dan track dokümanı silinir
      await deleteDoc(doc(db, "tracks", track.id));
    } catch {
      // Silme başarısız olursa uyarı verilir
      alert("Failed to delete track.");
    } finally {
      // Silme işlemi bittiğinde state sıfırlanır
      setDeleting(null);
    }
  };

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">

      {/* Sayfa başlığı */}
      <h1 className="text-4xl font-bold mb-10 text-purple-300">
        Your Library
      </h1>

      {/* Trackler yükleniyorsa */}
      {loading && (
        <p className="text-neutral-400">
          Loading tracks...
        </p>
      )}

      {/* Hiç track yoksa */}
      {!loading && tracks.length === 0 && (
        <p className="text-neutral-400 italic">
          No tracks uploaded yet.
        </p>
      )}

      {/* Track kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {tracks.map((track) => (
          <motion.div
            key={track.id}
            whileHover={{ scale: 1.03 }}
            className="p-4 rounded-2xl bg-white/10 border border-white/20"
          >
            {/* Track kapak görseli */}
            <img
              src={track.coverURL}
              alt={track.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            {/* Track adı */}
            <h2 className="text-xl font-semibold">
              {track.title}
            </h2>

            {/* Artist adı */}
            <p className="text-neutral-400 text-sm">
              {track.artistName}
            </p>

            {/* Silme butonu */}
            <div className="flex justify-end mt-4">
              <button
                disabled={deleting === track.id}
                onClick={() => deleteTrack(track)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-300"
              >
                <Trash2 size={18} />
                {deleting === track.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

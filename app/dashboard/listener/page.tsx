"use client";
// Bu sayfa client componenttir çünkü state, effect ve tarayıcı eventleri kullanılır.

import { useEffect, useMemo, useState } from "react";
// Track verileri, arama metni ve filtreleme işlemleri için kullanılır.

import { Search, Play } from "lucide-react";
// Arama alanı ve play butonu ikonları.

import { db } from "../../../lib/firebase";
// Firestore veritabanına erişim sağlar.

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
// Track listesini gerçek zamanlı dinlemek için kullanılır.

type Track = {
  id: string;
  // Track dokümanının Firestore ID’si

  title: string;
  // Track adı

  artistName: string;
  // Track’in ait olduğu artist adı

  coverURL: string;
  // Track kapak görseli URL’i

  audioURL: string;
  // Track ses dosyası URL’i

  ownerId: string;
  // Track’i yükleyen kullanıcının ID’si
};

export default function ListenerPage() {
  // Firestore’dan gelen tüm trackleri tutar
  const [tracks, setTracks] = useState<Track[]>([]);

  // Arama inputuna yazılan metni tutar
  const [queryText, setQueryText] = useState("");

  // Trackler yüklenirken kullanılan loading state
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde track listesi Firestore’dan çekilir
  useEffect(() => {
    // Trackler oluşturulma tarihine göre tersten sıralanır
    const q = query(
      collection(db, "tracks"),
      orderBy("createdAt", "desc")
    );

    // onSnapshot sayesinde veriler gerçek zamanlı dinlenir
    const unsub = onSnapshot(q, (snapshot) => {
      const list: Track[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Track, "id">),
      }));

      // Track listesi state’e aktarılır
      setTracks(list);

      // Yükleme tamamlanır
      setLoading(false);
    });

    // Sayfadan çıkıldığında Firestore dinleyicisi kapatılır
    return () => unsub();
  }, []);

  // Arama metnine göre trackleri filtreler
  const filteredTracks = useMemo(() => {
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(queryText.toLowerCase()) ||
        track.artistName.toLowerCase().includes(queryText.toLowerCase())
    );
  }, [tracks, queryText]);

  // Listener sayfasından play butonuna basıldığında çalışır
  const playFromListener = (startIndex: number) => {
    // Global audio player’a kuyruk bilgisi gönderilir
    window.dispatchEvent(
      new CustomEvent("symphira:setQueue", {
        detail: {
          queue: filteredTracks,
          startIndex,
          autoplay: true,
        },
      })
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Arka plan gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />

      {/* Arka plan blur efekti */}
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-8 py-16">

        {/* Sayfa başlığı */}
        <h1 className="mb-8 text-3xl font-semibold">
          Discover Music
        </h1>

        {/* Arama alanı */}
        <div className="mb-12 max-w-md">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 backdrop-blur-xl">
            <Search size={18} className="text-white/50" />
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Search by track or artist"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {/* Trackler yükleniyorsa */}
        {loading && (
          <p className="text-white/60">
            Loading tracks...
          </p>
        )}

        {/* Filtre sonucu boşsa */}
        {!loading && filteredTracks.length === 0 && (
          <p className="text-white/60 italic">
            No tracks found.
          </p>
        )}

        {/* Track kartları */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTracks.map((track, index) => (
            <div
              key={track.id}
              className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-white/10"
            >
              {/* Track kapak görseli */}
              <div
                className="mb-4 h-40 w-full rounded-xl bg-cover bg-center"
                style={{
                  backgroundImage: `url(${track.coverURL})`,
                }}
              />

              {/* Track adı */}
              <h2 className="text-lg font-medium">
                {track.title}
              </h2>

              {/* Artist adı */}
              <p className="mb-4 text-sm text-white/60">
                {track.artistName}
              </p>

              {/* Play butonu */}
              <button
                onClick={() => playFromListener(index)}
                className="flex items-center gap-2 rounded-lg bg-purple-600/30 px-4 py-2 text-sm text-purple-200 ring-1 ring-purple-400 hover:bg-purple-600/40"
              >
                <Play size={16} />
                Play
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}

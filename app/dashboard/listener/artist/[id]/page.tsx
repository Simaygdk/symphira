"use client";
// Bu sayfa client componenttir çünkü state ve Firestore işlemleri içerir.

import { useEffect, useState } from "react";
// Artist ve track verilerini yüklemek için state ve effect kullanılır.

import { db } from "@/lib/firebase";
// Firestore veritabanına erişim sağlar.

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
// Artist bilgisi ve artiste ait trackleri çekmek için kullanılır.

import Image from "next/image";
// Artist ve track görsellerini göstermek için kullanılır.

import Link from "next/link";
// Track detay sayfasına yönlendirme yapmak için kullanılır.

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  // URL üzerinden gelen artist ID
  const { id } = params;

  // Artist bilgilerini tutan state
  const [artist, setArtist] = useState<any>(null);

  // Artiste ait track listesini tutan state
  const [tracks, setTracks] = useState<any[]>([]);

  // Sayfa yüklenme durumunu kontrol eden state
  const [loading, setLoading] = useState(true);

  // Sayfa ilk açıldığında artist ve track verileri yüklenir
  useEffect(() => {
    const load = async () => {
      try {
        // ----------- ARTIST BİLGİSİ -----------

        const artistRef = doc(db, "artists", id);
        const artistSnap = await getDoc(artistRef);

        if (artistSnap.exists()) {
          setArtist({ id: artistSnap.id, ...artistSnap.data() });
        }

        // ----------- ARTISTE AİT TRACKLER -----------

        const trackRef = collection(db, "tracks");
        const qTracks = query(trackRef, where("artistId", "==", id));
        const trackSnap = await getDocs(qTracks);

        const trackList = trackSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setTracks(trackList);
      } catch (err) {
        // Veri çekilirken hata olursa konsola yazdırılır
        console.error("Artist load error:", err);
      }

      // Tüm veriler yüklendikten sonra loading kapatılır
      setLoading(false);
    };

    load();
  }, [id]);

  // Veriler henüz yüklenmediyse loading ekranı gösterilir
  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </main>
    );

  // Artist bulunamazsa kullanıcı bilgilendirilir
  if (!artist)
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Artist not found
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-16">

      {/* ARTIST BİLGİ ALANI */}
      <section className="flex flex-col md:flex-row items-center gap-10">

        {/* Artist fotoğrafı */}
        <div className="w-48 h-48 rounded-full overflow-hidden border border-white/20">
          <Image
            src={artist.photoURL || "/default-artist.png"}
            width={300}
            height={300}
            alt="artist"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Artist temel bilgileri */}
        <div className="flex flex-col gap-3 text-center md:text-left">
          <h1 className="text-4xl font-bold">{artist.name}</h1>

          <p className="text-white/60">
            {artist.genre || "Unknown Genre"}
          </p>

          <p className="text-white/50 max-w-xl">
            {artist.bio || "No artist biography available."}
          </p>
        </div>

      </section>

      {/* ARTISTE AİT TRACKLER */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Tracks by {artist.name}
        </h2>

        {tracks.length === 0 ? (
          // Artistin hiç tracki yoksa gösterilir
          <p className="text-white/50 italic">
            This artist has no tracks yet.
          </p>
        ) : (
          // Trackler grid şeklinde listelenir
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {tracks.map((track) => (
              <Link
                key={track.id}
                href={`/dashboard/listener/track/${track.id}`}
                className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition"
              >
                {/* Track kapak görseli */}
                <div className="aspect-square rounded-lg overflow-hidden mb-3">
                  <Image
                    src={track.coverURL || "/default-cover.png"}
                    width={300}
                    height={300}
                    alt={track.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Track adı */}
                <p className="font-medium truncate">
                  {track.title}
                </p>

                {/* Artist adı */}
                <p className="text-sm text-white/50 truncate">
                  {artist.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

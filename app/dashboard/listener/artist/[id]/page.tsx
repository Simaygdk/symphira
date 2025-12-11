"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [artist, setArtist] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    const loadArtist = async () => {
      const ref = doc(db, "artists", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setArtist({ id: snap.id, ...snap.data() });
      }
    };

    const loadTracks = async () => {
      const tracksRef = collection(db, "tracks");
      const q = query(tracksRef, where("artistId", "==", id));
      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setTracks(list);
    };

    loadArtist();
    loadTracks();
  }, [id]);

  if (!artist)
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-16">

      {/* Artist Header */}
      <section className="flex flex-col items-center gap-4">
        <div className="w-40 h-40 rounded-full overflow-hidden border border-white/20">
          <Image
            src={artist.photoURL || "/default-artist.png"}
            width={300}
            height={300}
            alt="artist"
            className="object-cover w-full h-full"
          />
        </div>

        <h1 className="text-4xl font-bold">{artist.name}</h1>

        <p className="text-white/60 max-w-xl text-center text-sm">
          {artist.bio || "This artist has no bio yet."}
        </p>
      </section>

      {/* Artist Tracks */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Tracks by {artist.name}</h2>

        {tracks.length === 0 && (
          <p className="text-white/50 text-sm">This artist has no tracks yet.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <Link
              key={track.id}
              href={`/dashboard/listener/track/${track.id}`}
              className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition"
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden mb-3">
                <Image
                  src={track.coverURL || "/default-cover.png"}
                  width={300}
                  height={300}
                  alt="cover"
                  className="object-cover w-full h-full"
                />
              </div>

              <p className="font-medium truncate">{track.title}</p>
              <p className="text-sm text-white/50 truncate">{artist.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

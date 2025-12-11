"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function TrackDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [track, setTrack] = useState<any>(null);

  useEffect(() => {
    const loadTrack = async () => {
      const ref = doc(db, "tracks", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setTrack({ id: snap.id, ...snap.data() });
      }
    };

    loadTrack();
  }, [id]);

  if (!track)
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-12">

      {/* Track Header */}
      <section className="flex flex-col md:flex-row items-center gap-10">
        <div className="w-60 h-60 rounded-xl overflow-hidden border border-white/20">
          <Image
            src={track.coverURL || "/default-cover.png"}
            width={400}
            height={400}
            alt="cover"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold">{track.title}</h1>

          <Link
            href={`/dashboard/listener/artist/${track.artistId}`}
            className="text-xl text-white/70 hover:text-white transition"
          >
            {track.artistName}
          </Link>

          <p className="text-white/60 text-sm max-w-xl">
            {track.description || "No description available for this track."}
          </p>

          <button className="mt-4 px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition">
            Play Track
          </button>
        </div>
      </section>

      {/* META INFO */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-white/60">Genre</p>
          <h3 className="text-xl font-semibold mt-1">
            {track.genre || "Unknown"}
          </h3>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-white/60">Release Date</p>
          <h3 className="text-xl font-semibold mt-1">
            {track.releaseDate || "N/A"}
          </h3>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-white/60">Duration</p>
          <h3 className="text-xl font-semibold mt-1">
            {track.duration || "Unknown"}
          </h3>
        </div>

      </section>
    </main>
  );
}

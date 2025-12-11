"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function FollowingPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const ref = collection(db, "artists");

      // Example: fetch all followed artists (replace with real filter later)
      const snap = await getDocs(ref);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setArtists(list.slice(0, 10)); // demo: first 10
      setLoading(false);
    };

    load();
  }, []);

  if (loading)
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-10">
      <h1 className="text-4xl font-bold">Following</h1>

      {artists.length === 0 && (
        <p className="text-white/60 text-sm">
          You are not following any artists yet.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/dashboard/listener/artist/${artist.id}`}
            className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
              <Image
                src={artist.photoURL || "/default-artist.png"}
                width={200}
                height={200}
                alt="artist"
                className="object-cover w-full h-full"
              />
            </div>

            <p className="font-medium text-center truncate">{artist.name}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

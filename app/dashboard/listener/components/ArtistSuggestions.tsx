"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

interface Artist {
  id: string;
  name: string;
  photoURL?: string;
}

export default function ArtistSuggestions({ userId }: { userId: string }) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const followRef = collection(db, "followers");
      const snapFollow = await getDocs(
        query(followRef, where("listenerId", "==", userId))
      );
      const followingIds = snapFollow.docs.map((d) => d.data().artistId);

      const artistRef = collection(db, "users");
      const snapArtist = await getDocs(
        query(artistRef, where("role", "==", "artist"))
      );

      let allArtists: Artist[] = snapArtist.docs.map((d) => ({
        id: d.id,
        name: d.data().name || "Unknown Artist",
        photoURL: d.data().photoURL || "/default-avatar.png",
      }));

      const filtered = allArtists.filter((a) => !followingIds.includes(a.id));

      setArtists(filtered);
      setLoading(false);
    };

    load();
  }, [userId]);

  const followArtist = async (artistId: string) => {
    await addDoc(collection(db, "followers"), {
      listenerId: userId,
      artistId,
      followedAt: serverTimestamp(),
    });

    setArtists((prev) => prev.filter((a) => a.id !== artistId));
  };

  if (loading)
    return <p className="text-white/50 mt-10 text-sm">Loading suggestions…</p>;

  if (artists.length === 0)
    return (
      <p className="text-white/50 mt-10 text-sm">No new artist suggestions.</p>
    );

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold mb-4">Artists You May Like</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition"
          >
            <Link href={`/dashboard/listener/artist/${artist.id}`}>
              <div className="w-full aspect-square rounded-full overflow-hidden mb-3 flex items-center justify-center bg-black/20">
                <Image
                  src={artist.photoURL || "/default-avatar.png"}
                  alt={artist.name}
                  width={180}
                  height={180}
                  className="object-cover w-full h-full"
                />
              </div>

              <p className="font-medium text-center">{artist.name}</p>
            </Link>

            <button
              onClick={() => followArtist(artist.id)}
              className="mt-3 w-full py-1.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

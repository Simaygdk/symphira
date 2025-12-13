"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  increment
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { UserMinus } from "lucide-react";

export default function FollowingPage() {
  const user = auth.currentUser;
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load followed artists
  useEffect(() => {
    const loadFollowing = async () => {
      if (!user) return;

      const q = query(
        collection(db, "follows"),
        where("followerId", "==", user.uid)
      );

      const snap = await getDocs(q);

      const list: any[] = [];

      for (const d of snap.docs) {
        const artistId = d.data().artistId;

        // Load artist profile
        const ref = doc(db, "users", artistId);
        const artistSnap = await getDoc(ref);

        if (artistSnap.exists()) {
          list.push({
            followDocId: d.id,
            ...artistSnap.data(),
            artistId: artistSnap.id,
          });
        }
      }

      setFollowing(list);
      setLoading(false);
    };

    loadFollowing();
  }, [user]);

  const unfollow = async (artistId: string, followDocId: string) => {
    if (!user) return;

    // Delete follow entry
    await deleteDoc(doc(db, "follows", followDocId));

    // Decrement artist follower count
    await updateDoc(doc(db, "users", artistId), {
      followerCount: increment(-1),
    });

    // Remove locally
    setFollowing((prev) =>
      prev.filter((item) => item.artistId !== artistId)
    );
  };

  if (!user)
    return (
      <main className="min-h-screen text-white flex justify-center items-center">
        Please log in.
      </main>
    );

  return (
    <main className="min-h-screen px-6 py-16 text-white">

      <h1 className="text-4xl font-bold mb-10">Following Artists</h1>

      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : following.length === 0 ? (
        <p className="text-white/60 italic">You are not following any artists.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {following.map((artist) => (
            <div
              key={artist.artistId}
              className="p-6 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition"
            >
              <div className="flex flex-col items-center text-center gap-3">

                {/* ARTIST IMAGE */}
                <div className="w-28 h-28 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src={artist.photoURL || "/default-artist.png"}
                    width={200}
                    height={200}
                    alt="artist"
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* NAME */}
                <h2 className="text-xl font-semibold">{artist.displayName}</h2>

                {/* BIO */}
                <p className="text-white/60 text-sm">
                  {artist.bio || "No bio provided."}
                </p>

                {/* FOLLOWERS */}
                <p className="text-white/40 text-xs">
                  Followers: {artist.followerCount ?? 0}
                </p>

                {/* VIEW PROFILE */}
                <Link
                  href={`/dashboard/listener/artist/${artist.artistId}`}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white mt-2"
                >
                  View Profile
                </Link>

                {/* UNFOLLOW */}
                <button
                  onClick={() => unfollow(artist.artistId, artist.followDocId)}
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2"
                >
                  <UserMinus size={18} /> Unfollow
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

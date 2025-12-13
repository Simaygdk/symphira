"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [artist, setArtist] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0); // 🔥 Yeni eklendi

  // LOAD ARTIST + TRACKS + FOLLOW STATUS + FOLLOWER COUNT
  useEffect(() => {
    const load = async () => {
      try {
        // ----------- LOAD ARTIST -----------
        const artistRef = doc(db, "artists", id);
        const artistSnap = await getDoc(artistRef);

        if (artistSnap.exists()) {
          setArtist({ id: artistSnap.id, ...artistSnap.data() });
        }

        // ----------- LOAD TRACKS -----------
        const trackRef = collection(db, "tracks");
        const qTracks = query(trackRef, where("artistId", "==", id));
        const trackSnap = await getDocs(qTracks);

        const trackList = trackSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setTracks(trackList);

        // ----------- FOLLOW STATUS -----------
        if (auth.currentUser) {
          const followRef = doc(db, "follows", `${auth.currentUser.uid}_${id}`);
          const fSnap = await getDoc(followRef);

          setIsFollowing(fSnap.exists());
        }

        // ----------- FOLLOWER COUNT -----------
        const followsRef = collection(db, "follows");
        const qFollowers = query(followsRef, where("artistId", "==", id));
        const followerSnap = await getDocs(qFollowers);

        setFollowersCount(followerSnap.size); // 🔥 gerçek takipçi sayısı

      } catch (err) {
        console.error("Artist load error:", err);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  // FOLLOW / UNFOLLOW
  const toggleFollow = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const followId = `${user.uid}_${id}`;
    const followRef = doc(db, "follows", followId);

    if (isFollowing) {
      // UNFOLLOW
      await deleteDoc(followRef);
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1); // 🔥 sayıyı azalt
    } else {
      // FOLLOW
      await setDoc(followRef, {
        userId: user.uid,
        artistId: id,
        createdAt: Date.now(),
      });
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1); // 🔥 sayıyı artır
    }
  };

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </main>
    );

  if (!artist)
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Artist not found
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-16">

      {/* ARTIST HEADER */}
      <section className="flex flex-col md:flex-row items-center gap-10">

        <div className="w-48 h-48 rounded-full overflow-hidden border border-white/20">
          <Image
            src={artist.photoURL || "/default-artist.png"}
            width={300}
            height={300}
            alt="artist"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-col gap-3 text-center md:text-left">
          <h1 className="text-4xl font-bold">{artist.name}</h1>

          <p className="text-white/60">{artist.genre || "Unknown Genre"}</p>

          <p className="text-white/50 max-w-xl">
            {artist.bio || "No artist biography available."}
          </p>

          {/* 🔥 REAL FOLLOWER COUNT */}
          <p className="text-white/40 text-sm">
            Followers: {followersCount}
          </p>

          {/* 🔥 FOLLOW / UNFOLLOW BUTTON */}
          <button
            onClick={toggleFollow}
            className={`px-6 py-2 rounded-lg border transition ${
              isFollowing
                ? "bg-white text-black border-white"
                : "bg-white/10 text-white border-white/30 hover:bg-white/20"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

      </section>

      {/* TRACKS SECTION */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Tracks by {artist.name}</h2>

        {tracks.length === 0 ? (
          <p className="text-white/50 italic">This artist has no tracks yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {tracks.map((track) => (
              <Link
                key={track.id}
                href={`/dashboard/listener/track/${track.id}`}
                className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition"
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-3">
                  <Image
                    src={track.coverURL || "/default-cover.png"}
                    width={300}
                    height={300}
                    alt={track.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                <p className="font-medium truncate">{track.title}</p>
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

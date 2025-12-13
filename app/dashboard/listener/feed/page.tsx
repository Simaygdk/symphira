"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";

// Correct import paths (2 levels up!)
import ListenerDashboardHero from "../components/ListenerDashboardHero";
import RecentlyPlayed from "../components/RecentlyPlayed";
import SavedItems from "../components/SavedItems";
import TrendingArtists from "../components/TrendingArtists";
import YourActivity from "../components/YourActivity";
import ArtistSuggestions from "../components/ArtistSuggestions";
import TrendingTracks from "../components/TrendingTracks";

export default function FeedPage() {
  const [feedTracks, setFeedTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeed = async () => {
      if (!auth.currentUser) return;

      const followsRef = collection(db, "follows");
      const qFollows = query(
        followsRef,
        where("userId", "==", auth.currentUser.uid)
      );

      const followSnap = await getDocs(qFollows);
      const followedArtists = followSnap.docs.map((d) => d.data().artistId);

      if (followedArtists.length === 0) {
        setFeedTracks([]);
        setLoading(false);
        return;
      }

      const trackRef = collection(db, "tracks");

      const promises = followedArtists.map((artistId) =>
        getDocs(query(trackRef, where("artistId", "==", artistId)))
      );

      const snaps = await Promise.all(promises);

      const allTracks: any[] = [];
      snaps.forEach((snap) => {
        snap.docs.forEach((d) =>
          allTracks.push({ id: d.id, ...d.data() })
        );
      });

      allTracks.sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );

      setFeedTracks(allTracks);
      setLoading(false);
    };

    loadFeed();
  }, []);

  if (loading)
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading feed...
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-16">

      <h1 className="text-4xl font-bold">Your Feed</h1>

      {feedTracks.length === 0 ? (
        <p className="text-white/50">
          You are not following any artists yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {feedTracks.map((track) => (
            <Link
              key={track.id}
              href={`/dashboard/listener/track/${track.id}`}
              className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-3">
                <Image
                  src={track.coverURL || "/default-cover.png"}
                  alt="Track Cover"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>

              <p className="font-medium truncate">{track.title}</p>
              <p className="text-sm text-white/50 truncate">
                {track.artistName}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

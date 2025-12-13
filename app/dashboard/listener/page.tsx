"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";

// Components
import ListenerDashboardHero from "./components/ListenerDashboardHero";
import RecentlyPlayed from "./components/RecentlyPlayed";
import SavedItems from "./components/SavedItems";
import TrendingArtists from "./components/TrendingArtists";
import YourActivity from "./components/YourActivity";
import ArtistSuggestions from "./components/ArtistSuggestions";
import TrendingTracks from "./components/TrendingTracks";

export default function ListenerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [stats, setStats] = useState({
    listens: 0,
    saved: 0,
    artistsFollowed: 0,
  });

  // AUTH LISTENER
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsub();
  }, []);

  // LOAD TRACKS + ARTISTS
  useEffect(() => {
    const load = async () => {
      const trackRef = collection(db, "tracks");
      const artistRef = collection(db, "artists");

      const [trackSnap, artistSnap] = await Promise.all([
        getDocs(trackRef),
        getDocs(artistRef),
      ]);

      const trackList = trackSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const artistList = artistSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setTracks(trackList);
      setArtists(artistList);
      setSaved(trackList.slice(0, 5));

      setStats({
        listens: trackList.length * 12,
        saved: trackList.slice(0, 5).length,
        artistsFollowed: artistList.length,
      });
    };

    load();
  }, []);

  if (!user)
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-16">

      {/* HERO */}
      <ListenerDashboardHero />

      {/* TRENDING TRACKS */}
      <TrendingTracks tracks={tracks} />

      {/* RECOMMENDATIONS */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Senin İçin Önerilenler</h2>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {tracks.slice(0, 10).map((track) => (
            <Link
              key={track.id}
              href={`/dashboard/listener/track/${track.id}`}
              className="min-w-[160px] bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition flex-shrink-0"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-3">
                <Image
                  src={track.coverURL || "/default-cover.png"}
                  width={300}
                  height={300}
                  alt="cover"
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
      </section>

      {/* RECENTLY PLAYED */}
      <RecentlyPlayed items={tracks} />

      {/* DISCOVER */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Discover Tracks</h2>

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
                  alt="cover"
                  className="object-cover w-full h-full"
                />
              </div>

              <p className="font-medium">{track.title}</p>
              <p className="text-sm text-white/50">{track.artistName}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SAVED ITEMS */}
      <SavedItems items={saved} />

      {/* TRENDING ARTISTS */}
      <TrendingArtists artists={artists} />

      {/* ACTIVITY */}
      <YourActivity stats={stats} />

      {/* SUGGESTIONS */}
      <ArtistSuggestions userId={user.uid} />
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { PlayCircle, ArrowRight } from "lucide-react";
import { useAudioPlayer } from "../../../components/AudioPlayerContext";
import Link from "next/link";

type Track = {
  id: string;
  title: string;
  artistName: string;
  coverURL?: string;
  audioURL?: string;
  createdAt?: any;
};

export default function DiscoverPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [recent, setRecent] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<string[]>([]);
  const { playTrack } = useAudioPlayer();

  const load = async () => {
    const snap = await getDocs(
      query(collection(db, "products"), orderBy("createdAt", "desc"))
    );

    const list: Track[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Track, "id">),
    }));

    setTracks(list.slice(0, 18));
    setRecent(list.slice(0, 6));

    const artists = [...new Set(list.map((t) => t.artistName))];
    setTopArtists(artists.slice(0, 6));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen px-6 py-14 text-white bg-gradient-to-b from-[#0e061d] via-[#1a0d2f] to-[#2b1250]">

      <h1 className="text-4xl font-bold text-center text-purple-200 drop-shadow-[0_0_20px_rgba(160,60,255,0.35)] mb-12">
        Discover
      </h1>

      <div className="max-w-6xl mx-auto space-y-16">

        {/* RECENT RELEASES */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-300 mb-6">Recently Added</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {recent.map((track) => (
              <motion.div
                key={track.id}
                whileHover={{ scale: 1.04 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-3 backdrop-blur-xl cursor-pointer"
              >
                <img
                  src={track.coverURL || "https://placehold.co/300x300"}
                  className="w-full h-32 rounded-xl object-cover mb-3"
                />

                <p className="text-sm font-semibold text-purple-200 truncate">{track.title}</p>
                <p className="text-xs text-neutral-400 truncate">{track.artistName}</p>

                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => playTrack(track)}
                    className="text-purple-300 hover:text-purple-100"
                  >
                    <PlayCircle size={26} />
                  </button>

                  <Link
                    href={`/dashboard/listener/track/${track.id}`}
                    className="text-purple-300 hover:text-purple-100"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TOP ARTISTS */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-300 mb-6">Trending Artists</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {topArtists.map((artist, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04 }}
                className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-xl"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/20 border border-purple-300/30 flex items-center justify-center text-purple-200 text-xl font-bold mb-3">
                  {artist[0]}
                </div>

                <p className="font-semibold text-purple-200 truncate">{artist}</p>

                <Link
                  href={`/dashboard/listener/search?artist=${encodeURIComponent(
                    artist
                  )}`}
                  className="text-purple-300 hover:text-purple-100 text-sm flex items-center justify-center gap-1 mt-2"
                >
                  Explore <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ALL DISCOVER MUSIC */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-300 mb-6">Recommended For You</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {tracks.map((track) => (
              <motion.div
                key={track.id}
                whileHover={{ scale: 1.04 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-3 backdrop-blur-xl cursor-pointer"
              >
                <img
                  src={track.coverURL || "https://placehold.co/300x300"}
                  className="w-full h-32 rounded-xl object-cover mb-3"
                />

                <p className="text-sm font-semibold text-purple-200 truncate">{track.title}</p>
                <p className="text-xs text-neutral-400 truncate">{track.artistName}</p>

                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => playTrack(track)}
                    className="text-purple-300 hover:text-purple-100"
                  >
                    <PlayCircle size={26} />
                  </button>

                  <Link
                    href={`/dashboard/listener/track/${track.id}`}
                    className="text-purple-300 hover:text-purple-100"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

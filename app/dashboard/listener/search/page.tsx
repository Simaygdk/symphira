"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { useAudioPlayer } from "../../../components/AudioPlayerContext";
import { Search, PlayCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

type Track = {
  id: string;
  title: string;
  artistName: string;
  coverURL?: string;
  audioURL?: string;
  createdAt?: any;
};

type Artist = {
  name: string;
};

type UserPlaylist = {
  id: string;
  title: string;
  tracks?: Track[];
};

export default function SearchPage() {
  const { playTrack } = useAudioPlayer();

  const [input, setInput] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (input.trim() === "") {
      setTracks([]);
      setArtists([]);
      setPlaylists([]);
      return;
    }

    setLoading(true);

    const text = input.toLowerCase();

    const productsSnap = await getDocs(
      query(collection(db, "products"), orderBy("createdAt", "desc"))
    );

    const productList: Track[] = productsSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Track, "id">),
    }));

    const filteredTracks = productList.filter(
      (p) =>
        p.title?.toLowerCase().includes(text) ||
        p.artistName?.toLowerCase().includes(text)
    );

    const artistNames = [...new Set(productList.map((p) => p.artistName))];

    const filteredArtists: Artist[] = artistNames
      .filter((artist) => artist?.toLowerCase().includes(text))
      .map((name) => ({ name }));

    let filteredPlaylists: UserPlaylist[] = [];

    if (auth.currentUser) {
      const playlistSnap = await getDocs(
        query(
          collection(db, "playlists"),
          where("userId", "==", auth.currentUser.uid)
        )
      );

      filteredPlaylists = playlistSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<UserPlaylist, "id">),
      }));
    }

    filteredPlaylists = filteredPlaylists.filter((p) =>
      p.title?.toLowerCase().includes(text)
    );

    setTracks(filteredTracks);
    setArtists(filteredArtists);
    setPlaylists(filteredPlaylists);

    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(search, 200);
    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <main className="min-h-screen px-6 py-14 text-white bg-gradient-to-b from-[#0c0618] via-[#140a26] to-[#241033]">

      <h1 className="text-4xl font-bold text-center text-purple-200 drop-shadow-[0_0_20px_rgba(150,50,255,0.35)] mb-10">
        Search
      </h1>

      <div className="max-w-xl mx-auto mb-14">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for songs, artists, playlists..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:border-purple-400"
          />
          <Search className="absolute right-4 top-3 text-neutral-400" />
        </div>
      </div>

      {loading && (
        <p className="text-center text-neutral-400">Searching...</p>
      )}

      <div className="max-w-4xl mx-auto space-y-12">

        {artists.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">
              Artists
            </h2>

            <div className="space-y-3">
              {artists.map((artist, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-xl"
                >
                  <p className="text-lg text-purple-200 font-semibold">
                    {artist.name}
                  </p>

                  <Link
                    href={`/dashboard/listener/search?artist=${encodeURIComponent(
                      artist.name
                    )}`}
                    className="text-purple-300 hover:text-purple-200"
                  >
                    <ArrowRight size={22} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {tracks.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">
              Songs
            </h2>

            <div className="space-y-4">
              {tracks.map((track) => (
                <motion.div
                  key={track.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between px-4 py-3 bg-white/10 border border-white/20 rounded-xl backdrop-blur-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={track.coverURL || "https://placehold.co/80x80"}
                      className="w-14 h-14 rounded object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold text-purple-200">
                        {track.title}
                      </p>
                      <p className="text-neutral-400 text-sm">
                        {track.artistName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => playTrack(track)}
                      className="text-purple-300 hover:text-purple-100"
                    >
                      <PlayCircle size={28} />
                    </button>

                    <Link
                      href={`/dashboard/listener/track/${track.id}`}
                      className="text-purple-300 hover:text-purple-100"
                    >
                      <ArrowRight size={24} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {playlists.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">
              Your Playlists
            </h2>

            <div className="space-y-3">
              {playlists.map((pl) => (
                <Link
                  key={pl.id}
                  href={`/dashboard/listener/playlists/${pl.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-xl transition"
                >
                  <div>
                    <p className="text-lg font-semibold text-purple-200">
                      {pl.title}
                    </p>
                    <p className="text-neutral-400 text-sm">
                      {pl.tracks?.length || 0} tracks
                    </p>
                  </div>

                  <ArrowRight size={22} className="text-purple-300" />
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

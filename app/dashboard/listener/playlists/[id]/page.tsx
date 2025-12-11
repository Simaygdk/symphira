"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "../../../../../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { PlayCircle, Trash2, ArrowLeft, PlusCircle } from "lucide-react";
import { useAudioPlayer } from "../../../../components/AudioPlayerContext";
import Link from "next/link";

type Track = {
  id: string;
  title: string;
  artistName: string;
  coverURL?: string;
  audioURL?: string;
};

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { playTrack } = useAudioPlayer();

  const [playlist, setPlaylist] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlaylist = async () => {
    if (!auth.currentUser) return;

    const ref = doc(db, "playlists", id as string);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      setPlaylist(null);
      setTracks([]);
      return;
    }

    const data = snap.data();
    setPlaylist({ id: snap.id, ...data });
    setTracks(data.tracks || []);
    setLoading(false);
  };

  const removeTrack = async (track: Track) => {
    if (!auth.currentUser || !playlist) return;

    const ref = doc(db, "playlists", playlist.id);

    await updateDoc(ref, {
      tracks: arrayRemove(track),
    });

    setTracks((prev) => prev.filter((t) => t.id !== track.id));
  };

  useEffect(() => {
    loadPlaylist();
  }, []);

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-b from-[#0d0718] via-[#1c0f2b] to-[#2d1242] text-white">

      {/* BACK */}
      <Link
        href="/dashboard/listener/playlists"
        className="flex items-center gap-2 text-purple-300 hover:text-purple-100 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Playlists
      </Link>

      {loading ? (
        <p className="text-center text-neutral-400">Loading playlist...</p>
      ) : !playlist ? (
        <p className="text-center text-red-400">Playlist not found.</p>
      ) : (
        <>
          {/* HEADER */}
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h1 className="text-4xl font-bold text-purple-200 drop-shadow-[0_0_25px_rgba(150,60,255,0.4)]">
              {playlist.name}
            </h1>

            <p className="text-neutral-300 mt-2 text-sm">
              {tracks.length} songs
            </p>

            <button
              onClick={() =>
                router.push(`/dashboard/listener/playlists/${playlist.id}/add`)
              }
              className="mt-6 inline-flex items-center gap-2 bg-purple-600/30 hover:bg-purple-600/40 border border-purple-400 px-6 py-2 rounded-full text-purple-200 transition"
            >
              <PlusCircle size={20} />
              Add Songs
            </button>
          </div>

          {/* TRACK LIST */}
          <div className="max-w-4xl mx-auto space-y-5">

            {tracks.length === 0 ? (
              <p className="text-neutral-400 text-center italic">
                This playlist is empty. Add some songs!
              </p>
            ) : (
              tracks.map((track) => (
                <motion.div
                  key={track.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={track.coverURL || "https://placehold.co/80x80"}
                      className="w-16 h-16 rounded-xl object-cover"
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

                    <button
                      onClick={() => removeTrack(track)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}

          </div>
        </>
      )}
    </main>
  );
}

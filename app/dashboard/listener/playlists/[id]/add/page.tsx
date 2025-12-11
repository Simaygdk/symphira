"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "../../../../../../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowLeft, PlusCircle, CheckCircle } from "lucide-react";

type Track = {
  id: string;
  title: string;
  artistName: string;
  coverURL?: string;
  audioURL?: string;
};

export default function AddSongsToPlaylistPage() {
  const { id } = useParams();
  const router = useRouter();

  const [playlist, setPlaylist] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [added, setAdded] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!auth.currentUser) return;

    const ref = doc(db, "playlists", id as string);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data() || {};
    setPlaylist({ id: snap.id, ...data });

    const existingTracks = Array.isArray(data.tracks) ? data.tracks : [];
    setAdded(existingTracks.map((t: Track) => t.id));

    const allSnap = await getDocs(
      query(collection(db, "products"), orderBy("createdAt", "desc"))
    );

    const allTracks: Track[] = allSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Track, "id">),
    }));

    setTracks(allTracks);
    setLoading(false);
  };

  const addToPlaylist = async (track: Track) => {
    if (!playlist) return;
    if (added.includes(track.id)) return;

    const ref = doc(db, "playlists", playlist.id);

    await updateDoc(ref, {
      tracks: arrayUnion(track),
    });

    setAdded((prev) => [...prev, track.id]);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-b from-[#0b0616] via-[#1a0d2c] to-[#2b1248] text-white">

      <button
        onClick={() => router.push(`/dashboard/listener/playlists/${id}`)}
        className="flex items-center gap-2 text-purple-300 hover:text-purple-100 mb-8"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {loading ? (
        <p className="text-center text-neutral-400">Loading...</p>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-purple-200 drop-shadow-[0_0_22px_rgba(150,60,255,0.4)] mb-6 text-center">
            Add Songs to "{playlist?.name}"
          </h1>

          <p className="text-center text-neutral-300 mb-12">
            Tap a song to add it into your playlist.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {tracks.map((track) => {
              const isAdded = added.includes(track.id);

              return (
                <motion.button
                  key={track.id}
                  whileHover={isAdded ? {} : { scale: 1.03 }}
                  onClick={() => addToPlaylist(track)}
                  disabled={isAdded}
                  className={`p-4 rounded-2xl backdrop-blur-xl border transition-all shadow-lg
                    ${
                      isAdded
                        ? "bg-green-500/20 border-green-400/30 cursor-not-allowed"
                        : "bg-white/10 border-white/20 hover:bg-white/20"
                    }`}
                >
                  <img
                    src={track.coverURL || "https://placehold.co/400x400"}
                    className="w-full h-40 rounded-xl object-cover mb-4"
                  />

                  <p className="text-lg font-semibold text-purple-200 truncate">
                    {track.title}
                  </p>

                  <p className="text-neutral-400 text-sm truncate">
                    {track.artistName}
                  </p>

                  <div className="flex items-center justify-center mt-4">
                    {isAdded ? (
                      <CheckCircle className="text-green-300" size={26} />
                    ) : (
                      <PlusCircle className="text-purple-300" size={26} />
                    )}
                  </div>
                </motion.button>
              );
            })}

          </div>
        </>
      )}
    </main>
  );
}

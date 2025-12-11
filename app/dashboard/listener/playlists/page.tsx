"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../../lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { PlusCircle, Music } from "lucide-react";
import Link from "next/link";

export default function ListenerPlaylistsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "playlists"),
      where("ownerId", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setPlaylists(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const createPlaylist = async () => {
    if (!title.trim()) return;

    setCreating(true);

    await addDoc(collection(db, "playlists"), {
      title,
      ownerId: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
      tracks: [],
    });

    setTitle("");
    setCreating(false);
  };

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#0c0618] via-[#1a0f2d] to-[#2c1347] text-white">
      <h1 className="text-4xl font-bold text-center text-purple-300 drop-shadow-[0_0_30px_rgba(180,50,255,0.35)]">
        Your Playlists
      </h1>

      <p className="text-neutral-300 text-center mt-3 mb-10">
        Create and manage your personal music collections.
      </p>

      {/* CREATE PLAYLIST INPUT */}
      <div className="max-w-md mx-auto flex items-center gap-3 mb-12">
        <input
          type="text"
          placeholder="New playlist name"
          className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          disabled={creating}
          onClick={createPlaylist}
          className="px-4 py-3 rounded-xl bg-purple-600/40 border border-purple-400 hover:bg-purple-600/50 transition flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Create
        </button>
      </div>

      {/* PLAYLIST GRID */}
      {loading ? (
        <p className="text-center text-neutral-400">Loading...</p>
      ) : playlists.length === 0 ? (
        <p className="text-center text-neutral-400 italic">
          You don't have any playlists yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {playlists.map((pl) => (
            <Link key={pl.id} href={`/dashboard/listener/playlists/${pl.id}`}>
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl hover:bg-white/20 transition cursor-pointer">
                <div className="bg-black/30 w-full h-36 rounded-xl flex items-center justify-center mb-4">
                  <Music size={44} className="text-purple-300" />
                </div>

                <h2 className="text-xl font-semibold text-purple-200 truncate">
                  {pl.title}
                </h2>

                <p className="text-neutral-400 text-sm mt-1">
                  {pl.tracks?.length || 0} tracks
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

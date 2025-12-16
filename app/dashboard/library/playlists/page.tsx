"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

type Playlist = {
  id: string;
  name: string;
};

export default function PlaylistsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserId(null);
        setPlaylists([]);
        setLoading(false);
        return;
      }

      setUserId(user.uid);

      const snap = await getDocs(
        collection(db, "users", user.uid, "playlists")
      );

      const data: Playlist[] = snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
      }));

      setPlaylists(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const createPlaylist = async () => {
    if (!userId || !name.trim()) return;

    const ref = await addDoc(
      collection(db, "users", userId, "playlists"),
      {
        name,
        createdAt: serverTimestamp(),
      }
    );

    setPlaylists((prev) => [
      ...prev,
      { id: ref.id, name },
    ]);

    setName("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-8 py-16">
      <h1 className="mb-6 text-3xl font-semibold text-white">
        Playlists
      </h1>

      <div className="mb-8 flex max-w-sm gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist name"
          className="flex-1 rounded-md bg-white/5 px-3 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-purple-500"
        />
        <button
          onClick={createPlaylist}
          className="rounded-md bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
        >
          Create
        </button>
      </div>

      {playlists.length === 0 && (
        <p className="text-white/50">
          No playlists yet.
        </p>
      )}

      <ul className="space-y-3">
        {playlists.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/library/playlists/${p.id}`}
            className="block rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 hover:bg-white/10"
          >
            <span className="text-white">
              {p.name}
            </span>
          </Link>
        ))}
      </ul>
    </div>
  );
}

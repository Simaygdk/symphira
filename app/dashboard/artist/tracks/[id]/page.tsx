"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ManageTrackPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const user = auth.currentUser;

  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  const [newCover, setNewCover] = useState<File | null>(null);
  const [newAudio, setNewAudio] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadTrack = async () => {
      const ref = doc(db, "tracks", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const data = snap.data();

      // Authorization check: Only artist who owns this track can access
      if (data.artistId !== user?.uid) {
        router.push("/dashboard/artist/tracks");
        return;
      }

      setTrack(data);
      setTitle(data.title);
      setGenre(data.genre || "");
      setDescription(data.description || "");

      setLoading(false);
    };

    loadTrack();
  }, [id, user, router]);

  const deleteTrack = async () => {
    await deleteDoc(doc(db, "tracks", id));
    router.push("/dashboard/artist/tracks");
  };

  const saveChanges = async () => {
    if (!track) return;

    setSaving(true);

    let coverURL = track.coverURL;
    let audioURL = track.audioURL;

    // Upload new cover if chosen
    if (newCover) {
      const coverRef = ref(
        storage,
        `tracks/covers/${user?.uid}-${Date.now()}.jpg`
      );
      await uploadBytes(coverRef, newCover);
      coverURL = await getDownloadURL(coverRef);
    }

    // Upload new audio if chosen
    if (newAudio) {
      const audioRef = ref(
        storage,
        `tracks/audio/${user?.uid}-${Date.now()}.mp3`
      );
      await uploadBytes(audioRef, newAudio);
      audioURL = await getDownloadURL(audioRef);
    }

    await updateDoc(doc(db, "tracks", id), {
      title,
      genre,
      description,
      coverURL,
      audioURL,
    });

    setSaving(false);
    router.refresh();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center text-white">
        Loading track...
      </main>
    );
  }

  if (!track) {
    return (
      <main className="min-h-screen flex justify-center items-center text-white">
        Track not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16 text-white max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Manage Track</h1>

      {/* COVER */}
      <div className="mb-6">
        <Image
          src={track.coverURL}
          width={300}
          height={300}
          alt="cover"
          className="rounded-xl mb-3 object-cover"
        />
        <label className="text-white/70 text-sm">Change Cover</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewCover(e.target.files?.[0] || null)}
          className="mt-2 mb-5"
        />
      </div>

      {/* AUDIO */}
      <label className="text-white/70 text-sm">Change Audio File</label>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setNewAudio(e.target.files?.[0] || null)}
        className="mt-2 mb-5"
      />

      {/* TITLE */}
      <label className="text-white/70 text-sm">Title</label>
      <input
        className="w-full p-3 mb-5 rounded bg-white/10 border border-white/20"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* GENRE */}
      <label className="text-white/70 text-sm">Genre</label>
      <input
        className="w-full p-3 mb-5 rounded bg-white/10 border border-white/20"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />

      {/* DESCRIPTION */}
      <label className="text-white/70 text-sm">Description</label>
      <textarea
        rows={4}
        className="w-full p-3 mb-8 rounded bg-white/10 border border-white/20"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* PLAY / LIKE METRICS */}
      <div className="mb-10 text-white/60 text-sm">
        <p>Plays: {track.plays ?? 0}</p>
        <p>Likes: {track.likes ?? 0}</p>
      </div>

      {/* SAVE + DELETE BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={saveChanges}
          disabled={saving}
          className="px-5 py-3 bg-green-600 hover:bg-green-700 rounded-lg"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={deleteTrack}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Delete Track
        </button>
      </div>
    </main>
  );
}

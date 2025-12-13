"use client";

import { useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function UploadTrackPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  if (!user) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center">
        Please log in.
      </main>
    );
  }

  const uploadTrack = async () => {
    if (!audioFile || !coverFile || !title) return;

    setUploading(true);

    // Audio upload
    const audioRef = ref(storage, `tracks/audio/${user.uid}-${Date.now()}.mp3`);
    await uploadBytes(audioRef, audioFile);
    const audioURL = await getDownloadURL(audioRef);

    // Cover upload
    const coverRef = ref(storage, `tracks/covers/${user.uid}-${Date.now()}.jpg`);
    await uploadBytes(coverRef, coverFile);
    const coverURL = await getDownloadURL(coverRef);

    // Firestore record
    await addDoc(collection(db, "tracks"), {
      artistId: user.uid,
      artistName: user.displayName || "Unknown Artist",
      title,
      description,
      genre,
      coverURL,
      audioURL,
      createdAt: Date.now(),
      plays: 0,
      likes: 0,
    });

    setUploading(false);
    router.push("/dashboard/artist/tracks");
  };

  return (
    <main className="min-h-screen px-6 py-16 text-white max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">Upload New Track</h1>

      <label className="text-white/70 text-sm">Title</label>
      <input
        className="w-full p-3 mb-5 rounded bg-white/10 border border-white/20"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="text-white/70 text-sm">Description</label>
      <textarea
        rows={4}
        className="w-full p-3 mb-5 rounded bg-white/10 border border-white/20"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="text-white/70 text-sm">Genre</label>
      <input
        className="w-full p-3 mb-5 rounded bg-white/10 border border-white/20"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />

      <label className="text-white/70 text-sm">Cover Image</label>
      <input
        type="file"
        accept="image/*"
        className="mb-5"
        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
      />

      <label className="text-white/70 text-sm">Audio File</label>
      <input
        type="file"
        accept="audio/*"
        className="mb-8"
        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
      />

      <button
        disabled={uploading}
        onClick={uploadTrack}
        className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
      >
        {uploading ? "Uploading..." : "Upload Track"}
      </button>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "next/navigation";

export default function UploadTrack() {
  const router = useRouter();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [artistName, setArtistName] = useState("");

  useEffect(() => {
    const loadArtist = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setArtistName(snap.data().name || "Unknown Artist");
      }
    };

    loadArtist();
  }, [user]);

  const uploadTrack = async () => {
    if (!user || !audioFile || !coverFile || !title) return;

    setLoading(true);

    const coverRef = ref(
      storage,
      `covers/${user.uid}/${Date.now()}-${coverFile.name}`
    );
    await uploadBytes(coverRef, coverFile);
    const coverURL = await getDownloadURL(coverRef);

    const audioRef = ref(
      storage,
      `tracks/${user.uid}/${Date.now()}-${audioFile.name}`
    );
    await uploadBytes(audioRef, audioFile);
    const audioURL = await getDownloadURL(audioRef);

    await addDoc(collection(db, "tracks"), {
      title,
      artistId: user.uid,
      artistName,
      coverURL,
      audioURL,
      createdAt: serverTimestamp(),
    });

    setLoading(false);
    router.push("/dashboard/artist");
  };

  return (
    <main className="min-h-screen text-white px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Upload Track</h1>

      <div className="space-y-6 max-w-xl">

        <div>
          <label className="block text-sm mb-2">Track Title</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-white/10 border border-white/20"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        <button
          onClick={uploadTrack}
          disabled={loading}
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
        >
          {loading ? "Uploading…" : "Upload Track"}
        </button>
      </div>
    </main>
  );
}

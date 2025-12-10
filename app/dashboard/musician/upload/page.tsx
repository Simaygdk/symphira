"use client";

import { useEffect, useState, DragEvent } from "react";
import { db, storage, auth } from "../../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

export default function UploadMusicPage() {
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState<any>(null);

  const [audioProgress, setAudioProgress] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Fix: Auth listener must run only once
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleDropAudio = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudio(file);
    } else {
      alert("Please drop a valid audio file.");
    }
  };

  const handleDropCover = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCover(file);
    } else {
      alert("Please drop a valid image file.");
    }
  };

  const handleUpload = async () => {
    if (!audio || !title || !user) {
      alert("Please select audio and enter a title.");
      return;
    }

    setLoading(true);

    try {
      // AUDIO UPLOAD
      const audioRef = ref(storage, `tracks/${user.uid}-${audio.name}`);
      const audioTask = uploadBytesResumable(audioRef, audio);

      const audioURL = await new Promise<string>((resolve, reject) => {
        audioTask.on(
          "state_changed",
          (snap) => {
            const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
            setAudioProgress(progress);
          },
          reject,
          async () => resolve(await getDownloadURL(audioTask.snapshot.ref))
        );
      });

      // COVER UPLOAD (optional)
      let coverURL = "";
      if (cover) {
        const coverRef = ref(storage, `covers/${user.uid}-${cover.name}`);
        const coverTask = uploadBytesResumable(coverRef, cover);

        coverURL = await new Promise<string>((resolve, reject) => {
          coverTask.on(
            "state_changed",
            (snap) => {
              const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
              setCoverProgress(progress);
            },
            reject,
            async () => resolve(await getDownloadURL(coverTask.snapshot.ref))
          );
        });
      }

      await addDoc(collection(db, "tracks"), {
        title,
        description,
        audioURL,
        coverURL,
        artist: user.uid,
        artistName: user.email,
        plays: 0,
        createdAt: serverTimestamp(),
      });

      alert("Upload complete!");

      // Reset fields
      setAudio(null);
      setCover(null);
      setTitle("");
      setDescription("");
      setAudioProgress(0);
      setCoverProgress(0);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-black to-gray-900 text-white px-6 py-10">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl p-8 rounded-xl border border-white/10 shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload Music</h1>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Track Title"
          className="p-3 text-black rounded mb-4 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          className="p-3 text-black rounded mb-4 w-full h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* AUDIO DRAG DROP */}
        <div
          onDrop={handleDropAudio}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer mb-4 transition ${
            dragActive ? "border-purple-400 bg-purple-400/10" : "border-gray-500"
          }`}
          onClick={() => document.getElementById("audioInput")?.click()}
        >
          {audio ? (
            <p className="text-gray-200">{audio.name}</p>
          ) : (
            <p className="text-gray-400">Drag & drop audio here or click to upload</p>
          )}
        </div>

        <input
          id="audioInput"
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => setAudio(e.target.files?.[0] || null)}
        />

        {audioProgress > 0 && (
          <div className="w-full bg-gray-800 h-2 rounded mb-4">
            <div
              className="bg-purple-500 h-2 rounded"
              style={{ width: `${audioProgress}%` }}
            />
          </div>
        )}

        {/* COVER DRAG DROP */}
        <div
          onDrop={handleDropCover}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("coverInput")?.click()}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer mb-4 border-gray-500"
        >
          {cover ? (
            <p className="text-gray-200">{cover.name}</p>
          ) : (
            <p className="text-gray-400">Drag & drop cover image here or click to upload</p>
          )}
        </div>

        <input
          id="coverInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setCover(e.target.files?.[0] || null)}
        />

        {coverProgress > 0 && (
          <div className="w-full bg-gray-800 h-2 rounded mb-4">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${coverProgress}%` }}
            />
          </div>
        )}

        {/* Upload button */}
        <button
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-semibold disabled:bg-gray-600"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Track"}
        </button>
      </div>
    </div>
  );
}

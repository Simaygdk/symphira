"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  Image as ImageIcon,
  Music2,
  CheckCircle,
} from "lucide-react";
import { db, auth } from "../../../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const CLOUD_NAME = "dmqnvoish";
const UPLOAD_PRESET = "symphira_profile";

export default function UploadMusicPage() {
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const uploadCoverToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    if (!res.ok || !data.secure_url) {
      throw new Error(data?.error?.message || "Cover upload failed");
    }

    return data.secure_url;
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    if (!title || !artistName || !coverFile) {
      alert("Title, artist and cover image required.");
      return;
    }

    setUploading(true);
    setSuccess(false);

    try {
      const coverURL = await uploadCoverToCloudinary(coverFile);

      await addDoc(collection(db, "tracks"), {
        title,
        artistName,
        coverURL,
        audioURL: "",
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setTitle("");
      setArtistName("");
      setCoverFile(null);
      setAudioFile(null);
    } catch (err: any) {
      alert(err.message || "Track upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">
      <h1 className="text-4xl font-bold mb-8 text-purple-300">
        Upload Track
      </h1>

      <div className="max-w-xl space-y-6">
        <input
          value={title}
          placeholder="Track Title"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          value={artistName}
          placeholder="Artist Name"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setArtistName(e.target.value)}
        />

        {/* COVER UPLOAD */}
        <div className="space-y-2">
          <p className="text-sm text-neutral-400">Upload Cover Image</p>
          <label className="flex flex-col items-center justify-center h-40 border border-dashed border-white/30 rounded-xl cursor-pointer bg-white/5">
            <ImageIcon size={32} className="text-purple-300 mb-2" />
            <span className="text-sm text-neutral-300">
              {coverFile ? coverFile.name : "Click to upload cover"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* AUDIO UPLOAD (UI PRESENT, NOT REQUIRED) */}
        <div className="space-y-2">
          <p className="text-sm text-neutral-400">Upload Audio</p>
          <label className="flex flex-col items-center justify-center h-40 border border-dashed border-white/30 rounded-xl cursor-pointer bg-white/5">
            <Music2 size={32} className="text-purple-300 mb-2" />
            <span className="text-sm text-neutral-300">
              {audioFile ? audioFile.name : "Click to upload audio"}
            </span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={uploading}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200 flex justify-center gap-2"
        >
          <UploadCloud size={20} />
          {uploading ? "Uploading..." : "Save Track"}
        </motion.button>

        {success && (
          <div className="flex items-center gap-3 text-green-400 bg-white/10 border border-green-500/30 p-4 rounded-xl">
            <CheckCircle size={22} />
            Track saved successfully
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

const handleUpload = async () => {
  if (!file || !user) {
    alert("Please select a file first.");
    return;
  }

  setUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        userName: user.displayName || user.email || "Anonymous",
        caption,
        url: data.secure_url,
        createdAt: serverTimestamp(),
        type: file.type.startsWith("video")
          ? "video"
          : file.type.startsWith("audio")
          ? "audio"
          : "image",
      });

      alert("Upload successful!");
      router.push("/feed");
    } else {
      alert("Upload failed.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred during upload.");
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-2xl w-[400px] text-center">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">📤 Upload Content</h2>
        <p className="text-gray-400 mb-6">
          Upload videos, audio or images to your Symphira feed.
        </p>

        <input
          type="file"
          accept="video/*,audio/*,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
        <input
          type="text"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded mt-2"
        >
          {uploading ? `Uploading... ${progress}%` : "Upload"}
        </button>
      </div>
    </div>
  );
}

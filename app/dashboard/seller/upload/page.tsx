"use client";

import { useState } from "react";
import { db, storage, auth } from "../../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function SellerUploadPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("beat");

  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const types = [
    { value: "beat", label: "Beat" },
    { value: "loop", label: "Loop" },
    { value: "pack", label: "Sound Pack" },
    { value: "stem", label: "Stem" },
  ];

  const handleUpload = async () => {
    if (!file || !title || !price) {
      alert("Please fill all required fields.");
      return;
    }

    if (!auth.currentUser) {
      alert("You must be logged in.");
      return;
    }

    setUploading(true);

    try {
      // upload audio
      const audioRef = ref(storage, `products/${auth.currentUser.uid}-${Date.now()}-${file.name}`);
      const audioTask = uploadBytesResumable(audioRef, file);

      const audioURL = await new Promise<string>((resolve, reject) => {
        audioTask.on(
          "state_changed",
          snap => {
            const p = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(p);
          },
          reject,
          async () => resolve(await getDownloadURL(audioTask.snapshot.ref))
        );
      });

      // upload cover (optional)
      let coverURL = "";
      if (cover) {
        const coverRef = ref(storage, `product_covers/${auth.currentUser.uid}-${Date.now()}-${cover.name}`);
        const coverTask = uploadBytesResumable(coverRef, cover);

        coverURL = await new Promise<string>((resolve, reject) => {
          coverTask.on(
            "state_changed",
            () => {},
            reject,
            async () => resolve(await getDownloadURL(coverTask.snapshot.ref))
          );
        });
      }

      await addDoc(collection(db, "products"), {
        title,
        description,
        price: Number(price),
        type,
        audioURL,
        coverURL,
        sellerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      alert("Product uploaded!");
      router.push("/dashboard/seller/products");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-b from-[#12071e] via-[#1c1030] to-[#2d1546] text-white flex justify-center">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold mb-8 text-purple-300 text-center">
          Upload Product
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Product Title"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price (USD)"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {types.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <div>
            <p className="mb-2 text-sm text-neutral-300">Audio File</p>
            <input
              type="file"
              accept="audio/*"
              className="w-full"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-neutral-300">Cover Image (optional)</p>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setCover(e.target.files?.[0] || null)}
            />
          </div>

          {uploading && (
            <div className="w-full bg-white/10 rounded h-2 overflow-hidden">
              <div
                className="bg-purple-400 h-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <button
            disabled={uploading}
            onClick={handleUpload}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
          >
            {uploading ? "Uploading..." : "Upload Product"}
          </button>

        </div>
      </div>
    </div>
  );
}

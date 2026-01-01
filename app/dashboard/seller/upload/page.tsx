"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Image as ImageIcon, CheckCircle } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

const CLOUD_NAME = "dmqnvoish";
const UPLOAD_PRESET = "symphira_profile";

const CATEGORIES = [
  "Strings",
  "Percussion",
  "Wind",
  "Electronic",
];

export default function SellerUploadPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const uploadCoverToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok || !data.secure_url) {
      throw new Error("Cover upload failed");
    }

    return data.secure_url as string;
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    if (!title || !price || !category || !coverFile) {
      alert("Please fill all required fields.");
      return;
    }

    setUploading(true);
    setSuccess(false);

    try {
      const coverURL = await uploadCoverToCloudinary(coverFile);

      await addDoc(collection(db, "products"), {
        title,
        description,
        price: Number(price),
        category,
        coverURL,
        sellerId: user.uid,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setCoverFile(null);

      setTimeout(() => {
        router.push("/dashboard/seller/products");
      }, 800);
    } catch (err: any) {
      alert(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">
      <h1 className="text-4xl font-bold mb-8 text-purple-300">
        Upload Product
      </h1>

      <div className="max-w-xl space-y-6">
        <input
          value={title}
          placeholder="Product Title"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          value={description}
          placeholder="Description"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          value={price}
          placeholder="Price (TL)"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className="space-y-2">
          <p className="text-sm text-neutral-400">Category</p>
          <div className="flex gap-3 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl border transition ${
                  category === c
                    ? "bg-purple-600/40 border-purple-400 text-purple-200"
                    : "bg-white/5 border-white/20 text-neutral-300 hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

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

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={uploading}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200 flex justify-center gap-2"
        >
          <UploadCloud size={20} />
          {uploading ? "Uploading..." : "Upload Product"}
        </motion.button>

        {success && (
          <div className="flex items-center gap-3 text-green-400 bg-white/10 border border-green-500/30 p-4 rounded-xl">
            <CheckCircle size={22} />
            Product saved successfully
          </div>
        )}
      </div>
    </main>
  );
}

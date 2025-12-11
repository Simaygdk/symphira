"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, storage } from "../../../../../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("beat");

  const [audioURL, setAudioURL] = useState("");
  const [coverURL, setCoverURL] = useState("");

  const [newAudio, setNewAudio] = useState<File | null>(null);
  const [newCover, setNewCover] = useState<File | null>(null);

  const [audioProgress, setAudioProgress] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);

  const types = [
    { value: "beat", label: "Beat" },
    { value: "loop", label: "Loop" },
    { value: "pack", label: "Sound Pack" },
    { value: "stem", label: "Stem" },
  ];

  useEffect(() => {
    const load = async () => {
      const refDoc = doc(db, "products", id as string);
      const snap = await getDoc(refDoc);

      if (!snap.exists()) {
        alert("Product not found.");
        router.push("/dashboard/seller/products");
        return;
      }

      const data = snap.data();

      setTitle(data.title || "");
      setDescription(data.description || "");
      setPrice(String(data.price || ""));
      setType(data.type || "beat");
      setAudioURL(data.audioURL || "");
      setCoverURL(data.coverURL || "");

      setLoading(false);
    };

    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);

    let finalAudio = audioURL;
    let finalCover = coverURL;

    try {
      if (newAudio) {
        try {
          if (audioURL) await deleteObject(ref(storage, audioURL));
        } catch {}

        const storageRef = ref(storage, `products/${Date.now()}-${newAudio.name}`);
        const uploadTask = uploadBytesResumable(storageRef, newAudio);

        finalAudio = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snap) => {
              const p = (snap.bytesTransferred / snap.totalBytes) * 100;
              setAudioProgress(p);
            },
            reject,
            async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
          );
        });
      }

      if (newCover) {
        try {
          if (coverURL) await deleteObject(ref(storage, coverURL));
        } catch {}

        const coverRef = ref(storage, `product_covers/${Date.now()}-${newCover.name}`);
        const coverTask = uploadBytesResumable(coverRef, newCover);

        finalCover = await new Promise<string>((resolve, reject) => {
          coverTask.on(
            "state_changed",
            (snap) => {
              const p = (snap.bytesTransferred / snap.totalBytes) * 100;
              setCoverProgress(p);
            },
            reject,
            async () => resolve(await getDownloadURL(coverTask.snapshot.ref))
          );
        });
      }

      await updateDoc(doc(db, "products", id as string), {
        title,
        description,
        price: Number(price),
        type,
        audioURL: finalAudio,
        coverURL: finalCover,
        updatedAt: serverTimestamp(),
      });

      alert("Product updated!");
      router.push("/dashboard/seller/products");
    } catch (err) {
      console.error(err);
      alert("Saving failed.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#0e071a] via-[#1a0f33] to-[#31134d] text-white flex justify-center">
      <div className="w-full max-w-xl bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-xl shadow-xl">

        <h1 className="text-3xl font-bold mb-8 text-purple-300 text-center">
          Edit Product
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
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <div>
            <p className="text-sm mb-1 text-neutral-300">Replace Audio (optional)</p>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setNewAudio(e.target.files?.[0] || null)}
            />
            {audioProgress > 0 && (
              <div className="w-full bg-white/10 rounded h-2 mt-2">
                <div
                  className="bg-purple-500 h-full transition-all"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            )}
          </div>

          <div>
            <p className="text-sm mb-1 text-neutral-300">Replace Cover (optional)</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewCover(e.target.files?.[0] || null)}
            />
            {coverProgress > 0 && (
              <div className="w-full bg-white/10 rounded h-2 mt-2">
                <div
                  className="bg-blue-400 h-full transition-all"
                  style={{ width: `${coverProgress}%` }}
                />
              </div>
            )}
          </div>

          <button
            disabled={saving}
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>
      </div>
    </main>
  );
}

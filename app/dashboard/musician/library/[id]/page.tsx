"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, storage } from "../../../../../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { motion } from "framer-motion";
import { Loader2, Music, Upload } from "lucide-react";

export default function EditTrackPage() {
  const router = useRouter();
  const params = useParams();
  const trackId = params.id as string;

  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newCover, setNewCover] = useState<File | null>(null);

  useEffect(() => {
    const loadTrack = async () => {
      const refDoc = doc(db, "tracks", trackId);
      const snap = await getDoc(refDoc);

      if (!snap.exists()) {
        alert("Track not found.");
        router.push("/dashboard/musician/library");
        return;
      }

      const data = snap.data();
      setTrack(data);
      setNewTitle(data.title || "");
      setNewDesc(data.description || "");
      setLoading(false);
    };

    loadTrack();
  }, [trackId]);

  const handleSave = async () => {
    setSaving(true);

    try {
      let finalUrl = track.url;
      let finalCoverUrl = track.coverUrl || null;

      
      if (newFile) {
        
        try {
          if (track.url) {
            await deleteObject(ref(storage, track.url));
          }
        } catch (err) {
          console.warn("Old file couldn't be deleted:", err);
        }

        const storageRef = ref(storage, `tracks/${Date.now()}_${newFile.name}`);
        await uploadBytes(storageRef, newFile);
        finalUrl = await getDownloadURL(storageRef);
      }

      if (newCover) {
        const coverRef = ref(storage, `covers/${Date.now()}_${newCover.name}`);
        await uploadBytes(coverRef, newCover);
        finalCoverUrl = await getDownloadURL(coverRef);
      }

    
      await updateDoc(doc(db, "tracks", trackId), {
        title: newTitle,
        description: newDesc,
        url: finalUrl,
        coverUrl: finalCoverUrl,
        updatedAt: serverTimestamp(),
      });

      alert("Track updated successfully!");
      router.push("/dashboard/musician/library");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 size={40} className="animate-spin text-purple-300" />
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-br from-[#0a0714] via-[#1b1035] to-[#2c1140] text-white">
      <div className="max-w-xl mx-auto bg-white/10 border border-white/20 p-8 rounded-2xl backdrop-blur-xl shadow-lg">

        <h1 className="text-3xl font-bold text-purple-300 mb-6 flex items-center gap-2">
          <Music size={28} />
          Edit Track
        </h1>

        {/* Title */}
        <label className="text-sm text-neutral-300">Track Title</label>
        <input
          className="w-full mt-1 mb-4 p-2 rounded-lg bg-white/10 border border-white/20 text-white"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        {/* Description */}
        <label className="text-sm text-neutral-300">Description</label>
        <textarea
          className="w-full mt-1 mb-4 p-2 rounded-lg bg-white/10 border border-white/20 text-white"
          rows={3}
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />

        {/* New Music Upload */}
        <label className="text-sm text-neutral-300">Replace Audio (optional)</label>
        <input
          type="file"
          accept="audio/*"
          className="mt-2 mb-4"
          onChange={(e) => setNewFile(e.target.files?.[0] || null)}
        />

        {/* New Cover Upload */}
        <label className="text-sm text-neutral-300">Cover Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          className="mt-2 mb-6"
          onChange={(e) => setNewCover(e.target.files?.[0] || null)}
        />

        {/* Save Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={saving}
          onClick={handleSave}
          className="w-full py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>
    </main>
  );
}

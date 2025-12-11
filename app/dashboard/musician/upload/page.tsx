"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Music2, Image as ImageIcon, CheckCircle } from "lucide-react";
import { db, storage } from "../../../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAudioPlayer } from "../../../components/AudioPlayerContext";

export default function UploadMusicPage() {
  const { playTrack } = useAudioPlayer();

  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCoverChange = (e: any) => {
    setCoverFile(e.target.files[0]);
  };

  const handleAudioChange = (e: any) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!title || !artistName || !coverFile || !audioFile) {
      alert("Please fill all fields and upload required files.");
      return;
    }

    setUploading(true);

    try {
      const coverRef = ref(storage, `covers/${Date.now()}-${coverFile.name}`);
      await uploadBytes(coverRef, coverFile);
      const coverURL = await getDownloadURL(coverRef);

      const audioRef = ref(storage, `tracks/${Date.now()}-${audioFile.name}`);
      await uploadBytes(audioRef, audioFile);
      const audioURL = await getDownloadURL(audioRef);

      await addDoc(collection(db, "tracks"), {
        title,
        artistName,
        coverURL,
        audioURL,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Upload failed.");
    }
  };

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">
      <h1 className="text-4xl font-bold mb-8 text-purple-300 drop-shadow-[0_0_25px_rgba(180,50,255,0.4)]">
        Upload Music
      </h1>

      <div className="max-w-xl space-y-6">
        <input
          type="text"
          placeholder="Track Title"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Artist Name"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
          onChange={(e) => setArtistName(e.target.value)}
        />

        <div className="space-y-2">
          <p className="text-sm text-neutral-400">Upload Cover (JPG/PNG)</p>
          <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border border-dashed border-white/30 hover:border-purple-400 transition cursor-pointer bg-white/5">
            <ImageIcon size={32} className="text-purple-300 mb-2" />
            <span className="text-sm text-neutral-300">
              {coverFile ? coverFile.name : "Click to upload cover"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-neutral-400">Upload Audio (MP3/WAV)</p>
          <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border border-dashed border-white/30 hover:border-purple-400 transition cursor-pointer bg-white/5">
            <Music2 size={32} className="text-purple-300 mb-2" />
            <span className="text-sm text-neutral-300">
              {audioFile ? audioFile.name : "Click to upload audio"}
            </span>
            <input type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
          </label>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={uploading}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200 hover:bg-purple-600/40 transition flex items-center justify-center gap-2"
        >
          <UploadCloud size={20} />
          {uploading ? "Uploading..." : "Upload Track"}
        </motion.button>

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex items-center gap-3 text-green-400 bg-white/10 border border-green-500/30 p-4 rounded-xl"
          >
            <CheckCircle size={22} />
            Upload Successful!
          </motion.div>
        )}

        {audioFile && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              playTrack({
                title,
                artistName,
                audioURL: URL.createObjectURL(audioFile),
                coverURL: coverFile ? URL.createObjectURL(coverFile) : "",
              })
            }
            className="w-full py-3 rounded-xl bg-green-600/20 border border-green-500/40 text-green-300 hover:bg-green-600/30 transition flex items-center justify-center gap-2 mt-4"
          >
            Preview Track
          </motion.button>
        )}
      </div>
    </main>
  );
}

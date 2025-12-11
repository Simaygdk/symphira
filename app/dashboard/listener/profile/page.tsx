"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "../../../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { Upload, User, Music2, Heart, ListMusic } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

export default function ListenerProfilePage() {
  const user = auth.currentUser;

  const [avatar, setAvatar] = useState(user?.photoURL || "");
  const [uploading, setUploading] = useState(false);

  const [stats, setStats] = useState({
    liked: 0,
    playlists: 0,
    history: 0,
  });

  const loadStats = async () => {
    if (!user) return;

    const likedSnap = await getDocs(
      query(collection(db, "likedSongs"), where("userId", "==", user.uid))
    );

    const playlistsSnap = await getDocs(
      query(collection(db, "playlists"), where("userId", "==", user.uid))
    );

    setStats({
      liked: likedSnap.size,
      playlists: playlistsSnap.size,
      history: 0,
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const uploadAvatar = async (file: File) => {
    if (!user) return;

    const storageRef = ref(storage, `avatars/${user.uid}`);
    setUploading(true);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await updateProfile(user, { photoURL: url });

    setAvatar(url);
    setUploading(false);
  };

  const handleAvatarChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
  };

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#0d0618] via-[#180d2a] to-[#2d1244] text-white">

      <h1 className="text-4xl font-bold text-purple-200 drop-shadow-[0_0_22px_rgba(150,50,255,0.35)] text-center mb-12">
        Your Profile
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl"
      >
        <div className="flex flex-col items-center gap-6">

          <div className="relative group">
            <img
              src={avatar || "https://placehold.co/150x150?text=Avatar"}
              className="w-36 h-36 rounded-full object-cover border border-white/20 shadow-lg"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
            >
              <Upload size={32} className="text-purple-300" />
            </label>

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <p className="text-xl font-semibold">{user?.displayName || "User"}</p>
          <p className="text-neutral-400">{user?.email}</p>

          {uploading && (
            <p className="text-purple-300 text-sm">Uploading avatar...</p>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl py-6 flex flex-col items-center gap-2 shadow-lg"
        >
          <Heart className="text-purple-300" size={28} />
          <p className="text-2xl font-bold">{stats.liked}</p>
          <p className="text-neutral-400 text-sm">Liked Songs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl py-6 flex flex-col items-center gap-2 shadow-lg"
        >
          <ListMusic className="text-purple-300" size={28} />
          <p className="text-2xl font-bold">{stats.playlists}</p>
          <p className="text-neutral-400 text-sm">Playlists</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl py-6 flex flex-col items-center gap-2 shadow-lg"
        >
          <Music2 className="text-purple-300" size={28} />
          <p className="text-2xl font-bold">{stats.history}</p>
          <p className="text-neutral-400 text-sm">Listening History</p>
        </motion.div>

      </div>

    </main>
  );
}

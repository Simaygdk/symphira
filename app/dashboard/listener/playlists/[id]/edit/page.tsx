"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../../../lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Trash2, X } from "lucide-react";
import Link from "next/link";

export default function EditPlaylistPage() {
  const { id } = useParams();
  const router = useRouter();

  const [playlist, setPlaylist] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    const ref = doc(db, "playlists", id as string);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      setPlaylist(null);
      return;
    }

    const data = snap.data() || {};

    const playlistObj = {
      id: snap.id,
      name: data.name || "",
      tracks: Array.isArray(data.tracks) ? data.tracks : [],
    };

    setPlaylist(playlistObj);
    setName(playlistObj.name);
    setLoading(false);
  };

  const save = async () => {
    if (!playlist) return;
    setSaving(true);

    const ref = doc(db, "playlists", playlist.id);
    await updateDoc(ref, { name });

    setSaving(false);
    router.push(`/dashboard/listener/playlists/${playlist.id}`);
  };

  const confirmDelete = async () => {
    if (!playlist) return;
    setDeleting(true);

    const ref = doc(db, "playlists", playlist.id);
    await deleteDoc(ref);

    setDeleting(false);
    router.push(`/dashboard/listener/playlists`);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen px-6 py-12 text-white bg-gradient-to-b from-[#0b0617] via-[#1a0d2c] to-[#2c1246]">

      <Link
        href={`/dashboard/listener/playlists/${id}`}
        className="flex items-center gap-2 text-purple-300 hover:text-purple-100 mb-8"
      >
        <ArrowLeft size={20} />
        Back
      </Link>

      {loading ? (
        <p className="text-center text-neutral-400">Loading...</p>
      ) : !playlist ? (
        <p className="text-center text-red-400">Playlist not found.</p>
      ) : (
        <div className="max-w-xl mx-auto">

          <h1 className="text-4xl font-bold text-purple-200 drop-shadow-[0_0_25px_rgba(160,60,255,0.35)] mb-10 text-center">
            Edit Playlist
          </h1>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">

            <div>
              <label className="text-sm text-neutral-400">Playlist Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-neutral-400 outline-none focus:border-purple-300"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={save}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200 hover:bg-purple-600/40 transition flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {saving ? "Saving..." : "Save Changes"}
            </motion.button>

            <button
              onClick={() => setDeleteModal(true)}
              className="w-full py-3 mt-4 rounded-xl bg-red-600/20 border border-red-400/40 text-red-300 hover:bg-red-600/30 transition flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              Delete Playlist
            </button>
          </div>

          <AnimatePresence>
            {deleteModal && (
              <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.7 }}
                  className="bg-[#1b0e2d] p-6 rounded-2xl border border-white/20 max-w-sm w-full"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-red-400">
                      Delete Playlist
                    </h2>
                    <button
                      onClick={() => setDeleteModal(false)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-neutral-300 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="text-red-300 font-semibold">{playlist.name}</span>?
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteModal(false)}
                      className="flex-1 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={confirmDelete}
                      disabled={deleting}
                      className="flex-1 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}

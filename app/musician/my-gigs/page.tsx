"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { collection, getDocs, query, where, addDoc, Timestamp, deleteDoc, doc, updateDoc, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, db, storage } from "../../../lib/firebase";

interface Gig {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  musicianId?: string;
  image?: string;
  createdAt?: any;
}

export default function MyGigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingGig, setEditingGig] = useState<Gig | null>(null);
  const [previewGig, setPreviewGig] = useState<Gig | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUserId(user ? user.uid : null));
    return () => unsubscribe();
  }, []);

  const fetchGigs = async (uid: string) => {
    try {
      const refCol = collection(db, "gigs");
      const q = query(refCol, where("musicianId", "==", uid), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const gigList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Gig, "id">),
      }));
      setGigs(gigList);
    } catch {
      toast.error("Failed to load gigs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchGigs(userId);
    else setLoading(false);
  }, [userId]);

  const filteredGigs = useMemo(() => {
    return gigs
      .filter((gig) => {
        const matchesSearch =
          gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gig.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = dateFilter ? new Date(gig.date) >= new Date(dateFilter) : true;
        return matchesSearch && matchesDate;
      })
      .slice(0, visibleCount);
  }, [gigs, searchTerm, dateFilter, visibleCount]);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setLocation("");
    setDescription("");
    setImageFile(null);
    setEditingGig(null);
  };

  const handleAddOrUpdateGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !title || !date || !location || !description) return;
    setSubmitting(true);
    try {
      let imageUrl = editingGig?.image || "";
      if (imageFile) {
        if (imageUrl) {
          const oldRef = ref(storage, imageUrl);
          await deleteObject(oldRef).catch(() => {});
        }
        const newRef = ref(storage, `gigs/${userId}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(newRef, imageFile);
        imageUrl = await getDownloadURL(newRef);
      }
      if (editingGig) {
        const gigRef = doc(db, "gigs", editingGig.id);
        await updateDoc(gigRef, { title, date, location, description, image: imageUrl });
        toast.success("Gig updated successfully");
      } else {
        await addDoc(collection(db, "gigs"), {
          title,
          date,
          location,
          description,
          musicianId: userId,
          image: imageUrl,
          createdAt: Timestamp.now(),
        });
        toast.success("Gig created successfully");
      }
      resetForm();
      await fetchGigs(userId);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGig = async (gigId: string, imageUrl?: string) => {
    if (!userId) return;
    setDeleting(gigId);
    try {
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef).catch(() => {});
      }
      await deleteDoc(doc(db, "gigs", gigId));
      toast.success("Gig deleted successfully");
      await fetchGigs(userId);
      setPreviewGig(null);
    } catch {
      toast.error("Failed to delete gig");
    } finally {
      setDeleting(null);
    }
  };

  const startEditing = (gig: Gig) => {
    setEditingGig(gig);
    setTitle(gig.title);
    setDate(gig.date);
    setLocation(gig.location);
    setDescription(gig.description);
    setImageFile(null);
    setPreviewGig(null);
  };

  const SkeletonCard = () => (
    <div className="bg-[#120025]/60 border border-purple-700/20 rounded-3xl p-5 animate-pulse">
      <div className="h-48 bg-gradient-to-r from-[#22003a] via-[#330056] to-[#22003a] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-2xl mb-4" />
      <div className="h-5 w-2/3 bg-gradient-to-r from-[#2a0051] via-[#3a0071] to-[#2a0051] rounded mb-2 animate-[shimmer_1.5s_infinite]" />
      <div className="h-4 w-1/3 bg-gradient-to-r from-[#2a0051] via-[#3a0071] to-[#2a0051] rounded animate-[shimmer_1.5s_infinite]" />
    </div>
  );

  if (!userId) return <p className="text-center mt-10 text-red-400">You must be logged in.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090013] via-[#0f001d] to-[#19002b] text-white">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#1a0029", color: "#fff", border: "1px solid #a855f7" },
          success: { iconTheme: { primary: "#ec4899", secondary: "#1a0029" } },
        }}
      />
      <div className="max-w-5xl mx-auto p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]"
        >
          My Gigs
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-[#1a0029]/60 border border-purple-700/50 text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-60 bg-[#1a0029]/60 border border-purple-700/50 text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500"
          />
        </motion.div>

        <motion.form
          onSubmit={handleAddOrUpdateGig}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 bg-[#110022]/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_25px_rgba(168,85,247,0.3)] border border-purple-700/30"
        >
          <h2 className="text-2xl font-semibold text-center mb-6 text-purple-300">
            {editingGig ? "Edit Gig" : "Add New Gig"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="bg-[#1a0029]/60 border border-purple-700/50 text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#1a0029]/60 border border-purple-700/50 text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="bg-[#1a0029]/60 border border-purple-700/50 text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500 sm:col-span-2"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={3}
              className="bg-[#1a0029]/60 border border-purple-700/50 text-white rounded-xl p-3 focus:ring-2 focus:ring-purple-500 sm:col-span-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              className="text-sm text-purple-300 sm:col-span-2"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition shadow-[0_0_15px_rgba(236,72,153,0.4)]"
            >
              {submitting ? "Saving..." : editingGig ? "Update Gig" : "Create Gig"}
            </button>
            {editingGig && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-[#2a003f] text-purple-200 font-semibold py-3 rounded-xl hover:bg-[#3b005f] transition"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.form>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredGigs.length === 0 ? (
          <p className="text-center text-purple-400 mt-10">No gigs found.</p>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredGigs.map((gig) => (
                <motion.div
                  key={gig.id}
                  onClick={() => setPreviewGig(gig)}
                  whileHover={{ scale: 1.03 }}
                  className="relative group bg-[#120025]/80 border border-purple-700/40 rounded-3xl p-5 shadow-[0_0_25px_rgba(168,85,247,0.25)] cursor-pointer"
                >
                  {gig.image && (
                    <img src={gig.image} alt={gig.title} className="w-full h-48 object-cover rounded-2xl mb-4" />
                  )}
                  <h2 className="text-xl font-semibold text-purple-300">{gig.title}</h2>
                  <p className="text-sm text-gray-300">{gig.date}</p>
                  <p className="text-gray-400 mt-2">{gig.location}</p>
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 bg-gradient-to-br from-purple-400 via-pink-400 to-transparent blur-2xl transition"></div>
                </motion.div>
              ))}
            </motion.div>

            {visibleCount < gigs.length && (
              <div className="flex justify-center mt-10">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                >
                  Load More
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {previewGig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setPreviewGig(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#10001a]/90 border border-purple-700/40 p-8 rounded-3xl max-w-lg w-full shadow-[0_0_30px_rgba(236,72,153,0.4)] relative"
            >
              {previewGig.image && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  src={previewGig.image}
                  alt={previewGig.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
              )}
              <h2 className="text-2xl font-bold text-purple-300 mb-2">{previewGig.title}</h2>
              <p className="text-gray-400 text-sm mb-2">{previewGig.date}</p>
              <p className="text-gray-400 mb-4">{previewGig.location}</p>
              <p className="text-gray-200 mb-6">{previewGig.description}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => startEditing(previewGig)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 rounded-xl hover:opacity-90 transition shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGig(previewGig.id, previewGig.image)}
                  disabled={deleting === previewGig.id}
                  className="flex-1 bg-[#400010] text-red-300 font-semibold py-2 rounded-xl hover:bg-[#60001a] transition"
                >
                  {deleting === previewGig.id ? "Deleting..." : "Delete"}
                </button>
              </div>
              <button
                onClick={() => setPreviewGig(null)}
                className="absolute top-4 right-4 text-purple-300 hover:text-pink-400 transition text-2xl"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

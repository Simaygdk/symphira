"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { auth, db, storage } from "../../../lib/firebase";

interface Musician {
  id: string;
  name: string;
  bio: string;
  genre: string;
  location: string;
  instruments: string[];
  image: string;
  followers?: string[];
  following?: string[];
}

interface Follower {
  id: string;
  name: string;
  image?: string;
}

interface Gig {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image?: string;
  musicianId?: string;
}

export default function MusicianProfilePage() {
  const params = useParams();
  const musicianId = params?.id as string;
  const [musician, setMusician] = useState<Musician | null>(null);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [mutuals, setMutuals] = useState<Follower[]>([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showMutuals, setShowMutuals] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [previewGig, setPreviewGig] = useState<Gig | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [mutualCount, setMutualCount] = useState(0);
  const [isMutual, setIsMutual] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUserId(user ? user.uid : null));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMusicianData = async () => {
      try {
        if (!musicianId) return;
        const musicianRef = doc(db, "musicians", musicianId);
        const musicianSnap = await getDoc(musicianRef);
        if (musicianSnap.exists()) {
          const data = musicianSnap.data() as Omit<Musician, "id">;
          setMusician({ id: musicianSnap.id, ...data });
          const followersList = data.followers || [];
          const followingList = data.following || [];
          setFollowerCount(followersList.length);
          setFollowingCount(followingList.length);
          if (userId && followersList.includes(userId)) setIsFollowing(true);

          if (userId) {
            const currentUserRef = await getDoc(doc(db, "musicians", userId));
            if (currentUserRef.exists()) {
              const currentData = currentUserRef.data() as Musician;
              const currentFollowing = currentData.following || [];
              const mutualIds = followersList.filter((f) => currentFollowing.includes(f));
              setMutualCount(mutualIds.length);
              if (mutualIds.includes(musicianId)) setIsMutual(true);
            }
          }
        } else toast.error("Musician not found");

        const gigsRef = collection(db, "gigs");
        const q = query(gigsRef, where("musicianId", "==", musicianId));
        const snapshot = await getDocs(q);
        const gigList = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Gig, "id">) }));
        setGigs(gigList);
      } catch {
        toast.error("Failed to load musician");
      } finally {
        setLoading(false);
      }
    };
    fetchMusicianData();
  }, [musicianId, userId]);

  const handleFollowToggle = async () => {
    if (!userId) {
      toast.error("You must be logged in to follow");
      return;
    }
    if (userId === musicianId) {
      toast.error("You cannot follow yourself");
      return;
    }
    try {
      const musicianRef = doc(db, "musicians", musicianId);
      const userRef = doc(db, "musicians", userId);
      if (isFollowing) {
        await updateDoc(musicianRef, { followers: arrayRemove(userId) });
        await updateDoc(userRef, { following: arrayRemove(musicianId) });
        setFollowerCount((prev) => prev - 1);
        setIsFollowing(false);
        toast("Unfollowed", { icon: "👋" });
      } else {
        await updateDoc(musicianRef, { followers: arrayUnion(userId) });
        await updateDoc(userRef, { following: arrayUnion(musicianId) });
        setFollowerCount((prev) => prev + 1);
        setIsFollowing(true);
        toast.success("Followed successfully");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleSendMessage = async () => {
    if (!userId || !messageText.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, "messages"), {
        senderId: userId,
        receiverId: musicianId,
        content: messageText.trim(),
        timestamp: Timestamp.now(),
      });
      setMessageText("");
      setShowMessageModal(false);
      toast.success("Message sent");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleOpenMutuals = async () => {
    if (!musician?.followers || !musician?.following) return;
    const mutualIds = musician.followers.filter((f) => musician.following?.includes(f));
    if (mutualIds.length === 0) {
      toast("No mutual connections yet");
      return;
    }
    try {
      const mutualDocs = await Promise.all(
        mutualIds.map(async (id) => {
          const userDoc = await getDoc(doc(db, "musicians", id));
          if (userDoc.exists()) {
            const data = userDoc.data() as Musician;
            return { id: userDoc.id, name: data.name, image: data.image };
          }
          return null;
        })
      );
      const filtered = mutualDocs.filter((f) => f !== null) as Follower[];
      setMutuals(filtered);
      setShowMutuals(true);
    } catch {
      toast.error("Failed to load mutuals");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#090013] to-[#19002b] text-purple-300">
        Loading musician profile...
      </div>
    );

  if (!musician)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#090013] to-[#19002b] text-pink-400">
        Musician not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090013] via-[#0f001d] to-[#19002b] text-white">
      <Toaster position="top-center" toastOptions={{ style: { background: "#1a0029", color: "#fff", border: "1px solid #a855f7" } }} />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center text-center mb-14">
          <div className="w-40 h-40 mb-6 rounded-full border-4 border-purple-600 shadow-[0_0_30px_rgba(236,72,153,0.3)] overflow-hidden">
            <img src={musician.image || "/default-avatar.png"} alt={musician.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">{musician.name}</h1>
          {isMutual && <p className="text-pink-400 mt-2 font-semibold">Mutual Connection 💫</p>}
          <p className="text-gray-300 mt-3 max-w-xl">{musician.bio}</p>
          <p className="text-purple-400 mt-2">{musician.genre}</p>
          <p className="text-gray-400 mt-1">{musician.location}</p>

          <div className="flex gap-6 mt-5 flex-wrap justify-center items-center">
            <button onClick={() => setShowFollowers(true)} className="text-purple-400 text-sm hover:text-pink-400 transition">
              Followers: <span className="text-pink-400 font-semibold">{followerCount}</span>
            </button>
            <button onClick={() => setShowFollowing(true)} className="text-purple-400 text-sm hover:text-pink-400 transition">
              Following: <span className="text-pink-400 font-semibold">{followingCount}</span>
            </button>
            <button onClick={handleOpenMutuals} className="text-purple-400 text-sm hover:text-pink-400 transition">
              Connections: <span className="text-pink-400 font-semibold">{mutualCount}</span>
            </button>
            {userId && userId !== musicianId && (
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleFollowToggle} className={`px-6 py-2 font-semibold rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.4)] transition ${
                  isFollowing ? "bg-[#2a003f] text-purple-200 hover:bg-[#3b005f]" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                }`}>
                  {isFollowing ? "Following ✓" : "Follow"}
                </motion.button>
                {isMutual && (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowMessageModal(true)} className="px-6 py-2 font-semibold rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(236,72,153,0.5)] transition">
                    Message
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <MessageModal show={showMessageModal} onClose={() => setShowMessageModal(false)} messageText={messageText} setMessageText={setMessageText} onSend={handleSendMessage} sending={sending} />
      </div>
    </div>
  );
}

function MessageModal({ show, onClose, messageText, setMessageText, onSend, sending }: any) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()} className="bg-[#10001a]/90 border border-purple-700/40 p-8 rounded-3xl max-w-md w-full shadow-[0_0_30px_rgba(236,72,153,0.4)]">
            <h2 className="text-xl font-semibold text-purple-300 mb-4 text-center">Send Message</h2>
            <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Write your message..." rows={4} className="w-full border border-purple-600/40 bg-transparent rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 bg-[#2a003f] text-purple-300 font-semibold py-2 rounded-xl hover:bg-[#3a005f] transition">
                Cancel
              </button>
              <button onClick={onSend} disabled={sending} className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-2 rounded-xl hover:opacity-90 transition">
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

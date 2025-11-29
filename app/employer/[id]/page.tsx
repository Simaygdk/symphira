"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import { ArrowLeft, DollarSign, CalendarDays, User, Send } from "lucide-react";
import { db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function OfferDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [offer, setOffer] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ⚡ Offer bilgisi çek
  useEffect(() => {
    if (!id) return;
    const fetchOffer = async () => {
      try {
        const docRef = doc(db, "offers", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOffer({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching offer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [id]);

  // 💬 Mesajları dinle
  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, "offers", id as string, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(fetched);
    });
    return () => unsubscribe();
  }, [id]);

  // 🔸 Otomatik scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✉️ Mesaj gönder
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "offers", id as string, "messages"), {
        sender: "employer", // ileride auth sistemine göre dinamik olacak
        text: newMessage,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      console.error("Message send error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-[#f5d36e]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-10 h-10 border-4 border-t-transparent border-[#f5d36e] rounded-full"
        />
      </div>
    );
  }

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-5 py-10">
      {/* BACK BUTTON */}
      <button
        onClick={() => router.push("/employer")}
        className="absolute top-6 left-5 flex items-center gap-2 text-[#f5d36e] hover:text-[#ffe58a] transition-all"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`${cinzel.className} text-3xl sm:text-4xl text-[#f5d36e] font-bold text-center mt-14`}
      >
        Offer Details
      </motion.h1>

      {/* OFFER CARD */}
      {offer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-10 w-full max-w-md sm:max-w-lg bg-white/10 border border-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-[0_0_30px_rgba(245,211,110,0.2)]"
        >
          <h2
            className={`${poppins.className} text-2xl sm:text-3xl font-semibold text-[#f5d36e] mb-3`}
          >
            {offer.title}
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed mb-6 whitespace-pre-line">
            {offer.description || "No description provided."}
          </p>

          <div className="flex flex-col gap-3 text-sm sm:text-base text-neutral-300 mb-5">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-[#f5d36e]" />
              <span className="text-white">{offer.budget}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[#f5d36e]" />
              <span className="text-white">{offer.deadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#f5d36e]" />
              <span className="text-white">{offer.artist}</span>
            </div>
          </div>

          {/* CHAT SECTION */}
          <div className="mt-6 bg-[#0f0b2a]/50 border border-[#f5d36e]/20 rounded-2xl p-4 max-h-[350px] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-neutral-400 text-center text-sm">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 flex ${
                    msg.sender === "employer" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] ${
                      msg.sender === "employer"
                        ? "bg-[#f5d36e]/20 text-[#f5d36e] rounded-br-none"
                        : "bg-white/10 text-white rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT FIELD */}
          <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#f5d36e]/40"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="p-2 rounded-full bg-[#f5d36e]/20 border border-[#f5d36e]/40 text-[#f5d36e] hover:bg-[#f5d36e]/30 transition-all"
            >
              <Send size={18} />
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* GLOW EFFECT */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#f5d36e]/10 rounded-full blur-3xl" />
      </div>
    </main>
  );
}

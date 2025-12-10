"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { db } from "../../../../lib/firebase";
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  where,
} from "firebase/firestore";

export default function MessagesPage() {
  const musicianName = "Simay";
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("musician", "==", musicianName),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(data);

      setTimeout(() => bottomRef.current?.scrollIntoView(), 100);
    });

    return () => unsub();
  }, []);

  const send = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "messages"), {
      musician: musicianName,
      sender: musicianName,
      text,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <main className="min-h-screen bg-[#0a0a1f] text-white px-6 py-12 flex flex-col">
      <h1 className="text-3xl text-[#f5d36e] font-bold text-center mb-6">
        Messages
      </h1>

      <div className="flex-1 overflow-y-auto bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-3 ${
              msg.sender === musicianName ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-xs ${
                msg.sender === musicianName
                  ? "bg-[#f5d36e]/30 text-[#f5d36e]"
                  : "bg-white/20 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <input
          className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 outline-none"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={send}
          className="px-4 py-2 bg-[#f5d36e]/20 border border-[#f5d36e]/40 rounded-xl text-[#f5d36e] font-medium"
        >
          Send
        </motion.button>
      </div>
    </main>
  );
}

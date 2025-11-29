"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any;
  seen?: boolean;
}

interface UserData {
  id: string;
  name: string;
  image?: string;
}

export default function MessagesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [chatUsers, setChatUsers] = useState<UserData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("participants", "array-contains", userId),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Message, "id">),
      }));
      setMessages(msgs);

      const latestMsg = msgs[msgs.length - 1];
      if (
        latestMsg &&
        latestMsg.receiverId === userId &&
        latestMsg.id !== lastMessageRef.current
      ) {
        const senderDoc = await getDoc(doc(db, "musicians", latestMsg.senderId));
        if (senderDoc.exists()) {
          const sender = senderDoc.data() as UserData;
          toast.custom(
            (t) => (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#1a0029]/90 border border-pink-600/40 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.4)] text-white"
              >
                <p className="font-semibold text-pink-400">
                  New message from {sender.name}
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  “{latestMsg.content.length > 50
                    ? latestMsg.content.slice(0, 50) + "..."
                    : latestMsg.content}”
                </p>
              </motion.div>
            ),
            { duration: 4000 }
          );
          lastMessageRef.current = latestMsg.id;
        }
      }

      const uniqueIds = Array.from(
        new Set(msgs.flatMap((m) => [m.senderId, m.receiverId]))
      ).filter((id) => id !== userId);

      const userDocs = await Promise.all(
        uniqueIds.map(async (id) => {
          const u = await getDoc(doc(db, "musicians", id));
          if (u.exists()) {
            const data = u.data() as UserData;
            return { id: u.id, name: data.name, image: data.image };
          }
          return null;
        })
      );
      const valid = userDocs.filter((u) => u !== null) as UserData[];
      setChatUsers(valid);
      const userMap: Record<string, UserData> = {};
      valid.forEach((u) => (userMap[u.id] = u));
      setUsers(userMap);
    });
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  useEffect(() => {
    if (!selectedUser || !userId) return;
    const unseen = messages.filter(
      (m) => m.receiverId === userId && m.senderId === selectedUser.id && !m.seen
    );
    unseen.forEach(async (msg) => {
      const msgRef = doc(db, "messages", msg.id);
      await updateDoc(msgRef, { seen: true });
    });
  }, [messages, selectedUser, userId]);

  const handleSend = async () => {
    if (!userId || !selectedUser || !newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      senderId: userId,
      receiverId: selectedUser.id,
      content: newMessage.trim(),
      participants: [userId, selectedUser.id],
      timestamp: serverTimestamp(),
      seen: false,
    });
    setNewMessage("");
  };

  if (!userId)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#090013] to-[#19002b] text-pink-400">
        You must be logged in to chat.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090013] via-[#0f001d] to-[#19002b] text-white flex">
      <Toaster position="top-right" toastOptions={{ style: { background: "#1a0029", color: "#fff", border: "1px solid #a855f7" } }} />
      <div className="w-1/3 border-r border-purple-800/30 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6 text-purple-300">Chats</h2>
        {chatUsers.length === 0 ? (
          <p className="text-gray-400">No active chats.</p>
        ) : (
          <div className="space-y-3">
            {chatUsers.map((u) => (
              <motion.div
                key={u.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedUser(u)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${
                  selectedUser?.id === u.id
                    ? "bg-gradient-to-r from-purple-600/50 to-pink-600/40"
                    : "bg-[#1a0029]/60 hover:bg-[#250045]"
                }`}
              >
                <img
                  src={u.image || "/default-avatar.png"}
                  alt={u.name}
                  className="w-10 h-10 rounded-full border border-purple-700/40 object-cover"
                />
                <p className="text-white font-medium">{u.name}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-5 border-b border-purple-800/30 flex items-center gap-3">
              <img
                src={selectedUser.image || "/default-avatar.png"}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full border border-purple-700/40 object-cover"
              />
              <h2 className="text-lg font-semibold text-purple-300">
                {selectedUser.name}
              </h2>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages
                .filter(
                  (m) =>
                    (m.senderId === userId &&
                      m.receiverId === selectedUser.id) ||
                    (m.senderId === selectedUser.id &&
                      m.receiverId === userId)
                )
                .map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`max-w-xs p-3 rounded-2xl ${
                      m.senderId === userId
                        ? "ml-auto bg-gradient-to-r from-pink-600 to-purple-600"
                        : "bg-[#1a0029]/80"
                    }`}
                  >
                    <p className="text-sm">{m.content}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400">
                        {m.timestamp
                          ? new Date(m.timestamp.seconds * 1000).toLocaleTimeString()
                          : ""}
                      </p>
                      {m.senderId === userId && m.seen && (
                        <p className="text-[10px] text-purple-200 font-semibold">
                          ✅ Seen
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-5 border-t border-purple-800/30 flex gap-3">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#12001f] border border-purple-800/40 rounded-xl px-4 py-2 focus:outline-none text-white placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-purple-400">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const ref = collection(db, "messages");

      // Example: all messages (filter by userId later)
      const snap = await getDocs(ref);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setMessages(list);
      setLoading(false);
    };

    load();
  }, []);

  if (loading)
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-10">
      <h1 className="text-4xl font-bold">Messages</h1>

      {messages.length === 0 && (
        <p className="text-white/60 text-sm">Your inbox is empty.</p>
      )}

      <div className="flex flex-col gap-4">
        {messages.map((msg) => (
          <Link
            key={msg.id}
            href={`/dashboard/listener/messages/${msg.id}`}
            className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition"
          >
            <p className="font-medium">{msg.senderName}</p>
            <p className="text-white/60 text-sm truncate">{msg.preview}</p>
            <p className="text-white/40 text-xs mt-2">{msg.timestamp || ""}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

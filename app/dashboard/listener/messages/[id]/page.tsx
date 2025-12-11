"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function MessageDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "messages", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setMessage({ id: snap.id, ...snap.data() });
      }
    };

    load();
  }, [id]);

  if (!message)
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-8">
      <h1 className="text-3xl font-bold">{message.senderName}</h1>

      <div className="bg-white/5 p-6 rounded-xl border border-white/10 leading-7">
        {message.content || "No message content."}
      </div>

      <p className="text-white/40 text-xs">{message.timestamp}</p>
    </main>
  );
}

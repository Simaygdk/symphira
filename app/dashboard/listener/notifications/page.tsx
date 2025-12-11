"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const ref = collection(db, "notifications");

      // Example: Fetch all notifications (you can filter by userId later)
      const snap = await getDocs(ref);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setNotifications(list);
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
      <h1 className="text-4xl font-bold">Notifications</h1>

      {notifications.length === 0 && (
        <p className="text-white/60 text-sm">No notifications yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-white/5 p-4 rounded-xl border border-white/10"
          >
            <p className="font-medium">{n.title}</p>
            <p className="text-white/60 text-sm">{n.message}</p>
            <p className="text-white/40 text-xs mt-2">{n.date || ""}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

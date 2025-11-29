"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setProfile(snap.data());
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-gray-400">
        Loading your dashboard...
      </div>
    );
  }

  if (!user || !profile) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-2 text-purple-400">
          Welcome to Symphira 🎵
        </h1>
        <p className="text-gray-300">{user.email}</p>
        <p className="text-gray-400 mb-4">
          Roles: {profile.roles?.join(", ")}
        </p>

        {profile.roles?.includes("musician") && (
          <button
            onClick={() => router.push("/musician")}
            className="w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded mt-4"
          >
            🎸 Musician Panel
          </button>
        )}

        {profile.roles?.includes("employer") && (
          <button
            onClick={() => router.push("/employer")}
            className="w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded mt-4"
          >
            💼 Employer Area
          </button>
        )}

        {profile.roles?.includes("seller") && (
          <button
            onClick={() => router.push("/seller")}
            className="w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded mt-4"
          >
            💰 Seller Shop
          </button>
        )}

        {profile.roles?.includes("listener") && (
          <button
            onClick={() => router.push("/listener")}
            className="w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded mt-4"
          >
            🎧 Listener Space
          </button>
        )}

        <button
          onClick={() => router.push("/profile")}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 mt-6 rounded"
        >
          Edit Profile
        </button>

        <button
          onClick={() => signOut(auth)}
          className="w-full bg-red-600 hover:bg-red-500 py-2 mt-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

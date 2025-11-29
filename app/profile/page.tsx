"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setProfile(snap.data());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRoleChange = (role: string) => {
    if (!profile) return;
    const roles = profile.roles || [];
    if (roles.includes(role)) {
      setProfile({ ...profile, roles: roles.filter((r: string) => r !== role) });
    } else {
      setProfile({ ...profile, roles: [...roles, role] });
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { roles: profile.roles });
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-gray-400">
        Loading profile...
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
        <h1 className="text-2xl font-bold mb-4 text-purple-400">Edit Profile</h1>
        <p className="text-gray-300 mb-1">Email: {user.email}</p>

        <div className="mt-4 text-left">
          <p className="text-gray-400 mb-2 font-semibold">Roles:</p>

          {["musician", "employer", "seller", "listener"].map((role) => (
            <label key={role} className="block mb-2">
              <input
                type="checkbox"
                checked={profile.roles?.includes(role)}
                onChange={() => handleRoleChange(role)}
                className="mr-2 accent-purple-500"
              />
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </label>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded mt-6"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-zinc-700 hover:bg-zinc-600 py-2 rounded mt-3"
        >
          Back to Dashboard
        </button>

        <button
          onClick={() => signOut(auth)}
          className="w-full bg-red-600 hover:bg-red-500 py-2 rounded mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

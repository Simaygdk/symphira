"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";

export default function ListenerSettingsPage() {
  const [user, setUser] = useState<any>(null);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      const u = auth.currentUser;
      setUser(u);
      setDisplayName(u.displayName || "");
      setEmail(u.email || "");
    }
  }, []);

  const saveProfile = async () => {
    if (!user) return;

    try {
      await updateProfile(user, { displayName });
      setStatus("Profile updated!");
    } catch (err) {
      setStatus("Error updating profile");
    }
  };

  const saveEmail = async () => {
    if (!user) return;

    try {
      await updateEmail(user, email);
      setStatus("Email updated!");
    } catch (err) {
      setStatus("Error updating email");
    }
  };

  const changePassword = async () => {
    if (!user || !newPassword) return;

    try {
      await updatePassword(user, newPassword);
      setStatus("Password changed!");
    } catch (err) {
      setStatus("Error changing password");
    }
  };

  if (!user)
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-12">
      <h1 className="text-4xl font-bold">Settings</h1>

      {status && <p className="text-green-400 text-sm">{status}</p>}

      {/* Display Name */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-3 max-w-xl">
        <h2 className="text-xl font-semibold">Profile Info</h2>

        <label className="text-sm text-white/70">Display Name</label>
        <input
          type="text"
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <button
          onClick={saveProfile}
          className="mt-2 px-5 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
        >
          Save Profile
        </button>
      </div>

      {/* Email */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-3 max-w-xl">
        <h2 className="text-xl font-semibold">Email</h2>

        <label className="text-sm text-white/70">Email Address</label>
        <input
          type="email"
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={saveEmail}
          className="mt-2 px-5 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
        >
          Update Email
        </button>
      </div>

      {/* Password */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-3 max-w-xl">
        <h2 className="text-xl font-semibold">Password</h2>

        <label className="text-sm text-white/70">New Password</label>
        <input
          type="password"
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={changePassword}
          className="mt-2 px-5 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
        >
          Change Password
        </button>
      </div>
    </main>
  );
}

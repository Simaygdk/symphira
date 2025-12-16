"use client";

import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const ROLES = [
  { label: "Musician", value: "musician" },
  { label: "Listener", value: "listener" },
  { label: "Employer", value: "employer" },
];

export default function RoleSelectPage() {
  const router = useRouter();

  const selectRole = async (role: string) => {
    const user = auth.currentUser;
    if (!user) return;

    // Kullanıcının rolü Firestore'a yazılır
    await updateDoc(doc(db, "users", user.uid), {
      roles: [role],
    });

    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">Select Your Role</h1>

        <div className="flex gap-4 justify-center">
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => selectRole(r.value)}
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

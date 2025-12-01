"use client";

import { useRouter } from "next/navigation";
import NeonBlob from "../components/NeonBlob";

export default function RoleSelectPage() {
  const router = useRouter();

  const roles = [
    { label: "Musician", icon: "🎤", value: "musician" },
    { label: "Listener", icon: "🎧", value: "listener" },
    { label: "Employer", icon: "💼", value: "employer" },
    { label: "Seller", icon: "🛍️", value: "seller" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-16">Choose Your Role</h1>

      <div className="flex gap-10">
        {roles.map((role) => (
          <NeonBlob
            key={role.value}
            icon={role.icon}
            label={role.label}
            onClick={() => router.push(`/${role.value}`)}
          />
        ))}
      </div>
    </div>
  );
}

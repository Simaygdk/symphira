"use client";

import { useRouter } from "next/navigation";
import NeonBlob from "../components/NeonBlob";

export default function RoleSelectPage() {
  const router = useRouter();

  const roles = [
    {
      label: "I'm a Musician",
      sub: "Showcase your sound",
      icon: "🎸",
      value: "musician",
    },
    {
      label: "I'm a Listener",
      sub: "Discover new artists",
      icon: "🎧",
      value: "listener",
    },
    {
      label: "I'm an Employer",
      sub: "Hire musical talent",
      icon: "💼",
      value: "employer",
    },
    {
      label: "I'm a Seller",
      sub: "Sell your products",
      icon: "🛍️",
      value: "seller",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#090014] to-black text-white">
      <h1 className="text-5xl font-bold mb-4 tracking-wide drop-shadow-[0_0_20px_rgba(180,0,255,0.6)]">
        What Are You Looking For?
      </h1>

      <p className="text-lg text-purple-300 mb-20">
        Explore your space within Symphira
      </p>

      <div className="grid grid-cols-2 gap-12">
        {roles.map((role) => (
          <NeonBlob
            key={role.value}
            icon={role.icon}
            label={role.label}
            sub={role.sub}
            onClick={() => router.push(`/${role.value}`)}
          />
        ))}
      </div>
    </div>
  );
}

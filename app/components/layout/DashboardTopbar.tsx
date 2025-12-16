"use client";

import LogoutButton from "@/app/components/LogoutButton";

export default function DashboardTopbar() {
  return (
    <div className="w-full h-14 border-b border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-between px-6">
      <span className="text-purple-300 font-semibold">
        Symphira Dashboard
      </span>

      <LogoutButton />
    </div>
  );
}

"use client";

import { Menu } from "lucide-react";

export default function DashboardTopbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="w-full h-16 flex items-center justify-between px-6 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <button
        className="md:hidden text-white"
        onClick={onMenu}
      >
        <Menu size={26} />
      </button>

      <h1 className="text-lg font-semibold tracking-wide">Symphira</h1>

      <div className="w-6 h-6" />
    </header>
  );
}
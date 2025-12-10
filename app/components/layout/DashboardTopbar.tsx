"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Menu } from "lucide-react";

export default function DashboardTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function getTitle() {
    if (pathname.includes("/musician/upload")) return "Upload Music";
    if (pathname.includes("/musician/library")) return "Your Library";
    if (pathname.includes("/musician")) return "Musician Dashboard";
    if (pathname.includes("/listener")) return "Listener Dashboard";
    if (pathname.includes("/seller")) return "Seller Dashboard";
    if (pathname.includes("/employer")) return "Employer Dashboard";
    return "Dashboard";
  }

  return (
    <header className="flex items-center justify-between px-4 h-14 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-40">
      <button
        className="md:hidden p-2 hover:bg-white/10 rounded-lg"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>

      <h1 className="text-lg font-semibold select-none">{getTitle()}</h1>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/10 rounded-lg relative">
          <Bell size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden"
          >
            <img
              src="https://i.pravatar.cc/300"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-black border border-white/10 rounded-lg shadow-lg p-2">
              <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-md">
                Account
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-md">
                Settings
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-md text-red-400">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

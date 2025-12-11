"use client";

import { useState } from "react";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import DashboardTopbar from "../components/layout/DashboardTopbar";
import AudioPlayer from "../components/AudioPlayer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="hidden md:block w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl">
        <DashboardSidebar />
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition md:hidden`}
      >
        <DashboardSidebar />
      </aside>

      <main className="flex-1 flex flex-col">
        <DashboardTopbar onMenu={() => setOpen(true)} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>

      <AudioPlayer />
    </div>
  );
}

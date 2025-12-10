"use client";

import React from "react";
import DashboardSidebar from "@/app/components/layout/DashboardSidebar";
import DashboardTopbar from "@/app/components/layout/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex w-full min-h-screen bg-black text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-60 border-r border-white/10 bg-black/30 backdrop-blur-xl">
        <DashboardSidebar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 w-60 h-full bg-black border-r border-white/10 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar />
          </aside>
        </div>
      )}

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 min-h-screen">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 p-4 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

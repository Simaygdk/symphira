"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cinzel_Decorative, Poppins } from "next/font/google";
import { PlusCircle, Briefcase, Users, FileText, BarChart3 } from "lucide-react";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function EmployerDashboard() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 py-16 overflow-hidden">
      
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`${cinzel.className} text-5xl md:text-6xl text-[#f5d36e] font-bold text-center drop-shadow-[0_0_25px_rgba(245,211,110,0.3)]`}
      >
        Employer Dashboard
      </motion.h1>

      <p className="text-neutral-300 text-center mt-3 text-sm md:text-base max-w-md mx-auto">
        Create offers, connect with musicians, and manage your projects.
      </p>

      {/* GRID */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

        {/* CREATE OFFER */}
        <DashboardCard
          title="Create Offer"
          icon={<PlusCircle size={26} />}
          href="/dashboard/employer/create-offer"
        />

        {/* MY OFFERS */}
        <DashboardCard
          title="My Offers"
          icon={<FileText size={26} />}
          href="/dashboard/employer/offers"
        />

        {/* ARTIST DIRECTORY */}
        <DashboardCard
          title="Artist Directory"
          icon={<Users size={26} />}
          href="/dashboard/employer/artists"
        />

        {/* PROJECT ANALYTICS (coming soon) */}
        <DashboardCard
          title="Analytics"
          icon={<BarChart3 size={26} />}
          href="#"
          disabled
        />

        {/* PROJECT MANAGEMENT (coming soon) */}
        <DashboardCard
          title="Project Management"
          icon={<Briefcase size={26} />}
          href="#"
          disabled
        />

      </div>

      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#f5d36e]/10 rounded-full blur-3xl" />
      </div>

    </main>
  );
}

function DashboardCard({
  title,
  icon,
  href,
  disabled = false,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
  disabled?: boolean;
}) {
  return (
    <Link href={disabled ? "#" : href}>
      <motion.div
        whileHover={disabled ? {} : { scale: 1.03 }}
        className={`p-6 rounded-2xl backdrop-blur-xl border border-white/20 bg-white/10
        shadow-[0_0_25px_rgba(245,211,110,0.15)] transition-all
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${poppins.className} text-xl font-semibold text-[#f5d36e]`}>
            {title}
          </h3>
          <div className="text-[#f5d36e]">{icon}</div>
        </div>

        <p className="text-neutral-300 text-sm">
          {disabled ? "Coming soon..." : "Go to page →"}
        </p>
      </motion.div>
    </Link>
  );
}

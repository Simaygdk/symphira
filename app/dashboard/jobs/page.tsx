"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, PlusCircle, Search } from "lucide-react";

export default function JobsDashboardPage() {
  const cards = [
    {
      title: "Post Job",
      desc: "Create a new job listing and find collaborators.",
      icon: <PlusCircle size={30} />,
      href: "/dashboard/jobs/post",
    },
    {
      title: "My Job Posts",
      desc: "View and manage the jobs you have posted.",
      icon: <Briefcase size={30} />,
      href: "/dashboard/jobs/mine",
    },
    {
      title: "Job Marketplace",
      desc: "Browse all jobs and apply to opportunities.",
      icon: <Search size={30} />,
      href: "/dashboard/jobs/market",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-6 py-16">
        <h1 className="text-5xl font-bold text-purple-300 text-center drop-shadow-[0_0_30px_rgba(180,50,255,0.35)]">
          Jobs Dashboard
        </h1>

        <p className="text-neutral-300 text-center mt-3 max-w-lg mx-auto">
          Post job listings, manage your opportunities and apply to roles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          {cards.map((card) => (
            <Link key={card.title} href={card.href}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="
                  p-6 rounded-2xl backdrop-blur-xl
                  bg-white/10 border border-white/20
                  shadow-[0_0_20px_rgba(150,70,255,0.15)]
                  hover:shadow-[0_0_30px_rgba(150,70,255,0.35)]
                  transition cursor-pointer
                "
              >
                <div className="text-purple-300 mb-4">
                  {card.icon}
                </div>

                <h2 className="text-2xl font-semibold">
                  {card.title}
                </h2>

                <p className="text-neutral-300 mt-2 text-sm">
                  {card.desc}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Music,
  FileMusic,
  Briefcase,
  ShoppingCart,
  Headphones,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Musician",
      href: "/dashboard/musician",
      icon: <Music size={20} />,
    },
    {
      name: "My Music",
      href: "/dashboard/musician/library",
      icon: <FileMusic size={20} />,
    },
    {
      name: "Employer",
      href: "/dashboard/employer",
      icon: <Briefcase size={20} />,
    },
    {
      name: "Seller",
      href: "/dashboard/seller",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Listener",
      href: "/dashboard/listener",
      icon: <Headphones size={20} />,
    },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 h-screen fixed left-0 top-0 bg-[#0d0d25] border-r border-white/10 p-6">
      <h1 className="text-xl font-semibold mb-8">Symphira</h1>

      <nav className="flex flex-col gap-2">
        {links.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition 
                ${
                  active
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10"
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

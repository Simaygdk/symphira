//MVP DIŞINDA
"use client";

import Link from "next/link";

export default function DashboardSidebar() {
  const links = [
    { label: "Home", href: "/dashboard" },
    { label: "Upload", href: "/dashboard/musician/upload" },
    { label: "Library", href: "/dashboard/musician/library" },
    { label: "Offers", href: "/dashboard/musician/offers" },
    { label: "Messages", href: "/messages" },
    { label: "Marketplace", href: "/dashboard/seller" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <nav className="p-6 space-y-4">
      <h2 className="text-xl font-bold tracking-wide mb-6">SYMPHIRA</h2>

      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block py-2 px-3 rounded-lg hover:bg-white/10 transition"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
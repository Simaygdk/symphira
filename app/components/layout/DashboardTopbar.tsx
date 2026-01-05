//MVP DIŞINDA
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardTopbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Listener", href: "/dashboard/listener" },
    { label: "Musician", href: "/dashboard/musician" },
    { label: "Seller", href: "/dashboard/seller" },
    { label: "Employer", href: "/dashboard/employer" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link
          href="/dashboard"
          className="font-serif text-xl tracking-wide text-white hover:text-purple-300 transition"
        >
          SYMPHIRA
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition ${
                  active
                    ? "text-purple-400"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

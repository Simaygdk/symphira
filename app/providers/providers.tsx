"use client";

import { useEffect, useState } from "react";
import { PlayerProvider } from "../context/PlayerContext";
import { UserProvider } from "../context/UserContext";
import PlayerBar from "../components/PlayerBar";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Hydration farklarını engeller
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <UserProvider>
      <PlayerProvider>
        {children}
        <PlayerBar />
      </PlayerProvider>
    </UserProvider>
  );
}

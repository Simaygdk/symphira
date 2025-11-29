"use client";

import { useEffect } from "react";
import { requestPermissionAndGetToken } from "../lib/firebase-messaging";

export default function HomePage() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => console.log("✅ Service Worker registered"))
        .catch((err) => console.error("❌ Service Worker failed:", err));
    }

    requestPermissionAndGetToken().then((token: string | null) => {
      if (token) {
        console.log("🔑 FCM Token:", token);
        alert("Token alındı! 🔥");
      }
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #0d001a, #000)",
        color: "#caa9ff",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Symphira Notification Test 🔔</h1>
    </div>
  );
}

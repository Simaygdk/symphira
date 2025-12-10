"use client";

import { useEffect } from "react";
import { requestPermissionAndGetToken } from "../lib/firebase-messaging";

export function FCMInitializer() {
  useEffect(() => {
    const initFCM = async () => {
      if (typeof window === "undefined") return;

      // Register Service Worker
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          console.log("Service Worker registered:", registration);
        } catch (err) {
          console.error("Service Worker registration failed:", err);
        }
      }

      // Request permission + get FCM token
      try {
        const token = await requestPermissionAndGetToken();
        if (token) {
          console.log("FCM Token:", token);
        } else {
          console.warn("No FCM token received (permission denied?)");
        }
      } catch (error) {
        console.error("FCM token error:", error);
      }
    };

    initFCM();
  }, []);

  return null;
}

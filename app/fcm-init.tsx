"use client";

import { useEffect } from "react";
import { requestPermissionAndGetToken } from "../lib/firebase-messaging";

export function FCMInitializer() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => console.log("Service Worker registered"))
        .catch((err) => console.error("Service Worker failed:", err));
    }

    requestPermissionAndGetToken().then((token) => {
      if (token) {
        console.log("FCM Token:", token);
      }
    });
  }, []);

  return null;
}

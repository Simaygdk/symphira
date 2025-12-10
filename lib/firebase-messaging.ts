"use client";

import { getToken, onMessage, Messaging } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestPermissionAndGetToken = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.warn("Firebase messaging not initialized.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (!token) {
      console.warn("No FCM token returned.");
      return null;
    }

    console.log("🔥 FCM Token:", token);
    return token;
  } catch (err) {
    console.error("❌ Error fetching FCM token:", err);
    return null;
  }
};

export const onForegroundMessage = (
  callback: (payload: unknown) => void
): void => {
  if (!messaging) {
    console.warn("Messaging unavailable.");
    return;
  }

  onMessage(messaging as Messaging, callback);
};

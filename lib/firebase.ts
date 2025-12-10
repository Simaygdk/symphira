"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBXzFvq-ExK8r3Vi3rtMIFW6v3nc2yRW6g",
  authDomain: "symphira-9fe1f.firebaseapp.com",
  projectId: "symphira-9fe1f",
  storageBucket: "symphira-9fe1f.appspot.com",
  messagingSenderId: "587963605325",
  appId: "1:587963605325:web:2619c2a22b7dadb14d9704",
  measurementId: "G-HYR79D5BHH",
};

// Initialize Firebase (prevent duplicate apps)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Core services — always safe to initialize
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Messaging — must be async + browser-only + support check
let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn("FCM not supported on this browser.");
      messaging = null;
    }
  });
}

export { app, auth, db, storage, messaging };

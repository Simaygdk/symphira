import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBXzFvq-ExK8r3Vi3rtMIFW6v3nc2yRW6g",
  authDomain: "symphira-9fe1f.firebaseapp.com",
  projectId: "symphira-9fe1f",
  storageBucket: "symphira-9fe1f.appspot.com",
  messagingSenderId: "587963605325",
  appId: "1:587963605325:web:2619c2a22b7dadb14d9704",
  measurementId: "G-HYR79D5BHH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

// Exports
export { app, auth, db, storage, messaging };

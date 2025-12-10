// Modern Firebase Messaging Service Worker (ESM Safe Compat Version)

importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBXzFvq-ExK8r3Vi3rtMIFW6v3nc2yRW6g",
  authDomain: "symphira-9fe1f.firebaseapp.com",
  projectId: "symphira-9fe1f",
  storageBucket: "symphira-9fe1f.appspot.com",
  messagingSenderId: "587963605325",
  appId: "1:587963605325:web:2619c2a22b7dadb14d9704",
});

const messaging = firebase.messaging();

// Background Push Handler
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background Message:", payload);

  const notification = payload.notification || {}; // Fail-safe
  const title = notification.title || "Symphira";
  const body = notification.body || "You have a new message";

  const options = {
    body,
    icon: "/icons/notification-icon.png", // Optional branding
    badge: "/icons/badge-icon.png",       // Optional
    vibrate: [100, 50, 100],
    data: {
      url: notification.click_action || "/", // Route on click
      payload,
    },
  };

  self.registration.showNotification(title, options);
});

// Click Action (when user taps the notification)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

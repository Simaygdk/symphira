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

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Received background message ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});

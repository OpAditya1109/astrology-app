importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCVz__qqfdLUMBqBhFwWP0vBDmYJ1pXqeo",
  authDomain: "astrobhavana-7d6e0.firebaseapp.com",
  projectId: "astrobhavana-7d6e0",
  storageBucket: "astrobhavana-7d6e0.firebasestorage.app",
  messagingSenderId: "882751487655",
  appId: "1:882751487655:web:97be53567ff1da8a6c6582",
  measurementId: "G-VTEFSP347R",
});

const messaging = firebase.messaging();

// Optional: background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/favicon.ico",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

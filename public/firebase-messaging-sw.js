importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyABIMvcuNivgTP1BXL-xXQEyLdLIvXnCrg",
  authDomain: "appwritedelivey.firebaseapp.com",
  projectId: "appwritedelivey",
  storageBucket: "appwritedelivey.firebasestorage.app",
  messagingSenderId: "309613309004",
  appId: "1:309613309004:web:95cb3f104e1a6d2b6998e9",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
  });
});
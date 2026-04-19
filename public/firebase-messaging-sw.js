importScripts(
  'https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyABIMvcuNivgTP1BXL-xXQEyLdLIvXnCrg',
  authDomain: 'appwritedelivey.firebaseapp.com',
  projectId: 'appwritedelivey',
  storageBucket: 'appwritedelivey.firebasestorage.app',
  messagingSenderId: '309613309004',
  appId: '1:309613309004:web:95cb3f104e1a6d2b6998e9',
});

// ── Hardcode these — they are not secrets, just project config ─────────────
const APPWRITE_BASE = 'https://cloud.appwrite.io';
const APPWRITE_PROJECT = '684ea0d100384c008ca4'; // ← paste your project ID
const ADVANCE_DISPATCH_FN_ID = '69bec5220031461e10d8 '; // ← paste your function


const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data ?? {};
  const note = payload.notification ?? {};

  const fare = data.fare ?? '';
  const distance = data.distance ? `${data.distance}km away` : '';
  const pickup = data.pickup ?? '';
  const deliveryId = data.deliveryId ?? '';
  const queueId = data.queueId ?? '';
  const type = data.type ?? '';

  if (type !== 'delivery_offer') {
    self.registration.showNotification(note.title ?? 'Carrydey', {
      body: note.body ?? '',
      icon: '/icon-192.png',
      badge: '/icon-32.png',
      tag: `carrydey-${Date.now()}`,
      data: { url: '/track' },
    });
    return;
  }

  const title = note.title ?? '📦 New Delivery Offer';
  const bodyParts = [fare, distance, pickup].filter(Boolean);
  const body = bodyParts.join(' · ');

  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-32.png',
    tag: `offer-${deliveryId}`,
    renotify: true,
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200, 100, 500],
    actions: [
      { action: 'accept', title: '✅ Accept' },
      { action: 'decline', title: '❌ Decline' },
    ],
    data: {
      type,
      deliveryId, // ✅ this is now defined from data.deliveryId above
      queueId,
      url: '/track',
    },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { action } = event;
  // ✅ deliveryId destructured here — it was always in data, but now guaranteed non-empty
  const { type, deliveryId, queueId, url } = event.notification.data ?? {};

  if (
    type === 'delivery_offer' &&
    (action === 'accept' || action === 'decline')
  ) {
    // ✅ Use hardcoded constants — no more race condition with SET_ENV postMessage
    event.waitUntil(
      fetch(
        `${APPWRITE_BASE}/v1/functions/${ADVANCE_DISPATCH_FN_ID}/executions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': APPWRITE_PROJECT,
          },
          body: JSON.stringify({
            body: JSON.stringify({ queueId, action }),
          }),
        }
      )
        .then(() => {
          if (action === 'accept') {
            return self.clients
              .matchAll({ type: 'window', includeUncontrolled: true })
              .then((clients) => {
                for (const client of clients) {
                  if (client.url.includes('/track') && 'focus' in client) {
                    return client.focus();
                  }
                }
                return self.clients.openWindow(url ?? '/track');
              });
          }
        })
        .catch((e) => console.error('[SW] Action dispatch failed:', e))
    );
    return;
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (client.url.includes('/track') && 'focus' in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(url ?? '/track');
      })
  );
});

// Keep SET_ENV listener for backwards compat — but constants above take precedence
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SET_ENV') {
    self.__APPWRITE_PROJECT__ = event.data.PROJECT ?? '';
    self.__ADVANCE_DISPATCH_FN__ = event.data.FN_ID ?? '';
  }
});

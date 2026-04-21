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

// ── Background message handler ─────────────────────────────────────────────
// This fires when the app is in the background or closed.
// We build the notification ourselves so we can set tag, actions,
// vibrate, and requireInteraction — none of which are available
// when FCM auto-constructs the notification from the `notification` key.
messaging.onBackgroundMessage((payload) => {
  const data   = payload.data ?? {};
  const note   = payload.notification ?? {};

  const fare      = data.fare     ?? '';
  const distance  = data.distance ? `${data.distance}km away` : '';
  const pickup    = data.pickup   ?? '';
  const deliveryId = data.deliveryId ?? '';
  const queueId    = data.queueId    ?? '';
  const type       = data.type       ?? '';

  // ── Non-offer notifications (sender updates, etc.) — simple style ──────
  if (type !== 'delivery_offer') {
    self.registration.showNotification(note.title ?? 'Carrydey', {
      body:  note.body ?? '',
      icon:  '/icon-192.png',
      badge: '/icon-72.png',
      tag:   `carrydey-${Date.now()}`,
      data:  { url: '/track' },
    });
    return;
  }

  // ── Delivery offer notification — rich style ───────────────────────────
  const title = note.title ?? '📦 New Delivery Offer';

  // Build a concise body: fare · distance · truncated pickup
  const bodyParts = [fare, distance, pickup].filter(Boolean);
  const body = bodyParts.join(' · ');

  self.registration.showNotification(title, {
    body,
    icon:  '/icon-192.png',
    badge: '/icon-72.png',

    // tag deduplicates: replaces any existing offer notification
    // for this delivery instead of stacking a second one
    tag:      `offer-${deliveryId}`,
    renotify: true,   // re-plays sound/vibrate even when replacing same tag

    // Keeps notification on screen until the courier acts
    requireInteraction: true,

    silent: false,

    // Haptic pattern: short-short-long  (Android PWA honours this)
    vibrate: [200, 100, 200, 100, 500],

    // Action buttons visible directly in the shade
    actions: [
      { action: 'accept',  title: '✅ Accept'  },
      { action: 'decline', title: '❌ Decline' },
    ],

    // Passed through to notificationclick so we can act without reopening
    data: {
      type,
      deliveryId,
      queueId,
      url: '/track',
    },
  });
});

// ── Notification click / action button handler ─────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { action }                          = event;
  const { type, deliveryId, queueId, url }  = event.notification.data ?? {};

  // Only intercept accept/decline taps on offer notifications
  if (type === 'delivery_offer' && (action === 'accept' || action === 'decline')) {
    const APPWRITE_BASE = 'https://cloud.appwrite.io';
    const PROJECT       = '684ea0d100384c008ca4';   // injected via env — see note below
    const FN_ID         ='69bec5220031461e10d8';

    event.waitUntil(
      fetch(`${APPWRITE_BASE}/v1/functions/${FN_ID}/executions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT,
        },
        body: JSON.stringify({
          body: JSON.stringify({ queueId, action }),
        }),
      }).then(() => {
        // After accepting, open/focus the track page
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
      }).catch((e) => console.error('[SW] Action dispatch failed:', e))
    );
    return;
  }

  // Default tap — open or focus the track page
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

// ── Inject env values at build time ───────────────────────────────────────
// In next.config.js add this to make the SW aware of env vars:
//
//   async headers() { return []; }   // not needed
//
// Instead, in your SW registration (usePushNotifications.js), right after
// navigator.serviceWorker.register('/firebase-messaging-sw.js'), do:
//
//   const reg = await navigator.serviceWorker.ready;
//   reg.active?.postMessage({
//     type: 'SET_ENV',
//     PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
//     FN_ID:   process.env.NEXT_PUBLIC_ADVANCE_DISPATCH_FUNCTION_ID,
//   });
//
// Then add this listener at the bottom of this file (already included):

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SET_ENV') {
    self.__APPWRITE_PROJECT__   = event.data.PROJECT ?? '';
    self.__ADVANCE_DISPATCH_FN__ = event.data.FN_ID  ?? '';
  }
});
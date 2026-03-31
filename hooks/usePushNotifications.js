'use client';
import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/lib/config/firebase';
import { account, ID, tablesDB } from '@/lib/config/Appwriteconfig';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const PROVIDER_ID = process.env.NEXT_PUBLIC_APPWRITE_FCM_PROVIDER_ID; // ← add this env var
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const USERS = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const ORGS = process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID;

const STORAGE_KEY = 'carrydey_push_target_id';
const TOKEN_KEY = 'carrydey_push_fcm_token';
const REGISTERING_KEY = 'carrydey_push_registering';

export function usePushNotifications({
  enabled = true,
  onForegroundMessage,
} = {}) {
  useEffect(() => {
    if (!enabled) return;

    const init = async () => {
      if (sessionStorage.getItem(REGISTERING_KEY)) return;
      sessionStorage.setItem(REGISTERING_KEY, '1');

      try {
        // 1. Check browser support
        if (!('Notification' in window) || !('serviceWorker' in navigator))
          return;

        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        // 2. Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('[Push] Notification permission denied');
          return;
        }

        // 3. Register service worker explicitly and pass to getToken
        let swReg;
        try {
          swReg = await navigator.serviceWorker.register(
            '/firebase-messaging-sw.js'
          );
          await navigator.serviceWorker.ready; // wait for SW to activate
        } catch (e) {
          console.error('[Push] Service worker registration failed:', e);
          return;
        }

        // 4. Get FCM token
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: swReg,
        });

        if (!token) {
          console.warn(
            '[Push] No FCM token returned — check VAPID key and Firebase config'
          );
          return;
        }

        const savedToken = localStorage.getItem(TOKEN_KEY);
        const existingTargetId = localStorage.getItem(STORAGE_KEY);

        // 5. Already registered with same token — just wire foreground handler
        if (existingTargetId && savedToken === token) {
          onMessage(messaging, (payload) => onForegroundMessage?.(payload));
          return;
        }

        // 6. Token rotated — delete stale target from Appwrite
        if (existingTargetId && savedToken !== token) {
          try {
            await account.deletePushTarget(existingTargetId);
          } catch (_) {
            // stale target may already be gone — safe to ignore
          }
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TOKEN_KEY);
        }

        // 7. Get Appwrite auth user + role
        let currentUser, role;
        try {
          currentUser = await account.get();
          const prefs = await account.getPrefs();
          role = prefs?.role ?? null;
        } catch (e) {
          console.warn(
            '[Push] Not authenticated, skipping push target registration'
          );
          return;
        }

        // 8. Create push target — providerId is REQUIRED
        let target;
        try {
          target = await account.createPushTarget(
            ID.unique(),
            token,
            PROVIDER_ID // ← must match your FCM provider ID in Appwrite console
          );
        } catch (e) {
          console.error('[Push] createPushTarget failed:', e);
          return;
        }

        localStorage.setItem(STORAGE_KEY, target.$id);
        localStorage.setItem(TOKEN_KEY, token);

        // 9. Save pushTargetId to the correct collection doc
        const tableId = role === 'agency' ? ORGS : USERS;

        try {
          await tablesDB.updateRow({
            databaseId: DB,
            tableId,
            rowId: currentUser.$id,
            data: { pushTargetId: target.$id },
          });
          console.log('[Push] Auth $id:', currentUser.$id);
          console.log(
            '[Push] Attempting updateRow on tableId:',
            tableId,
            'rowId:',
            currentUser.$id
          );

          console.log('[Push] Registered successfully. Target:', target.$id);
        } catch (e) {
          console.error('[Push] Failed to save pushTargetId to collection:', e);
        }

        // 10. Wire foreground message handler
        onMessage(messaging, (payload) => onForegroundMessage?.(payload));
      } catch (err) {
        console.error('[Push] Setup failed:', err);
      } finally {
        sessionStorage.removeItem(REGISTERING_KEY);
      }
    };

    init();
  }, [enabled]);
}

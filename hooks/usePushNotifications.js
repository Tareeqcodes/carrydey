'use client';
import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/lib/config/firebase';
import { account, ID, tablesDB, Query } from '@/lib/config/Appwriteconfig';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const PROVIDER_ID = process.env.NEXT_PUBLIC_APPWRITE_FCM_PROVIDER_ID;
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const USERS = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const ORGS = process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID;

const STORAGE_KEY = 'carrydey_push_target_id';
const TOKEN_KEY = 'carrydey_push_fcm_token';
const REGISTERING_KEY = 'carrydey_push_registering';

// Sends PROJECT + FN_ID into the SW so the notificationclick action buttons
// (Accept / Decline) can call advance-dispatch without opening the app.
// This is the only addition vs the original working code.
const injectEnvIntoSW = async () => {
  try {
    const reg = await navigator.serviceWorker.ready;
    const target = reg.active ?? reg.waiting ?? reg.installing;
    if (!target) return;
    target.postMessage({
      type: 'SET_ENV',
      PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '',
      FN_ID: process.env.NEXT_PUBLIC_ADVANCE_DISPATCH_FUNCTION_ID ?? '',
    });
  } catch (e) {
    console.warn('[Push] injectEnvIntoSW failed:', e);
  }
};

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
        if (!('Notification' in window) || !('serviceWorker' in navigator))
          return;

        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('[Push] Notification permission denied');
          return;
        }

        // NOTE: do NOT manually register the SW or call navigator.serviceWorker.register.
        // getToken() handles SW registration internally using the serviceWorkerRegistration
        // option. Manually registering causes a second SW instance that fights with Firebase.
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (!token) {
          console.warn(
            '[Push] No FCM token returned — check VAPID key and Firebase config'
          );
          return;
        }

        // Inject env vars after token is obtained (SW is guaranteed active at this point)
        await injectEnvIntoSW();

        const savedToken = localStorage.getItem(TOKEN_KEY);
        const existingTargetId = localStorage.getItem(STORAGE_KEY);

        // Already registered with the same token — just wire foreground handler
        if (existingTargetId && savedToken === token) {
          onMessage(messaging, (payload) => onForegroundMessage?.(payload));
          return;
        }

        // Token rotated — delete stale target from Appwrite
        if (existingTargetId && savedToken !== token) {
          try {
            await account.deletePushTarget(existingTargetId);
          } catch (_) {
            // stale target may already be gone — safe to ignore
          }
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TOKEN_KEY);
        }

        // Get Appwrite auth user + role
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

        // Create push target
        let target;
        try {
          target = await account.createPushTarget(
            ID.unique(),
            token,
            PROVIDER_ID
          );
        } catch (e) {
          console.error('[Push] createPushTarget failed:', e);
          return;
        }

        localStorage.setItem(STORAGE_KEY, target.$id);
        localStorage.setItem(TOKEN_KEY, token);

        // Look up the profile document by userId field, not by auth $id.
        // account.get().$id is the Appwrite Auth ID.
        // USERS/ORGS documents have their own $id and a separate `userId` field.
        const tableId = role === 'agency' ? ORGS : USERS;

        let profileDoc;
        try {
          const res = await tablesDB.listRows({
            databaseId: DB,
            tableId,
            queries: [Query.equal('userId', currentUser.$id), Query.limit(1)],
          });
          profileDoc = res.rows?.[0] ?? null;
        } catch (e) {
          console.error('[Push] Could not find profile doc by userId:', e);
          return;
        }

        if (!profileDoc) {
          console.warn(
            '[Push] No profile doc found for userId:',
            currentUser.$id
          );
          return;
        }

        try {
          await tablesDB.updateRow({
            databaseId: DB,
            tableId,
            rowId: profileDoc.$id,
            data: { pushTargetId: target.$id },
          });
          console.log(
            '[Push] pushTargetId saved to doc:',
            profileDoc.$id,
            '→',
            target.$id
          );
        } catch (e) {
          console.error('[Push] Failed to save pushTargetId to collection:', e);
        }

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

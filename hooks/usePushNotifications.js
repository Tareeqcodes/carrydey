import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/lib/config/firebase';
import { account, ID, tablesDB } from '@/lib/config/Appwriteconfig';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const USERS = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const ORGS = process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID;
const STORAGE_KEY = 'carrydey_push_target_id';
const TOKEN_KEY = 'carrydey_push_fcm_token';
const REGISTERING_KEY = 'carrydey_push_registering';

export function usePushNotifications({ enabled = true, onForegroundMessage } = {}) {
  useEffect(() => {
    if (!enabled) return;

    const init = async () => {
      if (sessionStorage.getItem(REGISTERING_KEY)) return;
      sessionStorage.setItem(REGISTERING_KEY, '1');

      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (!token) return;

        const savedToken = localStorage.getItem(TOKEN_KEY);
        const existingTargetId = localStorage.getItem(STORAGE_KEY);

        // Already registered with same token — just wire foreground handler
        if (existingTargetId && savedToken === token) {
          onMessage(messaging, (payload) => onForegroundMessage?.(payload));
          return;
        }

        // Token rotated — delete stale target
        if (existingTargetId && savedToken !== token) {
          try { await account.deletePushTarget(existingTargetId); } catch (_) {}
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TOKEN_KEY);
        }

        // Get the current Appwrite auth user + their role
        const currentUser = await account.get();
        const userPrefs = await account.getPrefs();
        const role = userPrefs?.role ?? null;

        // Register the push target
        const target = await account.createPushTarget(
          ID.unique(),
          token,
          'fcm'
        );

        localStorage.setItem(STORAGE_KEY, target.$id);
        localStorage.setItem(TOKEN_KEY, token);

        // Save pushTargetId to the correct collection
        const tableId = role === 'agency' ? ORGS : USERS;
        try {
          await tablesDB.updateRow({
            databaseId: DB,
            tableId,
            rowId: currentUser.$id,
            data: { pushTargetId: target.$id },
          });
        } catch (e) {
          console.error('Failed to save pushTargetId to collection:', e);
        }

        onMessage(messaging, (payload) => onForegroundMessage?.(payload));
      } catch (err) {
        console.error('Push notification setup failed:', err);
      } finally {
        sessionStorage.removeItem(REGISTERING_KEY);
      }
    };

    init();
  }, [enabled]);
}
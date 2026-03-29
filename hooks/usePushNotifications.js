import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/lib/config/firebase';
import { account, ID } from '@/lib/config/Appwriteconfig';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
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

        // Already registered with the same token — just wire up foreground handler
        if (existingTargetId && savedToken === token) {
          onMessage(messaging, (payload) => {
            onForegroundMessage?.(payload);
          });
          return;
        }

        // Token rotated — delete the stale target before re-registering
        if (existingTargetId && savedToken !== token) {
          try {
            await account.deletePushTarget(existingTargetId);
          } catch (_) {}
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TOKEN_KEY);
        }

        const target = await account.createPushTarget(
          ID.unique(),
          token,
          'fcm'  // ← must match your provider ID in Appwrite Console → Messaging → Providers
        );

        localStorage.setItem(STORAGE_KEY, target.$id);
        localStorage.setItem(TOKEN_KEY, token);

        onMessage(messaging, (payload) => {
          onForegroundMessage?.(payload);
        });
      } catch (err) {
        console.error('Push notification setup failed:', err);
      } finally {
        sessionStorage.removeItem(REGISTERING_KEY);
      }
    };

    init();
  }, [enabled]);
}
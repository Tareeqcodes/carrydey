
import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/lib/firebase';
import { account, ID } from '@/lib/config/Appwriteconfig';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const STORAGE_KEY = 'carrydey_push_target_id';

export function usePushNotifications({ enabled = true, onForegroundMessage } = {}) {
  useEffect(() => {
    if (!enabled) return; 

    const init = async () => {
      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (!token) return;

        const existingTargetId = localStorage.getItem(STORAGE_KEY);
        if (!existingTargetId) {
          const target = await account.createPushTarget(ID.unique(), token);
          localStorage.setItem(STORAGE_KEY, target.$id);
        }

        onMessage(messaging, (payload) => {
          onForegroundMessage?.(payload);
        });
      } catch (err) {
        console.error('Push notification setup failed:', err);
      }
    };

    init();
  }, [enabled]); // re-runs when enabled flips true
}
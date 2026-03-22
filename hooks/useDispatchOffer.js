'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { tablesDB, Query, client } from '@/lib/config/Appwriteconfig';

const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const DISPATCH = process.env.NEXT_PUBLIC_APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;
const FN_ID = process.env.NEXT_PUBLIC_ADVANCE_DISPATCH_FUNCTION_ID;
const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_BASE = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(
  /\/v1\/?$/,
  ''
);

const OFFER_DURATION_S = 20;

export function useDispatchOffer(
  entityId,
  entityCollection,
  { onAccepted } = {}
) {
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [offerCountdown, setOfferCountdown] = useState(OFFER_DURATION_S);

  const offerTimerRef = useRef(null);
  // Keep latest queueId accessible inside the timer without stale closure
  const queueIdRef = useRef(null);
  const timedOutRef = useRef(false);
  const clearTimer = useCallback(() => {
    if (offerTimerRef.current) {
      clearInterval(offerTimerRef.current);
      offerTimerRef.current = null;
    }
  }, []);

  const callAdvanceDispatch = useCallback(async (queueId, action) => {
    if (!queueId) return;
    try {
      await fetch(`${APPWRITE_BASE}/v1/functions/${FN_ID}/executions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT,
        },
        body: JSON.stringify({
          body: JSON.stringify({ queueId, action }),
        }),
      });
    } catch (e) {
      console.error('[useDispatchOffer] callAdvanceDispatch error:', e);
    }
  }, []);

  // ── startCountdown 
  // When the countdown expires on the courier/agency side, we call
  // advance-dispatch with 'timeout' so the server moves to the next candidate.
  // Without this, the sender's useChooseAvailable fires the timeout but the
  // courier/agency side never clears its banner.
  const startCountdown = useCallback(
    (expiresAt, queueId) => {
      clearTimer();
      timedOutRef.current = false;
      queueIdRef.current = queueId;

      const expires = new Date(expiresAt);

      offerTimerRef.current = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.round((expires - Date.now()) / 1000)
        );
        setOfferCountdown(remaining);

        if (remaining <= 0 && !timedOutRef.current) {
          timedOutRef.current = true;
          clearTimer();
          setIncomingOffer(null);
        }
      }, 1000);
    },
    [clearTimer]
  );

  useEffect(() => {
    if (!entityId || !entityCollection) return;

    const channel = `databases.${DB}.collections.${entityCollection}.documents.${entityId}`;

    const unsub = client.subscribe(channel, async (event) => {
      const doc = event.payload;

      if (doc.status === 'offered' && doc.currentOfferId) {
        // Fetch the matching pending queue doc to get its $id
        try {
          const res = await tablesDB.listRows({
            databaseId: DB,
            tableId: DISPATCH,
            queries: [
              Query.equal('deliveryId', doc.currentOfferId),
              Query.equal('status', 'pending'),
              Query.limit(1),
            ],
          });

          const queueDoc = res.rows?.[0];
          const queueId = queueDoc?.$id ?? null;

          setIncomingOffer({
            deliveryId: doc.currentOfferId,
            expiresAt: doc.offerExpiresAt,
            queueId,
          });

          startCountdown(doc.offerExpiresAt, queueId);
        } catch (e) {
          console.error('[useDispatchOffer] Failed to fetch queue doc:', e);
        }
      } else if (doc.status === 'available' || !doc.currentOfferId) {
        // Offer withdrawn server-side (timeout or advance) — clear banner
        clearTimer();
        setIncomingOffer(null);
      }
    });

    return () => {
      unsub();
      clearTimer();
    };
  }, [entityId, entityCollection, startCountdown, clearTimer]);

  const acceptOffer = useCallback(async () => {
    if (!incomingOffer?.queueId) return;

    const { queueId, deliveryId } = incomingOffer;
    clearTimer();
    setIncomingOffer(null);

    try {
      await callAdvanceDispatch(queueId, 'accept');
      onAccepted?.(deliveryId, queueId);
    } catch (e) {
      console.error('[useDispatchOffer] Accept failed:', e);
    }
  }, [incomingOffer, clearTimer, callAdvanceDispatch, onAccepted]);

  const declineOffer = useCallback(async () => {
    if (!incomingOffer?.queueId) return;

    const { queueId } = incomingOffer;

    clearTimer();
    setIncomingOffer(null);

    try {
      await callAdvanceDispatch(queueId, 'decline');
    } catch (e) {
      console.error('[useDispatchOffer] Decline failed:', e);
    }
  }, [incomingOffer, clearTimer, callAdvanceDispatch]);

  return {
    incomingOffer,
    offerCountdown,
    acceptOffer,
    declineOffer,
  };
}

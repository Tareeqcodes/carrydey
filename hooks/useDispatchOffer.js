'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { tablesDB, Query, client } from '@/lib/config/Appwriteconfig';

const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const DISPATCH = process.env.NEXT_PUBLIC_APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;
const FN_ID = process.env.NEXT_PUBLIC_ADVANCE_DISPATCH_FUNCTION_ID;
const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;

const OFFER_DURATION_S = 20;

/**
 * useDispatchOffer
 *
 * Shared hook for both courier and agency dashboards.
 * Subscribes to Realtime updates on the entity's own document,
 * manages the incoming offer state + countdown, and calls the
 * advance-dispatch function on accept / decline.
 *
 * @param {string} entityId         - The $id of the courier or agency document
 * @param {string} entityCollection - The Appwrite collection ID for the entity
 *                                    (USERS collection for couriers, ORGS for agencies)
 * @param {object} [options]
 * @param {(deliveryId: string, queueId: string) => Promise<void>} [options.onAccepted]
 *   Optional callback fired AFTER the advance-dispatch accept call succeeds.
 *   Receives the deliveryId and queueId so the parent can open a modal,
 *   refresh data, etc.
 */
export function useDispatchOffer(
  entityId,
  entityCollection,
  { onAccepted } = {}
) {
  // { deliveryId, expiresAt, queueId } | null
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [offerCountdown, setOfferCountdown] = useState(OFFER_DURATION_S);

  const offerTimerRef = useRef(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (offerTimerRef.current) {
      clearInterval(offerTimerRef.current);
      offerTimerRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(
    (expiresAt) => {
      clearTimer();
      const expires = new Date(expiresAt);

      offerTimerRef.current = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.round((expires - Date.now()) / 1000)
        );
        setOfferCountdown(remaining);

        if (remaining <= 0) {
          clearTimer();
          setIncomingOffer(null);
        }
      }, 1000);
    },
    [clearTimer]
  );

  const callAdvanceDispatch = useCallback(async (queueId, action) => {
    await fetch(`${ENDPOINT}/v1/functions/${FN_ID}/executions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT,
      },
      body: JSON.stringify({
        body: JSON.stringify({ queueId, action }),
      }),
    });
  }, []);

  // ── Realtime subscription ─────────────────────────────────────────────────
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

          setIncomingOffer({
            deliveryId: doc.currentOfferId,
            expiresAt: doc.offerExpiresAt,
            queueId: queueDoc?.$id ?? null,
          });

          startCountdown(doc.offerExpiresAt);
        } catch (e) {
          console.error('[useDispatchOffer] Failed to fetch queue doc:', e);
        }
      } else if (doc.status === 'available' || !doc.currentOfferId) {
        // Offer was withdrawn (timeout handled server-side, or already actioned)
        clearTimer();
        setIncomingOffer(null);
      }
    });

    return () => {
      unsub();
      clearTimer();
    };
  }, [entityId, entityCollection, startCountdown, clearTimer]);

  // ── public actions ────────────────────────────────────────────────────────
  const acceptOffer = useCallback(async () => {
    if (!incomingOffer?.queueId) return;

    const { queueId, deliveryId } = incomingOffer;

    // Optimistically clear the banner so the UI feels instant
    clearTimer();
    setIncomingOffer(null);

    try {
      await callAdvanceDispatch(queueId, 'accept');
      // Let the parent know — it can open AssignmentModal, refresh, etc.
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
    incomingOffer, // null when no offer, object when pending
    offerCountdown, // seconds remaining (0-20)
    acceptOffer,
    declineOffer,
  };
}

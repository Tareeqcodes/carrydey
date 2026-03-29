'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { tablesDB, Query, client } from '@/lib/config/Appwriteconfig';

const DB           = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const DISPATCH     = process.env.NEXT_PUBLIC_APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;
const USERS        = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const FN_ID        = process.env.NEXT_PUBLIC_ADVANCE_DISPATCH_FUNCTION_ID;
const PROJECT      = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_BASE = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(/\/v1\/?$/, '');

const OFFER_DURATION_S = 20;

const entityHasOffer = (doc) => {
  if (doc.status === 'offered' && doc.currentOfferId) return true;
  if (doc.isAvailable === false && doc.currentOfferId) return true;
  return false;
};

const entityOfferCleared = (doc) => {
  if (doc.status === 'available' && !doc.currentOfferId) return true;
  if (!doc.currentOfferId) return true;
  return false;
};

export function useDispatchOffer(
  entityId,
  entityCollection,
  { onAccepted } = {}
) {
  const [incomingOffer,  setIncomingOffer]  = useState(null);
  const [offerCountdown, setOfferCountdown] = useState(OFFER_DURATION_S);

  const offerTimerRef = useRef(null);
  const queueIdRef    = useRef(null);
  const timedOutRef   = useRef(false);

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

  const startCountdown = useCallback(
    (expiresAt, queueId) => {
      clearTimer();
      timedOutRef.current = false;
      queueIdRef.current  = queueId;

      const expires = new Date(expiresAt);

      offerTimerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((expires - Date.now()) / 1000));
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

  // ── Bootstrap: on mount, poll once in case an offer is already active ──────
  // This handles page refresh while an offer is live
  useEffect(() => {
    if (!entityId || !entityCollection) return;

    const bootstrap = async () => {
      try {
        const doc = await tablesDB.getRow({
          databaseId: DB,
          tableId:    entityCollection,
          rowId:      entityId,
        });

        if (!entityHasOffer(doc)) return;

        // Find the matching dispatch queue doc
        const res = await tablesDB.listRows({
          databaseId: DB,
          tableId:    DISPATCH,
          queries: [
            Query.equal('deliveryId', doc.currentOfferId),
            Query.equal('status', 'pending'),
            Query.limit(1),
          ],
        });

        const queueDoc = res.rows?.[0];
        if (!queueDoc) return;

        setIncomingOffer({
          deliveryId: doc.currentOfferId,
          expiresAt:  doc.offerExpiresAt,
          queueId:    queueDoc.$id,
        });
        startCountdown(doc.offerExpiresAt, queueDoc.$id);
      } catch (e) {
        // Entity doc not found or no offer — safe to ignore
      }
    };

    bootstrap();
  }, [entityId, entityCollection, startCountdown]);

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!entityId || !entityCollection) return;

    const channel = `databases.${DB}.collections.${entityCollection}.documents.${entityId}`;

    const unsub = client.subscribe(channel, async (event) => {
      const doc = event.payload;

      if (entityHasOffer(doc)) {
        try {
          const res = await tablesDB.listRows({
            databaseId: DB,
            tableId:    DISPATCH,
            queries: [
              Query.equal('deliveryId', doc.currentOfferId),
              Query.equal('status', 'pending'),
              Query.limit(1),
            ],
          });

          const queueDoc = res.rows?.[0];
          const queueId  = queueDoc?.$id ?? null;

          setIncomingOffer({
            deliveryId: doc.currentOfferId,
            expiresAt:  doc.offerExpiresAt,
            queueId,
          });

          startCountdown(doc.offerExpiresAt, queueId);
        } catch (e) {
          console.error('[useDispatchOffer] Failed to fetch queue doc:', e);
        }
      } else if (entityOfferCleared(doc)) {
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
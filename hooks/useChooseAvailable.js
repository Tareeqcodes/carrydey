'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { tablesDB, Query, client } from '@/lib/config/Appwriteconfig';

const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const DISPATCH = process.env.NEXT_PUBLIC_APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;
const FN_ID = process.env.NEXT_PUBLIC_ADVANCE_DISPATCH_FUNCTION_ID;

// Strip trailing /v1 so we don't build /v1/v1/functions/...
const APPWRITE_BASE = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(
  /\/v1\/?$/,
  ''
);

export default function useChooseAvailable(deliveryId) {
  const [status, setStatus] = useState('searching');
  const [currentCourier, setCurrentCourier] = useState(null);
  const [rankedCouriers, setRankedCouriers] = useState([]);
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [countdown, setCountdown] = useState(20);
  const [queueId, setQueueId] = useState(null);
  const [failReason, setFailReason] = useState('');

  const countdownRef = useRef(null);
  const expiresAtRef = useRef(null);
  const queueIdRef = useRef(null);
  const unsubRef = useRef(null);
  const subTimerRef = useRef(null);

  const stopCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const advanceDispatch = useCallback(async (id, action) => {
    if (!id) return;
    try {
      await fetch(`${APPWRITE_BASE}/v1/functions/${FN_ID}/executions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT,
        },
        body: JSON.stringify({
          body: JSON.stringify({ queueId: id, action }),
        }),
      });
    } catch (e) {
      console.error('advanceDispatch error:', e);
    }
  }, []);

  const startCountdown = useCallback(
    (expiresAt) => {
      stopCountdown();
      expiresAtRef.current = expiresAt;

      countdownRef.current = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.round((new Date(expiresAtRef.current) - Date.now()) / 1000)
        );
        setCountdown(remaining);

        if (remaining <= 0) {
          stopCountdown();
          if (queueIdRef.current) {
            advanceDispatch(queueIdRef.current, 'timeout');
          }
        }
      }, 1000);
    },
    [stopCountdown, advanceDispatch]
  );

  const applyQueueDoc = useCallback(
    (doc) => {
      const ranked = (() => {
        try {
          return JSON.parse(doc.rankedCouriersJson ?? '[]');
        } catch {
          return [];
        }
      })();

      const current = ranked[doc.attemptIndex] ?? null;

      queueIdRef.current = doc.$id;
      setQueueId(doc.$id);
      setRankedCouriers(ranked);
      setAttemptIndex(doc.attemptIndex ?? 0);
      setCurrentCourier(current);

      if (doc.status === 'pending') {
        setStatus('offering');
        startCountdown(doc.expiresAt);
      } else if (doc.status === 'accepted') {
        stopCountdown();
        setStatus('assigned');
      } else if (doc.status === 'failed') {
        stopCountdown();
        setStatus('failed');
        setFailReason(doc.failReason ?? 'all_rejected');
      }
    },
    [startCountdown, stopCountdown]
  );

  useEffect(() => {
    if (!deliveryId) return;

    // ── 1. Poll for existing queue doc immediately (handles page refresh) ───
    // This runs right away — no delay needed since it's a REST call not WS
    tablesDB
      .listRows({
        databaseId: DB,
        tableId: DISPATCH,
        queries: [
          Query.equal('deliveryId', deliveryId),
          Query.orderDesc('$createdAt'),
          Query.limit(1),
        ],
      })
      .then((res) => {
        if (res.rows?.length > 0) applyQueueDoc(res.rows[0]);
      })
      .catch(() => {});

    // ── 2. Delay the WebSocket subscription slightly ─────────────────────────
    // The Appwrite SDK throws InvalidStateError if you call subscribe()
    // while the WebSocket is still in CONNECTING state (readyState === 0).
    // A small delay lets the handshake complete before we subscribe.
    subTimerRef.current = setTimeout(() => {
      const channel = `databases.${DB}.collections.${DISPATCH}.documents`;

      try {
        unsubRef.current = client.subscribe(channel, (event) => {
          const doc = event.payload;
          // Filter to only events for this delivery's queue doc
          if (doc?.deliveryId !== deliveryId) return;
          applyQueueDoc(doc);
        });
      } catch (e) {
        console.error('WebSocket subscribe error:', e);

        // Fallback: if subscribe fails, poll every 3 seconds
        const pollInterval = setInterval(() => {
          tablesDB
            .listRows({
              databaseId: DB,
              tableId: DISPATCH,
              queries: [
                Query.equal('deliveryId', deliveryId),
                Query.orderDesc('$createdAt'),
                Query.limit(1),
              ],
            })
            .then((res) => {
              if (res.rows?.length > 0) {
                const doc = res.rows[0];
                // Stop polling once resolved
                if (doc.status !== 'pending') clearInterval(pollInterval);
                applyQueueDoc(doc);
              }
            })
            .catch(() => {});
        }, 3000);

        // Store pollInterval in unsubRef so cleanup can clear it
        unsubRef.current = () => clearInterval(pollInterval);
      }
    }, 300); // 300ms is enough for the WS handshake to complete

    return () => {
      // Clear the subscription delay timer
      if (subTimerRef.current) {
        clearTimeout(subTimerRef.current);
        subTimerRef.current = null;
      }
      // Unsubscribe from realtime (or clear poll fallback)
      if (unsubRef.current) {
        try {
          unsubRef.current();
        } catch (_) {}
        unsubRef.current = null;
      }
      stopCountdown();
    };
  }, [deliveryId, applyQueueDoc, stopCountdown]);

  return {
    status,
    currentCourier,
    rankedCouriers,
    attemptIndex,
    countdown,
    queueId,
    failReason,
    advanceDispatch,
  };
}

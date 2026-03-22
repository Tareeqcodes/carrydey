'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { tablesDB, Query, client } from '@/lib/config/Appwriteconfig';

const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const DISPATCH = process.env.NEXT_PUBLIC_APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;
const FN_ID = process.env.NEXT_PUBLIC_ADVANCE_DISPATCH_FUNCTION_ID;
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

  // All mutable runtime state in refs — closures never go stale
  const countdownRef = useRef(null);
  const expiresAtRef = useRef(null);
  const queueIdRef = useRef(null);
  const unsubRef = useRef(null);
  const subTimerRef = useRef(null);
  const timedOutRef = useRef(false); // prevents double timeout firing

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

  // startCountdown reads from refs so it never captures stale values
  const startCountdown = useCallback(
    (expiresAt) => {
      // Clear any running interval first
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }

      timedOutRef.current = false;
      expiresAtRef.current = expiresAt;

      countdownRef.current = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.round((new Date(expiresAtRef.current) - Date.now()) / 1000)
        );
        setCountdown(remaining);

        if (remaining <= 0 && !timedOutRef.current) {
          timedOutRef.current = true;
          clearInterval(countdownRef.current);
          countdownRef.current = null;
          // queueIdRef always has the latest — no stale closure issue
          if (queueIdRef.current) {
            advanceDispatch(queueIdRef.current, 'timeout');
          }
        }
      }, 1000);
    },
    [advanceDispatch]
  );

  const applyQueueDoc = useCallback(
    (doc) => {
      let ranked = [];
      try {
        ranked = JSON.parse(doc.rankedCouriersJson ?? '[]');
      } catch {
        ranked = [];
      }

      const current = ranked[doc.attemptIndex] ?? null;

      // Update ref immediately so startCountdown/advanceDispatch always see latest
      queueIdRef.current = doc.$id;

      setQueueId(doc.$id);
      setRankedCouriers(ranked);
      setAttemptIndex(doc.attemptIndex ?? 0);
      setCurrentCourier(current);

      if (doc.status === 'pending') {
        setStatus('offering');
        // Restart countdown with the new expiresAt every time —
        // this handles both the FIRST offer and every subsequent advance
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

    // 1. Immediate REST poll — handles page refresh where WS hasn't connected
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

    // 2. Subscribe after 300ms to let WS handshake complete
    subTimerRef.current = setTimeout(() => {
      const channel = `databases.${DB}.collections.${DISPATCH}.documents`;
      try {
        unsubRef.current = client.subscribe(channel, (event) => {
          const doc = event.payload;
          if (doc?.deliveryId !== deliveryId) return;
          applyQueueDoc(doc);
        });
      } catch (e) {
        console.error('WS subscribe failed, falling back to polling:', e);
        const poll = setInterval(() => {
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
                if (doc.status !== 'pending') clearInterval(poll);
                applyQueueDoc(doc);
              }
            })
            .catch(() => {});
        }, 3000);
        unsubRef.current = () => clearInterval(poll);
      }
    }, 300);

    return () => {
      if (subTimerRef.current) {
        clearTimeout(subTimerRef.current);
        subTimerRef.current = null;
      }
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

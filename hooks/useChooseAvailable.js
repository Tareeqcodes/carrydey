'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { tablesDB, Query, client } from '@/lib/config/Appwriteconfig';

const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const DISPATCH = process.env.NEXT_PUBLIC_APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;
const FN_ID = process.env.NEXT_PUBLIC_ADVANCE_DISPATCH_FUNCTION_ID;

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

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const advanceDispatch = useCallback(async (id, action) => {
    if (!id) return;
    try {
      await fetch(`${ENDPOINT}/v1/functions/${FN_ID}/executions`, {
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
          if (queueIdRef.current)
            advanceDispatch(queueIdRef.current, 'timeout');
        }
      }, 1000);
    },
    [advanceDispatch]
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
    [startCountdown]
  );

  useEffect(() => {
    if (!deliveryId) return;

    // Subscribe to dispatch_queue table changes for this delivery
    const channel = `databases.${DB}.collections.${DISPATCH}.documents`;
    const unsub = client.subscribe(channel, (event) => {
      const doc = event.payload;
      if (doc.deliveryId !== deliveryId) return;
      applyQueueDoc(doc);
    });

    // Check if a queue doc already exists (handles page refresh)
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

    return () => {
      unsub();
      stopCountdown();
    };
  }, [deliveryId, applyQueueDoc]);

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

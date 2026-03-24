'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';

const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const DELIVERIES = process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID;
const USERS = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

export const useCourierDelivery = (userId) => {
  const [courier, setCourier] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const courierRef = useRef(null);

  const fetchCourier = async () => {
    if (!userId) return null;
    const res = await tablesDB.listRows({
      databaseId: DB,
      tableId: USERS,
      queries: [Query.equal('userId', userId), Query.equal('role', 'courier')],
    });
    return res.rows?.[0] || null;
  };

  const fetchCourierDeliveries = useCallback(async (courierId) => {
    if (!courierId) return;
    const res = await tablesDB.listRows({
      databaseId: DB,
      tableId: DELIVERIES,
      queries: [
        Query.equal('assignedCourierId', courierId),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ],
    });
    setDeliveries(res.rows || []);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const courierProfile = await fetchCourier();
        courierRef.current = courierProfile;
        setCourier(courierProfile);

        if (courierProfile) {
          await fetchCourierDeliveries(courierProfile.$id);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  // Always reads from ref — safe to call from any async callback
  const refresh = useCallback(async () => {
    const id = courierRef.current?.$id;
    if (!id) return;
    await fetchCourierDeliveries(id);
  }, [fetchCourierDeliveries]);

  // ── confirmPickup ────────────────────────────────────────────────────────
  const confirmPickup = async (deliveryId, enteredCode) => {
    try {
      const delivery = deliveries.find((d) => d.$id === deliveryId);
      if (!delivery) return { success: false, error: 'Delivery not found' };

      if (delivery.pickupCode !== enteredCode.toUpperCase()) {
        return { success: false, error: 'Invalid pickup code' };
      }

      const response = await tablesDB.updateRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: deliveryId,
        data: { status: 'picked_up' },
      });

      setDeliveries((prev) =>
        prev.map((d) => (d.$id === deliveryId ? { ...d, ...response } : d))
      );

      return { success: true, data: response };
    } catch (err) {
      console.error('Error confirming pickup:', err);
      return { success: false, error: err.message };
    }
  };

  // ── confirmDelivery ──────────────────────────────────────────────────────
  const confirmDelivery = async (deliveryId, enteredOTP) => {
    try {
      const delivery = deliveries.find((d) => d.$id === deliveryId);
      if (!delivery) return { success: false, error: 'Delivery not found' };

      if (delivery.dropoffOTP !== enteredOTP) {
        return { success: false, error: 'Invalid OTP code' };
      }

      const response = await tablesDB.updateRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: deliveryId,
        data: {
          status: 'delivered',
          driverName: null,
          driverPhone: null,
        },
      });

      setDeliveries((prev) =>
        prev.map((d) => (d.$id === deliveryId ? { ...d, ...response } : d))
      );

      return { success: true, data: response };
    } catch (err) {
      console.error('Error confirming delivery:', err);
      return { success: false, error: err.message };
    }
  };

  // ── updateDeliveryStatus ─────────────────────────────────────────────────
  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const response = await tablesDB.updateRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: deliveryId,
        data: { status: newStatus },
      });

      setDeliveries((prev) =>
        prev.map((d) => (d.$id === deliveryId ? { ...d, ...response } : d))
      );

      return { success: true, data: response };
    } catch (err) {
      console.error('Error updating delivery status:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    courier,
    deliveries,
    loading,
    error,
    confirmPickup,
    confirmDelivery,
    updateDeliveryStatus,
    refresh,
  };
};

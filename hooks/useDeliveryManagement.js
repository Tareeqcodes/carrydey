'use client';
import { useState, useEffect } from 'react';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';
import { generateOTP, generatePickupCode } from '@/hooks/otpGenerator';

const generateDriverToken = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

export const useDeliveryManagement = (agencyId, freeDriverFromDelivery) => {
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (agencyId) {
      fetchActiveDeliveries();
    } else {
      setLoading(false);
    }
  }, [agencyId]);

  const fetchActiveDeliveries = async () => {
    if (!agencyId || typeof agencyId !== 'string') {
      setError('Invalid agency ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        queries: [
          Query.equal('assignedAgencyId', agencyId),
          Query.orderDesc('$createdAt'),
          Query.limit(100),
        ],
      });

      const pending = response.rows.filter((r) => r.status === 'pending');
      const active = response.rows.filter((r) =>
        ['accepted', 'pending_assignment', 'assigned', 'picked_up', 'in_transit'].includes(r.status)
      );
      const completed = response.rows.filter((r) =>
        ['delivered', 'cancelled'].includes(r.status)
      );

      setDeliveryRequests(pending);
      setActiveDeliveries(active);
      setCompletedDeliveries(completed);
      setError(null);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const request = deliveryRequests.find((r) => r.$id === requestId);
      if (!request) return { success: false, error: 'Request not found' };

      const pickupCode = generatePickupCode();
      const dropoffOTP = generateOTP();

      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: requestId,
        data: { status: 'accepted', pickupCode, dropoffOTP },
      });

      setDeliveryRequests((prev) => prev.filter((r) => r.$id !== requestId));
      setActiveDeliveries((prev) => [...prev, response]);

      return { success: true, data: response, pickupCode, dropoffOTP };
    } catch (err) {
      console.error('Error accepting request:', err);
      return { success: false, error: err.message };
    }
  };

  const assignDelivery = async (deliveryId, driverId, driverName, driverPhone) => {
    try {
      const driverToken = generateDriverToken();

      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: { status: 'assigned', driverId, driverName, driverPhone, driverToken },
      });

      setActiveDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.$id === deliveryId ? { ...delivery, ...response } : delivery
        )
      );

      return { success: true, data: response };
    } catch (err) {
      console.error('Error assigning delivery:', err);
      return { success: false, error: err.message };
    }
  };

  const confirmPickup = async (deliveryId, enteredCode) => {
    try {
      const delivery = activeDeliveries.find((d) => d.$id === deliveryId);
      if (!delivery) return { success: false, error: 'Delivery not found' };

      if (delivery.pickupCode !== enteredCode.toUpperCase()) {
        return { success: false, error: 'Invalid pickup code' };
      }

      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: { status: 'picked_up' },
      });

      setActiveDeliveries((prev) =>
        prev.map((d) => (d.$id === deliveryId ? { ...d, ...response } : d))
      );

      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ── confirmDelivery — fixed driver status reset ───────────────────────────
  const confirmDelivery = async (deliveryId, enteredOTP) => {
    try {
      const delivery = activeDeliveries.find((d) => d.$id === deliveryId);
      if (!delivery) return { success: false, error: 'Delivery not found' };

      if (delivery.dropoffOTP !== enteredOTP) {
        return { success: false, error: 'Invalid OTP code' };
      }

      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: { status: 'delivered' },
      });

      // ← Use the injected callback to update driver state immediately
      if (delivery?.driverId && freeDriverFromDelivery) {
        await freeDriverFromDelivery(delivery.driverId, deliveryId);
      }

      setActiveDeliveries((prev) => prev.filter((d) => d.$id !== deliveryId));
      setCompletedDeliveries((prev) => [response, ...prev]);

      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ── updateDeliveryStatus — fixed driver status reset ─────────────────────
  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const delivery = activeDeliveries.find((d) => d.$id === deliveryId);

      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: { status: newStatus },
      });

      if (newStatus === 'delivered' || newStatus === 'cancelled') {
        // ← Use the injected callback instead of re-fetching the driver
        if (delivery?.driverId && freeDriverFromDelivery) {
          await freeDriverFromDelivery(delivery.driverId, deliveryId);
        }

        setActiveDeliveries((prev) => prev.filter((d) => d.$id !== deliveryId));
        setCompletedDeliveries((prev) => [response, ...prev]);
      } else {
        setActiveDeliveries((prev) =>
          prev.map((d) => (d.$id === deliveryId ? { ...d, ...response } : d))
        );
      }

      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    deliveryRequests,
    activeDeliveries,
    completedDeliveries,
    loading,
    error,
    acceptRequest,
    assignDelivery,
    confirmPickup,
    confirmDelivery,
    updateDeliveryStatus,
    refreshDeliveries: fetchActiveDeliveries,
  };
};
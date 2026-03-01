'use client';
import { useEffect, useState } from 'react';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';
import { generateOTP, generatePickupCode } from '@/hooks/otpGenerator';

export const useCourierDelivery = (userId) => {
  const [courier, setCourier] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourier = async () => {
    if (!userId) return null;

    const res = await tablesDB.listRows({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      queries: [
        Query.equal('userId', userId),
        Query.equal('role', 'courier'),
      ],
    });

    return res.rows?.[0] || null;
  };

  const fetchCourierDeliveries = async (courierId) => {
    console.log('Fetching for courierId:', courierId); 
  const assignedRes = await tablesDB.listRows({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
    queries: [
      Query.equal('assignedCourierId', courierId),
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ],
  });

  setDeliveries(assignedRes.rows || []);
};

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const courierProfile = await fetchCourier();
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

  const acceptRequest = async (requestId) => {
    try {
      const request = deliveries.find((r) => r.$id === requestId);
      if (!request)  return { success: false, error: 'Request not found' };
      if (!courier)  return { success: false, error: 'Courier profile not found' };

      const pickupCode = generatePickupCode();
      const dropoffOTP = generateOTP();

      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId:    process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId:      requestId,
        data: {
          status:            'accepted',
          assignedCourierId: courier.$id,
          pickupCode,
          dropoffOTP,
          driverName:  courier.userName,
          driverPhone: courier.phone ?? null,
        },
      });

      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.$id === requestId ? { ...delivery, ...response } : delivery
        )
      );

      return { success: true, data: response, pickupCode, dropoffOTP };
    } catch (err) {
      console.error('Error accepting request:', err);
      return { success: false, error: err.message };
    }
  };

  const confirmPickup = async (deliveryId, enteredCode) => {
    try {
      const delivery = deliveries.find((d) => d.$id === deliveryId);
      if (!delivery) return { success: false, error: 'Delivery not found' };

      if (delivery.pickupCode !== enteredCode.toUpperCase()) {
        return { success: false, error: 'Invalid pickup code' };
      }

      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId:    process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId:      deliveryId,
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

  const confirmDelivery = async (deliveryId, enteredOTP) => {
    try {
      const delivery = deliveries.find((d) => d.$id === deliveryId);
      if (!delivery) return { success: false, error: 'Delivery not found' };

      if (delivery.dropoffOTP !== enteredOTP) {
        return { success: false, error: 'Invalid OTP code' };
      }

      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId:    process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId:      deliveryId,
        data: {
          status:      'delivered',
          driverName:  null,
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

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId:    process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId:      deliveryId,
        data: { status: newStatus },
      });

      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.$id === deliveryId
            ? { ...delivery, ...response }
            : delivery
        )
      );

      return { success: true, data: response };
    } catch (err) {
      console.error('Error updating delivery status:', err);
      return { success: false, error: err.message };
    }
  };

  const refresh = async () => {
    if (!courier) return;
    await fetchCourierDeliveries(courier.$id);
  };

  return {
    courier,
    deliveries,
    loading,
    error,
    acceptRequest,
    confirmPickup,
    confirmDelivery,
    updateDeliveryStatus,
    refresh,
  };
};
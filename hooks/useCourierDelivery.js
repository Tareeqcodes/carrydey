'use client';
import { useEffect, useState } from 'react';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';

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
    if (!courierId) {
      setDeliveries([]);
      return;
    }

    const res = await tablesDB.listRows({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
      queries: [
        // IMPORTANT: remove prefix unless you are 100% sure it exists in DB
        Query.equal('assignedCourierId', courierId),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ],
    });

    setDeliveries(res.rows || []);
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

  const refresh = async () => {
    if (!courier) return;
    await fetchCourierDeliveries(courier.$id);
  };

  return {
    courier,
    deliveries,
    loading,
    error,
    refresh,
  };
};

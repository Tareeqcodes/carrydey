'use client';
import { useState, useEffect } from 'react';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';

export const useAgencyDeliveries = (userId) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agencyId, setAgencyId] = useState(null);

  const fetchUserAgency = async () => {
    if (!userId) {
      console.warn('No userId provided to useAgencyDeliveries');
      return null;
    }

    try {
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        queries: [Query.equal('userId', userId)],
      });

      if (response.rows && response.rows.length > 0) {
        return response.rows[0].$id;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user agency:', err);
      throw err;
    }
  };

  const fetchDeliveryRequests = async (fetchedAgencyId) => {
    if (!fetchedAgencyId) {
      console.log('No agency found for this user');
      setRequests([]);
      return;
    }

    try {
      const queries = [
        Query.equal('assignedAgencyId', fetchedAgencyId),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ];

      console.log('Fetching deliveries for agency:', fetchedAgencyId);

      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        queries: queries,
      });

      console.log('Appwrite response:', response);

      if (!response || !response.rows || response.rows.length === 0) {
        console.log('No deliveries found');
        setRequests([]);
        return;
      }

      console.log('Found deliveries:', response.rows);

      const transformedRequests = response.rows.map((doc) => ({
        id: doc.$id,
        pickup: doc.pickupAddress,
        dropoff: doc.dropoffAddress,
        distance: `${(doc.distance / 1000).toFixed(1)} km`,
        payout: `₦${doc.offeredFare || doc.suggestedFare}`,
        packageSize: doc.packageSize || 'Medium',
        sender: doc.pickupStoreName || doc.pickupContactName || 'Customer',
        status: doc.status,
        customerName: doc.dropoffContactName || 'Customer',
        customerPhone: doc.dropoffPhone || 'N/A',
        instructions: doc.dropoffInstructions || doc.pickupInstructions || '',
        assignedAgencyId: doc.assignedAgencyId,
        pickupContactName: doc.pickupContactName,
        pickupPhone: doc.pickupPhone,
        pickupStoreName: doc.pickupStoreName,
        pickupUnitFloor: doc.pickupUnitFloor,
        pickupOption: doc.pickupOption,
        pickupInstructions: doc.pickupInstructions,
        dropoffContactName: doc.dropoffContactName,
        dropoffStoreName: doc.dropoffStoreName,
        dropoffUnitFloor: doc.dropoffUnitFloor,
        dropoffOption: doc.dropoffOption,
        dropoffInstructions: doc.dropoffInstructions,
        recipientPermission: doc.recipientPermission,
        isFragile: doc.isFragile,
        packageDescription: doc.packageDescription,
        pickupTime: doc.pickupTime,
        pickupLat: doc.pickupLat,
        pickupLng: doc.pickupLng,
        dropoffLat: doc.dropoffLat,
        dropoffLng: doc.dropoffLng,
        duration: doc.duration,
        createdAt: doc.$createdAt,
      }));

      setRequests(transformedRequests);
    } catch (err) {
      console.error('Error fetching delivery requests:', err);
      setError(err.message);
    }
  };

  // Main effect to fetch agency and deliveries
  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First get the agency
        const fetchedAgencyId = await fetchUserAgency();
        setAgencyId(fetchedAgencyId);

        // Then get deliveries for that agency
        await fetchDeliveryRequests(fetchedAgencyId);
      } catch (err) {
        console.error('Error loading agency deliveries:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up polling to check for new requests every 30 seconds
    const interval = setInterval(() => {
      if (agencyId) {
        fetchDeliveryRequests(agencyId);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  const refreshRequests = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const fetchedAgencyId = agencyId || await fetchUserAgency();
      await fetchDeliveryRequests(fetchedAgencyId);
    } catch (err) {
      console.error('Error refreshing requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    loading,
    error,
    agencyId,
    refreshRequests,
  };
};
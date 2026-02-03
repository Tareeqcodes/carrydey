'use client';
import { useState, useEffect } from 'react';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';
import { generateOTP, generatePickupCode } from '@/hooks/otpGenerator';

export const useDeliveryManagement = (agencyId) => {
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (agencyId) {
      console.log('Fetching deliveries for agencyId:', agencyId);
      fetchActiveDeliveries();
    } else {
      console.log('No agencyId provided to useDeliveryManagement');
      setLoading(false);
    }
  }, [agencyId]);

  const fetchActiveDeliveries = async () => {
    // Validate agencyId before making the query
    if (!agencyId || typeof agencyId !== 'string') {
      console.error('Invalid agencyId:', agencyId);
      setError('Invalid agency ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Querying deliveries for agency:', agencyId);
      
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        queries: [
          Query.equal('assignedAgencyId', agencyId),
          Query.orderDesc('$createdAt'),
          Query.limit(100), // Fetch more to include history
        ],
      });

      console.log('Deliveries fetched:', response.rows?.length || 0);

      // Separate deliveries by status
      const pending = response.rows.filter(r => r.status === 'pending');
      const active = response.rows.filter(r => 
        ['accepted', 'pending_assignment', 'assigned', 'picked_up', 'in_transit'].includes(r.status)
      );
      const completed = response.rows.filter(r => 
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

  // Accept a delivery request and generate OTP codes
  const acceptRequest = async (requestId) => {
    try {
      const request = deliveryRequests.find((r) => r.$id === requestId);
      if (!request) return { success: false, error: 'Request not found' };

      // Generate codes
      const pickupCode = generatePickupCode();
      const dropoffOTP = generateOTP();

      // Update the delivery in Appwrite
      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: requestId,
        data: {
          status: 'accepted',
          pickupCode: pickupCode,
          dropoffOTP: dropoffOTP,
        }
      });

      // Update local state
      setDeliveryRequests(prev => prev.filter(r => r.$id !== requestId));
      setActiveDeliveries(prev => [...prev, response]);

      return { 
        success: true, 
        data: response,
        pickupCode,
        dropoffOTP
      };
    } catch (err) {
      console.error('Error accepting request:', err);
      return { success: false, error: err.message };
    }
  };

  // Assign delivery to a driver
  const assignDelivery = async (deliveryId, driverId, driverName, driverPhone) => {
    try {
      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          status: 'assigned',
          driverId: driverId,
          driverName: driverName,
          driverPhone: driverPhone,
        }
      });

      // Update local state
      setActiveDeliveries(prev =>
        prev.map(delivery =>
          delivery.$id === deliveryId
            ? { ...delivery, ...response }
            : delivery
        )
      );

      return { success: true, data: response };
    } catch (err) {
      console.error('Error assigning delivery:', err);
      return { success: false, error: err.message };
    }
  };

  // Confirm pickup with code
  const confirmPickup = async (deliveryId, enteredCode) => {
    try {
      const delivery = activeDeliveries.find(d => d.$id === deliveryId);
      if (!delivery) return { success: false, error: 'Delivery not found' };

      // Verify pickup code
      if (delivery.pickupCode !== enteredCode.toUpperCase()) {
        return { success: false, error: 'Invalid pickup code' };
      }

      // Update delivery status
      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          status: 'picked_up',
        }
      });

      setActiveDeliveries(prev =>
        prev.map(d =>
          d.$id === deliveryId
            ? { ...d, ...response }
            : d
        )
      );

      return { success: true, data: response };
    } catch (err) {
      console.error('Error confirming pickup:', err);
      return { success: false, error: err.message };
    }
  };

  // Confirm delivery with OTP
  const confirmDelivery = async (deliveryId, enteredOTP) => {
    try {
      const delivery = activeDeliveries.find(d => d.$id === deliveryId);
      if (!delivery) return { success: false, error: 'Delivery not found' };

      // Verify OTP
      if (delivery.dropoffOTP !== enteredOTP) {
        return { success: false, error: 'Invalid OTP code' };
      }

      // Update delivery status
      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          status: 'delivered',
        }
      });

      // Update driver status back to available
      if (delivery.driverId) {
        await tablesDB.updateRow({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
          rowId: delivery.driverId,
          data: {
            status: 'available',
            assignedDelivery: null,
          }
        });
      }

      // Move from active to completed
      setActiveDeliveries(prev => prev.filter(d => d.$id !== deliveryId));
      setCompletedDeliveries(prev => [response, ...prev]);

      return { success: true, data: response };
    } catch (err) {
      console.error('Error confirming delivery:', err);
      return { success: false, error: err.message };
    }
  };

  // Update delivery status (for driver updates)
  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          status: newStatus,
        }
      });

      // If status is delivered or cancelled, move to completed
      if (newStatus === 'delivered' || newStatus === 'cancelled') {
        setActiveDeliveries(prev => prev.filter(d => d.$id !== deliveryId));
        setCompletedDeliveries(prev => [response, ...prev]);
      } else {
        setActiveDeliveries(prev =>
          prev.map(delivery =>
            delivery.$id === deliveryId
              ? { ...delivery, ...response }
              : delivery
          )
        );
      }

      return { success: true, data: response };
    } catch (err) {
      console.error('Error updating delivery status:', err);
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
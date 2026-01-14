'use client';
import { useState, useEffect } from 'react';
import { databases, ID } from '@/lib/config/Appwriteconfig';

export default function useDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const agencyId = localStorage.getItem('agencyId');
      const driversList = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_DRIVERS_COLLECTION_ID,
        [Query.equal('agencyId', agencyId)]
      );
      setDrivers(driversList.documents);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (driverData) => {
    try {
      const agencyId = localStorage.getItem('agencyId');
      const newDriver = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_DRIVERS_COLLECTION_ID,
        ID.unique(),
        {
          ...driverData,
          agencyId,
          status: 'available',
          earningsToday: 0,
          deliveriesToday: 0,
          totalEarnings: 0,
          totalDeliveries: 0,
          createdAt: new Date().toISOString()
        }
      );

      // Also create driver account
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_DRIVER_ACCOUNTS_COLLECTION_ID,
        ID.unique(),
        {
          driverId: newDriver.$id,
          email: driverData.email,
          password: driverData.password, // Should be hashed
          role: 'driver',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      );

      setDrivers(prev => [...prev, newDriver]);
      return newDriver;
    } catch (error) {
      console.error('Error adding driver:', error);
      throw error;
    }
  };

  const assignDeliveryToDriver = async (deliveryId, driverId) => {
    try {
      // Update active delivery
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_ACTIVE_DELIVERIES_COLLECTION_ID,
        deliveryId,
        {
          driverId,
          driverName: drivers.find(d => d.$id === driverId)?.name,
          status: 'assigned',
          progress: 10,
          assignedAt: new Date().toISOString()
        }
      );

      // Update driver status
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_DRIVERS_COLLECTION_ID,
        driverId,
        {
          status: 'on_delivery',
          assignedDeliveryId: deliveryId,
          lastUpdate: new Date().toISOString()
        }
      );

      // Update delivery request
      const delivery = activeDeliveries.find(d => d.$id === deliveryId);
      if (delivery?.requestId) {
        await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_DELIVERY_REQUESTS_COLLECTION_ID,
          delivery.requestId,
          {
            status: 'assigned',
            driverId,
            assignedAt: new Date().toISOString()
          }
        );
      }

      return true;
    } catch (error) {
      console.error('Error assigning delivery:', error);
      return false;
    }
  };

  return {
    drivers,
    loading,
    addDriver,
    toggleDriverStatus,
    assignDeliveryToDriver,
    fetchDrivers
  };
}
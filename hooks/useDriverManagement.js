import { useState, useEffect } from 'react';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';

export const useDriverManagement = (agencyId) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch drivers from Appwrite
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        queries: [
          Query.equal('agencyId', agencyId),
          Query.orderDesc('$createdAt'),
        ]
      });
      setDrivers(response.rows || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching drivers:', err);
      setDrivers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agencyId) {
      fetchDrivers();
    }
  }, [agencyId]);

  // Add driver to Appwrite
  const addDriver = async (driverData) => {
    try {
      const newDriver = {
        agencyId,
        name: driverData.name,
        phone: driverData.phone,
        vehicleType: driverData.vehicleType || null,
        status: driverData.status || 'available',
        
        assignedDelivery: driverData.assignedDelivery || null,
      };

      const response = await tablesDB.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: ID.unique(),
        data: newDriver
      });
   
      setDrivers(prev => [...prev, response]);
      return { success: true, data: response };
    } catch (err) {
      console.error('Error adding driver:', err);
      return { success: false, error: err.message };
    }
  };

  const toggleDriverStatus = async (driverId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'available' ? 'offline' : 'available';
      
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
        data: { status: newStatus }
      });
     
      setDrivers(prev =>
        prev.map(driver =>
          driver.$id === driverId
            ? { ...driver, status: newStatus }
            : driver
        )
      );
    } catch (err) {
      console.error('Error updating driver status:', err);
    }
  };

  const assignDriverToDelivery = async (driverId, deliveryId) => {
    try {
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
        data: { 
          status: 'on_delivery',
          assignedDelivery: deliveryId 
        }
      });

      setDrivers(prev =>
        prev.map(driver =>
          driver.$id === driverId
            ? { 
                ...driver, 
                status: 'on_delivery',
                assignedDelivery: deliveryId 
              }
            : driver
        )
      );
    } catch (err) {
      console.error('Error assigning driver:', err);
    }
  };

  

  return {
    drivers,
    loading,
    error,
    addDriver,
    toggleDriverStatus,
    assignDriverToDelivery,
    fetchDrivers,
  };
};
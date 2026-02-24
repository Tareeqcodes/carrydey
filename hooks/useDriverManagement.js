import { useState, useEffect } from 'react';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';

export const useDriverManagement = (agencyId) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        queries: [
          Query.equal('agencyId', agencyId),
          Query.orderDesc('$createdAt'),
        ],
      });
      setDrivers(response.rows || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching drivers:', err);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agencyId) {
      fetchDrivers();
    }
  }, [agencyId]);

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
        data: newDriver,
      });
      setDrivers((prev) => [response, ...prev]);
      return { success: true, data: response };
    } catch (err) {
      console.error('Error adding driver:', err);
      return { success: false, error: err.message };
    }
  };

  // ── Update an existing driver 
  const updateDriver = async (driverId, driverData) => {
    try {
      const updatedFields = {
        name: driverData.name,
        phone: driverData.phone,
        vehicleType: driverData.vehicleType || null,
        // Never overwrite status or assignedDelivery from the edit form
      };
      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
        data: updatedFields,
      });
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.$id === driverId ? { ...driver, ...updatedFields } : driver
        )
      );
      return { success: true, data: response };
    } catch (err) {
      console.error('Error updating driver:', err);
      return { success: false, error: err.message };
    }
  };

  const toggleDriverStatus = async (driverId, currentStatus) => {
    try {
      if (currentStatus === 'on_delivery') {
        console.log('Cannot toggle status while driver is on delivery');
        return;
      }
      const newStatus = currentStatus === 'available' ? 'offline' : 'available';
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
        data: { status: newStatus },
      });
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.$id === driverId ? { ...driver, status: newStatus } : driver
        )
      );
    } catch (err) {
      console.error('Error updating driver status:', err);
    }
  };

  // ── Assign driver to a delivery 
  const assignDriverToDelivery = async (driverId, deliveryId) => {
  try {
    const driver = drivers.find(d => d.$id === driverId);
    const existing = driver?.assignedDelivery 
      ? driver.assignedDelivery.split(',').filter(Boolean) 
      : [];
    
    if (!existing.includes(deliveryId)) {
      existing.push(deliveryId);
    }

    const updatedAssigned = existing.join(',');

    await tablesDB.updateRow({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
      rowId: driverId,
      data: {
        status: 'on_delivery',
        assignedDelivery: updatedAssigned,
      },
    });

    setDrivers(prev =>
      prev.map(d =>
        d.$id === driverId
          ? { ...d, status: 'on_delivery', assignedDelivery: updatedAssigned }
          : d
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
    updateDriver,           
    toggleDriverStatus,
    assignDriverToDelivery,
    fetchDrivers,
  };
};
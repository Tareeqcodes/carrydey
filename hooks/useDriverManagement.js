import { useState, useEffect } from 'react';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { freeDriverFromDelivery as freeDriverUtil } from '@/utils/Driverutils';

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
    if (agencyId) fetchDrivers();
  }, [agencyId]);

  const addDriver = async (driverData) => {
    try {
      const newDriver = {
        agencyId,
        name: driverData.name,
        phone: driverData.phone,
        phoneType: driverData.phoneType || 'android',
        vehicleType: driverData.vehicleType || null,
        status: driverData.status || 'available',
        assignedDelivery: null,
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

  const updateDriver = async (driverId, driverData) => {
    try {
      const updatedFields = {
        name: driverData.name,
        phone: driverData.phone,
        phoneType: driverData.phoneType || 'android',
        vehicleType: driverData.vehicleType || null,
      };
      await tablesDB.updateRow({
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
      return { success: true };
    } catch (err) {
      console.error('Error updating driver:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteDriver = async (driverId) => {
    try {
      const driver = drivers.find((d) => d.$id === driverId);
      if (driver?.status === 'on_delivery') {
        return {
          success: false,
          error: 'Cannot delete a driver who has active deliveries. Complete or reassign their deliveries first.',
        };
      }
      await tablesDB.deleteRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
      });
      setDrivers((prev) => prev.filter((d) => d.$id !== driverId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting driver:', err);
      return { success: false, error: err.message };
    }
  };

  const toggleDriverStatus = async (driverId, currentStatus) => {
    try {
      if (currentStatus === 'on_delivery') return;
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

  // Always fetch fresh to avoid stale comma-list
  const assignDriverToDelivery = async (driverId, deliveryId) => {
    try {
      const freshDriver = await tablesDB.getRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
      });

      const existing = (freshDriver?.assignedDelivery ?? '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      if (!existing.includes(deliveryId)) existing.push(deliveryId);
      const updatedAssigned = existing.join(',');

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
        data: { status: 'on_delivery', assignedDelivery: updatedAssigned },
      });

      setDrivers((prev) =>
        prev.map((d) =>
          d.$id === driverId
            ? { ...d, status: 'on_delivery', assignedDelivery: updatedAssigned }
            : d
        )
      );
    } catch (err) {
      console.error('Error assigning driver:', err);
    }
  };

  // Uses shared util — same logic as DriverPortalPage
  const freeDriverFromDelivery = async (driverId, completedDeliveryId) => {
    try {
      const { newStatus, newAssigned } = await freeDriverUtil(driverId, completedDeliveryId);
      // Sync React state to match what was written to Appwrite
      setDrivers((prev) =>
        prev.map((d) =>
          d.$id === driverId
            ? { ...d, status: newStatus, assignedDelivery: newAssigned }
            : d
        )
      );
      return { success: true };
    } catch (err) {
      console.error('Error freeing driver:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    drivers,
    loading,
    error,
    addDriver,
    updateDriver,
    deleteDriver,
    freeDriverFromDelivery,
    toggleDriverStatus,
    assignDriverToDelivery,
    fetchDrivers,
  };
};
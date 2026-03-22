'use client';
import { useState, useEffect } from 'react';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { freeDriverFromDelivery as freeDriverUtil } from '@/utils/Driverutils';

// ── Shared SMS trigger util ────────────────────────────────────────────────────
export async function triggerDriverSMS(deliveryId, driverId) {
  const base = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(
    /\/v1\/?$/,
    ''
  );
  const functionId = process.env.NEXT_PUBLIC_APPWRITE_SMS_FUNCTION_ID;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (!functionId) return;
  try {
    await fetch(`${base}/v1/functions/${functionId}/executions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': projectId,
      },
      body: JSON.stringify({
        body: JSON.stringify({ deliveryId, driverId }),
        async: true,
      }),
    });
  } catch (e) {
    console.warn('SMS trigger failed (non-critical):', e.message);
  }
}

export const useDriverManagement = (agencyId) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState(null);

  const openAddModal = () => {
    setDriverToEdit(null);
    setModalOpen(true);
  };
  const openEditModal = (driver) => {
    setDriverToEdit(driver);
    setModalOpen(true);
  };
  const closeModal = () => {
    setDriverToEdit(null);
    setModalOpen(false);
  };

  const fetchDrivers = async () => {
    if (!agencyId) return;
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
      const response = await tablesDB.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: ID.unique(),
        data: {
          agencyId,
          name: driverData.name,
          phone: driverData.phone,
          phoneType: driverData.phoneType || 'android',
          vehicleType: driverData.vehicleType || null,
          status: driverData.status || 'available',
          assignedDelivery: null,
        },
      });
      setDrivers((prev) => [response, ...prev]);
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateDriver = async (driverId, driverData) => {
    try {
      const fields = {
        name: driverData.name,
        phone: driverData.phone,
        phoneType: driverData.phoneType || 'android',
        vehicleType: driverData.vehicleType || null,
      };
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
        data: fields,
      });
      setDrivers((prev) =>
        prev.map((d) => (d.$id === driverId ? { ...d, ...fields } : d))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleModalSubmit = async (driverData) => {
    const result = driverToEdit
      ? await updateDriver(driverToEdit.$id, driverData)
      : await addDriver(driverData);
    if (result.success) closeModal();
    return result;
  };

  const deleteDriver = async (driverId) => {
    try {
      const driver = drivers.find((d) => d.$id === driverId);
      if (driver?.status === 'on_delivery') {
        return {
          success: false,
          error: 'Cannot delete a driver with active deliveries.',
        };
      }
      await tablesDB.deleteRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
      });
      setDrivers((prev) => prev.filter((d) => d.$id !== driverId));
      closeModal();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleDriverStatus = async (driverId, currentStatus) => {
    if (currentStatus === 'on_delivery') return;
    const newStatus = currentStatus === 'available' ? 'offline' : 'available';
    try {
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
        data: { status: newStatus },
      });
      setDrivers((prev) =>
        prev.map((d) => (d.$id === driverId ? { ...d, status: newStatus } : d))
      );
    } catch (err) {
      console.error('Error toggling driver status:', err);
    }
  };

  const assignDriverToDelivery = async (driverId, deliveryId) => {
    try {
      const fresh = await tablesDB.getRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
      });
      const existing = (fresh?.assignedDelivery ?? '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
      if (!existing.includes(deliveryId)) existing.push(deliveryId);
      const updated = existing.join(',');

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
        rowId: driverId,
        data: { status: 'on_delivery', assignedDelivery: updated },
      });
      setDrivers((prev) =>
        prev.map((d) =>
          d.$id === driverId
            ? { ...d, status: 'on_delivery', assignedDelivery: updated }
            : d
        )
      );
    } catch (err) {
      console.error('Error assigning driver:', err);
    }
  };

  const freeDriverFromDelivery = async (driverId, completedDeliveryId) => {
    try {
      const { newStatus, newAssigned } = await freeDriverUtil(
        driverId,
        completedDeliveryId
      );
      setDrivers((prev) =>
        prev.map((d) =>
          d.$id === driverId
            ? { ...d, status: newStatus, assignedDelivery: newAssigned }
            : d
        )
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const formattedDrivers = drivers.map((d) => ({
    id: d.$id,
    name: d.name,
    phone: d.phone,
    phoneType: d.phoneType || 'android',
    status: d.status,
    assignedDelivery: d.assignedDelivery || null,
    vehicle: d.vehicleType
      ? d.vehicleType.charAt(0).toUpperCase() + d.vehicleType.slice(1)
      : 'No vehicle',
  }));

  return {
    // Data
    drivers,
    formattedDrivers,
    loading,
    error,
    addDriver,
    updateDriver,
    deleteDriver,
    toggleDriverStatus,
    assignDriverToDelivery,
    freeDriverFromDelivery,
    fetchDrivers,
    modalOpen,
    driverToEdit,
    openAddModal,
    openEditModal,
    closeModal,
    handleModalSubmit,
  };
};

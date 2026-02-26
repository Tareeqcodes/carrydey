import { tablesDB } from '@/lib/config/Appwriteconfig';

/**
 * Removes a completed delivery from a driver's assignedDelivery list.
 * Sets driver status to 'available' when the list becomes empty.
 *
 * Called from:
 *  - DriverPortalPage (handleConfirmDelivery)
 *  - useDeliveryManagement (confirmDelivery, updateDeliveryStatus)
 *
 * Always fetches fresh from Appwrite — never trusts local state.
 */
export async function freeDriverFromDelivery(driverId, completedDeliveryId) {
  // Fetch the absolute latest driver row from Appwrite
  const freshDriver = await tablesDB.getRow({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
    rowId: driverId,
  });

  const currentAssigned = freshDriver?.assignedDelivery ?? '';

  // Split, trim whitespace, filter out the completed delivery ID
  const remaining = currentAssigned
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0 && id !== completedDeliveryId.trim());

  const newStatus = remaining.length > 0 ? 'on_delivery' : 'available';
  // Use null — NOT empty string — so Appwrite actually clears the field
  const newAssigned = remaining.length > 0 ? remaining.join(',') : null;

  await tablesDB.updateRow({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
    rowId: driverId,
    data: {
      status: newStatus,
      assignedDelivery: newAssigned,
    },
  });

  return { newStatus, newAssigned };
}
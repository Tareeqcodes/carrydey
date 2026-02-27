import { tablesDB } from '@/lib/config/Appwriteconfig';

export async function freeDriverFromDelivery(driverId, completedDeliveryId) {
  
  const freshDriver = await tablesDB.getRow({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVER_COLLECTION_ID,
    rowId: driverId,
  });

  const currentAssigned = freshDriver?.assignedDelivery ?? '';

  const remaining = currentAssigned
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0 && id !== completedDeliveryId.trim());

  const newStatus = remaining.length > 0 ? 'on_delivery' : 'available';
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
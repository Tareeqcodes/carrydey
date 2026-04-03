'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tablesDB, ID } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import { BrandColorsProvider } from '@/hooks/BrandColors';
import VendorBookingPage from '@/components/VendorBookingPage';

const DEFAULT_BRAND = {
  primary: '#3A0A21',
  secondary: '#5A1A41',
  accent: '#FF6B35',
};

const APPWRITE_BASE = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(/\/v1\/?$/, '');
const PROJECT_ID    = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DISPATCH_FN   = process.env.NEXT_PUBLIC_DISPATCH_SEARCH_FUNCTION_ID;

/* ─────────────────────────────────────────────
   Fire-and-forget dispatch trigger per delivery
───────────────────────────────────────────── */
function triggerDispatch(deliveryId) {
  fetch(`${APPWRITE_BASE}/v1/functions/${DISPATCH_FN}/executions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
    },
    body: JSON.stringify({
      body: JSON.stringify({ deliveryId }),
      async: true,
    }),
  }).catch((e) => console.error(`dispatch-search failed for ${deliveryId}:`, e));
}

/* ─────────────────────────────────────────────
   Save / load vendorPickupAddress from USERS
───────────────────────────────────────────── */
async function loadVendorPickup(userId) {
  try {
    const row = await tablesDB.getRow({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      tableId:    process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      rowId:      userId,
    });
    if (row?.vendorPickupAddress) {
      return JSON.parse(row.vendorPickupAddress);
    }
  } catch { /* silent — field may not exist yet */ }
  return null;
}

async function saveVendorPickup(userId, address, loc) {
  try {
    await tablesDB.updateRow({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      tableId:    process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      rowId:      userId,
      data: {
        vendorPickupAddress: JSON.stringify({ address, loc }),
      },
    });
  } catch (e) {
    console.error('Failed to save vendorPickupAddress:', e);
  }
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function CreateVendorDelivery() {
  const router  = useRouter();
  const { user } = useAuth();
  const [loading,      setLoading]      = useState(false);
  const [savedPickup,  setSavedPickup]  = useState(null);
  const [hydrated,     setHydrated]     = useState(false);

  /* Load saved store address on mount */
  useEffect(() => {
    if (!user) { setHydrated(true); return; }
    loadVendorPickup(user.$id).then((saved) => {
      if (saved) setSavedPickup(saved);
      setHydrated(true);
    });
  }, [user]);

  /* Redirect to login — must live in useEffect, never during render */
  

  /* ── Main confirm handler ── */
  const handleConfirmed = async ({
    pickupLoc,
    pickupAddress,
    recipients,
    packageDetails,
    paymentMethod,
  }) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      /* Persist store address for future sessions */
      await saveVendorPickup(user.$id, pickupAddress, pickupLoc);

      /* Shared batch ID — links all deliveries from this dispatch */
      const batchId = ID.unique();

      /* Create one delivery document per recipient in parallel */
      const createPromises = recipients.map(async (recipient) => {
        const deliveryId = ID.unique();
        const routeData  = recipient.routeData;

        await tablesDB.createRow({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId:    process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
          rowId:      deliveryId,
          data: {
            /* Pickup */
            pickupAddress:     pickupAddress.substring(0, 500),
            pickupLat:         pickupLoc.geometry.coordinates[1],
            pickupLng:         pickupLoc.geometry.coordinates[0],
            pickupContactName: packageDetails?.pickupContact?.pickupContactName?.substring(0, 100) ?? null,
            pickupPhone:       packageDetails?.pickupContact?.pickupPhone?.substring(0, 20) ?? null,
            pickupInstructions: null,
            pickupTime:        packageDetails?.pickupTime?.substring(0, 500) || 'courier',

            /* Dropoff */
            dropoffAddress:    (recipient.location?.place_name || recipient.address || '').substring(0, 500),
            dropoffLat:        recipient.location?.geometry?.coordinates[1] ?? null,
            dropoffLng:        recipient.location?.geometry?.coordinates[0] ?? null,
            dropoffContactName:(recipient.recipientName || '').substring(0, 100) || null,
            dropoffPhone:      (recipient.recipientPhone || '').substring(0, 20) || null,
            dropoffInstructions:(recipient.orderRef || '').substring(0, 1000) || null,
            recipientPermission: null,

            /* Route */
            distance: routeData ? parseFloat(routeData.distance) : 0,
            duration: routeData ? parseInt(routeData.duration)   : 0,

            /* Package */
            packageSize:        packageDetails?.size?.substring(0, 50) ?? null,
            packageDescription: packageDetails?.description?.substring(0, 500) ?? null,
            isFragile:          packageDetails?.isFragile ?? false,

            /* Fare */
            offeredFare:             parseInt(routeData?.estimatedFare || 0),
            paymentMethod:           paymentMethod ?? null,
            isLongDistance:          false,
            pricingProvidedAtBooking: true,

            /* Status & ownership */
            status:             'pending',
            userId:             user.$id,
            assignedAgencyId:   null,
            assignedCourierId:  null,
            pickupCode:         null,
            dropoffOTP:         null,
            driverName:         null,
            driverPhone:        null,
            driverId:           null,
            driverToken:        null,
            trackingToken:      null,

            /* Guest fields — not used for vendor */
            isGuestBooking: false,
            guestName:      null,
            guestEmail:     null,
            guestPhone:     null,

            /* Vendor metadata */
            isVendorBatch:  true,
            batchId:        batchId,
            orderRef:       (recipient.orderRef || '').substring(0, 100) || null,
            mutipledropoff: null,
          },
        });

        return deliveryId;
      });

      const deliveryIds = await Promise.all(createPromises);

      /* Store the first delivery ID for /check page */
      sessionStorage.setItem('latestDeliveryId', deliveryIds[0]);
      /* Store the full batch so /check can show all orders */
      sessionStorage.setItem('vendorBatchIds', JSON.stringify(deliveryIds));

      /* Trigger dispatch-search for each delivery (fire and forget) */
      deliveryIds.forEach(triggerDispatch);

      router.push('/check');
    } catch (error) {
      console.error('Vendor batch creation error:', error);
      alert(`Error creating deliveries: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* Loading skeleton */
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrandColorsProvider initialColors={DEFAULT_BRAND}>
      <VendorBookingPage
        savedPickup={savedPickup}
        loading={loading}
        onConfirmed={handleConfirmed}
      />
    </BrandColorsProvider>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tablesDB, ID } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import { BrandColorsProvider } from '@/hooks/BrandColors';
import DeliveryBookingPage from '@/components/DeliveryBookingPage';

const DEFAULT_BRAND = {
  primary: '#3A0A21',
  secondary: '#5A1A41',
  accent: '#8B2E5A',
};

export default function CreateDelivery() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [initialPickup, setInitialPickup] = useState(null);
  const [initialDropoff, setInitialDropoff] = useState(null);
  const [initialRouteData, setInitialRouteData] = useState(null);

  // ── Gate: don't render DeliveryBookingPage until session data is restored ──
  // This prevents InputLocation from mounting with null props before we've had
  // a chance to read sessionStorage — which caused the pre-fill race condition.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('deliveryData');
      if (stored) {
        const { pickup, dropoff, routeData } = JSON.parse(stored);
        if (pickup) setInitialPickup(pickup);
        if (dropoff) setInitialDropoff(dropoff);
        if (routeData) setInitialRouteData(routeData);
        sessionStorage.removeItem('deliveryData');
      }
    } catch (e) {
      console.error('Error restoring delivery data', e);
    } finally {
      // Always mark as hydrated — even if nothing was in storage
      setHydrated(true);
    }
  }, []);

  const handleConfirmed = async (
    packageDetails,
    fareDetails,
    pickup,
    dropoff,
    routeData
  ) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const deliveryId = ID.unique();
      await tablesDB.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          pickupAddress:
            pickup.place_name?.substring(0, 500) || 'Pickup location',
          pickupLat: pickup.geometry.coordinates[1],
          pickupLng: pickup.geometry.coordinates[0],
          dropoffAddress:
            dropoff.place_name?.substring(0, 500) || 'Dropoff location',
          dropoffLat: dropoff.geometry.coordinates[1],
          dropoffLng: dropoff.geometry.coordinates[0],
          distance: parseFloat(routeData.distance),
          duration: parseInt(routeData.duration),
          status: 'pending',
          pickupContactName: packageDetails?.pickupContact?.pickupContactName,
          pickupPhone: packageDetails?.pickupContact?.pickupPhone,
          dropoffContactName: packageDetails?.dropoffContact?.dropoffContactName,
          dropoffPhone: packageDetails?.dropoffContact?.dropoffPhone,
          dropoffInstructions: packageDetails?.dropoffContact?.dropoffInstructions,
          recipientPermission: packageDetails?.dropoffContact?.recipientPermission,
          offeredFare: parseInt(fareDetails.offeredFare || 0),
          packageSize: packageDetails?.size,
          packageDescription: packageDetails?.description,
          isFragile: packageDetails?.isFragile || false,
          pickupTime: packageDetails?.pickupTime || 'courier',
          userId: user.$id,
          assignedAgencyId: null,
          paymentMethod: fareDetails.paymentMethod,
          isLongDistance: fareDetails.isLongDistance || false,
        },
      });

      sessionStorage.setItem('latestDeliveryId', deliveryId);
      router.push('/check');
    } catch (error) {
      console.error('Error saving delivery:', error);
      alert(`Error creating delivery: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Don't render until sessionStorage has been read ───────────────────────
  // A minimal spinner so the page doesn't flash blank
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrandColorsProvider initialColors={DEFAULT_BRAND}>
      <div className="min-h-screen bg-gray-50">
        <DeliveryBookingPage
          isAgencyBooking={false}
          showPricing={true}
          loading={loading}
          onConfirmed={handleConfirmed}
          initialPickup={initialPickup}
          initialDropoff={initialDropoff}
          initialRouteData={initialRouteData}
        />
      </div>
    </BrandColorsProvider>
  );
}
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
      setHydrated(true);
    }
  }, []);

  const handleConfirmed = async (
    packageDetails,
    fareDetails,
    pickup,
    dropoffs,
    routeData
  ) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const safeDropoffs = dropoffs?.length ? dropoffs : [];
    const primary = safeDropoffs[0] ?? {};

    setLoading(true);
    try {
      const deliveryId = ID.unique();

      await tablesDB.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          // ── Pickup ──────────────────────────────────────────────────────
          pickupAddress:
            pickup.place_name?.substring(0, 500) || 'Pickup location',
          pickupLat: pickup.geometry.coordinates[1],
          pickupLng: pickup.geometry.coordinates[0],
          pickupContactName:
            packageDetails?.pickupContact?.pickupContactName?.substring(
              0,
              100
            ) ?? null,
          pickupPhone:
            packageDetails?.pickupContact?.pickupPhone?.substring(0, 20) ??
            null,
          pickupInstructions: null,
          pickupTime:
            packageDetails?.pickupTime?.substring(0, 500) || 'courier',

          dropoffAddress: (
            primary.location?.place_name ||
            primary.address ||
            ''
          ).substring(0, 500),
          dropoffLat: primary.location?.geometry?.coordinates[1] ?? null,
          dropoffLng: primary.location?.geometry?.coordinates[0] ?? 0,
          dropoffContactName:
            (primary.recipientName || '').substring(0, 100) || null,
          dropoffPhone: (primary.recipientPhone || '').substring(0, 20) || null,
          dropoffInstructions:
            (primary.packageLabel || '').substring(0, 1000) || null,
          recipientPermission:
            packageDetails?.dropoffContact?.recipientPermission ?? null,
          distance: parseFloat(routeData.distance),
          duration: parseInt(routeData.duration),
          packageSize: packageDetails?.size?.substring(0, 50) ?? null,
          packageDescription:
            packageDetails?.description?.substring(0, 500) ?? null,
          isFragile: packageDetails?.isFragile ?? false,
          offeredFare: parseInt(fareDetails.offeredFare || 0),
          paymentMethod: fareDetails.paymentMethod ?? null,
          isLongDistance: fareDetails.isLongDistance ?? false,
          pricingProvidedAtBooking: true,
          status: 'pending',
          userId: user.$id,
          assignedAgencyId: null,
          assignedCourierId: null, 
          pickupCode: null, 
          dropoffOTP: null, 
          driverName: null,
          driverPhone: null,
          driverId: null,
          driverToken: null,
          trackingToken: null,
          isGuestBooking: false,
          guestName: null,
          guestEmail: null,
          guestPhone: null,
          mutipledropoff: JSON.stringify(
            safeDropoffs.map((d, i) => ({
              idx: i,
              dropoffAddress: (
                d.location?.place_name ||
                d.address ||
                ''
              ).substring(0, 500),
              // dropoffLat: d.location?.geometry?.coordinates[1] ?? null,
              // dropoffLng: d.location?.geometry?.coordinates[0] ?? null,
  
              // dropoffCode: null, 
              // status: 'pending',
            }))
          ),
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

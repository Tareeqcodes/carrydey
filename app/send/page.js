'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { tablesDB, ID } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import { BrandColorsProvider } from '@/hooks/BrandColors';
import DeliveryBookingPage from '@/components/DeliveryBookingPage';
import VendorBookingPage from '@/components/VendorBookingPage';

const DEFAULT_BRAND = {
  primary: '#3A0A21',
  secondary: '#5A1A41',
  accent: '#FF6B35',
};

const APPWRITE_BASE = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(
  /\/v1\/?$/,
  ''
);
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DISPATCH_FN = process.env.NEXT_PUBLIC_DISPATCH_SEARCH_FUNCTION_ID;

function triggerDispatch(deliveryId) {
  fetch(`${APPWRITE_BASE}/v1/functions/${DISPATCH_FN}/executions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
    },
    body: JSON.stringify({ body: JSON.stringify({ deliveryId }), async: true }),
  }).catch((e) =>
    console.error(`dispatch-search failed for ${deliveryId}:`, e)
  );
}

/* ─── Tab strip */
function TabStrip({ active, onChange }) {
  const tabs = [
    { id: 'individual', label: 'Send a package' },
    { id: 'vendor', label: 'Batch orders' },
  ];
  return (
    <div className="relative flex border-b" style={{ borderColor: '#ede8e6' }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex-1 py-3 text-sm transition-colors duration-150 focus:outline-none"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#3A0A21' : '#aaa',
            }}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: '#3A0A21', borderRadius: 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function PageHeader({ tab, onTabChange }) {
  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-0">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 tracking-tight">
        New <em>delivery</em>
      </h1>
      <TabStrip active={tab} onChange={onTabChange} />
    </div>
  );
}

/* Page  */
export default function SendPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [tab, setTab] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  // savedPickup is loaded async — VendorBookingPage handles late arrival via useEffect
  const [savedPickup, setSavedPickup] = useState(null);

  const [initialPickup, setInitialPickup] = useState(null);
  const [initialDropoff, setInitialDropoff] = useState(null);
  const [initialRouteData, setInitialRouteData] = useState(null);

  /* Hydrate tab + restore any in-progress delivery from sessionStorage */
  useEffect(() => {
    const saved = localStorage.getItem('sendTab');
    setTab(saved === 'vendor' ? 'vendor' : 'individual');

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
    }

    setHydrated(true);
  }, []);

  /* Auto-submit pending delivery after post-login redirect */
  useEffect(() => {
    if (!user || !hydrated) return;
    const raw = localStorage.getItem('pendingDelivery');
    if (!raw) return;

    let snapshot;
    try {
      snapshot = JSON.parse(raw);
    } catch {
      localStorage.removeItem('pendingDelivery');
      localStorage.removeItem('postAuthRedirect');
      return;
    }

    localStorage.removeItem('pendingDelivery');
    localStorage.removeItem('postAuthRedirect');

    const { pickup, dropoffs, routeData, packageDetails, fareDetails } =
      snapshot;
    if (!pickup || !routeData || !packageDetails) return;

    handleIndividualConfirmed(
      packageDetails,
      {
        offeredFare: fareDetails?.offeredFare ?? 0,
        paymentMethod: fareDetails?.paymentMethod ?? null,
        isLongDistance: fareDetails?.isLongDistance ?? false,
        fareMode: fareDetails?.fareMode ?? null,
      },
      pickup,
      dropoffs ?? [],
      routeData
    );
  }, [user, hydrated]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    localStorage.setItem('sendTab', newTab);
  };

  /* Individual booking confirm */
  const handleIndividualConfirmed = async (
    packageDetails,
    fareDetails,
    pickup,
    dropoffs,
    routeData
  ) => {
    if (!user) {
      localStorage.setItem(
        'pendingDelivery',
        JSON.stringify({
          pickup,
          dropoffs,
          routeData,
          packageDetails,
          fareDetails,
        })
      );
      localStorage.setItem('postAuthRedirect', '/send');
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
            }))
          ),
        },
      });

      sessionStorage.setItem('latestDeliveryId', deliveryId);
      triggerDispatch(deliveryId);
      router.push('/check');
    } catch (error) {
      console.error('Error saving delivery:', error);
      alert(`Error creating delivery: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorConfirmed = async ({
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
      const batchId = ID.unique();

      const deliveryIds = await Promise.all(
        recipients.map(async (recipient) => {
          const deliveryId = ID.unique();

          await tablesDB.createRow({
            databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
            rowId: deliveryId,
            data: {
              pickupAddress: pickupAddress.substring(0, 500),
              pickupLat: pickupLoc.geometry.coordinates[1],
              pickupLng: pickupLoc.geometry.coordinates[0],
              pickupContactName:
                packageDetails?.pickupContact?.pickupContactName?.substring(
                  0,
                  100
                ) ?? null,
              pickupPhone:
                packageDetails?.pickupContact?.pickupPhone?.substring(0, 20) ??
                null,
              // pickupTime:
              //   packageDetails?.pickupTime?.substring(0, 500) || 'courier',
              dropoffAddress: (recipient.area || '').substring(0, 500),
              dropoffLat: null,
              dropoffLng: null,
              dropoffContactName:
                (recipient.recipientName || '').substring(0, 100) || null,
              dropoffPhone:
                (recipient.recipientPhone || '').substring(0, 20) || null,
              dropoffInstructions:
                (recipient.orderRef || '').substring(0, 1000) || null,
              distance: 0,
              duration: 0,

              /* Package */
              packageSize: packageDetails?.size?.substring(0, 50) ?? null,
              packageDescription:
                packageDetails?.description?.substring(0, 500) ?? null,
              isFragile: packageDetails?.isFragile ?? false,

              offeredFare: 0,
              paymentMethod: paymentMethod ?? null,
              isLongDistance: false,
              pricingProvidedAtBooking: false,

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

              isVendorBatch: true,
              batchId: batchId,
              orderRef: (recipient.orderRef || '').substring(0, 100) || null,
              mutipledropoff: null,
            },
          });

          return deliveryId;
        })
      );

      sessionStorage.setItem('latestDeliveryId', deliveryIds[0]);
      sessionStorage.setItem('vendorBatchIds', JSON.stringify(deliveryIds));
      deliveryIds.forEach(triggerDispatch);
      router.push('/check');
    } catch (error) {
      console.error('Vendor batch creation error:', error);
      alert(`Error creating deliveries: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* Spinner while hydrating */
  if (!hydrated || tab === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#faf9f7' }}
      >
        <div
          className="w-5 h-5 rounded-full animate-spin"
          style={{ border: '2px solid #3A0A21', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <BrandColorsProvider initialColors={DEFAULT_BRAND}>
      <div className="min-h-screen" style={{ background: '#faf9f7' }}>
        <PageHeader tab={tab} onTabChange={handleTabChange} />

        <AnimatePresence mode="wait">
          {tab === 'individual' && (
            <motion.div
              key="individual"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <DeliveryBookingPage
                isAgencyBooking={false}
                showPricing={true}
                loading={loading}
                onConfirmed={handleIndividualConfirmed}
                initialPickup={initialPickup}
                initialDropoff={initialDropoff}
                initialRouteData={initialRouteData}
                hideHeader
              />
            </motion.div>
          )}

          {tab === 'vendor' && (
            <motion.div
              key="vendor"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <VendorBookingPage
                loading={loading}
                onConfirmed={handleVendorConfirmed}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BrandColorsProvider>
  );
}

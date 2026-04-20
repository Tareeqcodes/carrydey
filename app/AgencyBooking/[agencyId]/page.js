'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { BrandColorsProvider } from '@/hooks/BrandColors';
import {
  AgencyPricingProvider,
  parseAgencyPricing,
} from '@/hooks/Agencypricing';
import Closedagencymodal from '@/components/Agencytrack/Closedagencymodal';
import DeliveryBookingPage from '@/components/DeliveryBookingPage';

function checkAvailability(agencyData) {
  if (!agencyData?.operationalHours) return { isOpen: true, message: '' };
  let hours;
  try {
    hours = JSON.parse(agencyData.operationalHours);
  } catch {
    return { isOpen: true, message: '' };
  }
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const day = hours[dayName];
  if (!day?.open)
    return { isOpen: false, message: `Closed today (${dayName})` };
  const [fh, fm] = day.from.split(':').map(Number);
  const [th, tm] = day.to.split(':').map(Number);
  if (nowMin < fh * 60 + fm)
    return { isOpen: false, message: `Opens today at ${day.from}` };
  if (nowMin >= th * 60 + tm) {
    const DAYS = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const idx = DAYS.indexOf(dayName);
    let nextMsg = '';
    for (let i = 1; i <= 7; i++) {
      const next = DAYS[(idx + i) % 7];
      if (hours[next]?.open) {
        nextMsg = `${next} at ${hours[next].from}`;
        break;
      }
    }
    return {
      isOpen: false,
      message: `Closed for today${nextMsg ? `. Opens ${nextMsg}` : ''}`,
    };
  }
  return { isOpen: true, message: `Open until ${day.to}` };
}

export default function AgencyBookingPage() {
  const params = useParams();
  const router = useRouter();
  const agencyId = params.agencyId;

  const [agency, setAgency] = useState(null);
  const [agencyPricing, setAgencyPricing] = useState(null);
  const [showPricing, setShowPricing] = useState(true);
  const [availability, setAvailability] = useState({
    isOpen: true,
    message: '',
  });
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [brandColors, setBrandColors] = useState({
     primary: '#00C896',
    secondary: '#00E5AD',
    accent: '#00C896',
  });
  const [loadingAgency, setLoadingAgency] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAgencyDetails();
  }, [agencyId]);

  const fetchAgencyDetails = async () => {
    try {
      setLoadingAgency(true);
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        queries: [Query.equal('$id', agencyId)],
      });
      if (response.rows.length > 0) {
        const data = response.rows[0];
        setAgency(data);
        if (data.brandColors) {
          try {
            setBrandColors(JSON.parse(data.brandColors));
          } catch {}
        }
        setAgencyPricing(parseAgencyPricing(data));
        setShowPricing(data.showPricing ?? true);
        const avail = checkAvailability(data);
        setAvailability(avail);
        if (!avail.isOpen) setShowClosedModal(true);
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Error fetching agency:', err);
    } finally {
      setLoadingAgency(false);
    }
  };

  const handleConfirmed = async (
    packageDetails,
    fareDetails,
    pickup,
    dropoffs,
    routeData,
    guestInfo
  ) => {
    if (!pickup || !dropoffs?.length || !routeData) return;

    const primary = dropoffs[0];

    setLoading(true);
    try {
      const deliveryId = ID.unique();
      const trackingToken = ID.unique();
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
            (primary.location?.place_name || primary.address || '').substring(
              0,
              500
            ) || 'Dropoff location',
          dropoffLat: primary.location?.geometry?.coordinates[1] ?? null,
          dropoffLng: primary.location?.geometry?.coordinates[0] ?? null,
          distance: parseFloat(routeData.distance),
          duration: parseInt(routeData.duration),
          status: 'pending',
          dropoffPhone:
            guestInfo?.dropoffPhone ||
            packageDetails?.dropoffContact?.dropoffPhone,
          dropoffInstructions:
            packageDetails?.dropoffContact?.dropoffInstructions,
         
          offeredFare: fareDetails?.offeredFare
            ? parseInt(fareDetails.offeredFare)
            : null,
          packageSize: packageDetails?.size,
          packageDescription: packageDetails?.description,
          isFragile: packageDetails?.isFragile || false,
          pickupTime: packageDetails?.pickupTime || 'courier',
          guestName: guestInfo?.name,
          isGuestBooking: true,
          guestPhone: guestInfo?.phone,
          assignedAgencyId: agencyId,
          userId: null,
          trackingToken,
          pricingProvidedAtBooking: showPricing,
        },
      });
      router.push(`/bookconfirm/${deliveryId}?token=${trackingToken}`);
    } catch (err) {
      console.error('Error saving delivery:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingAgency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#3A0A21] animate-spin" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            Loading booking page...
          </p>
        </motion.div>
      </div>
    );
  }

  /* ── not found ── */
  if (!agency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            Agency Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            This booking link is invalid or has expired.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] text-white rounded-2xl font-semibold hover:shadow-xl transition-all"
          >
            Go to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ── main ── */
  return (
    <BrandColorsProvider initialColors={brandColors}>
      <AgencyPricingProvider pricing={agencyPricing}>
        <Closedagencymodal
          isOpen={showClosedModal}
          onDismiss={() => setShowClosedModal(false)}
          agencyName={agency.name}
          message={availability.message}
          brandColors={brandColors}
          logoUrl={agency.logoUrl}
        />
        <DeliveryBookingPage
          isAgencyBooking
          agency={agency}
          availability={availability}
          showPricing={showPricing}
          loading={loading}
          onConfirmed={handleConfirmed}
        />
      </AgencyPricingProvider>
    </BrandColorsProvider>
  );
}

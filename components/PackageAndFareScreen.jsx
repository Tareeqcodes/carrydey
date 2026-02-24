'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import {
  useFareCalculator,
  useAgencyFareCalculator,
} from '@/hooks/useFareCalculator';
import { usePackageValidation } from '@/hooks/usePackageValidation';
import DeliverySummaryCard from '@/components/PackageAndFare/DeliverySummaryCard';
import PackageSection from '@/components/PackageAndFare/PackageSection';
import FareSection from '@/components/PackageAndFare/FareSection';
import PickupOptions from '@/components/PackageAndFare/PickupOptions';
import StickyConfirmBar from '@/components/PackageAndFare/StickyConfirmBar';
import PaymentSection from './PackageAndFare/PaymentSection';

// ─── Inner component that calls the correct fare hook ────────────────────────
// Hooks must be called unconditionally, so we split into two tiny wrappers
// that each call one hook and render the shared UI.

function Screen({ delivery, onPackageConfirmed, loading, onBack, fareHook }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [packageDetails, setPackageDetails] = useState({
    size: '',
    weight: '', // make sure weight is tracked
    description: '',
    isFragile: false,
    pickupTime: 'courier',
    pickupContact: {
      pickupContactName: '',
      pickupPhone: '',
      pickupStoreName: '',
      pickupUnitFloor: '',
      pickupOption: 'curb',
      pickupInstructions: '',
    },
    dropoffContact: {
      dropoffContactName: '',
      dropoffPhone: '',
      dropoffStoreName: '',
      dropoffUnitFloor: '',
      dropoffOption: 'door',
      dropoffInstructions: '',
      recipientPermission: false,
    },
  });

  const [fareDetails, setFareDetails] = useState({
    offeredFare: 0,
    paymentMethod: '',
  });

  // ← the hook (platform or agency) is injected from outside
  const suggestedFare = fareHook(packageDetails, delivery.routeData);
  const fareFloor = Math.round(suggestedFare * 0.15);
  const { isValid, errors } = usePackageValidation(
    packageDetails,
    fareDetails,
    fareFloor
  );

  useEffect(() => {
    setFareDetails((prev) => ({
      ...prev,
      offeredFare:
        prev.offeredFare === 0
          ? suggestedFare
          : Math.max(prev.offeredFare, suggestedFare),
    }));
  }, [suggestedFare]);

  const handleConfirm = () => {
    if (!isValid) return;
    onPackageConfirmed(packageDetails, {
      suggestedFare,
      offeredFare: fareDetails.offeredFare,
      paymentMethod: fareDetails.paymentMethod,
    });
  };

  return (
    <div className="min-h-screen bg-white max-w-md pb-28 md:pb-0 mx-auto">
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-6">
        <div className="flex items-start gap-3 px-5">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">New delivery</h1>
        </div>

        <DeliverySummaryCard
          delivery={delivery}
          pickupContact={packageDetails.pickupContact}
          dropoffContact={packageDetails.dropoffContact}
          onPickupContactChange={(c) =>
            setPackageDetails((p) => ({ ...p, pickupContact: c }))
          }
          onDropoffContactChange={(c) =>
            setPackageDetails((p) => ({ ...p, dropoffContact: c }))
          }
        />

        <PackageSection
          packageDetails={packageDetails}
          onPackageDetailChange={(k, v) =>
            setPackageDetails((p) => ({ ...p, [k]: v }))
          }
          errors={errors}
        />

        <PickupOptions
          packageDetails={packageDetails}
          onPackageDetailChange={(k, v) =>
            setPackageDetails((p) => ({ ...p, [k]: v }))
          }
        />

        <FareSection
          fareDetails={fareDetails}
          onFareChange={(offeredFare) =>
            setFareDetails((p) => ({ ...p, offeredFare }))
          }
          suggestedFare={suggestedFare}
          fareFloor={fareFloor}
          errors={errors}
        />

        <PaymentSection
          paymentMethod={fareDetails.paymentMethod}
          onPaymentMethodChange={(method) =>
            setFareDetails((p) => ({ ...p, paymentMethod: method }))
          }
          errors={errors}
        />
      </div>

      <StickyConfirmBar
        isValid={isValid}
        loading={loading}
        errors={errors}
        fareDetails={fareDetails}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

// ─── Platform variant (CreateDelivery — logged-in users) ─────────────────────
function PlatformScreen(props) {
  // useFareCalculator is called inside Screen via the injected fareHook
  return <Screen {...props} fareHook={useFareCalculator} />;
}

// ─── Agency variant (AgencyBookingPage — reads pricing from context) ──────────
function AgencyScreen(props) {
  return <Screen {...props} fareHook={useAgencyFareCalculator} />;
}

// ─── Public export — single component, switches variant via prop ──────────────
export default function PackageAndFareScreen({
  isAgencyBooking = false,
  ...props
}) {
  return isAgencyBooking ? (
    <AgencyScreen {...props} />
  ) : (
    <PlatformScreen {...props} />
  );
}

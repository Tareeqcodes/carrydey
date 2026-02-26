'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, Phone } from 'lucide-react';
import {
  useFareCalculator,
  useAgencyFareCalculator,
} from '@/hooks/useFareCalculator';
import { usePackageValidation } from '@/hooks/usePackageValidation';
import { useBrandColors } from '@/hooks/BrandColors';
import DeliverySummaryCard from '@/components/PackageAndFare/DeliverySummaryCard';
import PackageSection from '@/components/PackageAndFare/PackageSection';
import FareSection from '@/components/PackageAndFare/FareSection';
import PickupOptions from '@/components/PackageAndFare/PickupOptions';
import StickyConfirmBar from '@/components/PackageAndFare/StickyConfirmBar';
import PaymentSection from './PackageAndFare/PaymentSection';

function AgencyPriceContactCard() {
  const { brandColors } = useBrandColors();

  return (
    <section>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Fare
      </p>
      <div
        className="rounded-2xl border border-dashed bg-gray-50 px-5 py-6 flex gap-4 items-start"
        style={{ borderColor: `${brandColors.primary}40` }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
            boxShadow: `0 4px 14px ${brandColors.primary}30`,
          }}
        >
          <Phone className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">
            The agency will contact you with the price
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            This agency sets pricing manually. After you confirm your booking
            details, they will reach out to discuss and agree on a fare before
            your delivery is dispatched.
          </p>
        </div>
      </div>
    </section>
  );
}

function Screen({
  delivery,
  onPackageConfirmed,
  loading,
  onBack,
  fareHook,
  showPricing = true,
}) {
  const { brandColors } = useBrandColors();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [packageDetails, setPackageDetails] = useState({
    size: '',
    description: '',
    isFragile: false,
    pickupTime: 'courier',
    pickupContact: {
      pickupContactName: '',
      pickupPhone: '',
    },
    dropoffContact: {
      dropoffContactName: '',
      dropoffPhone: '',
      dropoffInstructions: '',
      recipientPermission: false,
    },
  });

  const [fareDetails, setFareDetails] = useState({
    offeredFare: 0,
    paymentMethod: '',
  });

  const suggestedFare = fareHook(packageDetails, delivery.routeData);
  const fareFloor = Math.round(suggestedFare * 0.5);
  const { isValid, errors } = usePackageValidation(
    packageDetails,
    fareDetails,
    fareFloor,
    showPricing
  );

  useEffect(() => {
    if (!showPricing) return;
    setFareDetails((prev) => ({
      ...prev,
      offeredFare:
        prev.offeredFare === 0
          ? suggestedFare
          : Math.max(prev.offeredFare, suggestedFare),
    }));
  }, [suggestedFare, showPricing]);

  const handleConfirm = () => {
    if (!isValid) return;
    onPackageConfirmed(packageDetails, {
      suggestedFare: showPricing ? suggestedFare : null,
      offeredFare: showPricing ? fareDetails.offeredFare : null,
      paymentMethod: fareDetails.paymentMethod,
    });
  };

  return (
    <div className="min-h-screen bg-white max-w-md pb-28 md:pb-0 mx-auto">
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-6">

        {/* Header */}
        <div className="flex items-start gap-3 px-5">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors hover:bg-gray-200"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">New delivery</h1>
        </div>

        {/* Branded accent bar — only shows for agency bookings where colors differ */}
        <div
          className="h-0.5 rounded-full mx-5"
          style={{
            background: `linear-gradient(90deg, ${brandColors.primary} 0%, ${brandColors.accent} 50%, ${brandColors.secondary} 100%)`,
          }}
        />

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

        {showPricing ? (
          <FareSection
            fareDetails={fareDetails}
            onFareChange={(offeredFare) =>
              setFareDetails((p) => ({ ...p, offeredFare }))
            }
            suggestedFare={suggestedFare}
            fareFloor={fareFloor}
            errors={errors}
          />
        ) : (
          <AgencyPriceContactCard />
        )}

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
        fareDetails={showPricing ? fareDetails : null}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

// ─── Platform variant ─────────────────────────────────────────────────────────
function PlatformScreen(props) {
  return <Screen {...props} fareHook={useFareCalculator} showPricing={true} />;
}

// ─── Agency variant ───────────────────────────────────────────────────────────
function AgencyScreen({ showPricing, ...props }) {
  return (
    <Screen
      {...props}
      fareHook={useAgencyFareCalculator}
      showPricing={showPricing ?? true}
    />
  );
}

export default function PackageAndFareScreen({
  isAgencyBooking = false,
  showPricing,
  ...props
}) {
  return isAgencyBooking ? (
    <AgencyScreen {...props} showPricing={showPricing} />
  ) : (
    <PlatformScreen {...props} />
  );
}
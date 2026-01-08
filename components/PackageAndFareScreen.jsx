'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useFareCalculator } from '@/hooks/useFareCalculator';
import { usePackageValidation } from '@/hooks/usePackageValidation'; 
import DeliverySummaryCard from '@/components/PackageAndFare/DeliverySummaryCard';
import PackageSection from '@/components/PackageAndFare/PackageSection';
import FareSection from '@/components/PackageAndFare/FareSection';
import PickupOptions from '@/components/PackageAndFare/PickupOptions';
import StickyConfirmBar from '@/components/PackageAndFare/StickyConfirmBar';

export default function PackageAndFareScreen({
  delivery,
  onBack,
  onPackageConfirmed,
  loading,
}) {
  const [packageDetails, setPackageDetails] = useState({
    size: '',
    description: '',
    isFragile: false,
    pickupTime: 'courier',
    // Add contact details here
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
    suggestedFare: 0,
    offeredFare: 0,
  });

  const suggestedFare = useFareCalculator(packageDetails, delivery.routeData);
  const { isValid, errors } = usePackageValidation(packageDetails, fareDetails);

  useEffect(() => {
    setFareDetails((prev) => ({
      suggestedFare,
      offeredFare: Math.max(prev.offeredFare, suggestedFare),
    }));
  }, [suggestedFare]);

  const handleFareChange = (offeredFare) => {
    setFareDetails((prev) => ({ ...prev, offeredFare }));
  };

  const handlePackageDetailChange = (key, value) => {
    setPackageDetails((prev) => ({ ...prev, [key]: value }));
  };

  // Add handlers for contact details
  const handlePickupContactChange = (contactDetails) => {
    setPackageDetails((prev) => ({
      ...prev,
      pickupContact: contactDetails,
    }));
  };

  const handleDropoffContactChange = (contactDetails) => {
    setPackageDetails((prev) => ({
      ...prev,
      dropoffContact: contactDetails,
    }));
  };

  const handleConfirm = () => {
    if (!isValid) return;
    onPackageConfirmed(packageDetails, fareDetails);
  };

  return (
    <div className="min-h-screen mt-28 bg-gray-50 pb-32">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onBack}
              className="text-[#3A0A21] font-semibold flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-900">
                  Delivery Route
                </h3>
              </div>
            </div>
          </div>

          <DeliverySummaryCard
            delivery={delivery}
            pickupContact={packageDetails.pickupContact}
            dropoffContact={packageDetails.dropoffContact}
            onPickupContactChange={handlePickupContactChange}
            onDropoffContactChange={handleDropoffContactChange}
          />
        </section>

        <PackageSection
          packageDetails={packageDetails}
          onPackageDetailChange={handlePackageDetailChange}
          errors={errors}
        />
        <PickupOptions
          packageDetails={packageDetails}
          onPackageDetailChange={handlePackageDetailChange}
        />
        <FareSection
          fareDetails={fareDetails}
          onFareChange={handleFareChange}
          suggestedFare={suggestedFare}
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
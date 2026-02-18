'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useFareCalculator } from '@/hooks/useFareCalculator';
import { usePackageValidation } from '@/hooks/usePackageValidation';
import DeliverySummaryCard from '@/components/PackageAndFare/DeliverySummaryCard';
import PackageSection from '@/components/PackageAndFare/PackageSection';
import FareSection from '@/components/PackageAndFare/FareSection';
import PickupOptions from '@/components/PackageAndFare/PickupOptions';
import StickyConfirmBar from '@/components/PackageAndFare/StickyConfirmBar';
import PaymentSection from './PackageAndFare/PaymentSection';

export default function PackageAndFareScreen({
  delivery,
  onPackageConfirmed,
  loading,
  onBack,
}) {
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
    paymentMethod: '',
  });

  const handlePaymentMethodChange = (method) => {
    setFareDetails((prev) => ({ ...prev, paymentMethod: method }));
  };

  const suggestedFare = useFareCalculator(packageDetails, delivery.routeData);
  const { isValid, errors } = usePackageValidation(packageDetails, fareDetails);
  const router = useRouter();
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
        {/* <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Route
        </p> */}
        <div className="space-y-3">
          <DeliverySummaryCard
            delivery={delivery}
            pickupContact={packageDetails.pickupContact}
            dropoffContact={packageDetails.dropoffContact}
            onPickupContactChange={handlePickupContactChange}
            onDropoffContactChange={handleDropoffContactChange}
          />
        </div>

        <div className="space-y-3">
          <PackageSection
            packageDetails={packageDetails}
            onPackageDetailChange={handlePackageDetailChange}
            errors={errors}
          />
        </div>

        <div className="space-y-3">
          <PickupOptions
            packageDetails={packageDetails}
            onPackageDetailChange={handlePackageDetailChange}
          />
        </div>

        <div className="space-y-3">
          <FareSection
            fareDetails={fareDetails}
            onFareChange={handleFareChange}
            suggestedFare={suggestedFare}
            errors={errors}
          />
        </div>

        {/* NEW STEP */}
        <div className="space-y-3">
          <PaymentSection
            paymentMethod={fareDetails.paymentMethod}
            onPaymentMethodChange={handlePaymentMethodChange}
            errors={errors}
          />
        </div>
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

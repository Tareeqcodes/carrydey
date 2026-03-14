'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Phone,
  Ruler,
  Clock,
  User,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useBrandColors } from '@/hooks/BrandColors';
import {
  useAgencyFareCalculator,
  useFareCalculator,
} from '@/hooks/useFareCalculator';
import { usePackageValidation } from '@/hooks/usePackageValidation';
import InputLocation from '@/components/InputLocation';
import PackageSection from '@/components/PackageAndFare/PackageSection';
import FareSection from '@/components/PackageAndFare/FareSection';
import PickupOptions from '@/components/PackageAndFare/PickupOptions';
import StickyConfirmBar from '@/components/PackageAndFare/StickyConfirmBar';
import PaymentSection from '@/components/PackageAndFare/PaymentSection';
import DeliverySummaryCard from '@/components/PackageAndFare/DeliverySummaryCard';

// ── Helper: create a blank dropoff entry ──────────────────────────────────
function makeDropoff(id) {
  return {
    id,
    location: null,
    address: '',
    recipientName: '',
    recipientPhone: '',
    packageLabel: '',
  };
}

function RouteInfoPill({ routeData }) {
  const { brandColors } = useBrandColors();
  const fmt = (m) => {
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60),
      r = m % 60;
    return r === 0
      ? `${h} hr${h > 1 ? 's' : ''}`
      : `${h} hr${h > 1 ? 's' : ''} ${r} min`;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
      style={{
        background: `${brandColors.primary}08`,
        borderColor: `${brandColors.primary}20`,
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
        }}
      >
        <Ruler className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <p className="text-xs text-gray-500 font-medium">Distance</p>
          <p className="text-sm font-bold text-gray-900">
            {routeData.distance} km
          </p>
        </div>
        <div
          className="w-px h-8 rounded-full"
          style={{ backgroundColor: `${brandColors.primary}20` }}
        />
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" style={{ color: brandColors.primary }} />
          <div>
            <p className="text-xs text-gray-500 font-medium">Est. time</p>
            <p className="text-sm font-bold text-gray-900">
              {fmt(routeData.duration)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AgencyPriceContactCard() {
  const { brandColors } = useBrandColors();
  return (
    <section className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Fare
      </p>
      <div className="flex items-center gap-3 py-4 border-b border-gray-100">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${brandColors.primary}12` }}
        >
          <Phone className="w-4 h-4" style={{ color: brandColors.primary }} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            We will confirm fare
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            We'll reach out before dispatch
          </p>
        </div>
      </div>
    </section>
  );
}

function AgencyHeader({ agency, availability, brandColors }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl md:mx-32 border-b border-gray-200/50 sticky top-0 z-40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          {agency.logoUrl ? (
            <div
              className="w-14 h-14 rounded-2xl bg-white border-2 flex items-center justify-center shadow-lg overflow-hidden"
              style={{ borderColor: brandColors.primary }}
            >
              <img
                src={agency.logoUrl}
                alt={agency.name}
                className="w-full h-full object-contain p-1.5"
              />
            </div>
          ) : (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
              }}
            >
              <Building2 className="w-7 h-7 text-white" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {agency.name}
            </h1>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs sm:text-sm text-gray-500">
                {agency.tagline || 'Book your delivery'}
              </p>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${availability.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
              >
                {availability.isOpen
                  ? `🟢 ${availability.message || 'Open'}`
                  : '🔴 Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GuestInfoModal({
  show,
  agency,
  brandColors,
  loading,
  guestInfo,
  onGuestInfoChange,
  onSubmit,
  onClose,
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div
              className="p-6 sm:p-8 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              <div className="relative flex items-start gap-4">
                {agency?.logoUrl ? (
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 p-2">
                    <img
                      src={agency.logoUrl}
                      alt={agency.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    Your Contact Info
                  </h2>
                  <p className="text-white/80 text-sm">
                    {agency?.name} will use this to reach you
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-5">
              {[
                {
                  label: 'Your Full Name',
                  key: 'name',
                  type: 'text',
                  icon: User,
                  placeholder: 'John Doe',
                  color: brandColors.primary,
                  required: true,
                },
                {
                  label: 'Pickup Contact Number',
                  key: 'phone',
                  type: 'tel',
                  icon: Phone,
                  placeholder: '+234 123 456 7890',
                  color: brandColors.secondary,
                  required: true,
                },
                {
                  label: 'Dropoff Contact Number',
                  key: 'dropoffPhone',
                  type: 'tel',
                  icon: Phone,
                  placeholder: '+234 987 654 3210',
                  color: brandColors.accent,
                  required: true,
                  labelSuffix: ' (for recipient)',
                },
              ].map(
                ({
                  label,
                  key,
                  type,
                  icon: Icon,
                  placeholder,
                  color,
                  required,
                  labelSuffix,
                }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      {label}
                      {labelSuffix && (
                        <span className="text-gray-400 text-[9px] normal-case font-normal ml-1">
                          {labelSuffix}
                        </span>
                      )}
                    </label>
                    <div className="relative flex items-center">
                      <Icon
                        className="absolute left-4 w-5 h-5"
                        style={{ color }}
                      />
                      <input
                        type={type}
                        value={guestInfo[key]}
                        onChange={(e) => onGuestInfoChange(key, e.target.value)}
                        onFocus={(e) => {
                          e.target.style.borderColor = color;
                          e.target.style.backgroundColor = `${color}08`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.backgroundColor = 'white';
                        }}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400"
                        placeholder={placeholder}
                        required={required}
                      />
                    </div>
                  </div>
                )
              )}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-3 py-3 text-white rounded-2xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <span>Confirm Booking</span>
                  )}
                </motion.button>
              </div>
            </form>
            <div className="px-6 pb-6 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Sparkles
                className="w-3 h-3"
                style={{ color: brandColors.accent }}
              />
              <span>Powered by {agency?.name}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function DeliveryBookingPage({
  isAgencyBooking = false,
  agency = null,
  availability = { isOpen: true, message: '' },
  showPricing = true,
  loading = false,
  onConfirmed,
  initialPickup = null,
  initialDropoff = null,
  initialRouteData = null,
  onBack,
}) {
  const { brandColors } = useBrandColors();
  const [pickup, setPickup] = useState(initialPickup);
  const [routeData, setRouteData] = useState(initialRouteData);
  const [routeReady, setRouteReady] = useState(
    !!(initialPickup && initialDropoff && initialRouteData)
  );

  const [dropoffs, setDropoffs] = useState(() => {
    if (initialDropoff) {
      // Legacy prefill: wrap single dropoff into array
      return [
        {
          id: 'd0',
          location: initialDropoff,
          address: initialDropoff.place_name || '',
          recipientName: '',
          recipientPhone: '',
          packageLabel: '',
        },
      ];
    }
    return [makeDropoff('d0')];
  });

  const primaryDropoff = dropoffs[0]?.location || null;

  const [packageDetails, setPackageDetails] = useState({
    size: '',
    description: '',
    isFragile: false,
    pickupTime: 'courier',
    pickupContact: { pickupContactName: '', pickupPhone: '' },
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
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    dropoffPhone: '',
  });

  const agencyFareResult = useAgencyFareCalculator(packageDetails, routeData);
  const platformFareResult = useFareCalculator(packageDetails, routeData);
  const fareResult = isAgencyBooking ? agencyFareResult : platformFareResult;
  const { fare: suggestedFare, isLongDistance, fareMode, minFare } = fareResult;
  const fareFloor = isLongDistance
    ? minFare
    : Math.round((suggestedFare ?? 0) * 0.5);

  const { isValid, errors } = usePackageValidation(
    packageDetails,
    fareDetails,
    fareFloor,
    showPricing,
    fareMode,
    minFare
  );

  useEffect(() => {
    if (!showPricing || isLongDistance || !suggestedFare) return;
    setFareDetails((prev) => ({
      ...prev,
      offeredFare:
        prev.offeredFare === 0
          ? suggestedFare
          : Math.max(prev.offeredFare, suggestedFare),
    }));
  }, [suggestedFare, showPricing, isLongDistance]);

  useEffect(() => {
    if (!showPricing || !isLongDistance || !minFare) return;
    setFareDetails((prev) => ({
      ...prev,
      offeredFare: prev.offeredFare === 0 ? minFare : prev.offeredFare,
    }));
  }, [isLongDistance, minFare, showPricing]);

  const prevFareModeRef = useRef(fareMode);
  useEffect(() => {
    if (prevFareModeRef.current !== fareMode) {
      prevFareModeRef.current = fareMode;
      setFareDetails((prev) => ({ ...prev, offeredFare: 0 }));
    }
  }, [fareMode]);

  const handleLocationSelect = (type, loc) => {
    if (type === 'pickup') setPickup(loc);
  };

  const handleDropoffsChange = (updatedDropoffs) => {
    setDropoffs(updatedDropoffs);
  };

  const handleRouteCalculated = (data) => {
    setRouteData(data);
    setRouteReady(true);
  };

  // isValid also requires at least one dropoff with location + recipient
  const allDropoffsValid = dropoffs.every((d) => d.location);

  const handleConfirm = () => {
    if (!isValid || !pickup || !primaryDropoff || !routeData) return;
    const fd = {
      suggestedFare: showPricing && !isLongDistance ? suggestedFare : null,
      offeredFare: showPricing ? fareDetails.offeredFare : null,
      paymentMethod: fareDetails.paymentMethod,
      isLongDistance,
      fareMode,
    };
    if (isAgencyBooking) {
      setShowGuestForm(true);
    } else {
      // Pass dropoffs array as 6th argument
      onConfirmed(packageDetails, fd, pickup, dropoffs, routeData);
    }
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (!guestInfo.name || !guestInfo.phone) return;
    const fd = {
      suggestedFare: showPricing && !isLongDistance ? suggestedFare : null,
      offeredFare: showPricing ? fareDetails.offeredFare : null,
      paymentMethod: fareDetails.paymentMethod,
      isLongDistance,
      fareMode,
    };
    onConfirmed(packageDetails, fd, pickup, dropoffs, routeData, guestInfo);
  };

  const deliverySnapshot = {
    pickup,
    dropoffs,
    routeData,
    packageDetails,
    fareDetails: {
      suggestedFare: showPricing && !isLongDistance ? suggestedFare : null,
      offeredFare: showPricing ? fareDetails.offeredFare : null,
      paymentMethod: fareDetails.paymentMethod,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {isAgencyBooking && agency && (
        <AgencyHeader
          agency={agency}
          availability={availability}
          brandColors={brandColors}
        />
      )}

      <div className="min-h-screen bg-white max-w-md pb-28 md:pb-0 mx-auto">
        <div className="max-w-3xl mx-auto px-4 py-5 space-y-6">
          {!isAgencyBooking && (
            <h1 className="text-lg font-bold text-gray-900">New delivery</h1>
          )}

          <div
            className="h-0.5 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${brandColors.primary} 0%, ${brandColors.accent} 50%, ${brandColors.secondary} 100%)`,
            }}
          />

          <section className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Where to &amp; from
            </p>
            {/* ── Updated InputLocation: now takes dropoffs[] + onDropoffsChange ── */}
            <InputLocation
              onLocationSelect={handleLocationSelect}
              onDropoffsChange={handleDropoffsChange}
              onRouteCalculated={handleRouteCalculated}
              pickup={pickup}
              dropoffs={dropoffs}
              onCalculate={() => {}}
              showNextButton={false}
            />
            <AnimatePresence>
              {routeReady && routeData && (
                <RouteInfoPill routeData={routeData} />
              )}
            </AnimatePresence>
          </section>

          {!isAgencyBooking && routeReady && (
            <DeliverySummaryCard
              delivery={{ pickup, dropoff: primaryDropoff, routeData }}
              pickupContact={packageDetails.pickupContact}
              dropoffContact={packageDetails.dropoffContact}
              onPickupContactChange={(c) =>
                setPackageDetails((p) => ({ ...p, pickupContact: c }))
              }
              onDropoffContactChange={(c) =>
                setPackageDetails((p) => ({ ...p, dropoffContact: c }))
              }
            />
          )}

          <AnimatePresence>
            {routeReady && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-6"
              >
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
                    minFare={minFare}
                    isLongDistance={isLongDistance}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <StickyConfirmBar
          isValid={isValid && routeReady && allDropoffsValid}
          loading={loading}
          onConfirm={handleConfirm}
          fareDetails={fareDetails}
          deliverySnapshot={deliverySnapshot}
        />
      </div>

      {isAgencyBooking && (
        <GuestInfoModal
          show={showGuestForm}
          agency={agency}
          brandColors={brandColors}
          loading={loading}
          guestInfo={guestInfo}
          onGuestInfoChange={(k, v) => setGuestInfo((p) => ({ ...p, [k]: v }))}
          onSubmit={handleGuestSubmit}
          onClose={() => setShowGuestForm(false)}
        />
      )}
    </div>
  );
}

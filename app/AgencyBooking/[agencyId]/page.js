'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LocationAndPreviewScreen from '@/components/LocationAndPreviewScreen';
import PackageAndFareScreen from '@/components/PackageAndFareScreen';
import Closedagencymodal from '@/components/Agencytrack/Closedagencymodal';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import {
  Building2,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandColorsProvider } from '@/hooks/BrandColors';
import {
  AgencyPricingProvider,
  parseAgencyPricing,
} from '@/hooks/Agencypricing';

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
      'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday', 'Sunday',
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

  const [currentScreen, setCurrentScreen] = useState('location');
  const [agency, setAgency] = useState(null);
  const [agencyPricing, setAgencyPricing] = useState(null);
  // ← tracks whether this agency shows calculated pricing to customers
  const [showPricing, setShowPricing] = useState(true);
  const [availability, setAvailability] = useState({ isOpen: true, message: '' });
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [brandColors, setBrandColors] = useState({
    primary: '#3A0A21',
    secondary: '#5A1A41',
    accent: '#8B2E5A',
  });
  const [loadingAgency, setLoadingAgency] = useState(true);
  const [deliveryData, setDeliveryData] = useState({
    pickup: null,
    dropoff: null,
    routeData: null,
    packageDetails: null,
    fareDetails: null,
  });
  const [loading, setLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });
  const [showGuestForm, setShowGuestForm] = useState(false);

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
        const agencyData = response.rows[0];
        setAgency(agencyData);

        if (agencyData.brandColors) {
          try { setBrandColors(JSON.parse(agencyData.brandColors)); } catch {}
        }

        setAgencyPricing(parseAgencyPricing(agencyData));

        // ← read showPricing from Appwrite, default true if agency hasn't set it yet
        setShowPricing(agencyData.showPricing ?? true);

        const avail = checkAvailability(agencyData);
        setAvailability(avail);
        if (!avail.isOpen) setShowClosedModal(true);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching agency:', error);
    } finally {
      setLoadingAgency(false);
    }
  };

  const handleLocationsConfirmed = (pickup, dropoff, routeData) => {
    setDeliveryData((prev) => ({ ...prev, pickup, dropoff, routeData }));
    setCurrentScreen('package');
  };

  const handlePackageConfirmed = (packageDetails, fareDetails) => {
    setDeliveryData((prev) => ({ ...prev, packageDetails, fareDetails }));
    setShowGuestForm(true);
  };

  const handleGuestInfoSubmit = async (e) => {
    e.preventDefault();
    if (!guestInfo.name || !guestInfo.phone) return;
    await saveDeliveryToAppwrite();
  };

  const saveDeliveryToAppwrite = async () => {
    const { pickup, dropoff, routeData, packageDetails, fareDetails } = deliveryData;
    if (!pickup || !dropoff || !routeData) return;
    setLoading(true);
    try {
      const deliveryId = ID.unique();
      const trackingToken = ID.unique();

      await tablesDB.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          pickupAddress: pickup.place_name?.substring(0, 500) || 'Pickup location',
          pickupLat: pickup.geometry.coordinates[1],
          pickupLng: pickup.geometry.coordinates[0],
          dropoffAddress: dropoff.place_name?.substring(0, 500) || 'Dropoff location',
          dropoffLat: dropoff.geometry.coordinates[1],
          dropoffLng: dropoff.geometry.coordinates[0],
          distance: parseFloat(routeData.distance),
          duration: parseInt(routeData.duration),
          status: 'pending',
          pickupContactName: packageDetails?.pickupContact?.pickupContactName,
          pickupPhone: packageDetails?.pickupContact?.pickupPhone,
          pickupInstructions: packageDetails?.pickupContact?.pickupInstructions,
          dropoffContactName: packageDetails?.dropoffContact?.dropoffContactName,
          dropoffPhone: packageDetails?.dropoffContact?.dropoffPhone,
          dropoffInstructions: packageDetails?.dropoffContact?.dropoffInstructions,
          recipientPermission: packageDetails?.dropoffContact?.recipientPermission,
          offeredFare: fareDetails?.offeredFare
            ? parseInt(fareDetails.offeredFare)
            : null,
          packageSize: packageDetails?.size,
          packageDescription: packageDetails?.description,
          isFragile: packageDetails?.isFragile || false,
          pickupTime: packageDetails?.pickupTime || 'courier',
          guestName: guestInfo.name,
          guestEmail: guestInfo.email || null,
          isGuestBooking: true,
          guestPhone: guestInfo.phone,
          assignedAgencyId: agencyId,
          userId: null,
          trackingToken,
          pricingProvidedAtBooking: showPricing,
        },
      });

      setShowGuestForm(false);
      router.push(`/bookconfirm/${deliveryId}?token=${trackingToken}`);
    } catch (error) {
      console.error('Error saving delivery:', error);
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
          <p className="text-sm font-medium text-gray-600">Loading booking page...</p>
        </motion.div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Agency Not Found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">This booking link is invalid or has expired.</p>
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

  return (
    <BrandColorsProvider initialColors={brandColors}>
      <AgencyPricingProvider pricing={agencyPricing}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <Closedagencymodal
            isOpen={showClosedModal}
            onDismiss={() => setShowClosedModal(false)}
            agencyName={agency.name}
            message={availability.message}
            brandColors={brandColors}
            logoUrl={agency.logoUrl}
          />

          {/* Agency Header */}
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
                    <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-contain p-1.5" />
                  </div>
                ) : (
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)` }}
                  >
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">{agency.name}</h1>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-xs sm:text-sm text-gray-500">{agency.tagline || 'Book your delivery'}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      availability.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {availability.isOpen ? `🟢 ${availability.message || 'Open'}` : '🔴 Closed'}
                    </span>
                  </div>
                </div>

                {agency.rating && (
                  <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-lg">⭐</span>
                    <span className="text-sm font-bold text-amber-900">{agency.rating}</span>
                  </div>
                )}
              </div>
            </div>
            
          </motion.div>

          {/* Screens */}
          <AnimatePresence mode="wait">
            {currentScreen === 'location' ? (
              <motion.div
                key="location"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LocationAndPreviewScreen
                  pickup={deliveryData.pickup}
                  dropoff={deliveryData.dropoff}
                  routeData={deliveryData.routeData}
                  onLocationsConfirmed={handleLocationsConfirmed}
                />
              </motion.div>
            ) : (
              <motion.div
                key="package"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* ← showPricing now passed from agency data */}
                <PackageAndFareScreen
                  delivery={deliveryData}
                  onBack={() => setCurrentScreen('location')}
                  onPackageConfirmed={handlePackageConfirmed}
                  loading={loading}
                  isAgencyBooking={true}
                  showPricing={showPricing}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Guest Info Modal */}
          <AnimatePresence>
            {showGuestForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={() => setShowGuestForm(false)}
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
                    style={{ background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)` }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                    <div className="relative flex items-start gap-4">
                      {agency.logoUrl ? (
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 p-2">
                          <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Your Contact Info</h2>
                        <p className="text-white/80 text-sm">{agency.name} will use this to reach you</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleGuestInfoSubmit} className="p-6 sm:p-8 space-y-5">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text', icon: User, placeholder: 'John Doe', color: brandColors.primary, required: true },
                      { label: 'Phone Number', key: 'phone', type: 'tel', icon: Phone, placeholder: '+234 123 456 7890', color: brandColors.secondary, required: true },
                      {
                        label: 'Email', key: 'email', type: 'email', icon: Mail, placeholder: 'john@example.com',
                        color: brandColors.accent, required: false,
                        labelSuffix: <span className="text-gray-400 normal-case font-normal ml-1">(Optional)</span>,
                      },
                    ].map(({ label, key, type, icon: Icon, placeholder, color, required, labelSuffix }) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          {label}{labelSuffix}
                        </label>
                        <div className="relative flex items-center">
                          <Icon className="absolute left-4 w-5 h-5" style={{ color }} />
                          <input
                            type={type}
                            value={guestInfo[key]}
                            onChange={(e) => setGuestInfo((p) => ({ ...p, [key]: e.target.value }))}
                            onFocus={(e) => { e.target.style.borderColor = color; e.target.style.backgroundColor = `${color}08`; }}
                            onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = 'white'; }}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400"
                            placeholder={placeholder}
                            required={required}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        type="button" onClick={() => setShowGuestForm(false)} disabled={loading}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
                        type="submit" disabled={loading}
                        className="flex-1 px-3 py-3 text-white rounded-2xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)` }}
                      >
                        {loading ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /><span>Booking...</span></>
                        ) : (
                          <span>Confirm Booking</span>
                        )}
                      </motion.button>
                    </div>
                  </form>

                  <div className="px-6 pb-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Sparkles className="w-3 h-3" style={{ color: brandColors.accent }} />
                    <span>Powered by {agency.name}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AgencyPricingProvider>
    </BrandColorsProvider>
  );
}
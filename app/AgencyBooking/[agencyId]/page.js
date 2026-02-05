'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LocationAndPreviewScreen from '@/components/LocationAndPreviewScreen';
import PackageAndFareScreen from '@/components/PackageAndFareScreen';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { Building2, Loader2, AlertCircle, User, Phone, Mail, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgencyBookingPage() {
  const params = useParams();
  const router = useRouter();
  const agencyId = params.agencyId;

  const [currentScreen, setCurrentScreen] = useState('location');
  const [agency, setAgency] = useState(null);

  const [loadingAgency, setLoadingAgency] = useState(true);
  const [deliveryData, setDeliveryData] = useState({
    pickup: null,
    dropoff: null,
    routeData: null,
    packageDetails: null,
    fareDetails: null,
  });
  const [loading, setLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [showGuestForm, setShowGuestForm] = useState(false);

  // Fetch agency details
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
        setAgency(response.rows[0]);
      } else {
        alert('Agency not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching agency:', error);
      alert('Failed to load agency details');
    } finally {
      setLoadingAgency(false);
    }
  };

  const handleLocationsConfirmed = (pickup, dropoff, routeData) => {
    setDeliveryData((prev) => ({
      ...prev,
      pickup,
      dropoff,
      routeData,
    }));
    setCurrentScreen('package');
  };

  const handlePackageConfirmed = (packageDetails, fareDetails) => {
    setDeliveryData((prev) => ({
      ...prev,
      packageDetails,
      fareDetails,
    }));
    setShowGuestForm(true);
  };

  const handleBackToLocations = () => {
    setCurrentScreen('location');
  };

  const handleGuestInfoSubmit = async (e) => {
    e.preventDefault();
    
    if (!guestInfo.name || !guestInfo.phone) {
      alert('Please provide your name and phone number');
      return;
    }

    await saveDeliveryToAppwrite();
  };

  const saveDeliveryToAppwrite = async () => {
    const { pickup, dropoff, routeData, packageDetails, fareDetails } = deliveryData;
    if (!pickup || !dropoff || !routeData) return;

    setLoading(true);
    try {
      const deliveryId = ID.unique();
      const trackingToken = ID.unique();

      const deliveryDataToSave = {
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
        suggestedFare: parseInt(fareDetails.suggestedFare || routeData.estimatedFare),
        offeredFare: parseInt(fareDetails.offeredFare || routeData.estimatedFare),
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
        trackingToken: trackingToken,
      };

      await tablesDB.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: deliveryDataToSave,
      });
      
      setShowGuestForm(false);
      alert(`Booking confirmed! ${agency?.name || 'The agency'} will contact you at ${guestInfo.phone}`);
      
      router.push(`/bookconfirm/${deliveryId}?token=${trackingToken}`);
    
    } catch (error) {
      console.error('Error saving delivery:', error);
      alert(`Error creating delivery: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
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

  // Agency Not Found
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
          <p className="text-gray-600 mb-8 leading-relaxed">
            The booking link you're trying to access is invalid or has expired.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#3A0A21]/20 transition-all"
          >
            Go to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Agency Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl md:mx-32 border-b border-gray-200/50 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3A0A21] to-[#5A1A41] flex items-center justify-center shadow-lg shadow-[#3A0A21]/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {agency.name || agency.contactPerson}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Book your delivery</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content with Smooth Transitions */}
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
            <PackageAndFareScreen
              delivery={deliveryData}
              onBack={handleBackToLocations}
              onPackageConfirmed={handlePackageConfirmed}
              loading={loading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Guest Info Modal */}
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
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                      Your Contact Info
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {agency.name || 'The agency'} will use this to contact you
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleGuestInfoSubmit} className="p-6 sm:p-8 space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        value={guestInfo.name}
                        onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-blue-50/30 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                    <div className="relative flex items-center">
                      <Phone className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                      <input
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:bg-green-50/30 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                        placeholder="+234 123 456 7890"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Email <span className="text-gray-400 normal-case">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:bg-purple-50/30 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={() => setShowGuestForm(false)}
                    className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                    disabled={loading}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                    type="submit"
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#3A0A21]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Booking...</span>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Check className="w-5 h-5" />
                        <span className="text-sm">Confirm Booking</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LocationAndPreviewScreen from '@/components/LocationAndPreviewScreen';
import PackageAndFareScreen from '@/components/PackageAndFareScreen';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { Building2, Loader2, AlertCircle } from 'lucide-react';

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

      // console.log('Delivery created successfully:', result);
      
      // Show success message
      setShowGuestForm(false);
      alert(`Booking confirmed! ${agency?.name || 'The agency'} will contact you at ${guestInfo.phone}`);
      
      // Redirect to a success page or home

    router.push(`/bookconfirm/${deliveryId}?token=${trackingToken}`);
    
    } catch (error) {
      console.error('Error saving delivery:', error);
      alert(`Error creating delivery: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingAgency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#3A0A21] mx-auto mb-4" />
          <p className="text-gray-600">Loading booking page...</p>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agency Not Found</h2>
          <p className="text-gray-600 mb-6">
            The booking link you're trying to access is invalid or has expired.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#3A0A21] text-white rounded-lg hover:bg-[#4A0A31] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Agency Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-12 h-12 bg-[#3A0A21] rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{agency.name || agency.contactPerson}</h1>
            <p className="text-sm text-gray-600">Book your delivery</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentScreen === 'location' ? (
        <LocationAndPreviewScreen
          pickup={deliveryData.pickup}
          dropoff={deliveryData.dropoff}
          routeData={deliveryData.routeData}
          onLocationsConfirmed={handleLocationsConfirmed}
        />
      ) : (
        <PackageAndFareScreen
          delivery={deliveryData}
          onBack={handleBackToLocations}
          onPackageConfirmed={handlePackageConfirmed}
          loading={loading}
        />
      )}

      {/* Guest Info Modal */}
      {showGuestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Contact Info</h2>
            <p className="text-gray-600 mb-6 text-sm">
              {agency.name || 'The agency'} will use this to contact you about your delivery
            </p>

            <form onSubmit={handleGuestInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
                  placeholder="+234 123 456 7890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGuestForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#3A0A21] text-white rounded-lg hover:bg-[#4A0A31] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Booking...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
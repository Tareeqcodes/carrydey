'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tablesDB, ID } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import useChooseTraveler from '@/hooks/useChooseTraveler';
import AgencyLoadingSkeleton from '@/ui/AgencyLoadingSkeleton';
import AgencyEmptyState from '@/ui/AgencyEmptyState';
import TravelerCard from '@/components/TravelerCard';
import SelectAgencyModal from '@/components/SelectAgencyModal';

const ChooseTraveler = () => {
  const [travelers, setTravelers] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [deliveryId, setDeliveryId] = useState(null);
  const [restoring, setRestoring] = useState(false); // pending delivery restore in progress

  const { agencies, loading, error } = useChooseTraveler();
  const { user } = useAuth();
  const router = useRouter();

  // ── On mount: check for a pending delivery saved before login ─────────────
  useEffect(() => {
    const init = async () => {
      // 1. Normal flow — delivery was already saved to Appwrite before /check
      const sessionId = sessionStorage.getItem('latestDeliveryId');
      if (sessionId) {
        setDeliveryId(sessionId);
        return;
      }

      // 2. Post-auth restore — user was redirected here after login/onboarding
      const raw = localStorage.getItem('pendingDelivery');
      if (!raw || !user) return;

      try {
        setRestoring(true);
        const pending = JSON.parse(raw);
        const { pickup, dropoff, routeData, packageDetails, fareDetails } =
          pending;

        if (!pickup || !dropoff || !routeData) {
          // Incomplete data — send back to /send to start over
          localStorage.removeItem('pendingDelivery');
          localStorage.removeItem('postAuthRedirect');
          router.push('/send');
          return;
        }

        // Save the delivery to Appwrite now that we have a logged-in user
        const newDeliveryId = ID.unique();
        await tablesDB.createRow({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
          rowId: newDeliveryId,
          data: {
            pickupAddress:
              pickup.place_name?.substring(0, 500) || 'Pickup location',
            pickupLat: pickup.geometry.coordinates[1],
            pickupLng: pickup.geometry.coordinates[0],
            dropoffAddress:
              dropoff.place_name?.substring(0, 500) || 'Dropoff location',
            dropoffLat: dropoff.geometry.coordinates[1],
            dropoffLng: dropoff.geometry.coordinates[0],
            distance: parseFloat(routeData.distance),
            duration: parseInt(routeData.duration),
            status: 'pending',
            pickupContactName: packageDetails?.pickupContact?.pickupContactName,
            pickupPhone: packageDetails?.pickupContact?.pickupPhone,
            dropoffContactName:
              packageDetails?.dropoffContact?.dropoffContactName,
            dropoffPhone: packageDetails?.dropoffContact?.dropoffPhone,
            dropoffInstructions:
              packageDetails?.dropoffContact?.dropoffInstructions,
            recipientPermission:
              packageDetails?.dropoffContact?.recipientPermission,
            offeredFare: parseInt(
              fareDetails?.offeredFare || routeData.estimatedFare || 0
            ),
            packageSize: packageDetails?.size,
            packageDescription: packageDetails?.description,
            isFragile: packageDetails?.isFragile || false,
            pickupTime: packageDetails?.pickupTime || 'courier',
            userId: user.$id,
            assignedAgencyId: null,
            paymentMethod: fareDetails?.paymentMethod,
          },
        });

        sessionStorage.setItem('latestDeliveryId', newDeliveryId);
        setDeliveryId(newDeliveryId);

        // Clean up — delivery is now in Appwrite, no longer needed in localStorage
        localStorage.removeItem('pendingDelivery');
        localStorage.removeItem('postAuthRedirect');
      } catch (err) {
        console.error('Failed to restore pending delivery:', err);
        // Don't block the UI — user can still browse couriers, just won't be able to book
      } finally {
        setRestoring(false);
      }
    };

    init();
  }, [user]); // re-run once user is available (covers the post-auth case)

  // ── Transform agencies into traveler cards ─────────────────────────────────
  useEffect(() => {
    if (!agencies?.length) return;

    const transformed = agencies
      .filter((e) => e.isAvailable === true)
      .map((entity) => {
        const isAgency = entity.entityType === 'agency';
        let serviceCities = [];
        if (isAgency && entity.serviceCities) {
          serviceCities = entity.serviceCities
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);
        }

        const routeDisplay = isAgency
          ? serviceCities.length === 0
            ? 'Nigeria'
            : serviceCities.length === 1
              ? serviceCities[0]
              : `${serviceCities[0]} + ${serviceCities.length - 1} more`
          : entity.currentCity || entity.operatingArea || 'Kano';

        return {
          id: entity.$id,
          entityType: entity.entityType,
          name: isAgency
            ? entity.name || entity.contactPerson || 'Agency'
            : entity.userName || 'Courier',
          avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${isAgency ? entity.name || entity.contactPerson : entity.userName}`,
          rating: entity.rating || 4.5,
          verified: entity.verified || false,
          route: routeDisplay,
          serviceCities,
          distance: (Math.random() * 3 + 0.5).toFixed(1),
          pickupTime: Math.floor(Math.random() * 20 + 10),
          lat: 6.5244 + (Math.random() * 0.04 - 0.02),
          lng: 3.3792 + (Math.random() * 0.04 - 0.02),
          type: isAgency ? entity.type : 'Individual Courier',
          phone: entity.phone || entity.phoneNumber,
          email: entity.email,
          services: isAgency
            ? entity.services
              ? JSON.parse(entity.services)
              : []
            : ['Package Delivery', 'Express Delivery'],
          vehicleTypes: isAgency
            ? entity.vehicleTypes
              ? JSON.parse(entity.vehicleTypes)
              : []
            : [entity.vehicleType || 'Motorcycle'],
          totalDeliveries:
            entity.totalDeliveries || Math.floor(Math.random() * 100 + 20),
          isAvailable: entity.isAvailable || false,
        };
      });

    setTravelers(transformed);
  }, [agencies]);

  const handleBookTraveler = (traveler) => {
    setSelectedTraveler(traveler);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTraveler || !deliveryId) {
      alert('Missing delivery or traveler information');
      return;
    }
    setBookingLoading(true);
    try {
      const isAgency = selectedTraveler.entityType === 'agency';
      const updateData = { status: 'pending' };
      if (isAgency) updateData.assignedAgencyId = selectedTraveler.id;
      else updateData.assignedCourierId = selectedTraveler.id;

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: updateData,
      });

      sessionStorage.removeItem('latestDeliveryId');

      if (isAgency) {
        sessionStorage.setItem('agencyId', selectedTraveler.id);
        sessionStorage.setItem('agencyName', selectedTraveler.name);
      } else {
        sessionStorage.setItem('courierId', selectedTraveler.id);
        sessionStorage.setItem('courierName', selectedTraveler.name);
      }

      setShowConfirmation(false);
      router.push('/track');
    } catch (err) {
      console.error('Error assigning delivery:', err);
      alert('Failed to assign delivery. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-red-600 p-4 rounded-md bg-red-50 max-w-md w-full">
          Error loading agencies and couriers: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 md:my-24 mx-2 md:mx-36 flex flex-col bg-white overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <p className="text-sm text-gray-500">
              {loading || restoring
                ? 'Getting things ready…'
                : `Available courier${travelers.length !== 1 ? 's' : ''} and agencies ready to handle your delivery`}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-white rounded-t-3xl -mt-6 shadow-2xl relative z-10">
        <div className="h-full overflow-y-auto px-4 pt-6 pb-24">
          {loading || restoring ? (
            <AgencyLoadingSkeleton />
          ) : travelers.length === 0 ? (
            <AgencyEmptyState message="No available couriers or agencies found at the moment. Please try again later." />
          ) : (
            <div className="space-y-3 pb-4">
              {travelers.map((traveler, index) => (
                <TravelerCard
                  key={traveler.id}
                  traveler={traveler}
                  index={index}
                  isSelected={selectedTraveler?.id === traveler.id}
                  onSelect={setSelectedTraveler}
                  onBook={handleBookTraveler}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showConfirmation && (
        <SelectAgencyModal
          traveler={selectedTraveler}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={handleConfirmBooking}
          loading={bookingLoading}
        />
      )}
    </div>
  );
};

export default ChooseTraveler;

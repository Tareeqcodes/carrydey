'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { tablesDB, ID } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import useChooseAvailable from '@/hooks/useChooseAvailable';
import AgencyLoadingSkeleton from '@/ui/AgencyLoadingSkeleton';
import SelectAvailableModal from '@/components/SelectAvailableModal';
import AvailableCard from '@/components/AvailableCard';

const ChooseAvailable = () => {
  const [travelers, setTravelers] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [deliveryId, setDeliveryId] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [tab, setTab] = useState('all'); 

  const { agencies, loading, error } = useChooseAvailable();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const sessionId = sessionStorage.getItem('latestDeliveryId');
      if (sessionId) {
        setDeliveryId(sessionId);
        return;
      }

      const raw = localStorage.getItem('pendingDelivery');
      if (!raw || !user) return;

      try {
        setRestoring(true);
        const pending = JSON.parse(raw);
        const { pickup, dropoff, routeData, packageDetails, fareDetails } =
          pending;

        if (!pickup || !dropoff || !routeData) {
          localStorage.removeItem('pendingDelivery');
          localStorage.removeItem('postAuthRedirect');
          router.push('/send');
          return;
        }

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
        localStorage.removeItem('pendingDelivery');
        localStorage.removeItem('postAuthRedirect');
      } catch (err) {
        console.error('Failed to restore pending delivery:', err);
      } finally {
        setRestoring(false);
      }
    };

    init();
  }, [user]);

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
          type: isAgency ? entity.type : 'Independent Courier',
          phone: entity.phone || entity.phoneNumber,
          services: isAgency
            ? entity.services
              ? JSON.parse(entity.services)
              : []
            : ['Package Delivery'],
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
    if (!deliveryId) {
      alert('Your delivery is still being prepared. Please wait a moment.');
      return;
    }
    setSelectedTraveler(traveler);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTraveler?.id || !deliveryId) {
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

  const tabs = [
    { id: 'all', label: 'All', count: travelers.length },
    {
      id: 'agency',
      label: 'Agencies',
      count: travelers.filter((t) => t.entityType === 'agency').length,
    },
    {
      id: 'courier',
      label: 'Couriers',
      count: travelers.filter((t) => t.entityType === 'courier').length,
    },
  ];

  const filtered =
    tab === 'all' ? travelers : travelers.filter((t) => t.entityType === tab);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-red-600 p-4 rounded-2xl bg-red-50 max-w-md w-full text-sm">
          Error loading couriers: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f4]">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-32">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-[20px] font-bold text-[#1a1a1a]">
            Choose a courier
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {loading || restoring
              ? 'Finding available couriers near you…'
              : ` available now`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 bg-[#3A0A21]/8 rounded-lg flex items-center justify-center">
                <span className="text-[11px]">🏢</span>
              </div>
              <p className="text-[11px] font-bold text-[#1a1a1a]">Agency</p>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              A registered business with multiple riders. More reliable for
              large or regular shipments.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 bg-[#FF6B35]/8 rounded-lg flex items-center justify-center">
                <span className="text-[11px]">🏍️</span>
              </div>
              <p className="text-[11px] font-bold text-[#1a1a1a]">Courier</p>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              An independent rider. Usually faster for small packages and short
              distances.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-150
                ${
                  tab === t.id
                    ? 'bg-[#3A0A21] text-white'
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200'
                }`}
            >
              {t.label}
              
            </button>
          ))}
        </div>

        {loading || restoring ? (
          <AgencyLoadingSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mb-3 text-2xl">
              {tab === 'agency' ? '🏢' : tab === 'courier' ? '🏍️' : '📦'}
            </div>
            <p className="text-[13px] font-semibold text-gray-500">
              No {tab === 'all' ? 'couriers' : tab + 's'} available right now
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Try again in a few minutes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((traveler, index) => (
                <motion.div
                  key={traveler.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: index * 0.04, duration: 0.22 }}
                >
                  <AvailableCard
                    traveler={traveler}
                    index={index}
                    isSelected={selectedTraveler?.id === traveler.id}
                    onSelect={setSelectedTraveler}
                    onBook={handleBookTraveler}
                    deliveryReady={!!deliveryId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {showConfirmation && (
        <SelectAvailableModal
          traveler={selectedTraveler}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={handleConfirmBooking}
          loading={bookingLoading}
        />
      )}
    </div>
  );
};

export default ChooseAvailable;

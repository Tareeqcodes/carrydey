'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tablesDB } from '@/lib/config/Appwriteconfig';
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
  const { agencies, loading, error } = useChooseTraveler();
  const router = useRouter(); 


  useEffect(() => {
    const latestDeliveryId = sessionStorage.getItem('latestDeliveryId');
    if (latestDeliveryId) {
      setDeliveryId(latestDeliveryId);
    }
  }, []);  

  useEffect(() => {
    if (agencies && agencies.length > 0) {
      const transformedTravelers = agencies.map((agency) => ({
        id: agency.$id,
        name: agency.name || agency.contactPerson,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${
          agency.name || agency.contactPerson
        }`,
        rating: agency.rating || 4.5,
        verified: agency.verified || false,
        route: `${agency.city} → ${agency.state}`,
        distance: (Math.random() * 3 + 0.5).toFixed(1),
        pickupTime: Math.floor(Math.random() * 20 + 10),
        lat: 6.5244 + (Math.random() * 0.04 - 0.02),
        lng: 3.3792 + (Math.random() * 0.04 - 0.02),
        type: agency.type,
        phone: agency.phone,
        email: agency.email,
        services: agency.services ? JSON.parse(agency.services) : [],
        vehicleTypes: agency.vehicleTypes
          ? JSON.parse(agency.vehicleTypes)
          : [],
        totalDeliveries:
          agency.totalDeliveries || Math.floor(Math.random() * 100 + 20),
      }));
      setTravelers(transformedTravelers);
    }
  }, [agencies]);

  const handleBookTraveler = (traveler) => {
    setSelectedTraveler(traveler);
    setShowConfirmation(true);
  };

   const handleConfirmBooking = async () => {
    if (!selectedTraveler || !deliveryId) {
      alert('Missing delivery or agency information');
      return;
    }

    setBookingLoading(true);
    
    try {
      // Update the delivery with the assigned agency
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          assignedAgencyId: selectedTraveler.id,
         
          status: 'pending', 
        },
      });

      sessionStorage.removeItem('latestDeliveryId');
      sessionStorage.setItem('agencyId', selectedTraveler.id);
      sessionStorage.setItem('agencyName', selectedTraveler.name);

      alert(`Delivery request sent to ${selectedTraveler.name}!`);
      setShowConfirmation(false);
      router.push('/track');
    } catch (error) {
      console.error('Error assigning delivery to agency:', error);
      alert('Failed to assign delivery. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-red-600 p-4 rounded-md bg-red-50 max-w-md w-full">
          Error loading agencies: {error}
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
              {loading ? 'Searching for available couriers and agencies...' : 'Select a courier or agency to handle your delivery'}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-white rounded-t-3xl -mt-6 shadow-2xl relative z-10">
        <div className="h-full overflow-y-auto px-4 pt-6 pb-24">
          {loading ? (
            <AgencyLoadingSkeleton />
          ) : travelers.length === 0 ? (
            <AgencyEmptyState />
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

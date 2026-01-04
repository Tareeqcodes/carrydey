'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import useChooseTraveler from '@/hooks/useChooseTraveler';
import AgencyLoadingSkeleton from '@/ui/AgencyLoadingSkeleton';
import AgencyEmptyState from '@/ui/AgencyEmptyState';
import TravelerCard from '@/components/TravelerCard';
import SelectAgencyModal from '@/components/SelectAgencyModal';

const ChooseTraveler = () => {
  const [travelers, setTravelers] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { agencies, loading, error } = useChooseTraveler();

  // Transform agencies data to match the expected traveler format
  useEffect(() => {
    if (agencies && agencies.length > 0) {
      const transformedTravelers = agencies.map((agency) => ({
        id: agency.$id,
        name: agency.name || agency.contactPerson,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${agency.name || agency.contactPerson}`,
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
        vehicleTypes: agency.vehicleTypes ? JSON.parse(agency.vehicleTypes) : [],
        totalDeliveries: agency.totalDeliveries || Math.floor(Math.random() * 100 + 20),
      }));
      setTravelers(transformedTravelers);
    }
  }, [agencies]);

  const handleBookTraveler = (traveler) => {
    setSelectedTraveler(traveler);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = () => {
    alert(`Booking confirmed with ${selectedTraveler.name}!`);
    setShowConfirmation(false);
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
    <div className="h-screen my-24 mx-2 md:mx-36 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Choose a Traveler</h1>
            <p className="text-sm text-gray-500">
              {loading ? "Finding travelers..." : "Travelers heading your way"}
            </p>
          </div>
        </div>
      </header>

      {/* Traveler Cards Section */}
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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <SelectAgencyModal
          traveler={selectedTraveler}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default ChooseTraveler;
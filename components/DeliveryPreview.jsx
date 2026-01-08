'use client';
import { useState } from 'react';
import { Navigation, Clock, Info } from 'lucide-react';
import dynamic from 'next/dynamic';
import FareCalculationBottomSheet from './FareCalculationBottomSheet';

// Dynamically import the map
const RouteMapPreview = dynamic(() => import('./RouteMapPreview'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center animate-pulse">
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-40 mx-auto"></div>
      </div>
    </div>
  ),
});

export default function DeliveryPreview({
  pickup,
  dropoff,
  routeData,
  onEdit,
  onConfirm,
  loading,
  isEmbedded = false,
}) {
  const [showFareModal, setShowFareModal] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isEmbedded) {
    return (
      <div className="bg-white">
        {/* Map Section */}
        <div className="h-64">
          {pickup && dropoff ? (
            <RouteMapPreview pickup={pickup} dropoff={dropoff} />
          ) : (
            <div className="h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Navigation size={48} className="mx-auto mb-2 text-[#3A0A21]" />
                <p className="font-medium">Map Loading</p>
                <p className="text-sm mt-1">Loading route preview...</p>
              </div>
            </div>
          )}
        </div>

        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onEdit}
            className="text-[#3A0A21] font-semibold flex items-center"
          >
            ← Edit Locations
          </button>
          <h1 className="text-xl font-bold text-[#3A0A21]">Delivery Preview</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Map Section - Full Width */}
        <div className="h-80 relative">
          {pickup && dropoff ? (
            <RouteMapPreview pickup={pickup} dropoff={dropoff} />
          ) : (
            <div className="h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Navigation size={48} className="mx-auto mb-2 text-[#3A0A21]" />
                <p className="font-medium">Map Loading</p>
                <p className="text-sm mt-1">Loading route preview...</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Total Fare Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Total Estimated Fare
                </p>
                <p className="text-3xl font-bold text-[#3A0A21]">
                  {formatCurrency(routeData.estimatedFare)}
                </p>
              </div>
              <button
                onClick={() => setShowFareModal(true)}
                className="flex items-center cursor-pointer text-[#3A0A21] hover:text-[#4A0A31] transition"
              >
                <Info size={18} className="mr-1" />
                <span className="text-sm font-medium">Learn about price calculation</span>
              </button>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Clock size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Estimated Time</span>
                </div>
                <p className="text-lg font-semibold">
                  {routeData.duration} mins
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Navigation size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Distance</span>
                </div>
                <p className="text-lg font-semibold">{routeData.distance} km</p>
              </div>
            </div>

            {/* Location Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start mb-3">
                <div className="w-2 h-2 bg-[#3A0A21] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">From</p>
                  <p className="font-medium truncate">{pickup?.place_name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">To</p>
                  <p className="font-medium truncate">{dropoff?.place_name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 sticky bottom-4">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full bg-[#3A0A21] hover:bg-[#4A0A31] text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl active:scale-[0.98]"
            >
              {loading
                ? 'Creating Delivery...'
                : 'Confirm Delivery '}
            </button>

            <button
              onClick={onEdit}
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition hover:border-gray-400"
            >
              ← Edit Locations
            </button>
          </div>
        </div>
      </div>

      {/* Fare Calculation Modal */}
      <FareCalculationBottomSheet
        isOpen={showFareModal}
        onClose={() => setShowFareModal(false)}
        routeData={routeData}
      />
    </div>
  );
}
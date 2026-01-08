'use client';
import { useState } from 'react';
import { Navigation, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import InputLocation from '@/components/InputLocation';

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

export default function LocationAndPreviewScreen({
  pickup,
  dropoff,
  routeData,
  onLocationsConfirmed,
}) {
  const [localPickup, setLocalPickup] = useState(pickup);
  const [localDropoff, setLocalDropoff] = useState(dropoff);
  const [localRouteData, setLocalRouteData] = useState(routeData);
  const [showMapPreview, setShowMapPreview] = useState(false);

  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat('en-NG', {
  //     style: 'currency',
  //     currency: 'NGN',
  //     minimumFractionDigits: 0,
  //   }).format(amount);
  // };

  const handleLocationSelect = (type, location) => {
    if (type === 'pickup') {
      setLocalPickup(location);
    } else {
      setLocalDropoff(location);
    }

    // Show map preview when both locations are selected
    if (
      (type === 'pickup' && localDropoff) ||
      (type === 'dropoff' && localPickup)
    ) {
      setShowMapPreview(true);
    }
  };

  const handleRouteCalculated = (data) => {
    setLocalRouteData(data);
    setShowMapPreview(true);
  };

  const handleCalculate = () => {
    if (localPickup && localDropoff && localRouteData) {
      setShowMapPreview(true);
    }
  };

  const handleConfirmLocations = () => {
    if (localPickup && localDropoff && localRouteData) {
      onLocationsConfirmed(localPickup, localDropoff, localRouteData);
    }
  };

  const renderMapPreview = () => {
    if (!showMapPreview || !localPickup || !localDropoff || !localRouteData) {
      return (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Navigation className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Enter both locations to see route preview
          </h3>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <div className="items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#3A0A21]">Route Preview</h2>
        </div>

        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          {/* Map Section */}
          <div className="h-64">
            {localPickup && localDropoff ? (
              <RouteMapPreview pickup={localPickup} dropoff={localDropoff} />
            ) : (
              <div className="h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Navigation
                    size={48}
                    className="mx-auto mb-2 text-[#3A0A21]"
                  />
                  <p className="font-medium">Map Loading</p>
                  <p className="text-sm mt-1">Loading route preview...</p>
                </div>
              </div>
            )}
          </div>

          {/* Route Summary Info */}
          <div className="p-4 border-t mt-48 border-gray-200">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-start md:text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1"></div>
                  <p className="text-lg font-bold text-gray-900">
                    {localRouteData.distance} km
                  </p>
                  <p className="text-xs text-gray-500">Distance</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1"></div>
                  <p className="text-lg font-bold text-gray-900">
                    {localRouteData.duration} min
                  </p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1"></div>
                  <p className="text-lg font-bold text-gray-900">
                    ₦{localRouteData.estimatedFare?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-gray-500">Est. fare</p>
                </div>
              </div>
        
              <p className="text-xs font-semibold text-center text-gray-600 mt-3">
                You'll set your final fare after adding package details
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen mt-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Map Preview Section */}
        {renderMapPreview()}

        <div className="mb-8">
          <InputLocation
            onLocationSelect={handleLocationSelect}
            onRouteCalculated={handleRouteCalculated}
            pickup={localPickup}
            dropoff={localDropoff}
            onCalculate={handleCalculate}
            showNextButton={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleConfirmLocations}
              disabled={!localPickup || !localDropoff || !localRouteData}
              className="px-6 py-3 bg-[#3A0A21] hover:bg-[#4A0A31] text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              Add Package Details
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

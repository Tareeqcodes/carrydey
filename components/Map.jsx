'use client';
import { useState, useEffect } from 'react';
import { AddressAutofill } from '@mapbox/search-js-react';
import { Clock, DollarSignIcon, Navigation2Icon  } from 'lucide-react';

export default function InputLocation({ 
  onLocationSelect, 
  onRouteCalculated, 
  pickup, 
  dropoff, 
  routeData, 
  loading, 
  onBookRide 
}) {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [calculatingRoute, setCalculatingRoute] = useState(false);

  const calculateRoute = async () => {
    if (!pickup || !dropoff) return;

    setCalculatingRoute(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.geometry.coordinates[0]},${pickup.geometry.coordinates[1]};${dropoff.geometry.coordinates[0]},${dropoff.geometry.coordinates[1]}?` +
        new URLSearchParams({
          access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
          geometries: 'geojson',
          overview: 'full'
        })
      );

      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const polyline = route.geometry.coordinates;
        
        // Calculate distance and duration
        const distance = (route.distance / 1000).toFixed(1); // km
        const duration = Math.round(route.duration / 60); // minutes
        
        const baseFare = 5; 
        const perKm = 50; 
        const estimatedFare = Math.round(baseFare + (distance * perKm));

        const routeInfo = {
          distance,
          duration,
          estimatedFare,
          polyline
        };

        onRouteCalculated(routeInfo);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    } finally {
      setCalculatingRoute(false);
    }
  };

  useEffect(() => {
    if (pickup && dropoff) {
      calculateRoute();
    }
  }, [pickup, dropoff]);

  const handleRetrieve = (result, type) => {
    const locationData = {
      ...result,
      geometry: {
        type: "Point",
        coordinates: result.geometry.coordinates
      }
    };
    
    onLocationSelect(type, locationData);
    
    if (type === 'pickup') {
      setPickupAddress(result.properties.full_address);
    } else {
      setDropoffAddress(result.properties.full_address);
    }
  };

  return (
    <div className="space-y-6">
     
      <div className="relative">
        <label className="block text-sm font-medium text-[#3A0A21] mb-2">
          Pickup Location
        </label>
        <div className="flex items-center bg-white rounded-lg p-4 border-2 border-[#3A0A21]">
          <div className="w-3 h-3 rounded-full bg-[#3A0A21] mr-3"></div>
          <AddressAutofill 
            accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            onRetrieve={(result) => handleRetrieve(result, 'pickup')}
          >
            <input
              type="text"
              placeholder="Enter pickup location"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              autoComplete="address-line1"
              className="flex-1 bg-transparent outline-none text-[#3A0A21] placeholder-gray-500 w-full"
            />
          </AddressAutofill>
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-[#3A0A21] mb-2">
          Dropoff Location
        </label>
        <div className="flex items-center bg-white rounded-lg p-4 border-2 border-[#3A0A21]">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
          <AddressAutofill 
            accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            onRetrieve={(result) => handleRetrieve(result, 'dropoff')}
          >
            <input
              type="text"
              placeholder="Enter dropoff location"
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
              autoComplete="address-line1"
              className="flex-1 bg-transparent outline-none text-[#3A0A21] placeholder-gray-500 w-full"
            />
          </AddressAutofill>
        </div>
      </div>

      {(calculatingRoute || loading) && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#3A0A21] border-t-transparent"></div>
          <p className="mt-2 text-gray-600">
            {calculatingRoute ? 'Calculating route...' : 'Creating delivery...'}
          </p>
        </div>
      )}

      {routeData && !calculatingRoute && (
        <div className="bg-white rounded-lg p-6 space-y-4 border-2 border-[#3A0A21] shadow-lg">
          <h3 className="text-lg font-bold text-[#3A0A21] mb-4">Delivery Summary</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[#3A0A21]" />
              <span className="text-sm text-gray-700">Estimated Time</span>
            </div>
            <span className="font-semibold text-[#3A0A21]">{routeData.duration} mins</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Navigation2Icon className="w-5 h-5 mr-2 text-[#3A0A21]" />
              <span className="text-sm text-gray-700">Distance</span>
            </div>
            <span className="font-semibold text-[#3A0A21]">{routeData.distance} km</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSignIcon className="w-5 h-5 mr-2 text-[#3A0A21]" />
                <span className="text-sm text-gray-700">Estimated Fare</span>
              </div>
              <span className="font-semibold text-[#3A0A21]">₦{routeData.estimatedFare}</span>
            </div>

            <button
              onClick={onBookRide}
              disabled={loading}
              className="w-full bg-[#3A0A21] hover:bg-[#4A0A31] text-white font-semibold py-3 rounded-lg mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Delivery...' : 'Send Delivery'}
            </button>
          </div>
        )}
      </div>
  );
}

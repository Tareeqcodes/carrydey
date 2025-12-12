'use client';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function InputLocation({
  onLocationSelect,
  onRouteCalculated,
  pickup,
  dropoff,
  onCalculate,
}) {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [suggestions, setSuggestions] = useState({ pickup: [], dropoff: [] });
  const [showSuggestions, setShowSuggestions] = useState({
    pickup: false,
    dropoff: false,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Manual search function as fallback
  const searchAddress = async (query, type) => {
    if (!query || query.length < 3) {
      setSuggestions((prev) => ({ ...prev, [type]: [] }));
      setShowSuggestions((prev) => ({ ...prev, [type]: false }));
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?` +
          new URLSearchParams({
            access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            country: 'NG',
            types: 'address,place,neighborhood,locality',
            autocomplete: 'true',
            limit: '10',
          })
      );

      const data = await response.json();

      if (data.features) {
        setSuggestions((prev) => ({ ...prev, [type]: data.features }));
        setShowSuggestions((prev) => ({ ...prev, [type]: true }));
      }
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  const handleInputChange = (value, type) => {
    if (type === 'pickup') {
      setPickupAddress(value);
    } else {
      setDropoffAddress(value);
    }

    setTimeout(() => {
      searchAddress(value, type);
    }, 300);
  };

  const handleSuggestionClick = (suggestion, type) => {
    const locationData = {
      ...suggestion,
      geometry: {
        type: 'Point',
        coordinates: suggestion.center,
      },
      properties: {
        full_address: suggestion.place_name,
      },
      place_name: suggestion.place_name,
    };

    onLocationSelect(type, locationData);

    if (type === 'pickup') {
      setPickupAddress(suggestion.place_name);
    } else {
      setDropoffAddress(suggestion.place_name);
    }

    setShowSuggestions((prev) => ({ ...prev, [type]: false }));
    setSuggestions((prev) => ({ ...prev, [type]: [] }));
  };

  const calculateRoute = async () => {
    if (!pickup || !dropoff) return;

    setCalculatingRoute(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.geometry.coordinates[0]},${pickup.geometry.coordinates[1]};${dropoff.geometry.coordinates[0]},${dropoff.geometry.coordinates[1]}?` +
          new URLSearchParams({
            access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            geometries: 'geojson',
            overview: 'full',
          })
      );

      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const polyline = route.geometry.coordinates;

        const distance = (route.distance / 1000).toFixed(1);
        const duration = Math.round(route.duration / 60);
        const baseFare = 100;
        const perKm = 50;
        const estimatedFare = Math.round(baseFare + distance * perKm);

        const routeInfo = {
          distance,
          duration,
          estimatedFare,
          polyline,
        };

        onRouteCalculated(routeInfo);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    } finally {
      setCalculatingRoute(false);
    }
  };

  // Calculate route automatically when both locations are selected
  useEffect(() => {
    if (pickup && dropoff) {
      calculateRoute();
    }
  }, [pickup, dropoff]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-white mb-2">
            Pickup Location
          </label>
          <div className="flex items-center bg-white rounded-lg p-4 border-2 border-[#3A0A21]">
            <div className="w-3 h-3 rounded-full bg-[#3A0A21] mr-3"></div>
            <input
              type="text"
              placeholder="Enter pickup location"
              className="flex-1 bg-transparent outline-none text-[#3A0A21] placeholder-gray-500 w-full"
              disabled
            />
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-white">Loading address search...</p>
        </div>
      </div>
    );
  }

  // Client-side only Mapbox import
  let AddressAutofill;
  try {
    const MapboxSearch = require('@mapbox/search-js-react');
    AddressAutofill = MapboxSearch.AddressAutofill;
  } catch (error) {
    console.log('Mapbox not available, using fallback');
  }

  const handleRetrieve = (result, type) => {
    console.log('Mapbox retrieve result:', result, type);

    const locationData = {
      ...result,
      geometry: {
        type: 'Point',
        coordinates: result.geometry.coordinates,
      },
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
      {/* Pickup Input */}
      <div className="relative">
        <label className="block text-sm font-medium text-white mb-2">
          Pickup Location
        </label>
        <div className="flex items-center bg-white rounded-lg p-4 border-2 border-[#3A0A21]">
          <div className="w-3 h-3 rounded-full bg-[#3A0A21] mr-3"></div>
          {AddressAutofill ? (
            <AddressAutofill
              accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              onRetrieve={(result) => handleRetrieve(result, 'pickup')}
              options={{
                country: 'NG',
                types: ['address', 'place', 'neighborhood', 'locality'],
                limit: 10,
              }}
            >
              <input
                type="text"
                placeholder="Enter pickup location"
                value={pickupAddress}
                onChange={(e) => handleInputChange(e.target.value, 'pickup')}
                autoComplete="address-line1"
                className="flex-1 bg-transparent outline-none text-[#3A0A21] placeholder-gray-500 w-full"
              />
            </AddressAutofill>
          ) : (
            <input
              type="text"
              placeholder="Enter pickup location"
              value={pickupAddress}
              onChange={(e) => handleInputChange(e.target.value, 'pickup')}
              className="flex-1 bg-transparent outline-none text-[#3A0A21] placeholder-gray-500 w-full"
            />
          )}
        </div>

        {/* Manual Suggestions for Pickup */}
        {showSuggestions.pickup && suggestions.pickup.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.pickup.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion, 'pickup')}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-gray-500">
                      {suggestion.place_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dropoff Input */}
      <div className="relative">
        <label className="block text-sm font-medium text-white mb-2">
          Dropoff Location
        </label>
        <div className="flex items-center bg-white rounded-lg p-4 border-2 border-[#3A0A21]">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
          {AddressAutofill ? (
            <AddressAutofill
              accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              onRetrieve={(result) => handleRetrieve(result, 'dropoff')}
              options={{
                country: 'NG',
                types: ['address', 'place', 'neighborhood', 'locality'],
                limit: 10,
              }}
            >
              <input
                type="text"
                placeholder="Enter dropoff location"
                value={dropoffAddress}
                onChange={(e) => handleInputChange(e.target.value, 'dropoff')}
                autoComplete="address-line1"
                className="flex-1 bg-transparent outline-none text-[#3A0A21] placeholder-gray-500 w-full"
              />
            </AddressAutofill>
          ) : (
            <input
              type="text"
              placeholder="Enter dropoff location"
              value={dropoffAddress}
              onChange={(e) => handleInputChange(e.target.value, 'dropoff')}
              className="flex-1 bg-transparent outline-none text-[#3A0A21] placeholder-gray-500 w-full"
            />
          )}
        </div>

        {/* Manual Suggestions for Dropoff */}
        {showSuggestions.dropoff && suggestions.dropoff.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.dropoff.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion, 'dropoff')}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-gray-500">
                      {suggestion.place_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calculate Delivery Button */}
      {pickup && dropoff && (
        <button
          onClick={onCalculate}
          disabled={!pickup || !dropoff || calculatingRoute}
          className="w-full py-4 bg-[#3A0A21] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition"
        >
          {calculatingRoute ? 'Calculating...' : 'Next'}
        </button>
      )}

      {/* Loading Indicator */}
      {calculatingRoute && (
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      )}
    </div>
  );
}

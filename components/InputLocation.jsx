'use client';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { useBrandColors } from '@/hooks/BrandColors';

export default function InputLocation({
  onLocationSelect,
  onRouteCalculated,
  pickup,
  dropoff,
  onCalculate,
  showNextButton = false,
}) {
  const { brandColors } = useBrandColors();
  
  // Initialize all state with defined values (empty strings, not undefined)
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [suggestions, setSuggestions] = useState({ pickup: [], dropoff: [] });
  const [showSuggestions, setShowSuggestions] = useState({
    pickup: false,
    dropoff: false,
  });
  const [routeInfo, setRouteInfo] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // Debounce timers
  const pickupTimerRef = useRef(null);
  const dropoffTimerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    // Get user's current location for proximity bias
    getUserLocation();
  }, []);

  // Sync addresses when pickup/dropoff props change
  useEffect(() => {
    if (pickup?.place_name && pickupAddress !== pickup.place_name) {
      setPickupAddress(pickup.place_name);
    }
  }, [pickup]);

  useEffect(() => {
    if (dropoff?.place_name && dropoffAddress !== dropoff.place_name) {
      setDropoffAddress(dropoff.place_name);
    }
  }, [dropoff]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        },
        (error) => {
          console.log('Could not get user location:', error);
          // Default to Abuja, Nigeria center if geolocation fails
          setUserLocation({
            longitude: 7.4951,
            latitude: 9.0765,
          });
        }
      );
    } else {
      // Default to Abuja, Nigeria
      setUserLocation({
        longitude: 7.4951,
        latitude: 9.0765,
      });
    }
  };

  const searchAddress = async (query, type) => {
    if (!query || query.length < 3) {
      setSuggestions((prev) => ({ ...prev, [type]: [] }));
      setShowSuggestions((prev) => ({ ...prev, [type]: false }));
      return;
    }

    try {
      const params = {
        access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
        country: 'NG',
        // More comprehensive types for better results
        types: 'address,poi,place,postcode,locality,neighborhood',
        autocomplete: 'true',
        limit: '8',
        language: 'en',
      };

      // Add proximity bias if user location is available
      if (userLocation) {
        params.proximity = `${userLocation.longitude},${userLocation.latitude}`;
      }

      // Add bbox for Nigeria to ensure results are within the country
      // Nigeria bounding box: [minLon, minLat, maxLon, maxLat]
      params.bbox = '2.668432,4.240594,14.680073,13.892007';

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?${new URLSearchParams(params)}`
      );

      const data = await response.json();

      if (data.features) {
        // Filter and enhance results
        const enhancedFeatures = data.features.map((feature) => ({
          ...feature,
          // Add relevance score display
          relevance_display: feature.relevance ? 
            Math.round(feature.relevance * 100) : 0,
        }));

        setSuggestions((prev) => ({ 
          ...prev, 
          [type]: enhancedFeatures 
        }));
        setShowSuggestions((prev) => ({ ...prev, [type]: true }));
      }
    } catch (error) {
      console.error('Error searching address:', error);
      setSuggestions((prev) => ({ ...prev, [type]: [] }));
    }
  };

  const handleInputChange = (value, type) => {
    // Always ensure value is a string
    const sanitizedValue = value || '';
    
    if (type === 'pickup') {
      setPickupAddress(sanitizedValue);
      // Clear previous timer
      if (pickupTimerRef.current) {
        clearTimeout(pickupTimerRef.current);
      }
      // Set new timer with optimized debounce
      pickupTimerRef.current = setTimeout(() => {
        searchAddress(sanitizedValue, type);
      }, 400);
    } else {
      setDropoffAddress(sanitizedValue);
      // Clear previous timer
      if (dropoffTimerRef.current) {
        clearTimeout(dropoffTimerRef.current);
      }
      // Set new timer
      dropoffTimerRef.current = setTimeout(() => {
        searchAddress(sanitizedValue, type);
      }, 400);
    }
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
        place_type: suggestion.place_type,
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

  const useCurrentLocation = (type) => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { longitude, latitude } = position.coords;
        
        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
            new URLSearchParams({
              access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
              types: 'address,poi,place',
              limit: '1',
            })
          );
          
          const data = await response.json();
          
          if (data.features && data.features[0]) {
            const feature = data.features[0];
            const locationData = {
              ...feature,
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              properties: {
                full_address: feature.place_name,
              },
              place_name: feature.place_name,
            };

            onLocationSelect(type, locationData);
            
            if (type === 'pickup') {
              setPickupAddress(feature.place_name);
            } else {
              setDropoffAddress(feature.place_name);
            }
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setGettingLocation(false);
        alert('Could not access your location. Please ensure location permissions are enabled.');
      }
    );
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
            steps: 'true',
            alternatives: 'false',
          })
      );

      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const polyline = route.geometry.coordinates;

        const distance = (route.distance / 1000).toFixed(1);
        const duration = Math.round(route.duration / 60);
        const baseFare = 150;
        const perKm = 60;
        const suggestedFare = Math.round(baseFare + distance * perKm);

        const calculatedRouteInfo = {
          distance,
          duration,
          estimatedFare: suggestedFare,
          suggestedFare: suggestedFare,
          polyline,
        };

        setRouteInfo(calculatedRouteInfo);
        onRouteCalculated(calculatedRouteInfo);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Failed to calculate route. Please try different locations.');
    } finally {
      setCalculatingRoute(false);
    }
  };

  useEffect(() => {
    if (pickup && dropoff) {
      calculateRoute();
    }
  }, [pickup, dropoff]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (pickupTimerRef.current) clearTimeout(pickupTimerRef.current);
      if (dropoffTimerRef.current) clearTimeout(dropoffTimerRef.current);
    };
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-white mb-2">
            Pickup Location
          </label>
          <div 
            className="flex items-center bg-white rounded-lg p-4 border-2"
            style={{ borderColor: brandColors.primary }}
          >
            <div 
              className="w-3 h-3 rounded-full mr-3"
              style={{ backgroundColor: brandColors.primary }}
            ></div>
            <input
              type="text"
              placeholder="Enter pickup location"
              value=""
              className="flex-1 bg-transparent outline-none placeholder-gray-500 w-full"
              style={{ color: brandColors.primary }}
              disabled
              readOnly
            />
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-white">Loading address search...</p>
        </div>
      </div>
    );
  }

  const renderLocationInput = (type, value, placeholder, iconColor) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {type === 'pickup' ? 'Pickup Location' : 'Dropoff Location'}
      </label>
      <div className="relative">
        <MapPin 
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5`}
          style={{ color: iconColor }}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => handleInputChange(e.target.value, type)}
          className="w-full pl-11 pr-24 py-3 border border-gray-300 rounded-lg outline-none transition-all text-gray-900 placeholder-gray-400"
          style={{
            focusBorderColor: brandColors.primary,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = brandColors.primary;
            e.target.style.boxShadow = `0 0 0 3px ${brandColors.primary}10`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="button"
          onClick={() => useCurrentLocation(type)}
          disabled={gettingLocation}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          style={{ color: brandColors.primary }}
          title="Use current location"
        >
          {gettingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions[type] && suggestions[type].length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          {suggestions[type].map((suggestion, index) => (
            <div
              key={`${suggestion.id}-${index}`}
              onClick={() => handleSuggestionClick(suggestion, type)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium truncate">
                    {suggestion.text}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {suggestion.place_name}
                  </p>
                  {/* Show place type badge */}
                  {suggestion.place_type && suggestion.place_type.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {suggestion.place_type.map((ptype, i) => (
                        <span 
                          key={i}
                          className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {ptype}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Relevance indicator */}
                {suggestion.relevance_display > 0 && (
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {suggestion.relevance_display}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions[type] && 
       suggestions[type].length === 0 && 
       value && 
       value.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">
            No locations found. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 space-y-4">
      {/* Pickup Input */}
      {renderLocationInput(
        'pickup',
        pickupAddress,
        'Enter pickup location',
        brandColors.primary
      )}

      {/* Dropoff Input */}
      {renderLocationInput(
        'dropoff',
        dropoffAddress,
        'Enter dropoff location',
        brandColors.accent
      )}

      {/* Route Calculation Loading */}
      {calculatingRoute && (
        <div className="text-center py-4">
          <div 
            className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent"
            style={{ borderColor: `${brandColors.primary}40`, borderTopColor: 'transparent' }}
          ></div>
          <p className="mt-2 text-gray-600 text-sm">Calculating optimal route...</p>
        </div>
      )}


      {/* Next Button */}
      {showNextButton && pickup && dropoff && routeInfo && (
        <button
          onClick={onCalculate}
          disabled={!pickup || !dropoff || calculatingRoute}
          className="w-full py-4 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
          }}
        >
          {calculatingRoute ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </span>
          ) : (
            'Next: Package Details'
          )}
        </button>
      )}
    </div>
  );
}
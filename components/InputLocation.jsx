'use client';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Navigation, X } from 'lucide-react';
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
  const MAROON = brandColors.primary;
  const ORANGE = brandColors.accent;
  const [pickupAddress, setPickupAddress]   = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [isClient, setIsClient]             = useState(false);
  const [suggestions, setSuggestions]       = useState({ pickup: [], dropoff: [] });
  const [showSuggestions, setShowSuggestions] = useState({ pickup: false, dropoff: false });
  const [userLocation, setUserLocation]     = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [activeField, setActiveField]       = useState(null); // 'pickup' | 'dropoff' | null

  const pickupTimerRef  = useRef(null);
  const dropoffTimerRef = useRef(null);
  const containerRef    = useRef(null);

  // ── Init ──────────────────────────────────────────────────
  useEffect(() => {
    setIsClient(true);
    getUserLocation();

    // Close suggestions when clicking outside
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions({ pickup: false, dropoff: false });
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync prop → display text
  useEffect(() => {
    if (pickup?.place_name) setPickupAddress(pickup.place_name);
  }, [pickup]);

  useEffect(() => {
    if (dropoff?.place_name) setDropoffAddress(dropoff.place_name);
  }, [dropoff]);

  // Auto-calculate route when both set
  useEffect(() => {
    if (pickup && dropoff) calculateRoute();
  }, [pickup, dropoff]);

  // Cleanup timers
  useEffect(() => () => {
    if (pickupTimerRef.current)  clearTimeout(pickupTimerRef.current);
    if (dropoffTimerRef.current) clearTimeout(dropoffTimerRef.current);
  }, []);

  // ── Geolocation ────────────────────────────────────────────
  const getUserLocation = () => {
    if (!navigator.geolocation) return setUserLocation({ longitude: 7.4951, latitude: 9.0765 });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setUserLocation({ longitude: coords.longitude, latitude: coords.latitude }),
      ()           => setUserLocation({ longitude: 7.4951, latitude: 9.0765 })
    );
  };

  // ── Mapbox address search ──────────────────────────────────
  const searchAddress = async (query, type) => {
    if (!query || query.length < 3) {
      setSuggestions(prev => ({ ...prev, [type]: [] }));
      setShowSuggestions(prev => ({ ...prev, [type]: false }));
      return;
    }
    try {
      const params = {
        access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
        country: 'NG',
        types: 'address,poi,place,locality,neighborhood',
        autocomplete: 'true',
        limit: '6',
        language: 'en',
        bbox: '2.668432,4.240594,14.680073,13.892007',
      };
      if (userLocation) params.proximity = `${userLocation.longitude},${userLocation.latitude}`;

      const res  = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${new URLSearchParams(params)}`
      );
      const data = await res.json();

      if (data.features) {
        setSuggestions(prev => ({ ...prev, [type]: data.features }));
        setShowSuggestions(prev => ({ ...prev, [type]: true }));
      }
    } catch {
      setSuggestions(prev => ({ ...prev, [type]: [] }));
    }
  };

  // ── Input change ───────────────────────────────────────────
  const handleInputChange = (value, type) => {
    const v = value || '';
    if (type === 'pickup') {
      setPickupAddress(v);
      // Clear selection if user edits
      if (pickup && v !== pickup.place_name) onLocationSelect('pickup', null);
      clearTimeout(pickupTimerRef.current);
      pickupTimerRef.current = setTimeout(() => searchAddress(v, type), 350);
    } else {
      setDropoffAddress(v);
      if (dropoff && v !== dropoff.place_name) onLocationSelect('dropoff', null);
      clearTimeout(dropoffTimerRef.current);
      dropoffTimerRef.current = setTimeout(() => searchAddress(v, type), 350);
    }
  };

  // ── Suggestion select ──────────────────────────────────────
  const handleSuggestionClick = (suggestion, type) => {
    const loc = {
      ...suggestion,
      geometry: { type: 'Point', coordinates: suggestion.center },
      place_name: suggestion.place_name,
    };
    onLocationSelect(type, loc);
    if (type === 'pickup') setPickupAddress(suggestion.place_name);
    else                   setDropoffAddress(suggestion.place_name);
    setShowSuggestions(prev => ({ ...prev, [type]: false }));
    setSuggestions(prev => ({ ...prev, [type]: [] }));
    setActiveField(null);
  };

  // ── Clear field ────────────────────────────────────────────
  const clearField = (type) => {
    if (type === 'pickup') {
      setPickupAddress('');
      onLocationSelect('pickup', null);
    } else {
      setDropoffAddress('');
      onLocationSelect('dropoff', null);
    }
    setSuggestions(prev => ({ ...prev, [type]: [] }));
    setShowSuggestions(prev => ({ ...prev, [type]: false }));
  };

  // ── Use current location ───────────────────────────────────
  const useCurrentLocation = (type) => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { longitude, latitude } }) => {
        try {
          const res  = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
            new URLSearchParams({
              access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
              types: 'address,poi,place', limit: '1',
            })
          );
          const data = await res.json();
          if (data.features?.[0]) {
            const f   = data.features[0];
            const loc = { ...f, geometry: { type: 'Point', coordinates: [longitude, latitude] }, place_name: f.place_name };
            onLocationSelect(type, loc);
            if (type === 'pickup') setPickupAddress(f.place_name);
            else                   setDropoffAddress(f.place_name);
          }
        } catch { /* silent */ }
        finally { setGettingLocation(false); }
      },
      () => { setGettingLocation(false); }
    );
  };

  // ── Route calculation ──────────────────────────────────────
  const calculateRoute = async () => {
    if (!pickup?.geometry?.coordinates || !dropoff?.geometry?.coordinates) return;
    setCalculatingRoute(true);
    try {
      const [px, py] = pickup.geometry.coordinates;
      const [dx, dy] = dropoff.geometry.coordinates;
      const res  = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${px},${py};${dx},${dy}?` +
        new URLSearchParams({
          access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
          geometries: 'geojson', overview: 'full', steps: 'false',
        })
      );
      const data = await res.json();
      if (data.routes?.[0]) {
        const r    = data.routes[0];
        const dist = (r.distance / 1000).toFixed(1);
        const dur  = Math.round(r.duration / 60);
        const fare = Math.round(150 + dist * 60);
        const info = { distance: dist, duration: dur, estimatedFare: fare, suggestedFare: fare, polyline: r.geometry.coordinates };
        onRouteCalculated(info);
      }
    } catch { /* silent */ }
    finally { setCalculatingRoute(false); }
  };

  // ── SSR skeleton ───────────────────────────────────────────
  if (!isClient) {
    return (
      <div className="rounded-2xl border border-gray-200 p-5 space-y-3 bg-white">
        {['Pickup Location', 'Dropoff Location'].map(label => (
          <div key={label}>
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</p>
            <div className="h-11 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // ── Field renderer ─────────────────────────────────────────
  const renderField = (type, value, placeholder) => {
    const isActive  = activeField === type;
    const isFilled  = type === 'pickup' ? !!pickup : !!dropoff;
    const dotColor  = type === 'pickup' ? MAROON : ORANGE;
    const hasSuggest = showSuggestions[type] && suggestions[type].length > 0;
    const noResults  = showSuggestions[type] && suggestions[type].length === 0 && value?.length >= 3;

    return (
      <div className="relative">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          {type === 'pickup' ? 'Pickup' : 'Dropoff'}
        </label>

        <div
          className="flex items-center border rounded-xl transition-all overflow-hidden"
          style={{
            borderColor: isActive ? dotColor : isFilled ? `${dotColor}55` : '#e5e7eb',
            boxShadow: isActive ? `0 0 0 3px ${dotColor}15` : 'none',
            background: '#fff',
          }}
        >
          {/* Colour dot */}
          <div className="pl-3 pr-2 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: dotColor }} />
          </div>

          <input
            type="text"
            placeholder={placeholder}
            value={value || ''}
            onChange={e => handleInputChange(e.target.value, type)}
            onFocus={() => {
              setActiveField(type);
              if (value?.length >= 3) setShowSuggestions(prev => ({ ...prev, [type]: true }));
            }}
            className="flex-1 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none min-w-0"
          />

          {/* Right action buttons */}
          <div className="flex items-center pr-1 gap-0.5">
            {/* Clear button — only when filled */}
            {value ? (
              <button
                type="button"
                onClick={() => clearField(type)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: '#9ca3af' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}

            {/* GPS button */}
            <button
              type="button"
              onClick={() => useCurrentLocation(type)}
              disabled={gettingLocation}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
              style={{ color: dotColor }}
              title="Use current location"
            >
              {gettingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Suggestions dropdown */}
        {hasSuggest && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {suggestions[type].map((s, i) => (
              <button
                key={`${s.id}-${i}`}
                type="button"
                onClick={() => handleSuggestionClick(s, type)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: dotColor }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{s.text}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{s.place_name}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {noResults && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-4 text-center">
            <p className="text-sm text-gray-400">No locations found. Try a different search.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">

      {renderField('pickup',  pickupAddress,  'Enter pickup location')}
      {renderField('dropoff', dropoffAddress, 'Enter dropoff location')}

      {/* Route calculating indicator — subtle, not a full spinner */}
      {calculatingRoute && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: MAROON }} />
          Calculating route…
        </div>
      )}

      {/* Next button — only on /send when showNextButton=true */}
      {showNextButton && pickup && dropoff && (
        <button
          onClick={onCalculate}
          disabled={calculatingRoute}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50 active:scale-[0.98]"
          style={{ background: calculatingRoute ? '#9ca3af' : MAROON }}
        >
          {calculatingRoute ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Calculating…
            </span>
          ) : (
            'Next: Package Details →'
          )}
        </button>
      )}
    </div>
  );
}
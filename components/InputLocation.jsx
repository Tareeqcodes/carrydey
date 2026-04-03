'use client';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Navigation, X, Plus, Trash2 } from 'lucide-react';
import { useBrandColors } from '@/hooks/BrandColors';

function createDropoff(id) {
  return {
    id,
    location: null,
    address: '',
    recipientName: '',
    recipientPhone: '',
    packageLabel: '',
  };
}

// Strip internal-only keys before sending to parent
function toClean(d) {
  const { suggestions, showSugg, ...clean } = d;
  return clean;
}

export default function InputLocation({
  onLocationSelect,
  onDropoffsChange,
  onRouteCalculated,
  pickup,
  dropoffs: dropoffsProp,
  dropoff,
  onCalculate,
  showNextButton = false,
}) {
  const { brandColors } = useBrandColors();
  const MAROON = brandColors.primary;
  const ORANGE = brandColors.accent;

  const [pickupAddress, setPickupAddress] = useState('');
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const [dropoffStates, setDropoffStates] = useState(() =>
    (dropoffsProp || [createDropoff('d1')]).map((d) => ({
      ...d,
      suggestions: [],
      showSugg: false,
    }))
  );
  const dropoffStatesRef = useRef(dropoffStates);
  useEffect(() => {
    dropoffStatesRef.current = dropoffStates;
  }, [dropoffStates]);

  const [pickupSugg, setPickupSugg] = useState([]);
  const [showPickupSugg, setShowPickupSugg] = useState(false);

  const pickupTimerRef = useRef(null);
  const dropoffTimers = useRef({});
  const containerRef = useRef(null);

  // ── Mount: get location once, set proximity bias + auto-prefill pickup ──
  useEffect(() => {
    setIsClient(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { longitude, latitude } }) => {
          setUserLocation({ longitude, latitude });

          // Only auto-prefill if no pickup was passed in (e.g. from sessionStorage)
          if (!pickup) {
            setGettingLocation(true);
            try {
              const res = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
                  new URLSearchParams({
                    access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
                    types: 'address,poi,place',
                    limit: '1',
                  })
              );
              const data = await res.json();
              if (data.features?.[0]) {
                const f = data.features[0];
                const loc = {
                  ...f,
                  geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                  },
                  place_name: f.place_name,
                };
                onLocationSelect('pickup', loc);
                setPickupAddress(f.place_name);
              }
            } catch {
              /* silent */
            } finally {
              setGettingLocation(false);
            }
          }
        },
        () => setUserLocation({ longitude: 7.4951, latitude: 9.0765 })
      );
    } else {
      setUserLocation({ longitude: 7.4951, latitude: 9.0765 });
    }

    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowPickupSugg(false);
        setDropoffStates((prev) =>
          prev.map((d) => ({ ...d, showSugg: false }))
        );
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (pickup?.place_name) setPickupAddress(pickup.place_name);
  }, [pickup]);

  useEffect(() => {
    if (!dropoffsProp) return;
    setDropoffStates((prev) =>
      dropoffsProp.map((d, i) => ({
        ...d,
        suggestions: prev[i]?.suggestions || [],
        showSugg: prev[i]?.showSugg || false,
      }))
    );
  }, [dropoffsProp]);

  useEffect(() => {
    const firstDropoffLoc = dropoffStates[0]?.location || dropoff;
    if (pickup && firstDropoffLoc) calculateRoute(firstDropoffLoc);
  }, [pickup, dropoffStates]);

  useEffect(
    () => () => {
      clearTimeout(pickupTimerRef.current);
      Object.values(dropoffTimers.current).forEach(clearTimeout);
    },
    []
  );

  // ── Mapbox search ──────────────────────────────────────────────────────
  const searchAddress = async (query, callback) => {
    if (!query || query.length < 3) {
      callback([]);
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
      if (userLocation)
        params.proximity = `${userLocation.longitude},${userLocation.latitude}`;
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${new URLSearchParams(params)}`
      );
      const data = await res.json();
      callback(data.features || []);
    } catch {
      callback([]);
    }
  };

  // ── Route calculation ──────────────────────────────────────────────────
  const calculateRoute = async (dropoffLoc) => {
    if (!pickup?.geometry?.coordinates || !dropoffLoc?.geometry?.coordinates)
      return;
    setCalculatingRoute(true);
    try {
      const [px, py] = pickup.geometry.coordinates;
      const [dx, dy] = dropoffLoc.geometry.coordinates;
      const res = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${px},${py};${dx},${dy}?` +
          new URLSearchParams({
            access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            geometries: 'geojson',
            overview: 'full',
            steps: 'false',
          })
      );
      const data = await res.json();
      if (data.routes?.[0]) {
        const r = data.routes[0];
        const dist = (r.distance / 1000).toFixed(1);
        const dur = Math.round(r.duration / 60);
        const fare = Math.round(150 + dist * 60);
        onRouteCalculated({
          distance: dist,
          duration: dur,
          estimatedFare: fare,
          suggestedFare: fare,
          polyline: r.geometry.coordinates,
        });
      }
    } catch {
      /* silent */
    } finally {
      setCalculatingRoute(false);
    }
  };

  // ── Pickup handlers ────────────────────────────────────────────────────
  const handlePickupChange = (value) => {
    setPickupAddress(value || '');
    if (pickup && value !== pickup.place_name) onLocationSelect('pickup', null);
    clearTimeout(pickupTimerRef.current);
    pickupTimerRef.current = setTimeout(() => {
      searchAddress(value, (results) => {
        setPickupSugg(results);
        setShowPickupSugg(results.length > 0);
      });
    }, 350);
  };

  const handlePickupSelect = (s) => {
    const loc = {
      ...s,
      geometry: { type: 'Point', coordinates: s.center },
      place_name: s.place_name,
    };
    onLocationSelect('pickup', loc);
    setPickupAddress(s.place_name);
    setPickupSugg([]);
    setShowPickupSugg(false);
    setActiveField(null);
  };

  // Manual "use my location" button — still available for re-triggering
  const useCurrentLocationForPickup = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { longitude, latitude } }) => {
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
              new URLSearchParams({
                access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
                types: 'address,poi,place',
                limit: '1',
              })
          );
          const data = await res.json();
          if (data.features?.[0]) {
            const f = data.features[0];
            const loc = {
              ...f,
              geometry: { type: 'Point', coordinates: [longitude, latitude] },
              place_name: f.place_name,
            };
            onLocationSelect('pickup', loc);
            setPickupAddress(f.place_name);
          }
        } catch {
          /* silent */
        } finally {
          setGettingLocation(false);
        }
      },
      () => setGettingLocation(false)
    );
  };

  // ── Dropoff handlers ───────────────────────────────────────────────────
  const handleDropoffAddressChange = (idx, value) => {
    const next = dropoffStatesRef.current.map((d, i) =>
      i === idx ? { ...d, address: value, location: null } : d
    );
    dropoffStatesRef.current = next;
    setDropoffStates(next);

    clearTimeout(dropoffTimers.current[idx]);
    dropoffTimers.current[idx] = setTimeout(() => {
      searchAddress(value, (results) => {
        setDropoffStates((prev) => {
          const updated = prev.map((d, i) =>
            i === idx
              ? { ...d, suggestions: results, showSugg: results.length > 0 }
              : d
          );
          dropoffStatesRef.current = updated;
          return updated;
        });
      });
    }, 350);
  };

  const handleDropoffSelect = (idx, s) => {
    const loc = {
      ...s,
      geometry: { type: 'Point', coordinates: s.center },
      place_name: s.place_name,
    };
    const patch = {
      location: loc,
      address: s.place_name,
      suggestions: [],
      showSugg: false,
    };
    const next = dropoffStatesRef.current.map((d, i) =>
      i === idx ? { ...d, ...patch } : d
    );
    dropoffStatesRef.current = next;
    setDropoffStates(next);
    onDropoffsChange?.(next.map(toClean));
    setActiveField(null);
  };

  const addDropoff = () => {
    const id = `d${Date.now()}`;
    const next = [
      ...dropoffStatesRef.current,
      { ...createDropoff(id), suggestions: [], showSugg: false },
    ];
    dropoffStatesRef.current = next;
    setDropoffStates(next);
    onDropoffsChange?.(next.map(toClean));
  };

  const removeDropoff = (idx) => {
    if (dropoffStatesRef.current.length <= 1) return;
    const next = dropoffStatesRef.current.filter((_, i) => i !== idx);
    dropoffStatesRef.current = next;
    setDropoffStates(next);
    onDropoffsChange?.(next.map(toClean));
  };

  // ── SSR skeleton ───────────────────────────────────────────────────────
  if (!isClient) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 p-5 space-y-3 bg-white">
        {['Pickup', 'Drop-off 1'].map((label) => (
          <div key={label}>
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {label}
            </p>
            <div className="h-11 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm"
    >
      {/* ── Pickup ── */}
      <div className="relative">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          Pickup
        </label>
        <div
          className="flex items-center border rounded-xl transition-all overflow-hidden"
          style={{
            borderColor:
              activeField === 'pickup'
                ? MAROON
                : pickup
                  ? `${MAROON}55`
                  : '#e5e7eb',
            boxShadow:
              activeField === 'pickup' ? `0 0 0 3px ${MAROON}15` : 'none',
          }}
        >
          <div className="pl-3 pr-2 flex-shrink-0">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: MAROON }}
            />
          </div>
          <input
            type="text"
            placeholder="Detecting your location…"
            value={pickupAddress}
            onChange={(e) => handlePickupChange(e.target.value)}
            onFocus={() => {
              setActiveField('pickup');
              if (pickupAddress.length >= 3) setShowPickupSugg(true);
            }}
            className="flex-1 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none min-w-0"
          />
          <div className="flex items-center pr-1 gap-0.5">
            {pickupAddress && (
              <button
                type="button"
                onClick={() => {
                  setPickupAddress('');
                  onLocationSelect('pickup', null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
                style={{ color: '#9ca3af' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={useCurrentLocationForPickup}
              disabled={gettingLocation}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"
              style={{ color: MAROON }}
              title="Use my current location"
            >
              {gettingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {showPickupSugg && pickupSugg.length > 0 && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {pickupSugg.map((s, i) => (
              <button
                key={`${s.id}-${i}`}
                type="button"
                onClick={() => handlePickupSelect(s)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left"
              >
                <MapPin
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: MAROON }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {s.text}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {s.place_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Dropoffs ── */}
      <div className="space-y-3">
        {dropoffStates.map((d, idx) => (
          <div
            key={d.id}
            className="border border-gray-100 rounded-xl p-3 space-y-2.5"
            style={{ background: `${ORANGE}05` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                  style={{ background: ORANGE }}
                >
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Drop-off {idx + 1}
                </span>
              </div>
              {dropoffStates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDropoff(idx)}
                  className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                  style={{ color: '#9ca3af' }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <div
                className="flex items-center border rounded-xl transition-all overflow-hidden bg-white"
                style={{
                  borderColor:
                    activeField === `dropoff-${idx}`
                      ? ORANGE
                      : d.location
                        ? `${ORANGE}55`
                        : '#e5e7eb',
                  boxShadow:
                    activeField === `dropoff-${idx}`
                      ? `0 0 0 3px ${ORANGE}15`
                      : 'none',
                }}
              >
                <div className="pl-3 pr-2 flex-shrink-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: ORANGE }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Delivery address"
                  value={d.address}
                  onChange={(e) =>
                    handleDropoffAddressChange(idx, e.target.value)
                  }
                  onFocus={() => {
                    setActiveField(`dropoff-${idx}`);
                    if (d.address.length >= 3)
                      setDropoffStates((prev) =>
                        prev.map((x, i) =>
                          i === idx ? { ...x, showSugg: true } : x
                        )
                      );
                  }}
                  className="flex-1 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none min-w-0"
                />
                {d.address && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = dropoffStatesRef.current.map((x, i) =>
                        i === idx
                          ? {
                              ...x,
                              address: '',
                              location: null,
                              suggestions: [],
                              showSugg: false,
                            }
                          : x
                      );
                      dropoffStatesRef.current = next;
                      setDropoffStates(next);
                      onDropoffsChange?.(next.map(toClean));
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 mr-1"
                    style={{ color: '#9ca3af' }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {d.showSugg && d.suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  {d.suggestions.map((s, si) => (
                    <button
                      key={`${s.id}-${si}`}
                      type="button"
                      onClick={() => handleDropoffSelect(idx, s)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left"
                    >
                      <MapPin
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: ORANGE }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {s.text}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {s.place_name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Add stop ── */}
      <button
        type="button"
        onClick={addDropoff}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-300 transition-all"
      >
        <Plus className="w-4 h-4" />
        Add drop-off
      </button>

      {calculatingRoute && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Loader2
            className="w-3.5 h-3.5 animate-spin"
            style={{ color: MAROON }}
          />
          Checking route…
        </div>
      )}

      {showNextButton && pickup && dropoffStates[0]?.location && (
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

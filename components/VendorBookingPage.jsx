'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Plus,
  Trash2,
  User,
  Phone,
  Hash,
  Package,
  ChevronRight,
  ChevronDown,
  Navigation,
  Loader2,
  Store,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useBrandColors } from '@/hooks/BrandColors';
import PackageSection from '@/components/PackageAndFare/PackageSection';
import PaymentSection from '@/components/PackageAndFare/PaymentSection';
import { formatNairaSimple } from '@/hooks/currency';

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const MAROON = '#3A0A21';
const BASE_FARE_PER_KM = 60;
const BASE_FARE = 150;

function estimateFare(distanceKm) {
  return Math.round(BASE_FARE + parseFloat(distanceKm || 0) * BASE_FARE_PER_KM);
}

function makeRecipient(id) {
  return {
    id,
    address: '',
    location: null,
    recipientName: '',
    recipientPhone: '',
    orderRef: '',
    routeData: null,
    suggestions: [],
    showSugg: false,
    calculatingRoute: false,
    error: null,
  };
}

/* ─────────────────────────────────────────────
   Mapbox helpers
───────────────────────────────────────────── */
async function searchMapbox(query, proximity) {
  if (!query || query.length < 3) return [];
  try {
    const params = {
      access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      country: 'NG',
      types: 'address,poi,place,locality,neighborhood',
      autocomplete: 'true',
      limit: '5',
      language: 'en',
      bbox: '2.668432,4.240594,14.680073,13.892007',
    };
    if (proximity) params.proximity = `${proximity.longitude},${proximity.latitude}`;
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${new URLSearchParams(params)}`
    );
    const data = await res.json();
    return data.features || [];
  } catch {
    return [];
  }
}

async function reverseGeocode(longitude, latitude) {
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
      return {
        ...f,
        geometry: { type: 'Point', coordinates: [longitude, latitude] },
        place_name: f.place_name,
      };
    }
  } catch { /* silent */ }
  return null;
}

async function calcRoute(pickupLoc, dropoffLoc) {
  if (!pickupLoc?.geometry?.coordinates || !dropoffLoc?.geometry?.coordinates) return null;
  try {
    const [px, py] = pickupLoc.geometry.coordinates;
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
      const distance = (r.distance / 1000).toFixed(1);
      const duration = Math.round(r.duration / 60);
      return { distance, duration, estimatedFare: estimateFare(distance) };
    }
  } catch { /* silent */ }
  return null;
}

/* ─────────────────────────────────────────────
   Step indicator
───────────────────────────────────────────── */
function StepIndicator({ step }) {
  const steps = ['Store', 'Orders', 'Details'];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((label, i) => {
        const idx = i + 1;
        const active = step === idx;
        const done = step > idx;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
                style={active ? { background: MAROON } : {}}
              >
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx}
              </div>
              <span
                className={`text-xs font-semibold ${
                  active ? 'text-gray-900' : done ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px w-6 ${done ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 1 — Store address
───────────────────────────────────────────── */
function StoreAddressStep({ pickupLoc, pickupAddress, setPickupAddress, setPickupLoc, savedAddress, onNext }) {
  const { brandColors } = useBrandColors();
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [gettingLoc, setGettingLoc] = useState(false);
  const [userLoc, setUserLoc] = useState(null);
  const [active, setActive] = useState(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { longitude, latitude } }) => setUserLoc({ longitude, latitude }),
        () => setUserLoc({ longitude: 7.4951, latitude: 9.0765 })
      );
    }
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSugg(false);
        setActive(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (val) => {
    setPickupAddress(val);
    if (pickupLoc) setPickupLoc(null);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const results = await searchMapbox(val, userLoc);
      setSuggestions(results);
      setShowSugg(results.length > 0);
    }, 350);
  };

  const handleSelect = (s) => {
    const loc = { ...s, geometry: { type: 'Point', coordinates: s.center }, place_name: s.place_name };
    setPickupLoc(loc);
    setPickupAddress(s.place_name);
    setSuggestions([]);
    setShowSugg(false);
    setActive(false);
  };

  const useMyLocation = async () => {
    setGettingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { longitude, latitude } }) => {
        const loc = await reverseGeocode(longitude, latitude);
        if (loc) { setPickupLoc(loc); setPickupAddress(loc.place_name); }
        setGettingLoc(false);
      },
      () => setGettingLoc(false)
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Your store address</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          This is where the courier will collect all orders from.
        </p>
      </div>

      {/* Saved address shortcut */}
      {savedAddress && !pickupLoc && (
        <button
          onClick={() => {
            setPickupLoc(savedAddress.loc);
            setPickupAddress(savedAddress.address);
          }}
          className="w-full flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all text-left"
        >
          <div className="p-2 rounded-xl" style={{ background: `${MAROON}15` }}>
            <Store className="w-4 h-4" style={{ color: MAROON }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 mb-0.5">Saved store address</p>
            <p className="text-sm font-medium text-gray-800 truncate">{savedAddress.address}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </button>
      )}

      {/* Address input */}
      <div ref={containerRef} className="relative">
        <div
          className="flex items-center border-2 rounded-2xl overflow-hidden transition-all bg-white"
          style={{ borderColor: active ? MAROON : pickupLoc ? `${MAROON}50` : '#e5e7eb' }}
        >
          <div className="pl-4 pr-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: MAROON }} />
          </div>
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setActive(true)}
            placeholder="Search your store address…"
            className="flex-1 py-3.5 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
          />
          <div className="flex items-center pr-2 gap-1">
            {pickupAddress && (
              <button onClick={() => { setPickupAddress(''); setPickupLoc(null); }} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
            <button
              onClick={useMyLocation}
              disabled={gettingLoc}
              className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-40"
              style={{ color: MAROON }}
            >
              {gettingLoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showSugg && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
            {suggestions.map((s, i) => (
              <button
                key={`${s.id}-${i}`}
                onClick={() => handleSelect(s)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 text-left"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: MAROON }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{s.text}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{s.place_name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {pickupLoc && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: `${MAROON}08` }}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: MAROON }} />
          <p className="text-xs font-medium text-gray-700 truncate">{pickupAddress}</p>
        </motion.div>
      )}

      <button
        onClick={onNext}
        disabled={!pickupLoc}
        className="w-full py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white"
        style={{ background: pickupLoc ? MAROON : '#e5e7eb', color: pickupLoc ? 'white' : '#9ca3af' }}
      >
        Next: Add Orders →
      </button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Recipient row card
───────────────────────────────────────────── */
function RecipientCard({ recipient, index, pickupLoc, userLoc, onUpdate, onRemove, canRemove }) {
  const { brandColors } = useBrandColors();
  const ORANGE = brandColors.accent || '#FF6B35';
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const [addrActive, setAddrActive] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onUpdate({ showSugg: false });
        setAddrActive(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAddressChange = (val) => {
    onUpdate({ address: val, location: null, error: null });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const results = await searchMapbox(val, userLoc);
      onUpdate({ suggestions: results, showSugg: results.length > 0 });
    }, 350);
  };

  const handleAddressSelect = async (s) => {
    const loc = { ...s, geometry: { type: 'Point', coordinates: s.center }, place_name: s.place_name };
    onUpdate({ location: loc, address: s.place_name, suggestions: [], showSugg: false, calculatingRoute: true });
    setAddrActive(false);
    const route = await calcRoute(pickupLoc, loc);
    onUpdate({ routeData: route, calculatingRoute: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
        style={{ background: `${ORANGE}08` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: ORANGE }}
          >
            {index + 1}
          </div>
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            Order {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {recipient.routeData && (
            <span className="text-xs text-gray-400 font-medium">
              {recipient.routeData.distance} km · {formatNairaSimple(recipient.routeData.estimatedFare)}
            </span>
          )}
          {recipient.calculatingRoute && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
          )}
          {canRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 transition-colors" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3" ref={containerRef}>
        {/* Delivery address */}
        <div className="relative">
          <div
            className="flex items-center border-2 rounded-xl overflow-hidden bg-white transition-all"
            style={{
              borderColor: addrActive ? ORANGE : recipient.location ? `${ORANGE}50` : '#f3f4f6',
              background: addrActive ? 'white' : '#fafafa',
            }}
          >
            <div className="pl-3 pr-2">
              <MapPin className="w-4 h-4" style={{ color: ORANGE }} />
            </div>
            <input
              type="text"
              value={recipient.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => setAddrActive(true)}
              placeholder="Delivery address *"
              className="flex-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
            />
            {recipient.address && (
              <button
                onClick={() => onUpdate({ address: '', location: null, suggestions: [], showSugg: false, routeData: null })}
                className="p-2 mr-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>

          {/* Suggestions */}
          {recipient.showSugg && recipient.suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              {recipient.suggestions.map((s, i) => (
                <button
                  key={`${s.id}-${i}`}
                  onClick={() => handleAddressSelect(s)}
                  className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 text-left"
                >
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: ORANGE }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.text}</p>
                    <p className="text-xs text-gray-400 truncate">{s.place_name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recipient details — 2 col grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
            <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={recipient.recipientName}
              onChange={(e) => onUpdate({ recipientName: e.target.value })}
              placeholder="Recipient name"
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none min-w-0"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
            <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              type="tel"
              value={recipient.recipientPhone}
              onChange={(e) => onUpdate({ recipientPhone: e.target.value })}
              placeholder="Phone"
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none min-w-0"
            />
          </div>
        </div>

        {/* Order reference */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
          <Hash className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={recipient.orderRef}
            onChange={(e) => onUpdate({ orderRef: e.target.value })}
            placeholder="Order ref / label (optional)"
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
          />
        </div>

        {/* Error */}
        {recipient.error && (
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-400">{recipient.error}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Step 2 — Recipient list
───────────────────────────────────────────── */
function RecipientsStep({ recipients, setRecipients, pickupLoc, onNext, onBack }) {
  const [userLoc, setUserLoc] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { longitude, latitude } }) => setUserLoc({ longitude, latitude }),
        () => setUserLoc({ longitude: 7.4951, latitude: 9.0765 })
      );
    }
  }, []);

  const updateRecipient = (id, patch) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const addRecipient = () => {
    setRecipients((prev) => [...prev, makeRecipient(`r${Date.now()}`)]);
  };

  const removeRecipient = (id) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const totalFare = recipients.reduce(
    (sum, r) => sum + (r.routeData?.estimatedFare || 0),
    0
  );
  const readyCount = recipients.filter((r) => r.location).length;
  const canNext = readyCount > 0 && readyCount === recipients.length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Add orders</h2>
          <p className="text-sm text-gray-400 mt-0.5">Each order goes to a separate recipient.</p>
        </div>
        {recipients.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Est. total</p>
            <p className="text-sm font-bold" style={{ color: MAROON }}>
              {formatNairaSimple(totalFare)}
            </p>
          </div>
        )}
      </div>

      {/* Summary bar */}
      {recipients.length > 1 && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl text-sm"
          style={{ background: `${MAROON}08` }}
        >
          <span className="text-gray-600 font-medium">
            {readyCount}/{recipients.length} addresses set
          </span>
          <span className="font-bold" style={{ color: MAROON }}>
            {recipients.length} deliveries
          </span>
        </div>
      )}

      {/* Recipient cards */}
      <AnimatePresence>
        {recipients.map((r, i) => (
          <RecipientCard
            key={r.id}
            recipient={r}
            index={i}
            pickupLoc={pickupLoc}
            userLoc={userLoc}
            onUpdate={(patch) => updateRecipient(r.id, patch)}
            onRemove={() => removeRecipient(r.id)}
            canRemove={recipients.length > 1}
          />
        ))}
      </AnimatePresence>

      {/* Add order */}
      <button
        onClick={addRecipient}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all"
      >
        <Plus className="w-4 h-4" />
        Add another order
      </button>

      {/* Nav */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="flex-2 flex-grow-[2] py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: canNext ? MAROON : '#e5e7eb', color: canNext ? 'white' : '#9ca3af' }}
        >
          Next: Package & Pay →
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Step 3 — Package details + payment + confirm
───────────────────────────────────────────── */
function DetailsStep({ recipients, packageDetails, setPackageDetails, paymentMethod, setPaymentMethod, pickupAddress, onBack, onConfirm, loading }) {
  const totalFare = recipients.reduce((sum, r) => sum + (r.routeData?.estimatedFare || 0), 0);
  const canConfirm = packageDetails.size && paymentMethod;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Package & payment</h2>
        <p className="text-sm text-gray-400 mt-0.5">Applies to all {recipients.length} orders.</p>
      </div>

      {/* Order summary card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900">Batch Summary</p>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: MAROON }}
          >
            {recipients.length} orders
          </span>
        </div>

        {/* Pickup */}
        <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: MAROON }} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Pickup</p>
            <p className="text-sm text-gray-700 truncate">{pickupAddress}</p>
          </div>
        </div>

        {/* Recipients list */}
        <div className="divide-y divide-gray-50">
          {recipients.map((r, i) => (
            <div key={r.id} className="px-4 py-2.5 flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: '#FF6B35' }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{r.address}</p>
                {r.recipientName && (
                  <p className="text-xs text-gray-400">{r.recipientName}</p>
                )}
              </div>
              {r.routeData && (
                <p className="text-xs font-semibold text-gray-600 flex-shrink-0 tabular-nums">
                  {formatNairaSimple(r.routeData.estimatedFare)}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ background: `${MAROON}06` }}
        >
          <p className="text-sm font-bold text-gray-900">Estimated Total</p>
          <p className="text-lg font-bold tabular-nums" style={{ color: MAROON }}>
            {formatNairaSimple(totalFare)}
          </p>
        </div>
      </div>

      {/* Package section */}
      <PackageSection
        packageDetails={packageDetails}
        onPackageDetailChange={(k, v) => setPackageDetails((p) => ({ ...p, [k]: v }))}
        errors={{}}
      />

      {/* Payment section */}
      <PaymentSection
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        errors={{}}
      />

      {/* Nav */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={!canConfirm || loading}
          className="flex-2 flex-grow-[2] py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: canConfirm && !loading ? MAROON : '#e5e7eb', color: canConfirm && !loading ? 'white' : '#9ca3af' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating {recipients.length} deliveries…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Dispatch {recipients.length} order{recipients.length > 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export default function VendorBookingPage({
  savedPickup = null,
  loading = false,
  onConfirmed,
}) {
  const [step, setStep] = useState(1);

  // Step 1
  const [pickupLoc, setPickupLoc] = useState(savedPickup?.loc || null);
  const [pickupAddress, setPickupAddress] = useState(savedPickup?.address || '');

  // Step 2
  const [recipients, setRecipients] = useState([makeRecipient('r0')]);

  // Step 3
  const [packageDetails, setPackageDetails] = useState({
    size: '',
    description: '',
    isFragile: false,
    pickupTime: 'courier',
    pickupContact: { pickupContactName: '', pickupPhone: '' },
    dropoffContact: { dropoffContactName: '', dropoffPhone: '', dropoffInstructions: '', recipientPermission: false },
  });
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleConfirm = () => {
    onConfirmed({
      pickupLoc,
      pickupAddress,
      recipients,
      packageDetails,
      paymentMethod,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-md mx-auto px-4 py-6 pb-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: MAROON }}
          >
            <Store className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">Vendor Dispatch</h1>
            <p className="text-xs text-gray-400">Batch delivery for your orders</p>
          </div>
        </div>

        <StepIndicator step={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StoreAddressStep
                pickupLoc={pickupLoc}
                pickupAddress={pickupAddress}
                setPickupAddress={setPickupAddress}
                setPickupLoc={setPickupLoc}
                savedAddress={savedPickup}
                onNext={() => setStep(2)}
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RecipientsStep
                recipients={recipients}
                setRecipients={setRecipients}
                pickupLoc={pickupLoc}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DetailsStep
                recipients={recipients}
                packageDetails={packageDetails}
                setPackageDetails={setPackageDetails}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                pickupAddress={pickupAddress}
                onBack={() => setStep(2)}
                onConfirm={handleConfirm}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
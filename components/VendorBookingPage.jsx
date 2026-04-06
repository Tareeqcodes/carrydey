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
  Navigation,
  Loader2,
  X,
  CheckCircle2,
  Sparkles,
  ClipboardList,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';
import PackageSection from '@/components/PackageAndFare/PackageSection';
import PaymentSection from '@/components/PackageAndFare/PaymentSection';

const MAROON = '#3A0A21';
const ORANGE = '#FF6B35';

function makeRecipient(id) {
  return {
    id,
    area: '',
    recipientName: '',
    recipientPhone: '',
    orderRef: '',
  };
}

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
    if (proximity)
      params.proximity = `${proximity.longitude},${proximity.latitude}`;
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
  } catch {
    /* silent */
  }
  return null;
}

function parseOrderList(raw) {
  const phonePattern = /^(\+?234|0)\d{9,10}$/;
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const parts = line
        .split(/[,\/\t]|\s{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

      let name = '';
      let phone = '';
      let area = '';
      let orderRef = '';

      for (const p of parts) {
        const stripped = p.replace(/\s/g, '');
        if (!phone && phonePattern.test(stripped)) {
          phone = p;
        } else if (!name && !/^\d/.test(p) && p.length > 1 && p.length < 60) {
          name = p;
        } else if (!area && p.length > 2) {
          area = p;
        } else if (!orderRef) {
          orderRef = p;
        }
      }

      return {
        ...makeRecipient(`paste-${Date.now()}-${i}`),
        recipientName: name,
        recipientPhone: phone,
        area,
        orderRef,
      };
    });
}

function StoreAddressStep({
  pickupLoc,
  pickupAddress,
  setPickupAddress,
  setPickupLoc,
  onNext,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [gettingLoc, setGettingLoc] = useState(false);
  const [userLoc, setUserLoc] = useState(null);
  const [active, setActive] = useState(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLoc({ longitude: 8.5167, latitude: 12.0022 });
      return;
    }

    setGettingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { longitude, latitude } }) => {
        setUserLoc({ longitude, latitude });
        // Only auto-fill if no pickup set yet
        if (!pickupLoc) {
          try {
            const loc = await reverseGeocode(longitude, latitude);
            if (loc) {
              setPickupLoc(loc);
              setPickupAddress(loc.place_name);
            }
          } catch {
            /* silent */
          }
        }
        setGettingLoc(false);
      },
      () => {
        setUserLoc({ longitude: 8.5167, latitude: 12.0022 });
        setGettingLoc(false);
      }
    );

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
    const loc = {
      ...s,
      geometry: { type: 'Point', coordinates: s.center },
      place_name: s.place_name,
    };
    setPickupLoc(loc);
    setPickupAddress(s.place_name);
    setSuggestions([]);
    setShowSugg(false);
    setActive(false);
  };

  const useMyLocation = () => {
    setGettingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { longitude, latitude } }) => {
        const loc = await reverseGeocode(longitude, latitude);
        if (loc) {
          setPickupLoc(loc);
          setPickupAddress(loc.place_name);
        }
        setGettingLoc(false);
      },
      () => setGettingLoc(false)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <h2 className="text-lg text-gray-300 font-bold">Your store address</h2>

      <div ref={containerRef} className="relative">
        <div
          className="flex items-center border-2 rounded-2xl overflow-hidden transition-all bg-white"
          style={{
            borderColor: active
              ? MAROON
              : pickupLoc
                ? `${MAROON}50`
                : '#e8e2e5',
          }}
        >
          <div className="pl-4 pr-3">
            {gettingLoc ? (
              <Loader2
                className="w-3 h-3 animate-spin"
                style={{ color: MAROON }}
              />
            ) : (
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: MAROON }}
              />
            )}
          </div>
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setActive(true)}
            placeholder={
              gettingLoc ? 'Detecting your location…' : 'Search store address…'
            }
            className="flex-1 py-3.5 text-sm text-gray-900 placeholder-gray-300 bg-transparent outline-none"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
          <div className="flex items-center pr-2 gap-1">
            {pickupAddress && !gettingLoc && (
              <button
                onClick={() => {
                  setPickupAddress('');
                  setPickupLoc(null);
                }}
                className="p-2 rounded-xl hover:bg-gray-100"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
            <button
              onClick={useMyLocation}
              disabled={gettingLoc}
              className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-40"
              style={{ color: MAROON }}
              title="Use my current location"
            >
              {gettingLoc ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
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

      {pickupLoc && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: `${MAROON}08` }}
        >
          <CheckCircle2
            className="w-4 h-4 flex-shrink-0"
            style={{ color: MAROON }}
          />
          <p className="text-xs font-medium text-gray-700 truncate">
            {pickupAddress}
          </p>
        </motion.div>
      )}

      <button
        onClick={onNext}
        disabled={!pickupLoc}
        className="w-full py-4 rounded-full font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: pickupLoc ? MAROON : '#e8e2e5',
          color: pickupLoc ? 'white' : '#bbb',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Next: Add orders
      </button>
    </motion.div>
  );
}

/* Single compact recipient row */
function RecipientRow({ recipient, index, onUpdate, onRemove, canRemove }) {
  const isValid = recipient.area.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl overflow-hidden"
      style={{
        border: `1.5px solid ${isValid ? `${ORANGE}40` : '#ede8e6'}`,
        background: 'white',
      }}
    >
      {/* Row header */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5"
        style={{
          background: isValid ? `${ORANGE}08` : '#fafafa',
          borderBottom: `1px solid ${isValid ? `${ORANGE}18` : '#f3f3f3'}`,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ background: isValid ? ORANGE : '#ccc' }}
          >
            {index + 1}
          </div>
          <span
            className="text-xs font-semibold"
            style={{ color: isValid ? '#555' : '#bbb' }}
          >
            Order {index + 1}
          </span>
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors group"
          >
            <Trash2 className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-400 transition-colors" />
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="p-3 space-y-2">
        {/* Area — required, the key field */}
        <div
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all"
          style={{
            background: recipient.area ? `${ORANGE}06` : '#fafafa',
            border: `1.5px solid ${recipient.area ? `${ORANGE}35` : '#ede8e6'}`,
          }}
        >
          <MapPin
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: recipient.area ? ORANGE : '#ccc' }}
          />
          <input
            type="text"
            value={recipient.area}
            onChange={(e) => onUpdate({ area: e.target.value })}
            placeholder="Area / neighborhood  (e.g. Sabon Gari, Kano) *"
            className="flex-1 text-sm text-gray-900 placeholder-gray-300 bg-transparent outline-none"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
          {recipient.area && (
            <button
              onClick={() => onUpdate({ area: '' })}
              className="flex-shrink-0"
            >
              <X className="w-3 h-3 text-gray-300 hover:text-gray-500" />
            </button>
          )}
        </div>

        {/* Name + Phone row */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: '#fafafa', border: '1.5px solid #ede8e6' }}
          >
            <User className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            <input
              type="text"
              value={recipient.recipientName}
              onChange={(e) => onUpdate({ recipientName: e.target.value })}
              placeholder="Name"
              className="flex-1 text-sm text-gray-900 placeholder-gray-300 bg-transparent outline-none min-w-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: '#fafafa', border: '1.5px solid #ede8e6' }}
          >
            <Phone className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            <input
              type="tel"
              value={recipient.recipientPhone}
              onChange={(e) => onUpdate({ recipientPhone: e.target.value })}
              placeholder="Phone"
              className="flex-1 text-sm text-gray-900 placeholder-gray-300 bg-transparent outline-none min-w-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
        </div>

        {/* Order ref */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: '#fafafa', border: '1.5px solid #ede8e6' }}
        >
          <Hash className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
          <input
            type="text"
            value={recipient.orderRef}
            onChange={(e) => onUpdate({ orderRef: e.target.value })}
            placeholder="Order ref / note (optional)"
            className="flex-1 text-sm text-gray-900 placeholder-gray-300 bg-transparent outline-none"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* Paste modal */
function PasteModal({ onParsed, onClose }) {
  const [raw, setRaw] = useState('');
  const preview = raw.trim() ? parseOrderList(raw) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between border-b"
          style={{ borderColor: '#f0ece9' }}
        >
          <div>
            <p className="text-sm font-bold text-gray-900">Paste order list</p>
            <p className="text-xs text-gray-400 mt-0.5">
              One order per line Name, Phone, Area, Ref
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Hint */}
        <div
          className="mx-5 mt-4 px-3 py-2.5 rounded-xl text-xs text-gray-400 font-mono leading-relaxed"
          style={{ background: '#fafafa', border: '1px solid #f0ece9' }}
        >
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
            Example
          </p>
          <p>Aminu Hassan / 08012345678 / Sabon Gari/ ORD-001</p>
          <p>Fatima / 09087654321 / Fagge / ORD-002</p>
        </div>

        {/* Textarea */}
        <div className="px-5 mt-3">
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="Paste your orders here…"
            rows={6}
            className="w-full rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none resize-none"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              border: `2px solid ${raw ? MAROON : '#e8e2e5'}`,
              background: raw ? `${MAROON}04` : '#fafafa',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          />
        </div>

        {/* Preview count */}
        {preview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-5 mt-2 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: `${MAROON}08` }}
          >
            <CheckCircle2
              className="w-4 h-4 flex-shrink-0"
              style={{ color: MAROON }}
            />
            <p className="text-xs font-semibold text-gray-700">
              {preview.length} order{preview.length > 1 ? 's' : ''} detected
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="px-5 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (preview.length > 0) {
                onParsed(preview);
                onClose();
              }
            }}
            disabled={preview.length === 0}
            className="flex-[2] py-3 rounded-full text-sm font-bold text-white transition-all disabled:opacity-40"
            style={{
              background: preview.length > 0 ? MAROON : '#e8e2e5',
              color: preview.length > 0 ? 'white' : '#bbb',
            }}
          >
            Add {preview.length > 0 ? `${preview.length} orders` : 'orders'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* Recipients step */
function RecipientsStep({ recipients, setRecipients, onNext, onBack }) {
  const [showPaste, setShowPaste] = useState(false);

  const updateRecipient = (id, patch) =>
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );

  const addRecipient = () =>
    setRecipients((prev) => [...prev, makeRecipient(`r${Date.now()}`)]);

  const removeRecipient = (id) =>
    setRecipients((prev) => prev.filter((r) => r.id !== id));

  const handleParsed = (parsed) =>
    setRecipients((prev) => {
      // if the only row is blank, replace it; otherwise append
      const isOnlyBlank =
        prev.length === 1 &&
        !prev[0].area &&
        !prev[0].recipientName &&
        !prev[0].recipientPhone;
      return isOnlyBlank ? parsed : [...prev, ...parsed];
    });

  const validCount = recipients.filter((r) => r.area.trim()).length;
  const canNext = validCount > 0 && validCount === recipients.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base text-gray-500 font-bold">Add orders</h2>
          </div>
          {/* Paste shortcut */}
          <button
            onClick={() => setShowPaste(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
            style={{
              background: `${MAROON}10`,
              color: MAROON,
              border: `1px solid ${MAROON}25`,
            }}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Paste list
          </button>
        </div>

        {/* Recipient rows */}
        <AnimatePresence initial={false}>
          {recipients.map((r, i) => (
            <RecipientRow
              key={r.id}
              recipient={r}
              index={i}
              onUpdate={(patch) => updateRecipient(r.id, patch)}
              onRemove={() => removeRecipient(r.id)}
              canRemove={recipients.length > 1}
            />
          ))}
        </AnimatePresence>

        {/* Add row */}
        <button
          onClick={addRecipient}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-gray-400 hover:text-gray-600 hover:bg-white transition-all"
          style={{ border: '2px dashed #e8e2e5' }}
        >
          <Plus className="w-4 h-4" />
          Add order
        </button>

        {/* Validation hint */}
        {recipients.length > 0 && !canNext && validCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: '#fff8f0', border: '1px solid #fde8d0' }}
          >
            <AlertCircle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
            <p className="text-xs text-orange-600">
              {recipients.length - validCount} order
              {recipients.length - validCount > 1 ? 's are' : ' is'} missing a
              delivery area
            </p>
          </motion.div>
        )}

        {/* Nav */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex-1 py-3.5 rounded-full font-semibold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            className="flex-[2] py-3.5 rounded-full font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canNext ? MAROON : '#e8e2e5',
              color: canNext ? 'white' : '#bbb',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Next: Package &amp; pay
          </button>
        </div>
      </motion.div>

      {/* Paste modal */}
      <AnimatePresence>
        {showPaste && (
          <PasteModal
            onParsed={handleParsed}
            onClose={() => setShowPaste(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function DetailsStep({
  recipients,
  packageDetails,
  setPackageDetails,
  paymentMethod,
  setPaymentMethod,
  pickupAddress,
  pickupPhone,
  setPickupPhone,
  onBack,
  onConfirm,
  loading,
}) {
  const canConfirm = packageDetails.size && paymentMethod;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2
          className="text-md font-semibold text-gray-500"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Payment Applies to all {recipients.length} order
          {recipients.length > 1 ? 's' : ''}.
        </h2>
      </div>

      {/* Batch summary card */}
      <div
        className="bg-white border rounded-2xl overflow-hidden"
        style={{ borderColor: '#ede8e6' }}
      >
        {/* Card header */}
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: '#f3eef1', background: `${MAROON}04` }}
        >
          <p
            className="text-sm font-bold text-gray-900"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Batch summary
          </p>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: MAROON }}
          >
            {recipients.length} order{recipients.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Pickup row */}
        <div
          className="px-4 py-3 border-b flex items-center gap-3"
          style={{ borderColor: '#f7f3f5' }}
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: MAROON }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
              Pickup
            </p>
            <p className="text-sm text-gray-700 truncate">{pickupAddress}</p>
          </div>
        </div>

        {/* Recipient rows */}
        <div className="divide-y" style={{ borderColor: '#f7f3f5' }}>
          {recipients.map((r, i) => (
            <div key={r.id} className="px-4 py-2.5 flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: ORANGE }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">
                  {r.area || <span className="text-gray-300">No area set</span>}
                </p>
                {r.recipientName && (
                  <p className="text-xs text-gray-400 truncate">
                    {r.recipientName}
                    {r.recipientPhone ? ` · ${r.recipientPhone}` : ''}
                  </p>
                )}
                {r.orderRef && (
                  <p className="text-[10px] text-gray-300 font-mono">
                    {r.orderRef}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        
        <div
          className="px-4 py-3 space-y-2.5"
          style={{
            background: `${MAROON}05`,
            borderTop: `1px solid ${MAROON}10`,
          }}
        >
          {/* Pickup phone input */}
          <div
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 bg-white"
            style={{
              border: `1.5px solid ${pickupPhone ? `${MAROON}35` : '#ede8e6'}`,
            }}
          >
            <Phone
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: pickupPhone ? MAROON : '#ccc' }}
            />
            <input
              type="tel"
              value={pickupPhone}
              onChange={(e) => setPickupPhone(e.target.value)}
              placeholder="Your pickup phone number"
              className="flex-1 text-sm text-gray-900 placeholder-gray-300 bg-transparent outline-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {pickupPhone && (
              <button onClick={() => setPickupPhone('')}>
                <X className="w-3 h-3 text-gray-300 hover:text-gray-500" />
              </button>
            )}
          </div>
          {/* <p className="text-xs text-gray-400 leading-relaxed flex items-center gap-1.5">
            <Phone
              className="w-3 h-3 flex-shrink-0"
              style={{ color: MAROON }}
            />
            Courier will confirm exact fare per order before pickup.
          </p> */}
        </div>
      </div>

      <PackageSection
        packageDetails={packageDetails}
        onPackageDetailChange={(k, v) =>
          setPackageDetails((p) => ({ ...p, [k]: v }))
        }
        errors={{}}
      />

      <PaymentSection
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        errors={{}}
      />

      {/* Nav */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-full font-semibold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={!canConfirm || loading}
          className="flex-[2] py-3.5 rounded-full font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: canConfirm && !loading ? MAROON : '#e8e2e5',
            color: canConfirm && !loading ? 'white' : '#bbb',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Dispatching {recipients.length} order
              {recipients.length > 1 ? 's' : ''}…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Dispatch {recipients.length} order
              {recipients.length > 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function VendorBookingPage({ loading = false, onConfirmed }) {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { userData } = useUserRole();
  const [pickupLoc, setPickupLoc] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupPhone, setPickupPhone] = useState('');
  const [recipients, setRecipients] = useState([makeRecipient('r0')]);

  const [packageDetails, setPackageDetails] = useState({
    size: '',
    description: '',
    isFragile: false,
    pickupTime: 'courier',
    pickupContact: { pickupContactName: '', pickupPhone: '' },
    dropoffContact: {
      dropoffContactName: '',
      dropoffPhone: '',
      dropoffInstructions: '',
      recipientPermission: false,
    },
  });

  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (userData?.phone && !pickupPhone) {
      setPickupPhone(userData.phone);
    }
  }, [userData]);

  const handleConfirm = () =>
    onConfirmed({
      pickupLoc,
      pickupAddress,
      pickupPhone,
      recipients,
      packageDetails,
      paymentMethod,
    });

  // Step indicator dots
  const StepDots = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className="transition-all duration-300"
          style={{
            width: s === step ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background:
              s === step ? MAROON : s < step ? `${MAROON}40` : '#e0dada',
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#faf9f7' }}>
      <div className="max-w-md mx-auto px-4 pt-5 pb-36">
        <StepDots />
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
            >
              <StoreAddressStep
                pickupLoc={pickupLoc}
                pickupAddress={pickupAddress}
                setPickupAddress={setPickupAddress}
                setPickupLoc={setPickupLoc}
                onNext={() => setStep(2)}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
            >
              <RecipientsStep
                recipients={recipients}
                setRecipients={setRecipients}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
            >
              <DetailsStep
                recipients={recipients}
                packageDetails={packageDetails}
                setPackageDetails={setPackageDetails}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                pickupAddress={pickupAddress}
                pickupPhone={pickupPhone}
                setPickupPhone={setPickupPhone}
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

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
import { useUserRole } from '@/hooks/useUserRole';
import PackageSection from '@/components/PackageAndFare/PackageSection';
import PaymentSection from '@/components/PackageAndFare/PaymentSection';

const TEAL = '#00C896';
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
      <h2 className="text-lg text-black dark:text-white font-bold">Your store address</h2>

      <div ref={containerRef} className="relative">
        <div
          className="flex items-center border-2 rounded-2xl overflow-hidden transition-all bg-white/40 dark:bg-black/40 backdrop-blur-xl"
          style={{
            borderColor: active
              ? TEAL
              : pickupLoc
                ? `rgba(0,200,150,0.3)`
                : 'rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)',
          }}
        >
          <div className="pl-4 pr-3">
            {gettingLoc ? (
              <Loader2
                className="w-3 h-3 animate-spin"
                style={{ color: TEAL }}
              />
            ) : (
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: TEAL }}
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
            className="flex-1 py-3.5 text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/50 bg-transparent outline-none"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
          <div className="flex items-center pr-2 gap-1">
            {pickupAddress && !gettingLoc && (
              <button
                onClick={() => {
                  setPickupAddress('');
                  setPickupLoc(null);
                }}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
              </button>
            )}
            <button
              onClick={useMyLocation}
              disabled={gettingLoc}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-40"
              style={{ color: TEAL }}
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
          <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
            {suggestions.map((s, i) => (
              <button
                key={`${s.id}-${i}`}
                onClick={() => handleSelect(s)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 border-b border-black/5 dark:border-white/5 last:border-b-0 text-left"
              >
                <MapPin
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: TEAL }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black dark:text-white truncate">
                    {s.text}
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 truncate mt-0.5">
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
          style={{ background: 'rgba(0,200,150,0.1)' }}
        >
          <CheckCircle2
            className="w-4 h-4 flex-shrink-0"
            style={{ color: TEAL }}
          />
          <p className="text-xs font-medium text-black/70 dark:text-white/70 truncate">
            {pickupAddress}
          </p>
        </motion.div>
      )}

      <button
        onClick={onNext}
        disabled={!pickupLoc}
        className="w-full py-4 rounded-full font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: pickupLoc ? 'linear-gradient(135deg, #00C896 0%, #00E5AD 100%)' : 'rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)',
          color: pickupLoc ? 'black' : 'rgba(0,0,0,0.3) dark:rgba(255,255,255,0.3)',
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
        border: `1.5px solid ${isValid ? `rgba(255,165,0,0.3)` : 'rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)'}`,
        background: 'rgba(0,0,0,0.05) dark:rgba(0,0,0,0.3)',
      }}
    >
      {/* Row header */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5"
        style={{
          background: isValid ? 'rgba(255,165,0,0.1)' : 'rgba(0,0,0,0.05) dark:rgba(255,255,255,0.05)',
          borderBottom: `1px solid ${isValid ? `rgba(255,165,0,0.2)` : 'rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)'}`,
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold uppercase"
            style={{ color: isValid ? 'rgba(0,0,0,0.8) dark:rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.4) dark:rgba(255,255,255,0.4)' }}
          >
            Order {index + 1}
          </span>
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors group"
          >
            <Trash2 className="w-3.5 h-3.5 text-black/40 dark:text-white/40 group-hover:text-black/70 dark:group-hover:text-white/70 transition-colors" />
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="p-3 space-y-2">
        {/* Area — required, the key field */}
        <div
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all"
          style={{
            background: recipient.area ? 'rgba(255,165,0,0.1)' : 'rgba(0,0,0,0.05) dark:rgba(255,255,255,0.05)',
            border: `1.5px solid ${recipient.area ? `rgba(255,165,0,0.3)` : 'rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)'}`,
          }}
        >
          <MapPin
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: recipient.area ? ORANGE : 'rgba(0,0,0,0.3) dark:rgba(255,255,255,0.3)' }}
          />
          <input
            type="text"
            value={recipient.area}
            onChange={(e) => onUpdate({ area: e.target.value })}
            placeholder="Area / neighborhood  (e.g. Sabon Gari, Kano) *"
            className="flex-1 text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 bg-transparent outline-none"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
          {recipient.area && (
            <button
              onClick={() => onUpdate({ area: '' })}
              className="flex-shrink-0"
            >
              <X className="w-3 h-3 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60" />
            </button>
          )}
        </div>

        {/* Name + Phone row */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: 'rgba(0,0,0,0.05) dark:rgba(255,255,255,0.05)', border: '1.5px solid rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)' }}
          >
            <User className="w-3.5 h-3.5 text-black/40 dark:text-white/40 flex-shrink-0" />
            <input
              type="text"
              value={recipient.recipientName}
              onChange={(e) => onUpdate({ recipientName: e.target.value })}
              placeholder="Name"
              className="flex-1 text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 bg-transparent outline-none min-w-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: 'rgba(0,0,0,0.05) dark:rgba(255,255,255,0.05)', border: '1.5px solid rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)' }}
          >
            <Phone className="w-3.5 h-3.5 text-black/40 dark:text-white/40 flex-shrink-0" />
            <input
              type="tel"
              value={recipient.recipientPhone}
              onChange={(e) => onUpdate({ recipientPhone: e.target.value })}
              placeholder="Phone"
              className="flex-1 text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 bg-transparent outline-none min-w-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
        </div>

        {/* Order ref */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: 'rgba(0,0,0,0.05) dark:rgba(255,255,255,0.05)', border: '1.5px solid rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)' }}
        >
          <Hash className="w-3.5 h-3.5 text-black/40 dark:text-white/40 flex-shrink-0" />
          <input
            type="text"
            value={recipient.orderRef}
            onChange={(e) => onUpdate({ orderRef: e.target.value })}
            placeholder="Order ref / note (optional)"
            className="flex-1 text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 bg-transparent outline-none"
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
      className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-black/40 backdrop-blur-xl rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-black/10 dark:border-white/10"
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between border-b border-black/10 dark:border-white/10"
        >
          <div>
            <p className="text-sm font-bold text-black dark:text-white">Paste order list</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
              One order per line Name, Phone, Area, Ref
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4 text-black/50 dark:text-white/50" />
          </button>
        </div>

        {/* Hint */}
        <div
          className="mx-5 mt-4 px-3 py-2.5 rounded-xl text-xs text-black dark:text-white/60 font-mono leading-relaxed"
          style={{ background: 'rgba(0,0,0,0.05) dark:rgba(255,255,255,0.05)', border: '1px solid rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)' }}
        >
          <p className="text-[10px] font-semibold text-black dark:text-white/70 uppercase tracking-wide mb-1.5">
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
            className="w-full rounded-2xl px-4 py-3 text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none resize-none"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              border: `2px solid ${raw ? TEAL : 'rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)'}`,
              background: raw ? 'rgba(0,200,150,0.1)' : 'rgba(0,0,0,0.05) dark:rgba(255,255,255,0.05)',
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
            style={{ background: 'rgba(0,200,150,0.1)' }}
          >
            <CheckCircle2
              className="w-4 h-4 flex-shrink-0"
              style={{ color: TEAL }}
            />
            <p className="text-xs font-semibold text-black/70 dark:text-white/70">
              {preview.length} order{preview.length > 1 ? 's' : ''} detected
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="px-5 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full text-sm font-semibold bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20 transition-all"
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
            className="flex-[2] py-3 rounded-full text-sm font-bold text-black transition-all disabled:opacity-40"
            style={{
              background: preview.length > 0 ? 'linear-gradient(135deg, #00C896 0%, #00E5AD 100%)' : 'rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)',
              color: preview.length > 0 ? 'black' : 'rgba(0,0,0,0.3) dark:rgba(255,255,255,0.3)',
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
            <h2 className="text-base text-black dark:text-white font-bold">Add orders</h2>
          </div>
          {/* Paste shortcut */}
          <button
            onClick={() => setShowPaste(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
            style={{
              background: 'rgba(0,200,150,0.1)',
              color: TEAL,
              border: `1px solid rgba(0,200,150,0.3)`,
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
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-black dark:text-white hover:text-black/60 dark:hover:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          style={{ border: '2px dashed rgba(0,0,0,0.2) dark:rgba(255,255,255,0.2)' }}
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
            style={{ background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.2)' }}
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgb(251, 146, 60)' }} />
            <p className="text-xs" style={{ color: 'rgb(254, 215, 170)' }}>
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
            className="flex-1 py-3.5 rounded-full font-semibold text-sm bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20 transition-all"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            className="flex-[2] py-3.5 rounded-full font-bold text-sm text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canNext ? 'linear-gradient(135deg, #00C896 0%, #00E5AD 100%)' : 'rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)',
              color: canNext ? 'black' : 'rgba(0,0,0,0.3) dark:rgba(255,255,255,0.3)',
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
          className="text-md font-semibold text-black dark:text-white"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Payment Applies to all {recipients.length} order
          {recipients.length > 1 ? 's' : ''}.
        </h2>
      </div>

      {/* Batch summary card */}
      <div
        className="bg-white dark:bg-black/20 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden"
      >
        {/* Card header */}
        <div
          className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between"
          style={{ background: 'rgba(0,200,150,0.1)' }}
        >
          <p
            className="text-sm font-bold text-black dark:text-white"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Batch summary
          </p>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold text-black"
            style={{ background: TEAL }}
          >
            {recipients.length} order{recipients.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Pickup row */}
        <div
          className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center gap-3"
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: TEAL }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide mb-0.5">
              Pickup
            </p>
            <p className="text-sm text-black dark:text-white truncate">{pickupAddress}</p>
          </div>
        </div>

        {/* Recipient rows */}
        <div className="divide-y divide-black/10 dark:divide-white/10">
          {recipients.map((r, i) => (
            <div key={r.id} className="px-4 py-2.5 flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-black text-[10px] font-bold flex-shrink-0"
                style={{ background: ORANGE }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-black dark:text-white truncate">
                  {r.area || <span className="text-black/40 dark:text-white/40">No area set</span>}
                </p>
                {r.recipientName && (
                  <p className="text-xs text-black/50 dark:text-white/50 truncate">
                    {r.recipientName}
                    {r.recipientPhone ? ` · ${r.recipientPhone}` : ''}
                  </p>
                )}
                {r.orderRef && (
                  <p className="text-[10px] text-black dark:text-white font-mono">
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
            background: 'rgba(0,200,150,0.1)',
            borderTop: `1px solid rgba(0,200,150,0.2)`,
          }}
        >
          {/* Pickup phone input */}
          <div
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 bg-black/5 dark:bg-black/30"
            style={{
              border: `1.5px solid ${pickupPhone ? `rgba(0,200,150,0.3)` : 'rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)'}`,
            }}
          >
            <Phone
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: pickupPhone ? TEAL : 'rgba(0,0,0,0.3) dark:rgba(255,255,255,0.3)' }}
            />
            <input
              type="tel"
              value={pickupPhone}
              onChange={(e) => setPickupPhone(e.target.value)}
              placeholder="Your pickup phone number"
              className="flex-1 text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 bg-transparent outline-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {pickupPhone && (
              <button onClick={() => setPickupPhone('')}>
                <X className="w-3 h-3 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60" />
              </button>
            )}
          </div>
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
          className="flex-1 py-3.5 rounded-full font-semibold text-sm bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20 transition-all"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={!canConfirm || loading}
          className="flex-[2] py-3.5 rounded-full font-bold text-sm text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: canConfirm && !loading ? 'linear-gradient(135deg, #00C896 0%, #00E5AD 100%)' : 'rgba(0,0,0,0.1) dark:rgba(255,255,255,0.1)',
            color: canConfirm && !loading ? 'black' : 'rgba(0,0,0,0.3) dark:rgba(255,255,255,0.3)',
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
              s === step ? TEAL : s < step ? `rgba(0,200,150,0.4)` : 'rgba(0,0,0,0.2) dark:rgba(255,255,255,0.2)',
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black/20">
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

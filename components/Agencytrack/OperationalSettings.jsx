'use client';
import { useState } from 'react';
import {
  Clock,
  DollarSign,
  Save,
  Package,
  AlertTriangle,
  Scale,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { tablesDB } from '@/lib/config/Appwriteconfig';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const DEFAULT_HOURS = DAYS.reduce(
  (acc, day) => ({
    ...acc,
    [day]: { open: true, from: '08:00', to: '18:00' },
  }),
  {}
);

function parseHours(raw) {
  if (!raw) return DEFAULT_HOURS;
  try {
    const p = JSON.parse(raw);
    return typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_HOURS;
  } catch {
    return DEFAULT_HOURS;
  }
}

function parseJson(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const DEFAULT_WEIGHT = { light: 0, medium: 100, heavy: 250, 'very-heavy': 400 };
const DEFAULT_SIZE = { small: 0, medium: 100, large: 250 };

export default function OperationalSettings({
  agencyData,
  formData,
  setFormData,
  setAgencyData,
  onSuccess,
  onError,
}) {
  const [saving, setSaving] = useState(false);
  const [hours, setHours] = useState(() =>
    parseHours(agencyData?.operationalHours)
  );
  const [weightPremiums, setWeightPremiums] = useState(() =>
    parseJson(agencyData?.weightPremiums, DEFAULT_WEIGHT)
  );
  const [sizePremiums, setSizePremiums] = useState(() =>
    parseJson(agencyData?.sizePremiums, DEFAULT_SIZE)
  );

  const set = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const toggleDay = (day) =>
    setHours((p) => ({ ...p, [day]: { ...p[day], open: !p[day].open } }));
  const setDayTime = (day, k, val) =>
    setHours((p) => ({ ...p, [day]: { ...p[day], [k]: val } }));

  const handleSave = async () => {
    try {
      setSaving(true);

      const baseFee = formData.baseDeliveryFee
        ? parseInt(formData.baseDeliveryFee)
        : null;
      const perKm = formData.pricePerKm ? parseInt(formData.pricePerKm) : null;
      const minFare = formData.minFare ? parseInt(formData.minFare) : null;
      const fragileFee = formData.fragilePremium
        ? parseInt(formData.fragilePremium)
        : null;

      if (baseFee < 0 || perKm < 0) {
        onError('Fees cannot be negative');
        setSaving(false);
        return;
      }

      const data = {
        operationalHours: JSON.stringify(hours),
        baseDeliveryFee: baseFee,
        pricePerKm: perKm,
        minFare,
        fragilePremium: fragileFee,
        weightPremiums: JSON.stringify(weightPremiums),
        sizePremiums: JSON.stringify(sizePremiums),
      };

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        rowId: agencyData.$id,
        data,
      });

      setAgencyData((p) => ({ ...p, ...data }));
      onSuccess('Operational settings saved!');
    } catch (e) {
      console.error(e);
      onError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const base = parseInt(formData.baseDeliveryFee) || 0;
  const perKm = parseInt(formData.pricePerKm) || 0;

  // Preview fare for X km (base + tiered distance only)
  const previewFare = (km) => {
    const dist = km <= 5 ? km * perKm : 5 * perKm + (km - 5) * (perKm * 0.8);
    return base + Math.round(dist);
  };

  const SaveButton = () => (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleSave}
      disabled={saving}
      className="w-full py-4 px-6 bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] text-white rounded-2xl font-bold text-base
                 hover:shadow-2xl hover:shadow-[#3A0A21]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
    >
      {saving ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Saving…</span>
        </>
      ) : (
        <>
          <Save className="w-5 h-5" />
          <span>Save Operational Settings</span>
        </>
      )}
    </motion.button>
  );

  return (
    <>
      {/* ── Operational Hours ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Operational Hours
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Toggle which days you're open and set your hours
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {DAYS.map((day) => {
              const d = hours[day];
              return (
                <div
                  key={day}
                  className={`flex flex-wrap items-center gap-3 p-3 rounded-xl border transition-all ${
                    d.open
                      ? 'border-green-200 bg-green-50/40'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${d.open ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${d.open ? 'translate-x-5' : ''}`}
                    />
                  </button>

                  <span
                    className={`w-24 text-sm font-medium flex-shrink-0 ${d.open ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    {day}
                  </span>

                  {d.open ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={d.from}
                        onChange={(e) =>
                          setDayTime(day, 'from', e.target.value)
                        }
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-green-400"
                      />
                      <span className="text-xs text-gray-400">to</span>
                      <input
                        type="time"
                        value={d.to}
                        onChange={(e) => setDayTime(day, 'to', e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-green-400"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Closed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Base Pricing ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Base Pricing
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Distance tiers applied automatically — rates taper for longer
                trips
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                label: 'Base Delivery Fee (₦)',
                field: 'baseDeliveryFee',
                placeholder: '1000',
                hint: 'Flat fee on every order',
              },
              {
                label: 'Price per KM (₦)',
                field: 'pricePerKm',
                placeholder: '150',
                hint: 'Full rate ≤5 km, tapers beyond',
              },
              {
                label: 'Minimum Fare (₦)',
                field: 'minFare',
                placeholder: '1500',
                hint: 'Floor price for any booking',
              },
            ].map(({ label, field, placeholder, hint }) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  {label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData[field] || ''}
                  placeholder={placeholder}
                  onChange={(e) => set(field, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all text-gray-900 font-medium"
                />
                <p className="text-xs text-gray-400 mt-1">{hint}</p>
              </div>
            ))}
          </div>

          {/* Live preview */}
          {base > 0 && perKm > 0 && (
            <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Distance preview
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 20].map((km) => (
                  <div
                    key={km}
                    className="text-center p-2 bg-white rounded-lg border border-amber-100"
                  >
                    <p className="text-xs text-gray-500 mb-1">{km} km</p>
                    <p className="font-bold text-amber-700">
                      ₦{previewFare(km).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                * Excludes time, weight, size & fragile premiums
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Size Premiums ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Package Size Premiums (₦)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Added on top of distance fare based on declared size
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(sizePremiums).map((size) => (
              <div key={size}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 capitalize">
                  {size}
                </label>
                <input
                  type="number"
                  min="0"
                  value={sizePremiums[size]}
                  onChange={(e) =>
                    setSizePremiums((p) => ({
                      ...p,
                      [size]: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-gray-900 font-medium"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Weight Premiums ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Weight Premiums (₦)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Added based on package weight category
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.keys(weightPremiums).map((w) => (
              <div key={w}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 capitalize">
                  {w}
                </label>
                <input
                  type="number"
                  min="0"
                  value={weightPremiums[w]}
                  onChange={(e) =>
                    setWeightPremiums((p) => ({
                      ...p,
                      [w]: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-gray-900 font-medium"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Fragile Premium ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Fragile Handling Premium (₦)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Added when customer marks their package as fragile
              </p>
            </div>
          </div>
          <div className="max-w-xs">
            <input
              type="number"
              min="0"
              value={formData.fragilePremium || ''}
              placeholder="200"
              onChange={(e) => set('fragilePremium', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white transition-all text-gray-900 font-medium"
            />
            <p className="text-xs text-gray-400 mt-1">
              Applied on top of all other charges
            </p>
          </div>
        </div>
      </motion.div>

      <SaveButton />
    </>
  );
}

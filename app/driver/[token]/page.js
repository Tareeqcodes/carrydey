'use client';
import { useState, useEffect, useCallback, use, useRef } from 'react';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';
import { freeDriverFromDelivery } from '@/utils/Driverutils';
import { BrandColorsProvider, useBrandColors } from '@/hooks/BrandColors';
import {
  Package,
  MapPin,
  CheckCircle,
  Truck,
  Navigation,
  Phone,
  AlertCircle,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

const STATUS_FLOW = {
  assigned: { step: 1, label: 'Assigned', next: 'picked_up' },
  picked_up: { step: 2, label: 'Picked Up', next: 'in_transit' },
  in_transit: { step: 3, label: 'In Transit', next: 'delivered' },
  delivered: { step: 4, label: 'Delivered', next: null },
};

function parseStops(raw) {
  if (!raw) return [];
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }
}

const formatAddress = (addr) => addr || '—';

const StepBar = ({ status }) => {
  const { brandColors } = useBrandColors();

  const steps = [
    { key: 'assigned', label: 'Assigned' },
    { key: 'picked_up', label: 'Picked Up' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'delivered', label: 'Delivered' },
  ];
  const currentStep = STATUS_FLOW[status]?.step ?? 0;

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const done = stepNum <= currentStep;
        const active = stepNum === currentStep;
        return (
          <div
            key={step.key}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all"
                style={{
                  background: done
                    ? brandColors.primary
                    : active
                      ? `${brandColors.primary}15`
                      : '#F3F4F6',
                  color: done
                    ? '#fff'
                    : active
                      ? brandColors.primary
                      : '#9CA3AF',
                  border: active
                    ? `2px solid ${brandColors.primary}`
                    : done
                      ? 'none'
                      : '2px solid #E5E7EB',
                  boxShadow: active
                    ? `0 0 0 3px ${brandColors.primary}25`
                    : 'none',
                }}
              >
                {done && !active ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  stepNum
                )}
              </div>
              <span
                className="text-[9px] font-bold whitespace-nowrap"
                style={{ color: done ? brandColors.primary : '#9CA3AF' }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-1 mb-4 transition-all"
                style={{
                  background:
                    currentStep > i + 1 ? brandColors.primary : '#E5E7EB',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const CodeInput = ({ label, length = 6, onSubmit, loading, hint, error }) => {
  const { brandColors } = useBrandColors();
  const [values, setValues] = useState(Array(length).fill(''));
  const [showCode, setShowCode] = useState(false);

  const handleChange = (val, idx) => {
    const char = val
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(-1);
    const next = [...values];
    next[idx] = char;
    setValues(next);
    if (char && idx < length - 1)
      document.getElementById(`code-input-${idx + 1}`)?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !values[idx] && idx > 0)
      document.getElementById(`code-input-${idx - 1}`)?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData
      .getData('text')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    const next = Array(length).fill('');
    paste
      .slice(0, length)
      .split('')
      .forEach((c, i) => {
        next[i] = c;
      });
    setValues(next);
    document
      .getElementById(`code-input-${Math.min(paste.length, length - 1)}`)
      ?.focus();
  };

  const code = values.join('');
  const isComplete = code.length === length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {label}
        </p>
        {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
      </div>
      <div className="flex gap-2 justify-center">
        {values.map((val, idx) => (
          <input
            key={idx}
            id={`code-input-${idx}`}
            type={showCode ? 'text' : 'password'}
            inputMode="text"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            className="w-10 h-12 text-center text-sm font-black rounded-xl border-2 outline-none transition-all"
            style={{
              borderColor: val
                ? brandColors.primary
                : error
                  ? '#EF4444'
                  : '#E5E7EB',
              background: val ? `${brandColors.primary}10` : '#FAFAFA',
              color: brandColors.primary,
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowCode((s) => !s)}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600"
        >
          {showCode ? (
            <EyeOff className="w-3 h-3" />
          ) : (
            <Eye className="w-3 h-3" />
          )}
          {showCode ? 'Hide code' : 'Show code'}
        </button>
        {error && (
          <p className="text-[10px] text-red-500 font-semibold">{error}</p>
        )}
      </div>
      <button
        disabled={!isComplete || loading}
        onClick={() => onSubmit(code)}
        className="w-full py-3 rounded-xl text-sm font-black text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          background: isComplete && !loading ? brandColors.primary : '#9CA3AF',
          boxShadow:
            isComplete && !loading
              ? `0 4px 16px ${brandColors.primary}50`
              : 'none',
        }}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <KeyRound className="w-4 h-4" />
        )}
        {loading ? 'Verifying…' : 'Confirm'}
      </button>
    </div>
  );
};

function DriverPortalInner({ token }) {
  const { brandColors } = useBrandColors();

  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, _setActionLoading] = useState(false);
  const actionLoadingRef = useRef(false);
  const [error, setError] = useState(null);
  const [codeError, setCodeError] = useState(null);
  const [success, setSuccess] = useState(null);
  const setActionLoading = (val) => {
    actionLoadingRef.current = val;
    _setActionLoading(val);
  };
  const isVendorBatch = delivery?.isVendorBatch;
  const stops = isVendorBatch ? parseStops(delivery?.mutipledropoff) : [];
  const currentStopIdx = delivery?.currentStopIdx ?? 0;
  const currentStop = stops[currentStopIdx];
  const totalStops = stops.length;
  const isLastStop = currentStopIdx >= totalStops - 1;

  const fetchDelivery = useCallback(async () => {
    if (!token) return;
    if (actionLoadingRef.current) return;
    try {
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        queries: [Query.equal('driverToken', token), Query.limit(1)],
      });
      if (!response.rows?.length) {
        setError('This link is invalid or has expired.');
        return;
      }
      setDelivery((prev) =>
        prev ? { ...prev, ...response.rows[0] } : response.rows[0]
      );
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDelivery();
    const interval = setInterval(fetchDelivery, 30000);
    return () => clearInterval(interval);
  }, [fetchDelivery]);

  const handleAdvanceStop = async () => {
    setCodeError(null);
    setActionLoading(true);
    try {
      const nextIdx = currentStopIdx + 1;
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: delivery.$id,
        data: { currentStopIdx: nextIdx }, // stays in_transit, just advances idx
      });
      setDelivery((prev) => ({ ...prev, currentStopIdx: nextIdx }));
      setSuccess(
        `Moving to stop ${nextIdx + 1} of ${totalStops}. Safe driving!`
      );
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setCodeError('Something went wrong. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmPickup = async (enteredCode) => {
    setCodeError(null);
    setActionLoading(true);
    try {
      if (enteredCode.toUpperCase() !== delivery.pickupCode?.toUpperCase()) {
        setCodeError('Wrong code — ask the sender for the correct pickup code');
        return;
      }
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: delivery.$id,
        data: { status: 'picked_up' },
      });
      setDelivery((prev) => ({ ...prev, status: 'picked_up' }));
      setSuccess('Package picked up! Head to the dropoff location.');
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setCodeError('Something went wrong. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartDelivery = async () => {
    setActionLoading(true);
    try {
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: delivery.$id,
        data: { status: 'in_transit' },
      });
      setDelivery((prev) => ({ ...prev, status: 'in_transit' }));
      setSuccess("You're on your way! Safe driving.");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setCodeError('Something went wrong. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelivery = async (enteredOTP) => {
    setCodeError(null);
    setActionLoading(true);
    try {
      if (enteredOTP !== delivery.dropoffOTP) {
        setCodeError('Wrong OTP — ask the recipient for the correct code');
        return;
      }
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: delivery.$id,
        data: { status: 'delivered' },
      });
      if (delivery.driverId) {
        await freeDriverFromDelivery(delivery.driverId, delivery.$id);
      }
      setDelivery((prev) => ({ ...prev, status: 'delivered' }));
      setSuccess('Delivery complete! Great work.');
    } catch (err) {
      console.error('Delivery confirmed but driver cleanup failed:', err);
      setDelivery((prev) => ({ ...prev, status: 'delivered' }));
      setSuccess('Delivery complete! Great work.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: brandColors.primary }}
          >
            <Truck className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Loading your delivery…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-red-200 p-6 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-sm font-black text-gray-900 mb-1">
            Link Not Found
          </h2>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (delivery?.status === 'delivered') {
    const completedStops = isVendorBatch
      ? parseStops(delivery?.mutipledropoff)
      : [];

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-green-200 p-8 text-center shadow-sm">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#DCFCE7', border: '2px solid #BBF7D0' }}
          >
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-lg font-black text-gray-900 mb-1">
            {isVendorBatch ? 'All Deliveries Complete!' : 'Delivery Complete!'}
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            {isVendorBatch
              ? `All ${completedStops.length} orders delivered successfully. Great work!`
              : 'This delivery has been successfully completed. Great work!'}
          </p>

          {isVendorBatch && completedStops.length > 0 ? (
            <div className="space-y-1.5 text-left">
              {completedStops.map((stop, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {stop.dropoffAddress}
                    </p>
                    {stop.dropoffContactName && (
                      <p className="text-[10px] text-gray-500">
                        {stop.dropoffContactName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-left">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Delivered to
              </p>
              <p className="text-xs font-semibold text-gray-700">
                {formatAddress(delivery.dropoffAddress)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="max-w-md mx-auto style={{ background: brandColors.primary }}">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
              Driver Portal
            </p>
            <h1 className="text-white text-base font-black leading-tight">
              {delivery?.driverName || 'Driver'}
            </h1>
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <StepBar status={delivery?.status} />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-4">
        {success && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-green-50 border border-green-200">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-xs text-green-700 font-semibold">{success}</p>
          </div>
        )}

        {/* Route card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Your Route
            </p>
          </div>
          <div className="p-4 space-y-3">
            {/* Pickup — unchanged */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-0.5 pt-0.5">
                <div className="w-3 h-3 rounded-full border-2 border-green-500 bg-green-100 flex-shrink-0" />
                <div className="w-px h-8 border-l-2 border-dashed border-gray-200" />
              </div>
              <div className="flex-1 pb-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-green-600 mb-0.5">
                  Pickup Location
                </p>
                <p className="text-sm font-bold text-gray-900 leading-snug">
                  {formatAddress(delivery?.pickupAddress)}
                </p>
                {(delivery?.guestName || delivery?.pickupContactName) && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Contact: {delivery.guestName || delivery.pickupContactName}
                  </p>
                )}
                {(delivery?.guestPhone || delivery?.pickupPhone) && (
                  <a
                    href={`tel:${delivery.guestPhone || delivery.pickupPhone}`}
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-green-50 border border-green-200 mt-2 flex-shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5 text-green-600" />
                  </a>
                )}
              </div>
            </div>

            {/* Dropoff — batch-aware */}
            {isVendorBatch && stops.length > 0 ? (
              <div className="space-y-0 rounded-xl border border-gray-200 overflow-hidden">
                {/* Progress header */}
                <div
                  className="px-3 py-2 flex items-center justify-between"
                  style={{
                    background: '#FFF7F3',
                    borderBottom: '1px solid #FF6B3520',
                  }}
                >
                  <p
                    className="text-[9px] font-black uppercase tracking-widest"
                    style={{ color: '#FF6B35' }}
                  >
                    {totalStops} Stops
                  </p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: '#FF6B35' }}
                  >
                    {currentStopIdx + 1} / {totalStops}
                  </span>
                </div>

                {stops.map((stop, i) => {
                  const isDone = i < currentStopIdx;
                  const isCurrent = i === currentStopIdx;
                  return (
                    <div
                      key={i}
                      className={`flex gap-3 px-3 py-3 border-b border-gray-100 last:border-b-0 ${
                        isCurrent
                          ? 'bg-orange-50'
                          : isDone
                            ? 'bg-gray-50'
                            : 'bg-white'
                      }`}
                    >
                      {/* Stop dot */}
                      <div className="flex flex-col items-center gap-0.5 pt-0.5 flex-shrink-0">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black"
                          style={{
                            background: isDone
                              ? '#10b981'
                              : isCurrent
                                ? '#FF6B35'
                                : '#d1d5db',
                          }}
                        >
                          {isDone ? '✓' : i + 1}
                        </div>
                        {i < stops.length - 1 && (
                          <div className="w-px h-3 border-l border-dashed border-gray-300 mt-0.5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`text-sm font-bold leading-snug ${
                              isDone
                                ? 'text-gray-400 line-through'
                                : 'text-gray-900'
                            }`}
                          >
                            {stop.dropoffAddress}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              Current
                            </span>
                          )}
                          {isDone && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              Done
                            </span>
                          )}
                        </div>
                        {stop.dropoffContactName && (
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {stop.dropoffContactName}
                          </p>
                        )}
                        {stop.orderRef && (
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                            {stop.orderRef}
                          </p>
                        )}
                        {/* Phone — only show for current stop */}
                        {isCurrent && stop.dropoffPhone && (
                          <a
                            href={`tel:${stop.dropoffPhone}`}
                            className="inline-flex items-center gap-1 mt-1.5 w-8 h-8 rounded-xl justify-center bg-red-50 border border-red-200"
                          >
                            <Phone className="w-3.5 h-3.5 text-red-600" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Original single dropoff
              <div className="flex gap-3">
                <div className="pt-0.5 flex-shrink-0">
                  <div className="w-3 h-3 rounded-full border-2 border-red-400 bg-red-100" />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-0.5">
                    Dropoff Location
                  </p>
                  <p className="text-sm font-bold text-gray-900 leading-snug">
                    {formatAddress(delivery?.dropoffAddress)}
                  </p>
                  {delivery?.dropoffInstructions && (
                    <div className="mt-1.5 flex items-start gap-1.5 rounded-lg px-2 py-1.5 bg-amber-50 border border-amber-200">
                      <Navigation className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-amber-600" />
                      <p className="text-[10px] text-amber-900 leading-snug">
                        {delivery.dropoffInstructions}
                      </p>
                    </div>
                  )}
                  {delivery?.dropoffPhone && (
                    <a
                      href={`tel:${delivery.dropoffPhone}`}
                      className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 border border-red-200 mt-2 flex-shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* {(isVendorBatch
            ? currentStop?.dropoffAddress
            : delivery?.dropoffAddress) && (
            <div className="px-4 pb-4">
              href=
              {`https://maps.google.com/?q=${encodeURIComponent(
                isVendorBatch
                  ? currentStop?.dropoffAddress
                  : delivery?.dropoffAddress
              )}`}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                style={{
                  background: '#F0FDF4',
                  color: '#16A34A',
                  border: '1px solid #BBF7D0',
                }}
              >
                <MapPin className="w-3.5 h-3.5" />
                {isVendorBatch
                  ? `Open Stop ${currentStopIdx + 1} in Maps`
                  : 'Open Dropoff in Maps'}
              </a>
            </div>
          )} */}
        </div>

        {/* Package info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
            Package Details
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${brandColors.primary}12` }}
            >
              <Package
                className="w-5 h-5"
                style={{ color: brandColors.primary }}
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 capitalize">
                {delivery?.packageSize || 'Standard'} Package
              </p>
              {delivery?.packageDescription && (
                <p className="text-[10px] text-gray-500">
                  {delivery.packageDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ASSIGNED → confirm pickup */}
        {delivery?.status === 'assigned' && (
          <div
            className="bg-white rounded-2xl shadow-sm p-4"
            style={{ border: `1px solid ${brandColors.primary}30` }}
          >
            <CodeInput
              label="Pickup Code"
              length={6}
              onSubmit={handleConfirmPickup}
              loading={actionLoading}
              hint="Ask the sender"
              error={codeError}
            />
          </div>
        )}

        {/* PICKED_UP → start delivery */}
        {delivery?.status === 'picked_up' && (
          <div className="bg-white rounded-2xl border border-purple-200 shadow-sm p-4">
            <button
              onClick={handleStartDelivery}
              disabled={actionLoading}
              className="w-full py-3 rounded-xl text-sm font-black text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              style={{
                background: '#7C3AED',
                boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              }}
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Truck className="w-4 h-4" />
              )}
              {actionLoading ? 'Updating…' : "I'm On My Way"}
            </button>
          </div>
        )}

        {/* IN_TRANSIT → confirm dropoff with OTP */}
        {delivery?.status === 'in_transit' && (
          <>
            {isVendorBatch && !isLastStop ? (
              // Not the last stop yet — "Delivered to this stop, next stop"
              <div
                className="bg-white rounded-2xl shadow-sm p-4"
                style={{ border: '1px solid #FF6B3530' }}
              >
                <p
                  className="text-[10px] font-black uppercase tracking-widest mb-3"
                  style={{ color: '#FF6B35' }}
                >
                  Delivered Stop {currentStopIdx + 1}?
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Confirm you've delivered to{' '}
                  <span className="font-semibold text-gray-900">
                    {currentStop?.dropoffContactName ||
                      currentStop?.dropoffAddress}
                  </span>{' '}
                  before moving to the next stop.
                </p>
                <button
                  onClick={handleAdvanceStop}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl text-sm font-black text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{
                    background: '#FF6B35',
                    boxShadow: '0 4px 16px rgba(255,107,53,0.35)',
                  }}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Truck className="w-4 h-4" />
                  )}
                  {actionLoading
                    ? 'Updating…'
                    : `Done — Next Stop (${currentStopIdx + 2}/${totalStops})`}
                </button>
              </div>
            ) : (
              // Last stop (or individual) — enter OTP to complete
              <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-4">
                {isVendorBatch && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">
                    Final Stop — Complete Delivery
                  </p>
                )}
                <CodeInput
                  label="Recipient OTP"
                  length={6}
                  onSubmit={handleConfirmDelivery}
                  loading={actionLoading}
                  hint="Ask the recipient"
                  error={codeError}
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="max-w-md mx-auto px-4 pb-8 mt-2 text-center">
        <p className="text-[10px] text-gray-400">
          This is a secure one-time delivery link. Do not share it with others.
        </p>
      </div>
    </div>
  );
}

export default function DriverPortalPage({ params }) {
  const { token } = use(params);

  const [agencyBrandColors, setAgencyBrandColors] = useState({
    primary: '#3A0A21',
    secondary: '#5A1A41',
    accent: '#8B2E5A',
  });

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await tablesDB.listRows({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
          queries: [Query.equal('driverToken', token), Query.limit(1)],
        });
        const delivery = res.rows?.[0];
        if (!delivery?.assignedAgencyId || cancelled) return;

        const agencyRes = await tablesDB.listRows({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
          queries: [
            Query.equal('$id', delivery.assignedAgencyId),
            Query.limit(1),
          ],
        });
        const agencyData = agencyRes.rows?.[0];
        if (!agencyData?.brandColors || cancelled) return;

        setAgencyBrandColors(JSON.parse(agencyData.brandColors));
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <BrandColorsProvider initialColors={agencyBrandColors}>
      <DriverPortalInner token={token} />
    </BrandColorsProvider>
  );
}

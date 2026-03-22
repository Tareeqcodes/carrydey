'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { tablesDB } from '@/lib/config/Appwriteconfig';
import useChooseAvailable from '@/hooks/useChooseAvailable';
import {
  CheckCircle,
  Zap,
  Loader2,
  TrendingUp,
  AlertCircle,
  Radio,
  RadioTower,
  MapPin,
} from 'lucide-react';

const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const DELIVERIES = process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID;
const APPWRITE_BASE = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(
  /\/v1\/?$/,
  ''
);
const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DISPATCH_FN = process.env.NEXT_PUBLIC_DISPATCH_SEARCH_FUNCTION_ID;

// Radius steps the system will try in order before giving up
const RADIUS_STEPS = [10, 20, 30, 50];
const MAX_RADIUS = RADIUS_STEPS[RADIUS_STEPS.length - 1];

// ── Expanding rings animation ─────────────────────────────────────────────────
function ExpandingRings({ radiusKm, prevRadiusKm }) {
  const pct = (radiusKm / MAX_RADIUS) * 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Animated rings */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-gray-100" />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`${radiusKm}-ring-${i}`}
            className="absolute rounded-full border-2 border-orange-400"
            style={{ opacity: i === 0 ? 0.7 : i === 1 ? 0.4 : 0.15 }}
            initial={{ width: 40, height: 40, opacity: 0.8 }}
            animate={{ width: 160, height: 160, opacity: 0 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeOut',
            }}
          />
        ))}
        {/* Center pin */}
        <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-orange-500">
          <MapPin size={20} color="#fff" />
        </div>
      </div>

      {/* Radius label */}
      <div className="text-center">
        <motion.p
          key={radiusKm}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-2xl font-black text-gray-900"
        >
          {radiusKm}km
        </motion.p>
        <p className="text-sm text-gray-400 mt-1">search radius</p>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-2">
        {RADIUS_STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className="rounded-full transition-all duration-500"
              style={{
                width: step === radiusKm ? 20 : 8,
                height: 8,
                background: step <= radiusKm ? '#FF6B35' : '#e5e7eb',
              }}
            />
            {i < RADIUS_STEPS.length - 1 && (
              <div
                className="h-px w-5"
                style={{ background: step < radiusKm ? '#FF6B35' : '#e5e7eb' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>10km</span>
          <span>{MAX_RADIUS}km</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-orange-500"
            initial={{ width: `${((prevRadiusKm ?? 10) / MAX_RADIUS) * 100}%` }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const AutoAssignDelivery = () => {
  const router = useRouter();

  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [assignedCourier, setAssignedCourier] = useState(null);

  // stage: 'hook' | 'expanding' | 'exhausted'
  const [stage, setStage] = useState('hook');
  const [searchRadius, setSearchRadius] = useState(RADIUS_STEPS[0]);
  const [prevRadius, setPrevRadius] = useState(null);
  const [expandMsg, setExpandMsg] = useState('');
  const expandingRef = useRef(false);

  const deliveryId =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('latestDeliveryId')
      : null;

  const {
    status,
    currentCourier,
    countdown,
    queueId,
    failReason,
    advanceDispatch,
  } = useChooseAvailable(deliveryId);

  // ── Load delivery details ─────────────────────────────────────────────────
  useEffect(() => {
    if (!deliveryId) {
      router.push('/send');
      return;
    }
    tablesDB
      .getRow({ databaseId: DB, tableId: DELIVERIES, rowId: deliveryId })
      .then(setDeliveryDetails)
      .catch(() => router.push('/send'));
  }, [deliveryId]);

  // ── On assign → redirect ──────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'assigned' && currentCourier && !assignedCourier) {
      setAssignedCourier(currentCourier);
      setStage('hook');
      setTimeout(() => router.push('/track'), 2000);
    }
  }, [status, currentCourier]);

  // ── When new queue arrives after expansion → return to offering ───────────
  useEffect(() => {
    if (status === 'offering' && stage === 'expanding') {
      expandingRef.current = false;
      setStage('hook');
    }
  }, [status, stage]);

  // ── When all couriers rejected → auto-expand radius ───────────────────────
  useEffect(() => {
    if (status !== 'failed' || expandingRef.current) return;

    const currentStepIndex = RADIUS_STEPS.indexOf(searchRadius);
    const nextRadius = RADIUS_STEPS[currentStepIndex + 1];

    if (!nextRadius) {
      setStage('exhausted');
      return;
    }

    expandingRef.current = true;
    setPrevRadius(searchRadius);
    setSearchRadius(nextRadius);
    setStage('expanding');
    setExpandMsg(
      `No couriers within ${searchRadius}km — widening to ${nextRadius}km`
    );

    fetch(`${APPWRITE_BASE}/v1/functions/${DISPATCH_FN}/executions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT,
      },
      body: JSON.stringify({
        body: JSON.stringify({ deliveryId, radiusKm: nextRadius }),
        async: true,
      }),
    }).catch(console.error);
  }, [status]); // only re-run when status changes

  // ── Increase offer ────────────────────────────────────────────────────────
  const handleIncreaseOffer = async () => {
    if (!deliveryDetails) return;
    const newFare = Math.round(deliveryDetails.offeredFare * 1.2);
    await tablesDB.updateRow({
      databaseId: DB,
      tableId: DELIVERIES,
      rowId: deliveryId,
      data: { offeredFare: newFare },
    });
    setDeliveryDetails((p) => ({ ...p, offeredFare: newFare }));
    if (queueId) advanceDispatch(queueId, 'timeout');
  };

  // ── Retry from scratch ────────────────────────────────────────────────────
  const handleRetryFull = () => {
    expandingRef.current = false;
    setStage('hook');
    setSearchRadius(RADIUS_STEPS[0]);
    setPrevRadius(null);
    fetch(`${APPWRITE_BASE}/v1/functions/${DISPATCH_FN}/executions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT,
      },
      body: JSON.stringify({
        body: JSON.stringify({ deliveryId, radiusKm: RADIUS_STEPS[0] }),
        async: true,
      }),
    }).catch(console.error);
  };

  // ── Renders ───────────────────────────────────────────────────────────────
  const renderSearching = () => (
    <motion.div
      key="searching"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center pt-6"
    >
      <div className="relative w-32 h-32 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-orange-200 animate-ping" />
        <div className="absolute inset-2 rounded-full border-4 border-orange-300 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-orange-500 flex items-center justify-center">
          <RadioTower className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
      <h2 className="text-xl font-black mb-2">Finding your courier</h2>
      <p className="text-sm text-gray-400">
        Scanning within {searchRadius}km of your pickup...
      </p>
    </motion.div>
  );

  const renderOffering = () => (
    <motion.div
      key="offering"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${currentCourier?.name}`}
            alt={currentCourier?.name}
            className="w-full h-full rounded-full border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-black mb-1">{currentCourier?.name}</h2>
        <p className="text-gray-500 mb-1">
          {currentCourier?.entityType === 'agency'
            ? 'Delivery Agency'
            : 'Independent Courier'}
        </p>
        <p className="text-sm text-gray-400 mb-4">
          {currentCourier?.distance}km away
          {currentCourier?.rating != null &&
            ` · ⭐ ${Number(currentCourier.rating).toFixed(1)}`}
        </p>

        {/* Countdown ring */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="#FF6B35"
              strokeWidth="6"
              fill="none"
              strokeDasharray="364.5"
              strokeDashoffset={364.5 * (1 - countdown / 20)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-black text-gray-800">
              {countdown}s
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-1">
          Waiting for {currentCourier?.name?.split(' ')[0]} to respond...
        </p>
        <p className="text-sm text-gray-400">
          They have {countdown} seconds to accept
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-600 mb-3">
          Increase your offer to get matched faster
        </p>
        <button
          onClick={handleIncreaseOffer}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Increase offer by 20%
          {deliveryDetails?.offeredFare && (
            <span className="opacity-50 font-normal text-sm">
              → ₦
              {Math.round(deliveryDetails.offeredFare * 1.2).toLocaleString()}
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderAssigned = () => (
    <motion.div
      key="assigned"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="text-center"
    >
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-8 mb-6 text-white">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-black mb-2">Courier Found!</h2>
        <p className="text-white/90 mb-1">
          {assignedCourier?.name} is on the way
        </p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
        <img
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${assignedCourier?.name}`}
          alt={assignedCourier?.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1 text-left">
          <p className="font-bold">{assignedCourier?.name}</p>
          {assignedCourier?.rating != null && (
            <p className="text-xs text-gray-500">
              ⭐ {Number(assignedCourier.rating).toFixed(1)}
              {assignedCourier?.distance != null &&
                ` · ${assignedCourier.distance}km away`}
            </p>
          )}
        </div>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500" />
      </div>
      <p className="text-sm text-gray-400 mt-4">Redirecting to tracking...</p>
    </motion.div>
  );

  const renderExpanding = () => (
    <motion.div
      key="expanding"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="pt-4 flex flex-col items-center gap-6"
    >
      <div className="text-center">
        <p className="text-xl font-black text-gray-900 mb-1">
          Widening your search
        </p>
        <motion.p
          key={expandMsg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed"
        >
          {expandMsg}
        </motion.p>
      </div>

      <ExpandingRings radiusKm={searchRadius} prevRadiusKm={prevRadius} />

      <p className="text-xs text-gray-400 text-center">
        Scanning for couriers — this may take a moment
      </p>

      <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <p className="text-sm text-gray-500 mb-3 text-center">
          Raise your offer to attract couriers faster
        </p>
        <button
          onClick={handleIncreaseOffer}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
        >
          <TrendingUp className="w-4 h-4" />
          Increase offer by 20%
          {deliveryDetails?.offeredFare && (
            <span className="opacity-50 font-normal">
              → ₦
              {Math.round(deliveryDetails.offeredFare * 1.2).toLocaleString()}
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderExhausted = () => (
    <motion.div
      key="exhausted"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center pt-6"
    >
      <div className="bg-red-50 rounded-3xl p-8 mb-6">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black mb-2">No couriers available</h2>
        <p className="text-gray-600 mb-3">
          We searched up to {MAX_RADIUS}km from your pickup and found no
          available couriers right now.
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-sm text-gray-500">
            Searched{' '}
            <span className="font-bold text-gray-800">{MAX_RADIUS}km</span>{' '}
            radius
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <button
          onClick={handleRetryFull}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Radio className="w-4 h-4" />
          Retry full search
        </button>
        <button
          onClick={handleIncreaseOffer}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Increase offer & retry
        </button>
        <button
          onClick={() => router.push('/send')}
          className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold"
        >
          Modify delivery
        </button>
      </div>
    </motion.div>
  );

  // ── What to render ────────────────────────────────────────────────────────
  const renderContent = () => {
    if (stage === 'expanding') return renderExpanding();
    if (stage === 'exhausted') return renderExhausted();

    if (status === 'searching') return renderSearching();
    if (status === 'offering') return renderOffering();
    if (status === 'assigned') return renderAssigned();

    // 'failed' is intercepted by useEffect — show spinner while effect fires
    return (
      <motion.div key="transitioning" className="text-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Widening search...</p>
      </motion.div>
    );
  };

  // ── Bottom bar label ──────────────────────────────────────────────────────
  const barLabel =
    stage === 'expanding'
      ? `Expanding to ${searchRadius}km...`
      : stage === 'exhausted'
        ? 'No couriers found'
        : status === 'searching'
          ? 'Scanning couriers...'
          : status === 'offering'
            ? 'Waiting for response...'
            : status === 'assigned'
              ? 'Courier confirmed ✓'
              : status === 'failed'
                ? 'Expanding search...'
                : 'Preparing...';

  const dotColor =
    stage === 'exhausted'
      ? '#f87171'
      : status === 'assigned'
        ? '#22c55e'
        : '#FF6B35';

  const dotAnimate =
    stage === 'exhausted' || status === 'assigned'
      ? { scale: 1 }
      : { scale: [1, 1.5, 1] };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
      <div
        className="min-h-screen bg-gradient-to-b from-white to-gray-50"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-md mx-auto px-4 py-8 pb-28">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>

        {/* Bottom status bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <div className="max-w-md mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: dotColor }}
                animate={dotAnimate}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-gray-600">{barLabel}</span>
            </div>
            {deliveryDetails?.offeredFare && (
              <span className="font-bold text-orange-500">
                ₦{deliveryDetails.offeredFare.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AutoAssignDelivery;

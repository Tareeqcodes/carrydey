'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  MapPin,
  CheckCircle,
  Star,
  Phone,
  X,
  Truck,
  User,
  Copy,
  Check,
  Shield,
  Heart,
  RotateCcw,
  ChevronRight,
  Clock,
  Info,
  Repeat2,
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const STATUS_PROGRESS = {
  pending: 0,
  accepted: 20,
  assigned: 40,
  picked_up: 60,
  in_transit: 80,
  delivered: 100,
};

const TIMELINE_STEPS = [
  { label: 'Order Placed', status: 'pending', icon: Package, progress: 0 },
  { label: 'Courier Assigned', status: 'assigned', icon: User, progress: 40 },
  { label: 'Picked Up', status: 'picked_up', icon: CheckCircle, progress: 60 },
  { label: 'In Transit', status: 'in_transit', icon: Truck, progress: 80 },
  { label: 'Delivered', status: 'delivered', icon: MapPin, progress: 100 },
];

function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  };
  return [copied, copy];
}

function ProgressBar({ progress }) {
  return (
    <div className="space-y-1.5">
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="h-full bg-white rounded-full"
        />
      </div>
    </div>
  );
}

/** Single timeline row */
function TimelineRow({ step, isActive, isCurrent, isLast }) {
  const Icon = step.icon;
  return (
    <div className="relative flex items-center gap-4">
      {!isLast && (
        <div
          className={`absolute left-[15px] top-10 w-0.5 h-7 transition-colors ${
            isActive ? 'bg-[#3A0A21]' : 'bg-gray-200'
          }`}
        />
      )}
      <div
        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-xl border-2 flex-shrink-0 transition-all ${
          isActive
            ? 'bg-[#3A0A21] border-[#3A0A21] text-white shadow-md shadow-[#3A0A21]/30'
            : 'bg-gray-50 border-gray-200 text-gray-400'
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p
          className={`font-semibold text-sm ${isActive ? 'text-gray-900' : 'text-gray-400'}`}
        >
          {step.label}
        </p>
        {isCurrent && (
          <p className="text-xs text-[#3A0A21] font-medium mt-0.5">
            In Progress
          </p>
        )}
      </div>
    </div>
  );
}

function CodeDisplay({ label, code, gradient, onCopy, copied }) {
  return (
    <div
      className={`relative rounded-3xl p-7 text-center overflow-hidden ${gradient}`}
    >
      {/* subtle dot-grid texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative z-10">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">
          {label}
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 mb-5 inline-block w-full">
          <p className="text-4xl font-bold text-white tracking-[0.25em] font-mono select-all">
            {code || '——'}
          </p>
        </div>
        <button
          onClick={() => onCopy(code)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white rounded-xl text-sm font-semibold transition-all"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

/** Inline hint chip */
function HintChip({ color, icon: Icon, text }) {
  const schemes = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };
  const iconSchemes = {
    blue: 'text-blue-500',
    emerald: 'text-emerald-500',
  };
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${schemes[color]}`}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconSchemes[color]}`} />
      <p className="text-xs leading-relaxed font-medium">{text}</p>
    </div>
  );
}

const SenderTrackingView = ({
  delivery,
  onClose,
  onRebook,
  onToggleFavourite,
  isFavourite: initialFav = false,
}) => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [showRating, setShowRating] = useState(false);
  const [courierRating, setCourierRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [favourite, setFavourite] = useState(initialFav);
  const [copiedPickup, copyPickup] = useCopy();
  const [copiedDropoff, copyDropoff] = useCopy();

  const progress = STATUS_PROGRESS[delivery?.status] ?? 0;
  const isDelivered = delivery?.status === 'delivered';
  const hasCourier = Boolean(delivery?.driverName);

  const stops = (() => {
    try {
      return delivery?.mutipledropoff
        ? JSON.parse(delivery.mutipledropoff)
        : null;
    } catch {
      return null;
    }
  })();
  const isVendorBatch = delivery?.isVendorBatch && stops?.length > 0;
  const currentStopIdx = delivery?.currentStopIdx ?? 0;

  const TABS = [
    { id: 'tracking', label: 'Tracking' },
    { id: 'security', label: 'Codes' },
    { id: 'courier', label: 'Courier', hidden: !hasCourier },
    { id: 'details', label: 'Details' },
  ].filter((t) => !t.hidden);

  const handleToggleFavourite = () => {
    const next = !favourite;
    setFavourite(next);
    onToggleFavourite?.(delivery?.driverId, next);
  };

  const handleRebook = () => {
    onRebook?.(delivery);
    onClose();
  };

  const handleSubmitRating = () => {
    if (courierRating === 0) return;
    console.log('Rating:', {
      courierRating,
      ratingComment,
      deliveryId: delivery?.$id,
    });
    setShowRating(false);
    onClose();
  };

  /* ── Tab: Tracking ── */
  const renderTracking = () => {
    const currentStepIndex = TIMELINE_STEPS.findIndex(
      (s) => s.progress >= progress
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        {/* Status Banner */}
        <div className="bg-gradient-to-br from-[#3A0A21] to-[#5A0A31] rounded-3xl p-6 text-white">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                Status
              </p>
              <p className="text-xl font-bold capitalize">
                {delivery?.status?.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl">
              {isDelivered ? (
                <CheckCircle className="w-7 h-7" />
              ) : (
                <Truck className="w-7 h-7" />
              )}
            </div>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            Delivery Timeline
          </h3>
          <div className="space-y-5">
            {TIMELINE_STEPS.map((step, i) => (
              <TimelineRow
                key={step.status}
                step={step}
                isActive={progress >= step.progress}
                isCurrent={i === currentStepIndex}
                isLast={i === TIMELINE_STEPS.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-gray-900">Route</h3>
            {isVendorBatch && (
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                style={{ background: '#FF6B35' }}
              >
                {stops.length} stops
              </span>
            )}
          </div>

          {/* Pickup — always the same */}
          <div className="flex gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-900 mb-0.5">
                Pickup
              </p>
              <p className="text-sm text-blue-800">{delivery?.pickupAddress}</p>
            </div>
          </div>

          {/* Dropoffs */}
          {isVendorBatch ? (
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              {stops.map((stop, i) => {
                const isDone = i < currentStopIdx;
                const isCurrent = i === currentStopIdx;
                return (
                  <div
                    key={i}
                    className={`flex gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                      isCurrent
                        ? 'bg-orange-50'
                        : isDone
                          ? 'bg-gray-50'
                          : 'bg-white'
                    }`}
                  >
                    {/* Stop indicator */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
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
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold truncate ${isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}
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
                        <p className="text-xs text-gray-500 mt-0.5">
                          {stop.dropoffContactName}
                        </p>
                      )}
                      {stop.orderRef && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {stop.orderRef}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-900 mb-0.5">
                  Dropoff
                </p>
                <p className="text-sm text-emerald-800">
                  {delivery?.dropoffAddress}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rate CTA */}
        {isDelivered && (
          <button
            onClick={() => setShowRating(true)}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            Rate Your Courier
          </button>
        )}
      </motion.div>
    );
  };

  /* ── Tab: Security Codes (display-only) ── */
  const renderSecurity = () => {
    const canShowPickup = ['accepted', 'assigned', 'pending'].includes(
      delivery?.status
    );
    const canShowDropoff = ['picked_up', 'in_transit', 'delivered'].includes(
      delivery?.status
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        {/* Pickup Code */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <h3 className="text-base font-bold text-gray-900">Pickup Code</h3>
          </div>
          {canShowPickup ? (
            <>
              <CodeDisplay
                label="Share with courier at pickup"
                code={delivery?.pickupCode}
                gradient="bg-gradient-to-br from-[#3A0A21] to-[#5A0A31]"
                onCopy={copyPickup}
                copied={copiedPickup}
              />
              <HintChip
                color="blue"
                icon={Info}
                text="Show or read this code to your courier when they arrive to collect the package. They'll enter it on their device to confirm pickup."
              />
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Available once a courier is assigned
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">
            DELIVERY OTP
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Dropoff OTP */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <h3 className="text-base font-bold text-gray-900">Delivery OTP</h3>
          </div>
          {canShowDropoff ? (
            <>
              <CodeDisplay
                label="Share with recipient at dropoff"
                code={delivery?.dropoffOTP}
                gradient="bg-gradient-to-br from-emerald-600 to-teal-600"
                onCopy={copyDropoff}
                copied={copiedDropoff}
              />
              <HintChip
                color="emerald"
                icon={Info}
                text="The recipient gives this OTP to the courier at the door. The courier enters it to confirm successful delivery."
              />
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Available once the package is picked up
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  /* ── Tab: Courier ── */
  const renderCourier = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Courier Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-5">
          {/* Avatar */}
          <div className="relative w-10 h-10 bg-gradient-to-br from-[#3A0A21] to-[#5A0A31] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#3A0A21]/20 flex-shrink-0">
            {delivery?.driverName?.charAt(0).toUpperCase()}
            {/* Verified badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-lg leading-tight">
              {delivery?.driverName}
            </p>
          </div>

          {/* Favourite toggle */}
          <button
            onClick={handleToggleFavourite}
            className={`p-3 rounded-2xl border-2 transition-all ${
              favourite
                ? 'bg-rose-50 border-rose-200 text-rose-500'
                : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-rose-200 hover:text-rose-400'
            }`}
            title={favourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart className={`w-5 h-5 ${favourite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Phone */}
        {delivery?.driverPhone && (
          <a
            href={`tel:${delivery.driverPhone}`}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
          >
            <div className="p-2 bg-[#3A0A21] rounded-xl">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Phone</p>
              <p className="text-sm font-bold text-gray-900">
                {delivery.driverPhone}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </a>
        )}

        {/* Favourite tip */}
        <AnimatePresence>
          {favourite && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-xl border border-rose-200">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 flex-shrink-0" />
                <p className="text-xs text-rose-700 font-medium">
                  Saved to favourites you can rebook this courier on future
                  deliveries.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rebook Section — only when delivered */}
      {isDelivered && (
        <div className="bg-gradient-to-br from-[#3A0A21]/5 to-[#3A0A21]/10 rounded-3xl border border-[#3A0A21]/20 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3A0A21] rounded-xl">
              <Repeat2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">
                Rebook {delivery?.driverName?.split(' ')[0]}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Start a new delivery with the same courier
              </p>
            </div>
          </div>

          {/* Route preview of last delivery */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
              Last Route
            </p>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 line-clamp-1">
                {delivery?.pickupAddress}
              </p>
            </div>
            <div className="ml-[3px] w-px h-3 bg-gray-200" />
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 line-clamp-1">
                {delivery?.dropoffAddress}
              </p>
            </div>
          </div>

          <button
            onClick={handleRebook}
            className="w-full py-4 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Rebook This Courier
          </button>

          <p className="text-xs text-center text-gray-400">
            You'll be taken to a new delivery form pre-filled with this
            courier's details.
          </p>
        </div>
      )}

      {/* Placeholder when not yet delivered */}
      {!isDelivered && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
          <RotateCcw className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-500">
            Rebook available after delivery
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Once this delivery is completed you can rebook this courier.
          </p>
        </div>
      )}
    </motion.div>
  );

  const renderDetails = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-white rounded-3xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-600 mb-5">
          Delivery Information
        </h3>
        <div className="divide-y divide-gray-100">
          {[
            {
              label: 'Package Size',
              value: delivery?.packageSize || 'Standard',
            },
            isVendorBatch && {
              label: 'Total Stops',
              value: `${stops.length} orders`,
            },
            {
              label: 'Delivery Fee',
              value: formatNairaSimple(
                delivery?.offeredFare || delivery?.suggestedFare
              ),
            },
            delivery?.isFragile && {
              label: 'Special Handling',
              value: (
                <span className="px-3 py-1 text-xs font-bold bg-orange-100 text-orange-700 rounded-lg border border-orange-200">
                  Fragile
                </span>
              ),
            },
            {
              label: 'Order Date',
              value: new Date(delivery?.$createdAt).toLocaleDateString(
                'en-US',
                {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }
              ),
            },
          ]
            .filter(Boolean)
            .map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-3.5"
              >
                <span className="text-gray-500 font-medium text-sm">
                  {label}
                </span>
                <span className="font-bold text-gray-900 text-sm">{value}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Batch stops breakdown */}
      {isVendorBatch && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-600 mb-4">
            All Orders
          </h3>
          <div className="space-y-2">
            {stops.map((stop, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: i < currentStopIdx ? '#10b981' : '#FF6B35',
                  }}
                >
                  {i < currentStopIdx ? '✓' : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {stop.dropoffAddress}
                  </p>
                  {stop.dropoffContactName && (
                    <p className="text-xs text-gray-500">
                      {stop.dropoffContactName}
                    </p>
                  )}
                  {stop.orderRef && (
                    <p className="text-[10px] text-gray-400 font-mono">
                      {stop.orderRef}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  /* ── Render ── */
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-gray-50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-700">
              Delivery Tracking
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                {/* favourite dot on courier tab */}
                {tab.id === 'courier' && favourite && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            {activeTab === 'tracking' && renderTracking()}
            {activeTab === 'security' && renderSecurity()}
            {activeTab === 'courier' && renderCourier()}
            {activeTab === 'details' && renderDetails()}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Rating Modal ── */}
      <AnimatePresence>
        {showRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowRating(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3A0A21] to-[#5A0A31] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {delivery?.driverName?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Rate Your Experience
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  How was {delivery?.driverName}?
                </p>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setCourierRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-12 h-12 transition-colors ${
                        star <= courierRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Leave feedback (optional)"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl p-4 mb-5 resize-none focus:outline-none focus:border-[#3A0A21] focus:ring-4 focus:ring-[#3A0A21]/10 text-sm"
                rows={3}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRating(false)}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={courierRating === 0}
                  className="flex-1 py-3 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-40 text-sm"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SenderTrackingView;

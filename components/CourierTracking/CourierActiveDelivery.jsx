'use client';
import { useState } from 'react';
import {
  Package,
  MapPin,
  Truck,
  Copy,
  Check,
  Phone,
  ChevronDown,
  DollarSign,
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const CourierActiveDelivery = ({
  deliveries,
  loading,
  copiedCode,
  onCopyCode,
  onConfirmPickup,
  onAdvanceStop,
  onConfirmDelivery,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const getStatusDot = (status) => {
    const colors = {
      accepted: 'bg-blue-500',
      assigned: 'bg-blue-500',
      picked_up: 'bg-amber-500',
      in_transit: 'bg-emerald-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  const getStatusLabel = (status) => {
    const labels = {
      accepted: 'Ready',
      assigned: 'Ready',
      picked_up: 'Picked Up',
      in_transit: 'In Transit',
    };
    return labels[status] || status;
  };

  function parseStops(raw) {
    if (!raw) return [];
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return [];
    }
  }

  const renderDeliveryCard = (delivery) => {
    const isExpanded = expandedId === delivery.$id;
    const isPickupPhase =
      delivery.status === 'accepted' || delivery.status === 'assigned';
    const isDeliveryPhase = delivery.status === 'in_transit';
    const isVendorBatch = delivery.isVendorBatch;
    const stops = isVendorBatch ? parseStops(delivery.mutipledropoff) : null;
    const currentStopIdx = delivery.currentStopIdx ?? 0;
    const currentStop = stops?.[currentStopIdx];
    const totalStops = stops?.length ?? 1;
    const isLastStop = currentStopIdx >= totalStops - 1;

    return (
      <div
        key={delivery.$id}
        className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden"
      >
        <div
          onClick={() => setExpandedId(isExpanded ? null : delivery.$id)}
          className="p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusDot(delivery.status)}`}
                  />
                  <span className="text-xs sm:text-sm font-semibold text-black dark:text-white">
                    {getStatusLabel(delivery.status)}
                  </span>
                  {isVendorBatch && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ background: '#FF6B35' }}
                    >
                      {totalStops} stops
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-black/50 dark:text-white/50">
                  {new Date(delivery.$createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-black dark:text-white">
                    {formatNairaSimple(delivery.offeredFare)}
                  </p>
                  <p className="text-[10px] text-black/50 dark:text-white/50 font-medium">
                    {isVendorBatch
                      ? `${totalStops} orders`
                      : `${(delivery.distance / 1000).toFixed(1)} km`}
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-black/40 dark:text-white/40 transition-transform flex-shrink-0 mt-0.5 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2 text-xs text-black/60 dark:text-white/60 overflow-hidden">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="break-words overflow-hidden">
                  {delivery.pickupAddress}
                </span>
              </div>
              {isVendorBatch && currentStop ? (
                <div className="flex gap-2 text-xs text-black/50 dark:text-white/50 overflow-hidden">
                  <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="break-words overflow-hidden">
                    Stop {currentStopIdx + 1}/{totalStops}:{' '}
                    {currentStop.dropoffAddress}
                  </span>
                </div>
              ) : (
                <div className="flex gap-2 text-xs text-black/50 dark:text-white/50 overflow-hidden">
                  <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="break-words overflow-hidden">
                    {delivery.dropoffAddress}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-black/10 dark:border-white/10 p-4 space-y-4 bg-black/2 dark:bg-white/2">
            {isVendorBatch && stops?.length > 0 && (
              <div className="bg-white dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
                <p className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide px-4 pt-3 pb-2">
                  All Stops
                </p>
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {stops.map((stop, i) => {
                    const isDone = i < currentStopIdx;
                    const isCurrent = i === currentStopIdx;
                    return (
                      <div
                        key={i}
                        className={`px-4 py-3 flex items-start gap-3 ${isCurrent ? 'bg-orange-50 dark:bg-orange-500/10' : isDone ? 'bg-black/2 dark:bg-white/2' : ''}`}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-semibold truncate ${isDone ? 'text-black/40 dark:text-white/40 line-through' : 'text-black dark:text-white'}`}
                            >
                              {stop.dropoffAddress}
                            </p>
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-orange-600 bg-orange-100 dark:bg-orange-500/15 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                          {stop.dropoffContactName && (
                            <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
                              {stop.dropoffContactName}
                            </p>
                          )}
                          {stop.dropoffPhone && !isDone && (
                            <a
                              href={`tel:${stop.dropoffPhone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 mt-1 text-xs font-semibold text-green-600 hover:underline"
                            >
                              <Phone className="w-3 h-3" />
                              {stop.dropoffPhone}
                            </a>
                          )}
                          {stop.orderRef && (
                            <p className="text-[10px] text-black/40 dark:text-white/40 font-mono mt-0.5">
                              {stop.orderRef}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!isVendorBatch &&
              isDeliveryPhase &&
              delivery.dropoffContactName && (
                <div className="bg-white dark:bg-white/5 rounded-lg p-3 border border-black/10 dark:border-white/10">
                  <p className="text-xs font-semibold text-black/60 dark:text-white/60 mb-2">
                    RECIPIENT
                  </p>
                  <p className="text-sm font-medium text-black dark:text-white">
                    {delivery.dropoffContactName}
                  </p>
                  {delivery.dropoffPhone && (
                    <a
                      href={`tel:${delivery.dropoffPhone}`}
                      className="flex items-center gap-2 mt-2 text-sm font-semibold text-red-600 hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {delivery.dropoffPhone}
                    </a>
                  )}
                </div>
              )}

            {isPickupPhase && delivery.pickupCode && (
              <div className="bg-white dark:bg-white/5 rounded-lg p-4 border border-black/10 dark:border-white/10">
                <p className="text-xs font-semibold text-black/60 dark:text-white/60 mb-2">
                  PICKUP CODE
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-mono font-bold text-black dark:text-white tracking-widest">
                    {delivery.pickupCode}
                  </p>
                  <button
                    onClick={() =>
                      onCopyCode(delivery.pickupCode, `pickup-${delivery.$id}`)
                    }
                  >
                    {copiedCode === `pickup-${delivery.$id}` ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-black/60 dark:text-white/60" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {isPickupPhase && delivery.pickupPhone && (
              <div className="bg-white dark:bg-white/5 rounded-lg p-3 border border-black/10 dark:border-white/10">
                <p className="text-xs font-semibold text-black/60 dark:text-white/60 mb-2">
                  SENDER
                </p>
                {delivery.pickupContactName && (
                  <p className="text-sm font-medium text-black dark:text-white mb-1">
                    {delivery.pickupContactName}
                  </p>
                )}
                <a
                  href={`tel:${delivery.pickupPhone}`}
                  className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  {delivery.pickupPhone}
                </a>
              </div>
            )}

            <button
              onClick={() => {
                if (isPickupPhase) onConfirmPickup(delivery.$id);
                else if (delivery.status === 'in_transit') {
                  if (isVendorBatch && !isLastStop)
                    onAdvanceStop(delivery.$id, currentStopIdx + 1);
                  else onConfirmDelivery(delivery.$id);
                }
              }}
              className="w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
              style={{
                background:
                  isVendorBatch &&
                  !isLastStop &&
                  delivery.status === 'in_transit'
                    ? '#FF6B35'
                    : '#111827',
              }}
            >
              {isPickupPhase
                ? 'Confirm Pickup'
                : isVendorBatch && !isLastStop
                  ? `Delivered — Next Stop (${currentStopIdx + 2}/${totalStops})`
                  : 'Confirm Delivery'}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-end justify-between">
        <h1
          className="text-[28px] font-black text-black dark:text-white leading-[1.08] tracking-[-0.02em]"
          style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        >
          Active Deliveries
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-500/10 dark:to-blue-500/5 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-3xl font-bold text-blue-900 dark:text-white">
              {
                deliveries.filter(
                  (d) => d.status === 'accepted' || d.status === 'assigned'
                ).length
              }
            </p>
          </div>
          <p className="text-sm font-semibold text-blue-900 dark:text-white">
            Ready to Pickup
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Awaiting pickup
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-500/10 dark:to-amber-500/5 rounded-3xl p-6 border border-amber-200/50 dark:border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <p className="text-3xl font-bold text-amber-900 dark:text-white">
              {deliveries.filter((d) => d.status === 'in_transit').length}
            </p>
          </div>
          <p className="text-sm font-semibold text-amber-900 dark:text-white">
            In Transit
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            On the way
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 rounded-3xl p-6 border border-emerald-200/50 dark:border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-3xl font-bold text-emerald-900 dark:text-white">
              ₦
              {deliveries
                .reduce((sum, d) => sum + (d.offeredFare || 0), 0)
                .toLocaleString()}
            </p>
          </div>
          <p className="text-sm font-semibold text-emerald-900 dark:text-white">
            Total Value
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
            Current earnings
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-black/10 dark:border-white/10 rounded-full" />
            <div className="absolute top-0 left-0 w-12 h-12 border-2 border-black/40 dark:border-white/40 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 p-12 text-center">
          <Truck className="w-12 h-12 text-black/20 dark:text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
            No Active Deliveries
          </h3>
          <p className="text-sm text-black/50 dark:text-white/50">
            Accept delivery requests to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">{deliveries.map(renderDeliveryCard)}</div>
      )}
    </div>
  );
};

export default CourierActiveDelivery;

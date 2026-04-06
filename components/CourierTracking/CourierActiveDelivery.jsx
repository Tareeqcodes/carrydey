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
  onStartDelivery,
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
    const isPickupPhase = delivery.status === 'accepted' || delivery.status === 'assigned';
    const isDeliveryPhase = delivery.status === 'picked_up' || delivery.status === 'in_transit';

  const isVendorBatch = delivery.isVendorBatch;
  const stops = isVendorBatch ? parseStops(delivery.mutipledropoff) : null;

  const currentStopIdx = delivery.currentStopIdx ?? 0;
  const currentStop = stops?.[currentStopIdx];
  const totalStops = stops?.length ?? 1;
  const isLastStop = currentStopIdx >= totalStops - 1;

    return (
        <div key={delivery.$id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      
      {/* Header - same as before but show batch badge */}
      <div
        onClick={() => setExpandedId(isExpanded ? null : delivery.$id)}
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusDot(delivery.status)}`} />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  {getStatusLabel(delivery.status)}
                </span>
                {/* Batch badge */}
                {isVendorBatch && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ background: '#FF6B35' }}>
                    {totalStops} stops
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-500">
                {new Date(delivery.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{formatNairaSimple(delivery.offeredFare)}</p>
                <p className="text-[10px] text-gray-500 font-medium">
                  {isVendorBatch ? `${totalStops} orders` : `${(delivery.distance / 1000).toFixed(1)} km`}
                </p>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 mt-0.5 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Addresses */}
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2 text-xs text-gray-600 overflow-hidden">
              <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="break-words overflow-hidden">{delivery.pickupAddress}</span>
            </div>
            {/* For batch: show current stop, for individual: show dropoff */}
            {isVendorBatch && currentStop ? (
              <div className="flex gap-2 text-xs text-gray-500 overflow-hidden">
                <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="break-words overflow-hidden">
                  Stop {currentStopIdx + 1}/{totalStops}: {currentStop.dropoffAddress}
                </span>
              </div>
            ) : (
              <div className="flex gap-2 text-xs text-gray-500 overflow-hidden">
                <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="break-words overflow-hidden">{delivery.dropoffAddress}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">

          {/* ── VENDOR BATCH: all stops list ── */}
          {isVendorBatch && stops?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 pt-3 pb-2">
                All Stops
              </p>
              <div className="divide-y divide-gray-100">
                {stops.map((stop, i) => {
                  const isDone = i < currentStopIdx;
                  const isCurrent = i === currentStopIdx;
                  return (
                    <div key={i}
                      className={`px-4 py-3 flex items-start gap-3 ${isCurrent ? 'bg-orange-50' : isDone ? 'bg-gray-50/80' : ''}`}
                    >
                      {/* Stop number */}
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
                        style={{
                          background: isDone ? '#10b981' : isCurrent ? '#FF6B35' : '#d1d5db',
                        }}
                      >
                        {isDone ? '✓' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold truncate ${isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {stop.dropoffAddress}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              Current
                            </span>
                          )}
                        </div>
                        {stop.dropoffContactName && (
                          <p className="text-xs text-gray-500 mt-0.5">{stop.dropoffContactName}</p>
                        )}
                        {stop.dropoffPhone && !isDone && (
                          <a href={`tel:${stop.dropoffPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 mt-1 text-xs font-semibold text-green-600 hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            {stop.dropoffPhone}
                          </a>
                        )}
                        {stop.orderRef && (
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{stop.orderRef}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── INDIVIDUAL: existing contact info ── */}
          {!isVendorBatch && (
            <>
              {/* {isPickupPhase && delivery.pickupContactName && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">SENDER</p>
                  <p className="text-sm font-medium text-gray-900">{delivery.pickupContactName}</p>
                  {delivery.pickupPhone && (
                    <a href={`tel:${delivery.pickupPhone}`}
                      className="flex items-center gap-2 mt-2 text-sm font-semibold text-green-600 hover:underline">
                      <Phone className="w-4 h-4" />{delivery.pickupPhone}
                    </a>
                  )}
                </div>
              )} */}
              {isDeliveryPhase && delivery.dropoffContactName && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">RECIPIENT</p>
                  <p className="text-sm font-medium text-gray-900">{delivery.dropoffContactName}</p>
                  {delivery.dropoffPhone && (
                    <a href={`tel:${delivery.dropoffPhone}`}
                      className="flex items-center gap-2 mt-2 text-sm font-semibold text-red-600 hover:underline">
                      <Phone className="w-4 h-4" />{delivery.dropoffPhone}
                    </a>
                  )}
                </div>
              )}
            </>
          )}

          {/* Pickup code — same for both */}
          {isPickupPhase && delivery.pickupCode && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">PICKUP CODE</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-mono font-bold text-gray-900 tracking-widest">
                  {delivery.pickupCode}
                </p>
                <button onClick={() => onCopyCode(delivery.pickupCode, `pickup-${delivery.$id}`)}>
                  {copiedCode === `pickup-${delivery.$id}` ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                </button>
              </div>
            </div>
          )}

          {/* Pickup sender info — always shown in pickup phase */}
          {isPickupPhase && delivery.pickupPhone && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">SENDER</p>
              {delivery.pickupContactName && (
                <p className="text-sm font-medium text-gray-900 mb-1">{delivery.pickupContactName}</p>
              )}
              <a href={`tel:${delivery.pickupPhone}`}
                className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:underline">
                <Phone className="w-4 h-4" />{delivery.pickupPhone}
              </a>
            </div>
          )}

          {/* ── Action button ── */}
          <button
            onClick={() => {
              if (isPickupPhase) {
                onConfirmPickup(delivery.$id);
              } else if (delivery.status === 'picked_up') {
                onStartDelivery(delivery.$id);
              } else if (delivery.status === 'in_transit') {
                if (isVendorBatch && !isLastStop) {
                  // Advance to next stop — update currentStopIdx in Appwrite
                  onAdvanceStop(delivery.$id, currentStopIdx + 1);
                } else {
                  onConfirmDelivery(delivery.$id);
                }
              }
            }}
            className="w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
            style={{
              background: isVendorBatch && isDeliveryPhase && !isLastStop ? '#FF6B35' : '#111827'
            }}
          >
            {isPickupPhase
              ? 'Confirm Pickup'
              : delivery.status === 'picked_up'
              ? 'Start Delivery'
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
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Active Deliveries</h1>
          
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-200/50">
          <div className="flex items-center justify-between mb-3">
            <Package className="w-5 h-5 text-blue-600" />
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-900">
                {deliveries.filter(d => d.status === 'accepted' || d.status === 'assigned').length}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-blue-900">Ready to Pickup</p>
          <p className="text-xs text-blue-700 mt-1">Awaiting pickup</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-3xl p-6 border border-amber-200/50">
          <div className="flex items-center justify-between mb-3">
            <Truck className="w-5 h-5 text-amber-600" />
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-900">
                {deliveries.filter(d => d.status === 'in_transit').length}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-amber-900">In Transit</p>
          <p className="text-xs text-amber-700 mt-1">On the way</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-6 border border-emerald-200/50">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-900">
                ₦{deliveries.reduce((sum, d) => sum + (d.offeredFare || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-emerald-900">Total Value</p>
          <p className="text-xs text-emerald-700 mt-1">Current earnings</p>
        </div>
      </div>

      {/* Deliveries List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-gray-200 rounded-full" />
            <div className="absolute top-0 left-0 w-12 h-12 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Active Deliveries</h3>
          <p className="text-sm text-gray-600">Accept delivery requests to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {deliveries.map(renderDeliveryCard)}
        </div>
      )}
    </div>
  );
};

export default CourierActiveDelivery;

'use client';
import { useState } from 'react';
import {
  User,
  Phone,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Navigation,
  Package,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const getStatusConfig = (status) => {
  const configs = {
    accepted: {
      dot: '#F59E0B',
      label: 'Accepted',
      badgeBg: '#FEF3C7',
      badgeText: '#D97706',
      ringColor: '#FCD34D',
    },
    pending_assignment: {
      dot: '#F59E0B',
      label: 'Awaiting',
      badgeBg: '#FEF3C7',
      badgeText: '#D97706',
      ringColor: '#FCD34D',
    },
    assigned: {
      dot: '#3B82F6',
      label: 'Assigned',
      badgeBg: '#DBEAFE',
      badgeText: '#2563EB',
      ringColor: '#93C5FD',
    },
    picked_up: {
      dot: '#8B5CF6',
      label: 'Picked Up',
      badgeBg: '#EDE9FE',
      badgeText: '#7C3AED',
      ringColor: '#C4B5FD',
    },
    in_transit: {
      dot: '#6366F1',
      label: 'In Transit',
      badgeBg: '#E0E7FF',
      badgeText: '#4F46E5',
      ringColor: '#A5B4FC',
    },
  };
  return (
    configs[status] || {
      dot: '#6B7280',
      label: status,
      badgeBg: '#F3F4F6',
      badgeText: '#374151',
      ringColor: '#D1D5DB',
    }
  );
};

const RouteVisual = ({ pickup, dropoff, dropoffInstructions }) => (
  <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
    <div className="flex items-start gap-2.5 px-3 py-2.5">
      <div className="flex flex-col items-center gap-0.5 pt-0.5">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-green-500 bg-green-100 flex-shrink-0" />
        <div className="w-px h-5 border-l border-dashed border-gray-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
          Pickup
        </p>
        <p className="text-xs text-gray-900 font-medium leading-snug">
          {pickup}
        </p>
      </div>
    </div>

    <div className="flex items-start gap-2.5 px-3 pb-2.5">
      <div className="pt-0.5 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-red-400 bg-red-100" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
          Dropoff
        </p>
        <p className="text-xs text-gray-900 font-medium leading-snug">
          {dropoff}
        </p>
        {dropoffInstructions && (
          <div className="mt-1.5 flex items-start gap-1.5 rounded-lg px-2 py-1.5 bg-amber-50 border border-amber-200">
            <Navigation className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-amber-600" />
            <p className="text-[10px] leading-snug text-amber-900">
              {dropoffInstructions}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CodePill = ({
  label,
  code,
  bg,
  border,
  textColor,
  copyId,
  copiedState,
  onCopy,
}) => (
  <div
    className="flex-1 rounded-xl p-2.5"
    style={{ background: bg, border: `1px solid ${border}` }}
  >
    <div className="flex items-center justify-between mb-1">
      <span
        className="text-[9px] font-bold uppercase tracking-widest"
        style={{ color: textColor }}
      >
        {label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCopy(code, copyId);
        }}
        className="p-0.5 rounded-md transition-colors hover:bg-white/60"
      >
        {copiedState === copyId ? (
          <Check className="w-3 h-3 text-green-600" />
        ) : (
          <Copy className="w-3 h-3" style={{ color: textColor }} />
        )}
      </button>
    </div>
    <p
      className="text-center font-mono text-sm font-bold"
      style={{ color: textColor }}
    >
      {code}
    </p>
  </div>
);

const ActiveDeliveryCard = ({
  delivery,
  showAssignButton = false,
  onAssign,
  onConfirmPickup,
  onConfirmDelivery,
  onStartDelivery,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const deliveryId = delivery.id || delivery.$id;

  const statusConfig = getStatusConfig(delivery.status);
  const isExpandable = [
    'accepted',
    'pending_assignment',
    'assigned',
    'picked_up',
    'in_transit',
  ].includes(delivery.status);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderActionButton = () => {
    const baseClass =
      'w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 mt-2';

    if (
      (delivery.status === 'accepted' ||
        delivery.status === 'pending_assignment') &&
      showAssignButton
    ) {
      return (
        <button
          onClick={() => onAssign(delivery)}
          className={baseClass}
          style={{ background: '#3A0A21', color: 'white' }}
        >
          <User className="w-3 h-3" />
          Assign Driver
        </button>
      );
    }

    if (delivery.status === 'assigned') {
      return (
        <button
          onClick={onConfirmPickup}
          className={baseClass}
          style={{ background: '#2563EB', color: 'white' }}
        >
          <Package className="w-3 h-3" />
          Confirm Pickup
        </button>
      );
    }

    if (delivery.status === 'picked_up') {
      return (
        <button
          onClick={() => onStartDelivery(deliveryId)}
          className={baseClass}
          style={{ background: '#7C3AED', color: 'white' }}
        >
          <Truck className="w-3 h-3" />
          Start Delivery
        </button>
      );
    }

    if (delivery.status === 'in_transit') {
      return (
        <button
          onClick={onConfirmDelivery}
          className={baseClass}
          style={{ background: '#16A34A', color: 'white' }}
        >
          <CheckCircle className="w-3 h-3" />
          Complete Delivery
        </button>
      );
    }

    return null;
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden transition-all"
      style={{
        border: `1px solid ${expanded ? statusConfig.ringColor : '#E5E7EB'}`,
        boxShadow: expanded ? `0 0 0 3px ${statusConfig.ringColor}40` : 'none',
      }}
    >
      {/* Compact Header — always visible */}
      <div
        className="flex items-center gap-2.5 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => isExpandable && setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-gray-900">
              {delivery.packageSize || 'Medium'}
            </span>
            <span
              className="text-[6px] font-bold uppercase px-1.5 py-0.5 rounded-full"
              style={{
                background: statusConfig.badgeBg,
                color: statusConfig.badgeText,
              }}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Route preview line */}
          {(delivery.pickupAddress || delivery.dropoffAddress) && (
            <p className="text-[10px] text-gray-400 truncate mt-0.5">
              {delivery.pickupAddress?.split(',')[0]} →{' '}
              {delivery.dropoffAddress?.split(',')[0]}
            </p>
          )}
        </div>

        {/* Fare */}
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-green-600">
            {formatNairaSimple(delivery.suggestedFare || delivery.offeredFare)}
          </p>
        </div>

        {/* Expand chevron */}
        {isExpandable && (
          <div className="flex-shrink-0 text-gray-400">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        )}
      </div>

      {/* Expanded panel */}
      {expanded && isExpandable && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2.5 space-y-2.5 bg-gray-50">
          {/* Route with dropoff instructions */}
          {(delivery.pickup || delivery.dropoff) && (
            <RouteVisual
              pickup={delivery.pickup}
              dropoff={delivery.dropoff}
              dropoffInstructions={delivery.dropoffInstructions}
            />
          )}

          {/* Pickup + Dropoff codes */}
          {(delivery.pickupCode || delivery.dropoffOTP) && (
            <div className="flex gap-2">
              {delivery.pickupCode && (
                <CodePill
                  label="Pickup Code"
                  code={delivery.pickupCode}
                  bg="#DBEAFE"
                  border="#BFDBFE"
                  textColor="#2563EB"
                  copyId={`pickup-${deliveryId}`}
                  copiedState={copiedCode}
                  onCopy={copyToClipboard}
                />
              )}
              {delivery.dropoffOTP && (
                <CodePill
                  label="Dropoff OTP"
                  code={delivery.dropoffOTP}
                  bg="#DCFCE7"
                  border="#BBF7D0"
                  textColor="#16A34A"
                  copyId={`dropoff-${deliveryId}`}
                  copiedState={copiedCode}
                  onCopy={copyToClipboard}
                />
              )}
            </div>
          )}

          {/* Driver info */}
          {delivery.driverName && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: '#3A0A21' }}
                >
                  {delivery.driverName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {delivery.driverName}
                  </p>
                  {delivery.driverPhone && (
                    <p className="text-[10px] text-gray-500">
                      {delivery.driverPhone}
                    </p>
                  )}
                </div>
              </div>
              {delivery.driverPhone && (
                <a
                  href={`tel:${delivery.driverPhone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors bg-green-50 border border-green-200 hover:bg-green-100"
                >
                  <Phone className="w-3.5 h-3.5 text-green-600" />
                </a>
              )}
            </div>
          )}

          {/* Sender contact (when no driver yet) */}
          {!delivery.driverName &&
            (delivery.guestPhone || delivery.pickupContactName) && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-200">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">
                    Sender
                  </p>
                  <p className="text-xs text-gray-700 font-medium">
                    {delivery.pickupContactName || 'Customer'}
                  </p>
                </div>
                {delivery.guestPhone && (
                  <a
                    href={`tel:${delivery.guestPhone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                  </a>
                )}
              </div>
            )}

          {/* Action button */}
          {renderActionButton()}
        </div>
      )}

      {/* Action button when card is not expandable (fallback) */}
      {!isExpandable && (
        <div className="border-t border-gray-100 p-2.5">
          {renderActionButton()}
        </div>
      )}
    </div>
  );
};

export default ActiveDeliveryCard;

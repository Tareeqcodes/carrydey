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
  Share2,
  Link2,
  ExternalLink,
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
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Pickup</p>
        <p className="text-xs text-gray-900 font-medium leading-snug">{pickup}</p>
      </div>
    </div>
    <div className="flex items-start gap-2.5 px-3 pb-2.5">
      <div className="pt-0.5 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-red-400 bg-red-100" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Dropoff</p>
        <p className="text-xs text-gray-900 font-medium leading-snug">{dropoff}</p>
        {dropoffInstructions && (
          <div className="mt-1.5 flex items-start gap-1.5 rounded-lg px-2 py-1.5 bg-amber-50 border border-amber-200">
            <Navigation className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-amber-600" />
            <p className="text-[10px] leading-snug text-amber-900">{dropoffInstructions}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Driver link share panel — shown when delivery is assigned (or beyond)
const DriverLinkPanel = ({ delivery }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!delivery.driverToken) return null;

  const driverUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/driver/${delivery.driverToken}`;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(driverUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Your Delivery Assignment',
          text: `Hi ${delivery.driverName}, you have a new delivery. Use this link to manage it:`,
          url: driverUrl,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // fallback to copy
        handleCopy(e);
      }
    } else {
      handleCopy(e);
    }
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Hi ${delivery.driverName || 'Driver'}, you have a new delivery assignment. Open this link to view details and confirm pickup/dropoff:\n${driverUrl}`
    );
    window.open(`https://wa.me/${delivery.driverPhone?.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="rounded-xl overflow-hidden border border-blue-200 bg-blue-50">
      <div className="px-3 py-2 border-b border-blue-200 flex items-center gap-1.5">
        <Link2 className="w-3 h-3 text-blue-600" />
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">
          Driver Portal Link
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[10px] text-blue-600 mb-2 leading-snug">
          Share this link with the driver so they can confirm pickup &amp; delivery themselves.
        </p>

        {/* URL display */}
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-blue-200 mb-2">
          <p className="flex-1 text-[10px] text-gray-500 font-mono truncate">
            /driver/{delivery.driverToken?.slice(0, 16)}...
          </p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all"
            style={{
              background: copied ? '#DCFCE7' : '#EFF6FF',
              color: copied ? '#16A34A' : '#2563EB',
              border: `1px solid ${copied ? '#BBF7D0' : '#BFDBFE'}`,
            }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* WhatsApp — primary CTA */}
          {delivery.driverPhone && (
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold text-white transition-all hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp
            </button>
          )}

          {/* Share / Open */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all hover:bg-blue-100"
            style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>

          <a
            href={driverUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all hover:bg-gray-100"
            style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview
          </a>
        </div>
      </div>
    </div>
  );
};

const ActiveDeliveryCard = ({
  delivery,
  showAssignButton = false,
  onAssign,
}) => {
  const [expanded, setExpanded] = useState(false);
  // const deliveryId = delivery.id || delivery.$id;

  const statusConfig = getStatusConfig(delivery.status);
  const isExpandable = [
    'accepted',
    'pending_assignment',
    'assigned',
    'picked_up',
    'in_transit',
  ].includes(delivery.status);

  // Status label to show driver progress to the admin (read-only)
  const statusProgressLabel = {
    assigned: 'Waiting for driver to confirm pickup',
    picked_up: 'Driver has picked up the package',
    in_transit: 'Package is on the way',
  }[delivery.status];

  const renderActionButton = () => {
    const baseClass =
      'w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 mt-2';

    if (
      (delivery.status === 'accepted' || delivery.status === 'pending_assignment') &&
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
      {/* Compact Header */}
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
              style={{ background: statusConfig.badgeBg, color: statusConfig.badgeText }}
            >
              {statusConfig.label}
            </span>
          </div>
          {(delivery.pickupAddress || delivery.dropoffAddress) && (
            <p className="text-[10px] text-gray-400 truncate mt-0.5">
              {delivery.pickupAddress?.split(',')[0]} → {delivery.dropoffAddress?.split(',')[0]}
            </p>
          )}
          {/* Progress hint for admin (read-only) */}
          {statusProgressLabel && !expanded && (
            <p className="text-[10px] text-blue-500 mt-0.5 font-medium">{statusProgressLabel}</p>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-green-600">
            {formatNairaSimple(delivery.suggestedFare || delivery.offeredFare)}
          </p>
        </div>

        {isExpandable && (
          <div className="flex-shrink-0 text-gray-400">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        )}
      </div>

      {/* Expanded panel */}
      {expanded && isExpandable && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2.5 space-y-2.5 bg-gray-50">
          {/* Route */}
          {(delivery.pickup || delivery.dropoff) && (
            <RouteVisual
              pickup={delivery.pickup}
              dropoff={delivery.dropoff}
              dropoffInstructions={delivery.dropoffInstructions}
            />
          )}

          {/* Driver Portal Link — shown when driver is assigned */}
          {['assigned', 'picked_up', 'in_transit'].includes(delivery.status) && (
            <DriverLinkPanel delivery={delivery} />
          )}

          {/* Status progress for admin */}
          {statusProgressLabel && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
              <p className="text-[11px] text-blue-700 font-medium">{statusProgressLabel}</p>
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
                  <p className="text-xs font-semibold text-gray-900 truncate">{delivery.driverName}</p>
                  {delivery.driverPhone && (
                    <p className="text-[10px] text-gray-500">{delivery.driverPhone}</p>
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

          {/* Sender contact */}
          {!delivery.driverName && (delivery.guestPhone || delivery.pickupContactName) && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-200">
              <div>
                <p className="text-[9px] text-gray-400 uppercase font-bold">Sender</p>
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

          {renderActionButton()}
        </div>
      )}

      {/* Assign button when not expandable */}
      {!isExpandable && (
        <div className="border-t border-gray-100 p-2.5">{renderActionButton()}</div>
      )}
    </div>
  );
};

export default ActiveDeliveryCard;
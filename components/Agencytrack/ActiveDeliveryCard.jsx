'use client';
import { useState } from 'react';
import { User, Phone, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const ActiveDeliveryCard = ({ 
  delivery, 
  showAssignButton = false,
  onAssign,
  onConfirmPickup,
  onConfirmDelivery,
  onStartDelivery
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const deliveryId = delivery.id || delivery.$id;

  const getStatusConfig = (status) => {
    const configs = {
      'accepted': { color: 'bg-amber-500', text: 'Accepted', dot: 'bg-amber-500' },
      'pending_assignment': { color: 'bg-amber-500', text: 'Awaiting', dot: 'bg-amber-500' },
      'assigned': { color: 'bg-blue-500', text: 'Assigned', dot: 'bg-blue-500' },
      'picked_up': { color: 'bg-purple-500', text: 'Picked Up', dot: 'bg-purple-500' },
      'in_transit': { color: 'bg-indigo-500', text: 'In Transit', dot: 'bg-indigo-500' }
    };
    return configs[status] || { color: 'bg-gray-500', text: status, dot: 'bg-gray-500' };
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(`${type}-${deliveryId}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const statusConfig = getStatusConfig(delivery.status);
  const showCodes = ['accepted', 'assigned', 'picked_up', 'in_transit'].includes(delivery.status);

  const renderActionButton = () => {
    if ((delivery.status === 'accepted' || delivery.status === 'pending_assignment') && showAssignButton) {
      return (
        <button
          onClick={() => onAssign(delivery)}
          className="w-full py-2 bg-[#3A0A21] text-white rounded-lg text-xs font-medium hover:bg-[#4A0A31] transition-colors"
        >
          Assign Driver
        </button>
      );
    }

    if (delivery.status === 'assigned') {
      return (
        <button
          onClick={onConfirmPickup}
          className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          Confirm Pickup
        </button>
      );
    }

    if (delivery.status === 'picked_up') {
      return (
        <button
          onClick={() => onStartDelivery(deliveryId)}
          className="w-full py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors"
        >
          Start Delivery
        </button>
      );
    }

    if (delivery.status === 'in_transit') {
      return (
        <button
          onClick={onConfirmDelivery}
          className="w-full py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
        >
          Complete Delivery
        </button>
      );
    }

    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Compact Header - Always Visible */}
      <div 
        className="flex items-center gap-2 p-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Status Indicator */}
        <div className={`w-2 h-2 rounded-full ${statusConfig.dot} flex-shrink-0`} />
        
        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-900">
              {delivery.packageSize || 'Medium'}
            </span>
            <span className="text-[10px] text-gray-500">•</span>
            <span className="text-[10px] text-gray-500">{statusConfig.text}</span>
          </div>
          {delivery.driverName && (
            <p className="text-[10px] text-gray-500 truncate mt-0.5">{delivery.driverName}</p>
          )}
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-gray-900">
            {formatNairaSimple(delivery.suggestedFare || delivery.offeredFare)}
          </p>
        </div>

        {/* Expand Icon */}
        {showCodes && (
          <div className="flex-shrink-0">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        )}
      </div>

      {/* Expandable Details */}
      {expanded && showCodes && (
        <div className="border-t border-gray-100 p-2.5 space-y-2 bg-gray-50">
          {/* Codes - Horizontal Layout */}
          <div className="flex gap-2">
            {/* Pickup Code */}
            {delivery.pickupCode && (
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-medium text-blue-700 uppercase">Pickup</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(delivery.pickupCode, 'pickup');
                    }}
                    className="p-0.5 hover:bg-blue-100 rounded"
                  >
                    {copiedCode === `pickup-${deliveryId}` ? (
                      <Check className="w-3 h-3 text-blue-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-blue-600" />
                    )}
                  </button>
                </div>
                <p className="text-base font-bold text-blue-900 tracking-wide text-center">
                  {delivery.pickupCode}
                </p>
              </div>
            )}

            {/* Dropoff OTP */}
            {delivery.dropoffOTP && (
              <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-medium text-green-700 uppercase">Dropoff</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(delivery.dropoffOTP, 'dropoff');
                    }}
                    className="p-0.5 hover:bg-green-100 rounded"
                  >
                    {copiedCode === `dropoff-${deliveryId}` ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-green-600" />
                    )}
                  </button>
                </div>
                <p className="text-base font-bold text-green-900 tracking-wide text-center">
                  {delivery.dropoffOTP}
                </p>
              </div>
            )}
          </div>

          {/* Driver Info - Compact */}
          {delivery.driverName && delivery.driverPhone && (
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-900 truncate">{delivery.driverName}</span>
              </div>
              <a 
                href={`tel:${delivery.driverPhone}`}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-3.5 h-3.5 text-gray-600" />
              </a>
            </div>
          )}

          {/* Action Button */}
          {renderActionButton()}
        </div>
      )}

      {/* Action Button for Non-Expandable States */}
      {!showCodes && (
        <div className="border-t border-gray-100 p-2">
          {renderActionButton()}
        </div>
      )}
    </div>
  );
};

export default ActiveDeliveryCard;
'use client';
import React, { useState } from 'react';
import { Package, User, Phone, Copy, Check, CheckCircle } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';
import PickupCodeModal from './PickupCodeModal';
import DropoffOTPModal from './DropoffOTPModal';

const ActiveDeliveriesPage = ({ 
  activeDeliveries, 
  onAssign,
  onConfirmPickup,
  onConfirmDelivery,
  onUpdateStatus,
}) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedDeliveryForPickup, setSelectedDeliveryForPickup] = useState(null);
  const [selectedDeliveryForDropoff, setSelectedDeliveryForDropoff] = useState(null);
  
  const pendingDeliveries = activeDeliveries.filter((d) => d.status === 'pending_assignment' || d.status === 'accepted');
  const assignedDeliveries = activeDeliveries.filter((d) => d.status === 'assigned');
  const pickedUpDeliveries = activeDeliveries.filter((d) => d.status === 'picked_up');
  const inTransitDeliveries = activeDeliveries.filter((d) => d.status === 'in_transit');

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
      case 'pending_assignment':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'picked_up':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'in_transit':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'pending_assignment':
        return 'Awaiting Assignment';
      case 'assigned':
        return 'Assigned to Driver';
      case 'picked_up':
        return 'Picked Up';
      case 'in_transit':
        return 'In Transit';
      default:
        return status;
    }
  };

  const copyToClipboard = (text, type, deliveryId) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(`${type}-${deliveryId}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleConfirmPickup = async (deliveryId, pickupCode) => {
    if (onConfirmPickup) {
      const result = await onConfirmPickup(deliveryId, pickupCode);
      
      if (result?.success) {
        alert('Pickup confirmed successfully!');
      } else {
        alert(result?.error || 'Invalid pickup code');
      }
    }
  };

  const handleConfirmDelivery = async (deliveryId, otp) => {
    if (onConfirmDelivery) {
      const result = await onConfirmDelivery(deliveryId, otp);
      
      if (result?.success) {
        alert('Delivery completed successfully!');
      } else {
        alert(result?.error || 'Invalid OTP code');
      }
    }
  };

  const handleStartDelivery = async (deliveryId) => {
    if (onUpdateStatus) {
      await onUpdateStatus(deliveryId, 'in_transit');
    }
  };

  const DeliveryCard = ({ delivery, showAssignButton = false }) => {
    const deliveryId = delivery.id || delivery.$id;
    
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-all">
        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(delivery.status)}`}>
            {getStatusText(delivery.status)}
          </span>
        </div>

        {/* CODES DISPLAY - Show both at the same time */}
        {(delivery.status === 'accepted' || delivery.status === 'assigned' || delivery.status === 'picked_up' || delivery.status === 'in_transit') && (
          <div className="mb-4 space-y-3">
            {/* PICKUP CODE */}
            {delivery.pickupCode && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-900">Pickup Code</p>
                      <p className="text-xs text-blue-600">Show to sender</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(delivery.pickupCode, 'pickup', deliveryId)}
                    className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
                    aria-label="Copy pickup code"
                  >
                    {copiedCode === `pickup-${deliveryId}` ? (
                      <Check className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                </div>
                <p className="text-3xl font-bold text-blue-900 tracking-widest text-center py-2">
                  {delivery.pickupCode}
                </p>
              </div>
            )}

            {/* DROPOFF OTP */}
            {delivery.dropoffOTP && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-green-900">Dropoff OTP</p>
                      <p className="text-xs text-green-600">Get from recipient</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(delivery.dropoffOTP, 'dropoff', deliveryId)}
                    className="p-2 hover:bg-green-200 rounded-lg transition-colors"
                    aria-label="Copy dropoff OTP"
                  >
                    {copiedCode === `dropoff-${deliveryId}` ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-green-600" />
                    )}
                  </button>
                </div>
                <p className="text-3xl font-bold text-green-900 tracking-widest text-center py-2">
                  {delivery.dropoffOTP}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Main Info */}
        <div className="space-y-4">
          {/* Package Info */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Package className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Package Size</p>
              <p className="text-sm font-semibold text-gray-900">{delivery.packageSize || 'Medium'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Payout</p>
              <p className="text-lg font-bold text-green-600">
                {formatNairaSimple(delivery.suggestedFare || delivery.offeredFare)}
              </p>
            </div>
          </div>

          {/* Driver Info */}
          {delivery.driverName && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Courier</p>
                <p className="text-sm font-semibold text-gray-900">{delivery.driverName}</p>
              </div>
              {delivery.driverPhone && (
                <a 
                  href={`tel:${delivery.driverPhone}`}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5 text-gray-600" />
                </a>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {renderActionButton(delivery, showAssignButton)}
        </div>
      </div>
    );
  };

  const renderActionButton = (delivery, showAssignButton) => {
    const deliveryId = delivery.id || delivery.$id;

    // Pending assignment - show assign button
    if ((delivery.status === 'accepted' || delivery.status === 'pending_assignment') && showAssignButton) {
      return (
        <button
          onClick={() => onAssign(delivery)}
          className="w-full px-4 py-3 bg-[#3A0A21] text-white rounded-lg font-medium hover:bg-[#4A0A31] transition-colors"
        >
          Assign Driver
        </button>
      );
    }

    // Assigned - show confirm pickup button
    if (delivery.status === 'assigned') {
      return (
        <button
          onClick={() => setSelectedDeliveryForPickup(deliveryId)}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          Confirm Pickup
        </button>
      );
    }

    // Picked up - show start delivery button
    if (delivery.status === 'picked_up') {
      return (
        <button
          onClick={() => handleStartDelivery(deliveryId)}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Start Delivery
        </button>
      );
    }

    // In transit - show confirm delivery button
    if (delivery.status === 'in_transit') {
      return (
        <button
          onClick={() => setSelectedDeliveryForDropoff(deliveryId)}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Confirm Delivery
        </button>
      );
    }

    // No driver assigned
    if (!delivery.driverName && !showAssignButton) {
      return (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">No driver assigned yet</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h2 className="text-gray-500 text-xl mt-1">Manage ongoing deliveries</h2>
      </div>

      {/* Empty State */}
      {activeDeliveries.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Active Deliveries
          </h3>
          <p className="text-gray-500">
            Accepted deliveries will appear here
          </p>
        </div>
      )}

      {/* Pending Assignments */}
      {pendingDeliveries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Awaiting Assignment ({pendingDeliveries.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingDeliveries.map((delivery) => (
              <DeliveryCard 
                key={delivery.id || delivery.$id} 
                delivery={delivery} 
                showAssignButton={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Assigned to Driver */}
      {assignedDeliveries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Assigned to Driver ({assignedDeliveries.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedDeliveries.map((delivery) => (
              <DeliveryCard 
                key={delivery.id || delivery.$id} 
                delivery={delivery}
              />
            ))}
          </div>
        </div>
      )}

      {/* Picked Up */}
      {pickedUpDeliveries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Picked Up ({pickedUpDeliveries.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pickedUpDeliveries.map((delivery) => (
              <DeliveryCard 
                key={delivery.id || delivery.$id} 
                delivery={delivery}
              />
            ))}
          </div>
        </div>
      )}

      {/* In Transit */}
      {inTransitDeliveries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            In Transit ({inTransitDeliveries.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inTransitDeliveries.map((delivery) => (
              <DeliveryCard 
                key={delivery.id || delivery.$id} 
                delivery={delivery}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pickup Code Confirmation Modal */}
      <PickupCodeModal
        isOpen={selectedDeliveryForPickup !== null}
        onClose={() => setSelectedDeliveryForPickup(null)}
        onConfirm={handleConfirmPickup}
        deliveryId={selectedDeliveryForPickup}
      />

      {/* Dropoff OTP Confirmation Modal */}
      <DropoffOTPModal
        isOpen={selectedDeliveryForDropoff !== null}
        onClose={() => setSelectedDeliveryForDropoff(null)}
        onConfirm={handleConfirmDelivery}
        deliveryId={selectedDeliveryForDropoff}
      />
    </div>
  );
};

export default ActiveDeliveriesPage;
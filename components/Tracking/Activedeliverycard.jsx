'use client';
import React, { useState } from 'react';
import { MapPin, Truck, Phone, Package, CheckCircle } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';
import PickupotpModal from './PickupotpModal';
import DropoffotpPModal from './DropoffotpPModal';

const ActiveDeliveryCard = ({ delivery, onConfirmPickup, onConfirmDelivery, onViewDetails }) => {
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDropoffModal, setShowDropoffModal] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      accepted: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getProgressPercentage = (status) => {
    const progress = {
      accepted: 25,
      assigned: 40,
      picked_up: 60,
      in_transit: 80,
      delivered: 100,
    };
    return progress[status] || 0;
  };

  const formattedPayout = formatNairaSimple(
    delivery.payout || delivery.offeredFare || delivery.suggestedFare
  );

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">#{(delivery.$id || delivery.id).slice(0, 8).toUpperCase()}</h3>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(delivery.status)}`}>
              {delivery.status.replace('_', ' ').toUpperCase()}
            </span>
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

        {/* Driver Info */}
        {delivery.driverName && (
          <div className="bg-blue-50 rounded-xl p-3 mb-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-blue-700">Assigned Driver</p>
              <p className="font-semibold text-blue-900">{delivery.driverName}</p>
              {delivery.driverPhone && (
                <p className="text-xs text-blue-600">{delivery.driverPhone}</p>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Delivery Progress</span>
            <span className="text-xs font-semibold text-gray-700">
              {getProgressPercentage(delivery.status)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#3A0A21] h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage(delivery.status)}%` }}
            />
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2">
            <div className="p-1 bg-green-100 rounded-full mt-0.5">
              <MapPin className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Pickup</p>
              <p className="text-sm text-gray-900">{delivery.pickup || delivery.pickupAddress}</p>
            </div>
          </div>

          <div className="border-l-2 border-dashed border-gray-200 h-4 ml-3"></div>

          <div className="flex items-start gap-2">
            <div className="p-1 bg-red-100 rounded-full mt-0.5">
              <MapPin className="w-3 h-3 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Dropoff</p>
              <p className="text-sm text-gray-900">{delivery.dropoff || delivery.dropoffAddress}</p>
            </div>
          </div>
        </div>

        {/* Package & Payout Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1">Package Size</p>
            <p className="font-semibold">{delivery.packageSize || 'Medium'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1">Payout</p>
            <p className="font-semibold text-green-600">{formattedPayout}</p>
          </div>
        </div>

        {/* Action Buttons based on status */}
        <div className="space-y-2">
          {delivery.status === 'assigned' && (
            <button
              onClick={() => setShowPickupModal(true)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Confirm Pickup
            </button>
          )}

          {(delivery.status === 'picked_up' || delivery.status === 'in_transit') && (
            <button
              onClick={() => setShowDropoffModal(true)}
              className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm Delivery
            </button>
          )}

          {delivery.status === 'delivered' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Delivery Completed</span>
            </div>
          )}

          <button
            onClick={() => onViewDetails?.(delivery)}
            className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Modals */}
      <PickupotpModal
        isOpen={showPickupModal}
        onClose={() => setShowPickupModal(false)}
        delivery={delivery}
        onConfirmPickup={onConfirmPickup}
      />

      <DropoffotpPModal
        isOpen={showDropoffModal}
        onClose={() => setShowDropoffModal(false)}
        delivery={delivery}
        onConfirmDelivery={onConfirmDelivery}
      />
    </>
  );
};

export default ActiveDeliveryCard;
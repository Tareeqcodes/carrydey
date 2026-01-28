'use client';
import React from 'react';
import { useState } from 'react';
import { Package, User, Phone, MapPin, Copy, Check } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const ActiveDeliveriesPage = ({ 
  activeDeliveries, 
  onAssign, 
}) => {
  const [copiedCode, setCopiedCode] = useState(null);
  
  const pendingDeliveries = activeDeliveries.filter((d) => d.status === 'pending_assignment' || d.status === 'accepted');
  const assignedDeliveries = activeDeliveries.filter((d) => d.status === 'assigned');
  const inProgressDeliveries = activeDeliveries.filter((d) => ['pickup', 'picked_up', 'in_transit'].includes(d.status));

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
      case 'pending_assignment':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pickup':
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
        return 'Assigned';
      case 'pickup':
        return 'En Route to Pickup';
      case 'picked_up':
        return 'Picked Up';
      case 'in_transit':
        return 'In Transit to Customer';
      default:
        return status;
    }
  };

  const copyToClipboard = (text, type, deliveryId) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(`${type}-${deliveryId}`);
    setTimeout(() => setCopiedCode(null), 2000);
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

        {/* PROMINENT PICKUP CODE DISPLAY */}
        {(delivery.status === 'accepted' || delivery.status === 'assigned' || delivery.status === 'pickup') && delivery.pickupCode && (
          <div className="mb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
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
            <p className="text-2xl font-bold text-blue-900 tracking-widest text-center py-1">
              {delivery.pickupCode}
            </p>
          </div>
        )}

        {/* PROMINENT DROPOFF OTP DISPLAY */}
        {(delivery.status === 'picked_up' || delivery.status === 'in_transit') && delivery.dropoffOTP && (
          <div className="mb-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
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
            <p className="text-2xl font-bold text-green-900 tracking-widest text-center py-1">
              {delivery.dropoffOTP}
            </p>
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
              <p className="text-lg font-bold text-green-600">{formatNairaSimple(delivery.suggestedFare)}</p>
            </div>
          </div>

          {/* Driver Info or Assign Button */}
          {delivery.driverName ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">courier</p>
                <p className="text-sm font-semibold text-gray-900">{delivery.driverName}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : showAssignButton ? (
            <button
              onClick={() => onAssign(delivery)}
              className="w-full px-4 py-3 bg-[#3A0A21] text-white rounded-lg font-medium hover:bg-[#4A0A31] transition-colors"
            >
              Assign Driver
            </button>
          ) : (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">No driver assigned yet</p>
            </div>
          )}

          {/* Quick Location Preview */}
          <button 
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            onClick={() => {/* Show location details modal or expand */}}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">View Route Details</span>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
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

      {/* Assigned */}
      {assignedDeliveries.length > 0 && (
        <div>
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

      {/* In Progress */}
      {inProgressDeliveries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              In Progress
            </h3>
            
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressDeliveries.map((delivery) => (
              <DeliveryCard 
                key={delivery.id || delivery.$id} 
                delivery={delivery}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveDeliveriesPage;
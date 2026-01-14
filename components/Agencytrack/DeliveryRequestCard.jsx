'use client';
import React from 'react';
import { MapPin, Package, User, Clock, AlertCircle, XCircle, CheckCircle, MoreVertical } from 'lucide-react';

const DeliveryRequestCard = ({ request, onAccept, onDecline }) => {
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            New Request
          </span>
          <p className="text-sm text-gray-500 mt-1">
            {request.createdAt ? getTimeAgo(request.createdAt) : 'Just now'}
          </p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      {/* Pickup & Dropoff */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">PICKUP</p>
            <p className="text-gray-900">{request.pickupAddress}</p>
            {request.pickupContactName && (
              <p className="text-sm text-gray-600 mt-1">
                <User className="w-3 h-3 inline mr-1" />
                {request.pickupContactName} • {request.pickupPhone}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">DROPOFF</p>
            <p className="text-gray-900">{request.dropoffAddress}</p>
            {request.dropoffContactName && (
              <p className="text-sm text-gray-600 mt-1">
                <User className="w-3 h-3 inline mr-1" />
                {request.dropoffContactName} • {request.dropoffPhone}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Package Details */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Distance</p>
          <p className="font-semibold">{(request.distance / 1000).toFixed(1)} km</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Package</p>
          <p className="font-semibold">{request.packageSize || 'Medium'}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Est. Time</p>
          <p className="font-semibold">{Math.ceil(request.duration / 60)} min</p>
        </div>
      </div>
      
      {/* Special Instructions */}
      {request.dropoffInstructions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-700">{request.dropoffInstructions}</p>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Payout</p>
          <p className="text-2xl font-bold text-[#3A0A21]">${request.offeredFare}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onDecline}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Decline
          </button>
          <button 
            onClick={onAccept}
            className="px-4 py-2 bg-[#3A0A21] text-white rounded-xl hover:bg-[#2A0819] transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Accept & Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRequestCard;
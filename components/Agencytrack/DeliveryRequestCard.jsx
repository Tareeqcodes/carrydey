'use client';
import React from 'react';
import { MapPin, MoreVertical, AlertCircle, XCircle, CheckCircle } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const DeliveryRequestCard = ({ request, onAccept, onDecline }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Pending
          </span>
          <p className="text-sm text-gray-500 mt-1">From: {request.sender}</p>
          <p className="text-sm text-gray-500">Customer: {request.customerName}</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-sm font-medium">Pickup:</p>
            <p className="text-sm text-gray-600">{request.pickup}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-600" />
          <div>
            <p className="text-sm font-medium">Dropoff:</p>
            <p className="text-sm text-gray-600">{request.dropoff}</p>
          </div>
        </div>
        {/* {request.instructions && (
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <p className="text-sm text-gray-600">{request.instructions}</p>
          </div>
        )} */}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Distance</p>
          <p className="font-semibold">{request.distance}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Package</p>
          <p className="font-semibold">{request.packageSize}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Customer</p>
          <p className="font-semibold text-xs">{request.customerPhone}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Estimated Payout</p>
          <p className="text-xl font-bold text-[#3A0A21]">{formatNairaSimple(request.payout)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDecline(request.id)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <XCircle className="w-4 h-4 inline mr-1" />
            Decline
          </button>
          <button
            onClick={() => onAccept(request.id)}
            className="px-4 py-2 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors"
          >
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRequestCard;
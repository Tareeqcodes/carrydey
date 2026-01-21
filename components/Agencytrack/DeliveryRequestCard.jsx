'use client';
import React from 'react';
import { MapPin, XCircle, CheckCircle } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const DeliveryRequestCard = ({ request, onAccept, onDecline }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-100">
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">
            Pending
          </span>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="font-medium">From:</span> {request.sender}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              {/* <span className="font-medium">Customer's Name:</span> {request.customerName} */}
            </p>
          </div>
        </div>
        {/* <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button> */}
      </div>

      {/* Location Details */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex gap-3">
          <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Pickup</p>
            <p className="text-sm text-gray-900">{request.pickup}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Dropoff</p>
            <p className="text-sm text-gray-900">{request.dropoff}</p>
          </div>
        </div>

        {/* {request.instructions && (
          <div className="flex gap-3 p-3 bg-amber-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-900">{request.instructions}</p>
          </div>
        )} */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Distance</p>
          <p className="text-sm font-semibold text-gray-900">{request.distance}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Package</p>
          <p className="text-sm font-semibold text-gray-900">{request.packageSize}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Phone </p>
          <p className="text-xs font-semibold text-gray-900 break-all">{request.customerPhone}</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Estimated Payout</p>
            <p className="text-2xl font-bold text-gray-900">{formatNairaSimple(request.payout)}</p>
          </div>
          
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => onDecline(request.id)}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 transition-colors font-medium text-sm inline-flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Decline</span>
            </button>
            <button
              onClick={() => onAccept(request.id)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm inline-flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Accept</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRequestCard;
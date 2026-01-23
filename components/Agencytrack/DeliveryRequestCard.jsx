'use client';
import React from 'react';
import { 
  MapPin, 
  CheckCircle, 
  Clock, 
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const DeliveryRequestCard = ({ request, onAccept }) => {
  // Format the payout amount
  const formattedPayout = formatNairaSimple(request.payout);
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header with ID and timestamp */}
      <div className="flex items-center justify-between mb-4">
        <div>
          {/* <h3 className="font-bold text-lg">#{request.id.slice(0, 8).toUpperCase()}</h3> */}
          <p className="text-xs text-gray-500">
            <Clock className="w-3 h-3 inline mr-1" />
            {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
          Pending
        </span>
      </div>

      {/* Location Details */}
      <div className="space-y-3 mb-4">
        {/* Pickup Location */}
        <div className="flex items-start gap-2">
          <div className="p-1 bg-green-100 rounded-full mt-0.5">
            <MapPin className="w-3 h-3 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Pickup</p>
            <p className="text-sm text-gray-900">{request.pickup}</p>
            {request.sender && (
              <p className="text-xs text-gray-500 mt-1">
                Sender: {request.sender}
              </p>
            )}
          </div>
        </div>
        
        {/* Separator line */}
        <div className="border-l-2 border-dashed border-gray-200 h-4 ml-3"></div>
        
        {/* Dropoff Location */}
        <div className="flex items-start gap-2">
          <div className="p-1 bg-red-100 rounded-full mt-0.5">
            <MapPin className="w-3 h-3 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Dropoff</p>
            <p className="text-sm text-gray-900">{request.dropoff}</p>
            {request.customerName && (
              <p className="text-xs text-gray-500 mt-1">
                Customer: {request.customerName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded-xl text-center">
          <p className="text-xs text-gray-500 mb-1">Distance</p>
          <p className="font-semibold">{request.distance}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl text-center">
          <p className="text-xs text-gray-500 mb-1">Package</p>
          <p className="font-semibold">{request.packageSize}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl text-center">
          <p className="text-xs text-gray-500 mb-1">Phone</p>
          <p className="font-semibold text-xs break-all">{request.customerPhone}</p>
        </div>
      </div>

      {/* Package Details */}
      {request.instructions && (
        <div className="mb-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Instructions</p>
          <p className="text-sm text-gray-700">{request.instructions}</p>
        </div>
      )}

      {/* Footer with Payout and Accept Button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">Estimated Payout</p>
          <p className="text-2xl font-bold text-green-600">{formattedPayout}</p>
        </div>
        
        {/* Single Accept Button (removed Decline button) */}
        <button
          onClick={() => onAccept(request.id)}
          className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors inline-flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Accept Delivery
        </button>
      </div>
    </div>
  );
};

export default DeliveryRequestCard;
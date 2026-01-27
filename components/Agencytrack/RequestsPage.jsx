'use client';
import React from 'react';
import { RefreshCw, Package } from 'lucide-react';
import DeliveryRequestCard from './DeliveryRequestCard';

const RequestsPage = ({
  deliveryRequests,
  loading,
  error,
  onRefresh,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xm md:text-2xl font-bold">
            Manage incoming delivery requests
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          Error loading requests: {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : deliveryRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Pending Requests
          </h3>
          <p className="text-gray-500">
            New delivery requests will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryRequests.map((request) => (
            <DeliveryRequestCard
              key={request.id || request.$id}
              request={request}
              onAccept={onAccept}
              onDecline={onDecline}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;

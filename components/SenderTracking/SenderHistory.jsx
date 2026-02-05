'use client';
import { History, Package, MapPin, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const SenderHistory = ({ deliveries, loading, onTrackDelivery }) => {
  const renderHistoryCard = (delivery) => (
    <div
      key={delivery.$id}
      className="group bg-white rounded-3xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Delivered</p>
              <p className="text-xs text-gray-500">Successfully completed</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(delivery.$createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Route Summary */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-blue-50 rounded-lg">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-0.5">From</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {delivery.pickupAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center pl-2">
            <div className="w-px h-6 bg-gradient-to-b from-gray-200 to-transparent" />
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-emerald-50 rounded-lg">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-0.5">To</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {delivery.dropoffAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Paid Amount</p>
            <p className="text-lg font-bold text-gray-900">
              {formatNairaSimple(delivery.offeredFare || delivery.suggestedFare)}
            </p>
          </div>

          <button
            onClick={() => onTrackDelivery(delivery)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl text-sm font-medium transition-all"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-xl md:text-xl font-semibold text-gray-900 mb-1">Review all your completed deliveries</h2>
        
      </div>

      {/* Stats Summary */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-8 border border-emerald-200/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700 mb-1">Total Completed</p>
            <p className="text-4xl font-bold text-emerald-900">{deliveries.length}</p>
            <p className="text-sm text-emerald-600 mt-2">
              {deliveries.length > 0
                ? `Total spent: ${formatNairaSimple(
                    deliveries.reduce((sum, d) => sum + (d.offeredFare || d.suggestedFare || 0), 0)
                  )}`
                : 'No deliveries yet'}
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl shadow-lg">
            <History className="w-12 h-12 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* History Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <History className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Delivery History</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Your completed deliveries will appear here once they're done
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deliveries.map(renderHistoryCard)}
        </div>
      )}
    </div>
  );
};

export default SenderHistory;
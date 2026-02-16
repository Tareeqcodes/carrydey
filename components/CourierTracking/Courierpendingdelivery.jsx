'use client';
import { Package, MapPin, CheckCircle, DollarSign, Clock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const CourierPendingDelivery = ({
  deliveries,
//   allDeliveries,
  loading,
  isAccepting,
  onAcceptDelivery,
}) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusIcon = () => <Clock className="w-4 h-4" />;

  const renderDeliveryCard = (delivery) => (
    <div
      key={delivery.$id}
      className="group bg-white rounded-3xl border border-gray-200 hover:border-[#3A0A21]/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
              delivery.status
            )}`}
          >
            {getStatusIcon()}
            <span className="capitalize">Pending</span>
          </span>
          <span className="text-xs font-medium text-gray-400">
            {new Date(delivery.$createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Route Info with Enhanced Display */}
        <div className="space-y-4 mb-6">
          {/* Pickup Location */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-white rounded-xl shadow-sm">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-1">
                  Pickup Location
                </p>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {delivery.pickupAddress}
                </p>
                
                {/* Contact Details */}
                {delivery.pickupContactName && (
                  <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/60 rounded-lg px-3 py-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">
                        {delivery.pickupContactName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{delivery.pickupContactName}</p>
                      <p className="text-gray-500">{delivery.pickupPhone}</p>
                    </div>
                  </div>
                )}

                {/* Pickup Instructions */}
                {delivery.pickupInstructions && (
                  <div className="mt-3 bg-white/60 rounded-lg p-3 border border-blue-200/50">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-900 mb-1">
                          Pickup Instructions
                        </p>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {delivery.pickupInstructions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Route Connector */}
          <div className="flex items-center pl-6">
            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 via-gray-300 to-emerald-300 rounded-full" />
          </div>

          {/* Dropoff Location */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-4 border border-emerald-200/50">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-white rounded-xl shadow-sm">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-1">
                  Dropoff Location
                </p>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {delivery.dropoffAddress}
                </p>
                
                {/* Contact Details */}
                {delivery.dropoffContactName && (
                  <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/60 rounded-lg px-3 py-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-600">
                        {delivery.dropoffContactName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{delivery.dropoffContactName}</p>
                      <p className="text-gray-500">{delivery.dropoffPhone}</p>
                    </div>
                  </div>
                )}

                {/* Dropoff Instructions */}
                {delivery.dropoffInstructions && (
                  <div className="mt-3 bg-white/60 rounded-lg p-3 border border-emerald-200/50">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-emerald-900 mb-1">
                          Dropoff Instructions
                        </p>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {delivery.dropoffInstructions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Package Info Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Distance</p>
            <p className="text-sm font-semibold text-gray-900">
              {(delivery.distance / 1000).toFixed(1)} km
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Duration</p>
            <p className="text-sm font-semibold text-gray-900">
              {Math.round(delivery.duration / 60)} min
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Payout</p>
            <p className="text-sm font-bold text-emerald-600">
              {formatNairaSimple(delivery.offeredFare)}
            </p>
          </div>
        </div>

        {/* Package Description */}
        {delivery.packageDescription && (
          <div className="mb-4 bg-purple-50 rounded-xl p-3 border border-purple-200/50">
            <p className="text-xs font-semibold text-purple-900 mb-1">Package Details</p>
            <p className="text-sm text-gray-700">{delivery.packageDescription}</p>
            {delivery.isFragile && (
              <span className="inline-block mt-2 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-lg">
                ⚠️ Fragile Item
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onAcceptDelivery(delivery.$id)}
          disabled={isAccepting}
          className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAccepting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Accepting...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Accept Delivery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-gray-900 text-lg md:text-xl font-semibold">
          New delivery requests waiting for your acceptance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-3xl p-6 border border-amber-200/50">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-900">{deliveries.length}</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-amber-900">Pending Requests</p>
          <p className="text-xs text-amber-700 mt-1">Available opportunities</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-6 border border-emerald-200/50">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-900">
                ₦{deliveries.reduce((sum, d) => sum + (d.offeredFare || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-emerald-900">Total Value</p>
          <p className="text-xs text-emerald-700 mt-1">Potential earnings</p>
        </div>
      </div>

      {/* Deliveries Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#3A0A21] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Pending Requests</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            New delivery requests will appear here when customers need your service
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deliveries.map(renderDeliveryCard)}
        </div>
      )}
    </div>
  );
};

export default CourierPendingDelivery;
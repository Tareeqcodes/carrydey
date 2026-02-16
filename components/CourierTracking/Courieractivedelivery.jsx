'use client';
import { 
  Package, 
  MapPin, 
  CheckCircle, 
  Truck, 
  Copy, 
  Check, 
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const CourierActiveDelivery = ({
  deliveries,
  allDeliveries,
  loading,
  copiedCode,
  onCopyCode,
  onConfirmPickup,
  onStartDelivery,
  onConfirmDelivery,
}) => {
  const getStatusColor = (status) => {
    const colors = {
      accepted: 'bg-blue-50 text-blue-700 border-blue-200',
      assigned: 'bg-blue-50 text-blue-700 border-blue-200',
      picked_up: 'bg-purple-50 text-purple-700 border-purple-200',
      in_transit: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    if (status === 'accepted' || status === 'assigned') return <Package className="w-4 h-4" />;
    return <Truck className="w-4 h-4" />;
  };

  const getStatusLabel = (status) => {
    const labels = {
      accepted: 'Accepted',
      assigned: 'Assigned',
      picked_up: 'Picked Up',
      in_transit: 'In Transit',
    };
    return labels[status] || status;
  };

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
            {getStatusIcon(delivery.status)}
            <span className="capitalize">{getStatusLabel(delivery.status)}</span>
          </span>
          <span className="text-xs font-medium text-gray-400">
            {new Date(delivery.$createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Pickup Code Display */}
        {(delivery.status === 'accepted' || delivery.status === 'assigned') && delivery.pickupCode && (
          <div className="mb-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">Pickup Code</p>
                  <p className="text-xs text-blue-600">Show to sender</p>
                </div>
              </div>
              <button
                onClick={() => onCopyCode(delivery.pickupCode, `pickup-${delivery.$id}`)}
                className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
              >
                {copiedCode === `pickup-${delivery.$id}` ? (
                  <Check className="w-5 h-5 text-blue-600" />
                ) : (
                  <Copy className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </div>
            <p className="text-3xl font-bold text-blue-900 tracking-widest text-center py-2 font-mono">
              {delivery.pickupCode}
            </p>
          </div>
        )}

        {/* Dropoff OTP Display */}
        {(delivery.status === 'picked_up' || delivery.status === 'in_transit') && delivery.dropoffOTP && (
          <div className="mb-6 bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-900 uppercase tracking-wide">Dropoff OTP</p>
                  <p className="text-xs text-green-600">Get from recipient</p>
                </div>
              </div>
              <button
                onClick={() => onCopyCode(delivery.dropoffOTP, `dropoff-${delivery.$id}`)}
                className="p-2 hover:bg-green-200 rounded-lg transition-colors"
              >
                {copiedCode === `dropoff-${delivery.$id}` ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-green-600" />
                )}
              </button>
            </div>
            <p className="text-3xl font-bold text-green-900 tracking-widest text-center py-2 font-mono">
              {delivery.dropoffOTP}
            </p>
          </div>
        )}

        {/* Location Cards */}
        <div className="space-y-4 mb-6">
          {/* Pickup Location */}
          <div className={`rounded-2xl p-4 border-2 ${
            delivery.status === 'accepted' || delivery.status === 'assigned' 
              ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 ${
                delivery.status === 'accepted' || delivery.status === 'assigned'
                  ? 'bg-blue-600'
                  : 'bg-blue-100'
              }`}>
                <MapPin className={`w-4 h-4 ${
                  delivery.status === 'accepted' || delivery.status === 'assigned'
                    ? 'text-white'
                    : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Pickup Location</p>
                  {(delivery.status === 'accepted' || delivery.status === 'assigned') && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-2">{delivery.pickupAddress}</p>
                
                {/* Contact Details */}
                {delivery.pickupContactName && (
                  <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/60 rounded-lg px-3 py-2 mb-2">
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
                  <div className="bg-white/60 rounded-lg p-3 border border-blue-200/50">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Pickup Instructions</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{delivery.pickupInstructions}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Route Connector */}
          <div className="flex items-center pl-6">
            <div className="w-0.5 h-6 bg-gradient-to-b from-blue-300 via-gray-300 to-red-300 rounded-full" />
          </div>

          {/* Dropoff Location */}
          <div className={`rounded-2xl p-4 border-2 ${
            delivery.status === 'picked_up' || delivery.status === 'in_transit'
              ? 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 ${
                delivery.status === 'picked_up' || delivery.status === 'in_transit'
                  ? 'bg-red-600'
                  : 'bg-red-100'
              }`}>
                <MapPin className={`w-4 h-4 ${
                  delivery.status === 'picked_up' || delivery.status === 'in_transit'
                    ? 'text-white'
                    : 'text-red-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Dropoff Location</p>
                  {(delivery.status === 'picked_up' || delivery.status === 'in_transit') && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-medium">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-2">{delivery.dropoffAddress}</p>
                
                {/* Contact Details */}
                {delivery.dropoffContactName && (
                  <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/60 rounded-lg px-3 py-2 mb-2">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">
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
                  <div className="bg-white/60 rounded-lg p-3 border border-red-200/50">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-red-900 mb-1">Dropoff Instructions</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{delivery.dropoffInstructions}</p>
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
            <p className="text-xs text-gray-500 mb-1">Package</p>
            <p className="text-sm font-semibold text-gray-900">
              {delivery.packageSize || 'Standard'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Distance</p>
            <p className="text-sm font-semibold text-gray-900">
              {(delivery.distance / 1000).toFixed(1)} km
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Payout</p>
            <p className="text-sm font-bold text-emerald-600">
              {formatNairaSimple(delivery.offeredFare)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {(delivery.status === 'accepted' || delivery.status === 'assigned') && (
          <button
            onClick={() => onConfirmPickup(delivery.$id)}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm Pickup
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {delivery.status === 'picked_up' && (
          <button
            onClick={() => onStartDelivery(delivery.$id)}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            Start Delivery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {delivery.status === 'in_transit' && (
          <button
            onClick={() => onConfirmDelivery(delivery.$id)}
            className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm Delivery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-gray-900 text-lg md:text-xl font-semibold">
          Manage and track your ongoing deliveries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-200/50">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-900">{deliveries.length}</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-blue-900">Active</p>
          <p className="text-xs text-blue-700 mt-1">In progress</p>
        </div> */}

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-6 border border-purple-200/50">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-900">
                {deliveries.filter(d => d.status === 'picked_up').length}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-purple-900">Picked Up</p>
          <p className="text-xs text-purple-700 mt-1">Ready to deliver</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-3xl p-6 border border-indigo-200/50">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <p className="text-3xl font-bold text-indigo-900">
                {deliveries.filter(d => d.status === 'in_transit').length}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-indigo-900">In Transit</p>
          <p className="text-xs text-indigo-700 mt-1">On the way</p>
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
          <p className="text-xs text-emerald-700 mt-1">Current earnings</p>
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
            <Truck className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Deliveries</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Accept pending delivery requests to start earning
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

export default CourierActiveDelivery;
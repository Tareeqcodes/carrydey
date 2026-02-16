'use client';
import { History, CheckCircle, DollarSign, XCircle, Package, MapPin, Clock, Calendar } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const CourierHistory = ({ deliveries, loading }) => {
  const deliveredCount = deliveries.filter((d) => d.status === 'delivered').length;
  const cancelledCount = deliveries.filter((d) => d.status === 'cancelled').length;
  const totalEarned = deliveries
    .filter((d) => d.status === 'delivered')
    .reduce((sum, d) => sum + (d.offeredFare || 0), 0);

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    if (status === 'delivered') return <CheckCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const renderHistoryCard = (delivery) => (
    <div
      key={delivery.$id}
      className="group bg-white rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
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
            <span className="capitalize">{delivery.status}</span>
          </span>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-400">
              {new Date(delivery.$createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            {delivery.deliveredAt && (
              <p className="text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3 inline mr-1" />
                {new Date(delivery.deliveredAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </div>

        {/* Route Info */}
        <div className="space-y-4 mb-6">
          {/* Pickup Location */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 border border-gray-200/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Package className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Pickup Location
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {delivery.pickupAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Route Connector */}
          <div className="flex items-center pl-6">
            <div className="w-0.5 h-6 bg-gradient-to-b from-gray-300 to-gray-300 rounded-full" />
          </div>

          {/* Dropoff Location */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 border border-gray-200/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <MapPin className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Dropoff Location
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {delivery.dropoffAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Distance</p>
            <p className="text-sm font-semibold text-gray-900">
              {(delivery.distance / 1000).toFixed(1)} km
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Package</p>
            <p className="text-sm font-semibold text-gray-900">
              {delivery.packageSize || 'Standard'}
            </p>
          </div>
          <div className={`rounded-xl p-3 text-center ${
            delivery.status === 'delivered' ? 'bg-emerald-50' : 'bg-gray-50'
          }`}>
            <p className="text-xs text-gray-500 mb-1">
              {delivery.status === 'delivered' ? 'Earned' : 'Lost'}
            </p>
            <p className={`text-sm font-bold ${
              delivery.status === 'delivered' ? 'text-emerald-600' : 'text-gray-600'
            }`}>
              {formatNairaSimple(delivery.offeredFare)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-gray-900 text-lg md:text-xl font-semibold">
          Your delivery history and completed jobs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-6 border border-emerald-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-900">
                {deliveredCount}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-emerald-900">Delivered</p>
          <p className="text-xs text-emerald-700 mt-1">Successfully completed</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-3xl p-6 border border-red-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-red-900">
                {cancelledCount}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-red-900">Cancelled</p>
          <p className="text-xs text-red-700 mt-1">Not completed</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-6 border border-purple-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-900">
                ₦{totalEarned.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-purple-900">Total Earned</p>
          <p className="text-xs text-purple-700 mt-1">From completed jobs</p>
        </div>
      </div>

      {/* History Grid */}
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
            <History className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No History Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Your completed and cancelled deliveries will appear here
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

export default CourierHistory;
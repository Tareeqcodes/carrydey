'use client';
import { Plus, Search, RefreshCw, Package, Truck, CheckCircle, DollarSign, Clock, AlertCircle, MapPin, ArrowRight } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const SenderActiveDelivery = ({
  deliveries,
  allDeliveries,
  completedDeliveries,
  loading,
  searchQuery,
  setSearchQuery,
  onRefresh,
  onTrackDelivery,
  onNewDelivery,
}) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      assigned: 'bg-blue-50 text-blue-700 border-blue-200',
      picked_up: 'bg-purple-50 text-purple-700 border-purple-200',
      in_transit: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'assigned':
      case 'picked_up':
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const renderDeliveryCard = (delivery) => (
    <div
      key={delivery.$id}
      className="group bg-white rounded-3xl border border-gray-200 hover:border-[#3A0A21]/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
              delivery.status
            )}`}
          >
            {getStatusIcon(delivery.status)}
            <span className="capitalize">{delivery.status.replace('_', ' ')}</span>
          </span>
          <span className="text-xs font-medium text-gray-400">
            {new Date(delivery.$createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Route Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-blue-50 rounded-lg">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-0.5">Pickup</p>
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
              <p className="text-xs font-medium text-gray-500 mb-0.5">Dropoff</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {delivery.dropoffAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Details Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Delivery Fee</p>
            <p className="text-lg font-bold text-gray-900">
              {formatNairaSimple(delivery.offeredFare || delivery.suggestedFare)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {delivery.isFragile && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-orange-50 text-orange-700 rounded-lg border border-orange-200">
                Fragile
              </span>
            )}
            <span className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 rounded-lg">
              {delivery.packageSize || 'Standard'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onTrackDelivery(delivery)}
          className="mt-4 w-full py-3 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-2xl text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
        >
          Track Delivery
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-900 text-lg md:text-xl font-semibold">Track and manage your ongoing Deliveries</p>
        </div>
        <button
          onClick={onNewDelivery}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-2xl hover:shadow-lg transition-all font-semibold text-sm"
        >
          <Plus className="w-5 h-5" />
          New Delivery
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-900">{deliveries.length}</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-blue-900">Active Deliveries</p>
          <p className="text-xs text-blue-700 mt-1">Currently in transit</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-6 border border-emerald-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-900">
                {completedDeliveries.length}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-emerald-900">Completed</p>
          <p className="text-xs text-emerald-700 mt-1">Successfully delivered</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-6 border border-purple-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-900">
                ₦
                {allDeliveries
                  .reduce((sum, d) => sum + (d.offeredFare || d.suggestedFare || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-purple-900">Total Spent</p>
          <p className="text-xs text-purple-700 mt-1">All-time deliveries</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent text-sm placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-3.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Deliveries</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start sending packages by creating your first delivery request
          </p>
          <button
            onClick={onNewDelivery}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-2xl hover:shadow-lg transition-all font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create Delivery
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deliveries.map(renderDeliveryCard)}
        </div>
      )}
    </div>
  );
};

export default SenderActiveDelivery;
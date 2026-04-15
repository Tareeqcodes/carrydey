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
      className="group bg-white/5 rounded-3xl border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 overflow-hidden"
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
            <p className="text-xs font-medium text-white/40">
              {new Date(delivery.$createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            {delivery.deliveredAt && (
              <p className="text-xs text-white/50 mt-1">
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
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Package className="w-4 h-4 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white/40 uppercase tracking-[0.12em] mb-1">
                  Pickup Location
                </p>
                <p className="text-sm font-semibold text-white">
                  {delivery.pickupAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Route Connector */}
          <div className="flex items-center pl-6">
            <div className="w-0.5 h-6 bg-gradient-to-b from-white/20 to-white/20 rounded-full" />
          </div>

          {/* Dropoff Location */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <MapPin className="w-4 h-4 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white/40 uppercase tracking-[0.12em] mb-1">
                  Dropoff Location
                </p>
                <p className="text-sm font-semibold text-white">
                  {delivery.dropoffAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <p className="text-xs text-white/50 mb-1">Distance</p>
            <p className="text-sm font-semibold text-white">
              {(delivery.distance / 1000).toFixed(1)} km
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <p className="text-xs text-white/50 mb-1">Package</p>
            <p className="text-sm font-semibold text-white">
              {delivery.packageSize || 'Standard'}
            </p>
          </div>
          <div className={`rounded-xl p-3 text-center border ${
            delivery.status === 'delivered' ? 'bg-emerald-500/15 border-emerald-500/30' : 'bg-white/5 border-white/10'
          }`}>
            <p className="text-xs text-white/50 mb-1">
              {delivery.status === 'delivered' ? 'Earned' : 'Lost'}
            </p>
            <p className={`text-sm font-bold ${
              delivery.status === 'delivered' ? 'text-emerald-400' : 'text-white'
            }`}>
              {formatNairaSimple(delivery.offeredFare)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div>
        <h2 className="text-[28px] font-black text-white leading-[1.08] tracking-[-0.02em] mb-2" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>History and Completed Jobs</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-500/20 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                {deliveredCount}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-white">Delivered</p>
          <p className="text-xs text-white/50 mt-1">Successfully completed</p>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-500/20 rounded-2xl">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                {cancelledCount}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-white">Cancelled</p>
          <p className="text-xs text-white/50 mt-1">Not completed</p>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-cyan-500/20 rounded-2xl">
              <DollarSign className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                ₦{totalEarned.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-white">Total Earned</p>
          <p className="text-xs text-white/50 mt-1">From completed jobs</p>
        </div>
      </div>

      {/* History Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-white/40 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="bg-white/5 rounded-3xl border-2 border-dashed border-white/20 p-16 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <History className="w-10 h-10 text-white/30" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No History Yet</h3>
          <p className="text-white/50 max-w-md mx-auto">
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
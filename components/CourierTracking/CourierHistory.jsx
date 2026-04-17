'use client';
import {
  History,
  CheckCircle,
  DollarSign,
  XCircle,
  Package,
  MapPin,
  Clock,
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const CourierHistory = ({ deliveries, loading }) => {
  const deliveredCount = deliveries.filter(
    (d) => d.status === 'delivered'
  ).length;
  const cancelledCount = deliveries.filter(
    (d) => d.status === 'cancelled'
  ).length;
  const totalEarned = deliveries
    .filter((d) => d.status === 'delivered')
    .reduce((sum, d) => sum + (d.offeredFare || 0), 0);

  const getStatusColor = (status) => {
    const colors = {
      delivered:
        'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
      cancelled:
        'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30',
    };
    return (
      colors[status] ||
      'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10'
    );
  };

  const getStatusIcon = (status) => {
    if (status === 'delivered') return <CheckCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const renderHistoryCard = (delivery) => (
    <div
      key={delivery.$id}
      className="group bg-black/5 dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(delivery.status)}`}
          >
            {getStatusIcon(delivery.status)}
            <span className="capitalize">{delivery.status}</span>
          </span>
          <div className="text-right">
            <p className="text-xs font-medium text-black/40 dark:text-white/40">
              {new Date(delivery.$createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            {delivery.deliveredAt && (
              <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                <Clock className="w-3 h-3 inline mr-1" />
                {new Date(delivery.deliveredAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-black/10 dark:border-white/10">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-black/5 dark:bg-white/10 rounded-xl">
                <Package className="w-4 h-4 text-black/60 dark:text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-[0.12em] mb-1">
                  Pickup Location
                </p>
                <p className="text-sm font-semibold text-black dark:text-white">
                  {delivery.pickupAddress}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center pl-6">
            <div className="w-0.5 h-6 bg-gradient-to-b from-black/20 dark:from-white/20 to-black/20 dark:to-white/20 rounded-full" />
          </div>
          <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-black/10 dark:border-white/10">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-black/5 dark:bg-white/10 rounded-xl">
                <MapPin className="w-4 h-4 text-black/60 dark:text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-[0.12em] mb-1">
                  Dropoff Location
                </p>
                <p className="text-sm font-semibold text-black dark:text-white">
                  {delivery.dropoffAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 text-center border border-black/10 dark:border-white/10">
            <p className="text-xs text-black/50 dark:text-white/50 mb-1">
              Distance
            </p>
            <p className="text-sm font-semibold text-black dark:text-white">
              {(delivery.distance / 1000).toFixed(1)} km
            </p>
          </div>
          <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 text-center border border-black/10 dark:border-white/10">
            <p className="text-xs text-black/50 dark:text-white/50 mb-1">
              Package
            </p>
            <p className="text-sm font-semibold text-black dark:text-white">
              {delivery.packageSize || 'Standard'}
            </p>
          </div>
          <div
            className={`rounded-xl p-3 text-center border ${delivery.status === 'delivered' ? 'bg-emerald-500/15 border-emerald-500/30' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10'}`}
          >
            <p className="text-xs text-black/50 dark:text-white/50 mb-1">
              {delivery.status === 'delivered' ? 'Earned' : 'Lost'}
            </p>
            <p
              className={`text-sm font-bold ${delivery.status === 'delivered' ? 'text-emerald-500' : 'text-black dark:text-white'}`}
            >
              {formatNairaSimple(delivery.offeredFare)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2
          className="text-[28px] font-black text-black dark:text-white leading-[1.08] tracking-[-0.02em] mb-2"
          style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        >
          History and Completed Jobs
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-6 border border-black/10 dark:border-white/10 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-500/20 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-black dark:text-white">
              {deliveredCount}
            </p>
          </div>
          <p className="text-sm font-semibold text-black dark:text-white">
            Delivered
          </p>
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            Successfully completed
          </p>
        </div>
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-6 border border-black/10 dark:border-white/10 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-500/20 rounded-2xl">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-black dark:text-white">
              {cancelledCount}
            </p>
          </div>
          <p className="text-sm font-semibold text-black dark:text-white">
            Cancelled
          </p>
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            Not completed
          </p>
        </div>
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-6 border border-black/10 dark:border-white/10 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-cyan-500/20 rounded-2xl">
              <DollarSign className="w-6 h-6 text-cyan-500" />
            </div>
            <p className="text-3xl font-bold text-black dark:text-white">
              ₦{totalEarned.toLocaleString()}
            </p>
          </div>
          <p className="text-sm font-semibold text-black dark:text-white">
            Total Earned
          </p>
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            From completed jobs
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-black/10 dark:border-white/10 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-black/40 dark:border-white/40 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl border-2 border-dashed border-black/20 dark:border-white/20 p-16 text-center">
          <div className="w-20 h-20 bg-black/5 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <History className="w-10 h-10 text-black/30 dark:text-white/30" />
          </div>
          <h3 className="text-xl font-bold text-black dark:text-white mb-2">
            No History Yet
          </h3>
          <p className="text-black/50 dark:text-white/50 max-w-md mx-auto">
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

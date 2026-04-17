'use client';
import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Search,
  History as HistoryIcon,
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const DeliveryHistory = ({ completedDeliveries, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const getFilteredDeliveries = () => {
    let filtered = completedDeliveries;
    if (filterStatus === 'delivered')
      filtered = filtered.filter((d) => d.status === 'delivered');
    else if (filterStatus === 'cancelled')
      filtered = filtered.filter((d) => d.status === 'cancelled');
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.pickupAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.dropoffAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (sortBy) {
      case 'recent':
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.$createdAt || b.createdAt) -
            new Date(a.$createdAt || a.createdAt)
        );
        break;
      case 'oldest':
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(a.$createdAt || a.createdAt) -
            new Date(b.$createdAt || b.createdAt)
        );
        break;
      case 'highest':
        filtered = [...filtered].sort(
          (a, b) =>
            (b.offeredFare || b.suggestedFare || 0) -
            (a.offeredFare || a.suggestedFare || 0)
        );
        break;
      case 'lowest':
        filtered = [...filtered].sort(
          (a, b) =>
            (a.offeredFare || a.suggestedFare || 0) -
            (b.offeredFare || b.suggestedFare || 0)
        );
        break;
    }
    return filtered;
  };

  const filteredDeliveries = getFilteredDeliveries();
  const totalDelivered = completedDeliveries.filter(
    (d) => d.status === 'delivered'
  ).length;
  const totalCancelled = completedDeliveries.filter(
    (d) => d.status === 'cancelled'
  ).length;

  const getStatusBadge = (status) => {
    if (status === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Delivered
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60">
        <div className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40" />
        Cancelled
      </span>
    );
  };

  const DeliveryHistoryCard = ({ delivery }) => (
    <div className="group bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl p-4 hover:border-black/20 dark:hover:border-white/20 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        {getStatusBadge(delivery.status)}
        <time className="text-xs text-black/40 dark:text-white/40 font-mono">
          {new Date(delivery.$createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
      </div>

      <div className="mb-3">
        <div className="flex items-start gap-3 mb-2">
          <div className="flex items-center gap-2 pt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40 font-medium">
              Pickup
            </span>
          </div>
          <p className="text-[11px] text-black dark:text-white leading-snug">
            {delivery.pickupAddress}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 pt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
            <span className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40 font-medium">
              Dropoff
            </span>
          </div>
          <p className="text-[11px] text-black dark:text-white leading-snug">
            {delivery.dropoffAddress}
          </p>
        </div>
      </div>

      {delivery.driverName && (
        <div className="mb-3 p-2.5 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40 font-medium mb-0.5">
            delivered by
          </p>
          <p className="text-sm font-medium text-black dark:text-white">
            {delivery.driverName}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 text-center p-2 rounded-lg bg-black/5 dark:bg-white/5">
          <p className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40 font-medium mb-0.5">
            Package
          </p>
          <p className="text-xs font-semibold text-black dark:text-white">
            {delivery.packageSize || 'Medium'}
          </p>
        </div>
        <div
          className={`flex-1 text-center p-2 rounded-lg ${delivery.status === 'delivered' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-black/5 dark:bg-white/5'}`}
        >
          <p className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40 font-medium mb-0.5">
            Payout
          </p>
          <p
            className={`text-xs font-bold ${delivery.status === 'delivered' ? 'text-emerald-600' : 'text-black/50 dark:text-white/50'}`}
          >
            {formatNairaSimple(
              delivery.payout || delivery.offeredFare || delivery.suggestedFare
            )}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-black dark:text-white tracking-tight mb-1">
            Delivery History
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-black rounded-xl p-4 border border-black/10 dark:border-white/10 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mb-0.5">
              {totalDelivered}
            </p>
            <p className="text-xs text-black/50 dark:text-white/50">
              Delivered
            </p>
          </div>
          <div className="bg-white dark:bg-black rounded-xl p-4 border border-black/10 dark:border-white/10 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-black/50 dark:text-white/50" />
              </div>
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mb-0.5">
              {totalCancelled}
            </p>
            <p className="text-xs text-black/50 dark:text-white/50">
              Cancelled
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-black rounded-xl p-3 border border-black/10 dark:border-white/10 mb-5">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
              <input
                type="text"
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-black/5 dark:bg-white/5 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C896] text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-black/5 dark:bg-white/5 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C896] text-sm font-medium text-black dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-black/5 dark:bg-white/5 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C896] text-sm font-medium text-black dark:text-white"
              >
                <option value="recent">Recent First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Pay</option>
                <option value="lowest">Lowest Pay</option>
              </select>
            </div>
          </div>
          {(searchTerm || filterStatus !== 'all') && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/10 dark:border-white/10">
              <p className="text-xs text-black/60 dark:text-white/60">
                <span className="font-semibold text-black dark:text-white">
                  {filteredDeliveries.length}
                </span>{' '}
                of {completedDeliveries.length} deliveries
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="text-xs font-medium text-[#00C896] hover:text-[#00E5AD] transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-white dark:bg-black rounded-xl p-12 text-center border border-black/10 dark:border-white/10">
            <div className="w-14 h-14 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
              <HistoryIcon className="w-7 h-7 text-black/30 dark:text-white/30" />
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-1">
              {searchTerm || filterStatus !== 'all'
                ? 'No results found'
                : 'No history yet'}
            </h3>
            <p className="text-sm text-black/50 dark:text-white/50 max-w-sm mx-auto">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Your completed deliveries will appear here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDeliveries.map((delivery) => (
              <DeliveryHistoryCard
                key={delivery.id || delivery.$id}
                delivery={delivery}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;

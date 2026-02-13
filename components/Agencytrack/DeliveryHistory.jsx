'use client';
import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle,
  XCircle,
  Clock,
  Search,
  TrendingUp,
  History as HistoryIcon,
  ArrowRight
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const DeliveryHistory = ({ completedDeliveries, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const getFilteredDeliveries = () => {
    let filtered = completedDeliveries;

    if (filterStatus === 'delivered') {
      filtered = filtered.filter(d => d.status === 'delivered');
    } else if (filterStatus === 'cancelled') {
      filtered = filtered.filter(d => d.status === 'cancelled');
    }

    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.pickupAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.dropoffAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'recent':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.$createdAt || b.createdAt) - new Date(a.$createdAt || a.createdAt)
        );
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => 
          new Date(a.$createdAt || a.createdAt) - new Date(b.$createdAt || b.createdAt)
        );
        break;
      case 'highest':
        filtered = [...filtered].sort((a, b) => 
          (b.offeredFare || b.suggestedFare || 0) - (a.offeredFare || a.suggestedFare || 0)
        );
        break;
      case 'lowest':
        filtered = [...filtered].sort((a, b) => 
          (a.offeredFare || a.suggestedFare || 0) - (b.offeredFare || b.suggestedFare || 0)
        );
        break;
    }

    return filtered;
  };

  const filteredDeliveries = getFilteredDeliveries();

  const totalDelivered = completedDeliveries.filter(d => d.status === 'delivered').length;
 const totalCancelled = completedDeliveries.filter(d => d.status === 'cancelled').length;
  // const totalEarnings = completedDeliveries
  //   .filter(d => d.status === 'delivered')
  //   .reduce((sum, d) => sum + (d.offeredFare || d.suggestedFare || 0), 0);

  const today = new Date().toDateString();
  const todayDeliveries = completedDeliveries.filter(d => 
    new Date(d.$createdAt || d.createdAt).toDateString() === today
  );
  const todayEarnings = todayDeliveries
    .filter(d => d.status === 'delivered')
    .reduce((sum, d) => sum + (d.offeredFare || d.suggestedFare || 0), 0);

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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Cancelled
      </span>
    );
  };

  const DeliveryHistoryCard = ({ delivery }) => {
    return (
      <div className="group bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-md hover:shadow-gray-100/50 transition-all duration-200">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          {getStatusBadge(delivery.status)}
          <time className="text-xs text-gray-400 font-mono">
            {new Date(delivery.$createdAt || delivery.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>

        {/* Route - Horizontal Layout */}
        <div className="mb-3">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex items-center gap-2 pt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Pickup</span>
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-gray-900 leading-snug">{delivery.pickup || delivery.pickupAddress}</p>
              {/* {delivery.pickupContactName && (
                <p className="text-xs text-gray-500 mt-0.5">{delivery.pickupContactName}</p>
              )} */}
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 pt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Dropoff</span>
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-gray-900 leading-snug">{delivery.dropoff || delivery.dropoffAddress}</p>
              {/* {delivery.dropoffContactName && (
                <p className="text-xs text-gray-500 mt-0.5">{delivery.dropoffContactName}</p>
              )} */}
            </div>
          </div>
        </div>

        {/* Driver - Compact */}
        {delivery.driverName && (
          <div className="mb-3 p-2.5 bg-gray-50/50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">Courier</p>
                <p className="text-sm font-medium text-gray-900">{delivery.driverName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Details - Horizontal Grid */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 text-center p-2 rounded-lg bg-gray-50/50">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">Distance</p>
            <p className="text-xs font-semibold text-gray-900">{delivery.distance || 'N/A'}</p>
          </div>
          <div className="flex-1 text-center p-2 rounded-lg bg-gray-50/50">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">Package</p>
            <p className="text-xs font-semibold text-gray-900">{delivery.packageSize || 'Medium'}</p>
          </div>
          <div className={`flex-1 text-center p-2 rounded-lg ${
            delivery.status === 'delivered' ? 'bg-emerald-50/50' : 'bg-gray-50/50'
          }`}>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">Payout</p>
            <p className={`text-xs font-bold ${
              delivery.status === 'delivered' ? 'text-emerald-600' : 'text-gray-500'
            }`}>
              {formatNairaSimple(delivery.payout || delivery.offeredFare || delivery.suggestedFare)}
            </p>
          </div>
        </div>

        {/* Package Description - Compact */}
        {/* {delivery.packageDescription && (
          <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Details</p>
            <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{delivery.packageDescription}</p>
            {delivery.isFragile && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded font-medium">
                ⚠️ Fragile
              </span>
            )}
          </div>
        )} */}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">Delivery History</h1>
        </div>

        {/* Statistics - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:shadow-gray-100/50 transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{totalDelivered}</p>
            <p className="text-xs text-gray-500">Delivered</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:shadow-gray-100/50 transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{totalCancelled}</p>
            <p className="text-xs text-gray-500">Cancelled</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 border border-emerald-400 hover:shadow-md hover:shadow-emerald-100 transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{formatNairaSimple(todayEarnings)}</p>
            <p className="text-xs text-emerald-50">Today's Earnings</p>
          </div>
        </div>

        {/* Filters - Compact */}
        <div className="bg-white rounded-xl p-3 border border-gray-100 mb-5">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deliveries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm font-medium"
              >
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm font-medium"
              >
                <option value="recent">Recent First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Pay</option>
                <option value="lowest">Lowest Pay</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          {(searchTerm || filterStatus !== 'all') && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900">{filteredDeliveries.length}</span> of {completedDeliveries.length} deliveries
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="text-xs font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Deliveries Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <HistoryIcon className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {searchTerm || filterStatus !== 'all' ? 'No results found' : 'No history yet'}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Your completed deliveries will appear here'
              }
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
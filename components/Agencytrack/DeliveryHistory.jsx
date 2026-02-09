'use client';
import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle,
  XCircle,
  Clock,
  Search,
  TrendingUp,
  History as HistoryIcon
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const DeliveryHistory = ({ completedDeliveries, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, delivered, cancelled
  const [sortBy, setSortBy] = useState('recent'); // recent, oldest, highest, lowest

  // Filter and sort deliveries
  const getFilteredDeliveries = () => {
    let filtered = completedDeliveries;

    // Filter by status
    if (filterStatus === 'delivered') {
      filtered = filtered.filter(d => d.status === 'delivered');
    } else if (filterStatus === 'cancelled') {
      filtered = filtered.filter(d => d.status === 'cancelled');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.pickupAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.dropoffAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
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
      default:
        break;
    }

    return filtered;
  };

  const filteredDeliveries = getFilteredDeliveries();

  // Calculate statistics
  const totalDelivered = completedDeliveries.filter(d => d.status === 'delivered').length;
  const totalCancelled = completedDeliveries.filter(d => d.status === 'cancelled').length;
  const totalEarnings = completedDeliveries
    .filter(d => d.status === 'delivered')
    .reduce((sum, d) => sum + (d.offeredFare || d.suggestedFare || 0), 0);

  // Calculate today's stats
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
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <CheckCircle className="w-3 h-3" />
          Delivered
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
        <XCircle className="w-3 h-3" />
        Cancelled
      </span>
    );
  };

  const DeliveryHistoryCard = ({ delivery }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-all">
        {/* Header with Status and Date */}
        <div className="flex items-center justify-between mb-4">
          {getStatusBadge(delivery.status)}
          <div className="text-right">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(delivery.$createdAt || delivery.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Route Information */}
        <div className="space-y-3 mb-4">
          {/* Pickup */}
          <div className="flex items-start gap-2">
            <div className="p-1 bg-green-100 rounded-full mt-0.5">
              <MapPin className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Pickup</p>
              <p className="text-sm text-gray-900">{delivery.pickup || delivery.pickupAddress}</p>
              {delivery.pickupContactName && (
                <p className="text-xs text-gray-500 mt-1">
                  {delivery.pickupContactName} • {delivery.pickupPhone}
                </p>
              )}
            </div>
          </div>
          
          {/* Route Line */}
          <div className="border-l-2 border-dashed border-gray-200 h-4 ml-3"></div>
          
          {/* Dropoff */}
          <div className="flex items-start gap-2">
            <div className="p-1 bg-red-100 rounded-full mt-0.5">
              <MapPin className="w-3 h-3 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Dropoff</p>
              <p className="text-sm text-gray-900">{delivery.dropoff || delivery.dropoffAddress}</p>
              {delivery.dropoffContactName && (
                <p className="text-xs text-gray-500 mt-1">
                  {delivery.dropoffContactName} • {delivery.dropoffPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Driver Info */}
        {delivery.driverName && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Courier</p>
            <p className="text-sm font-semibold text-gray-900">{delivery.driverName}</p>
            {delivery.driverPhone && (
              <p className="text-xs text-gray-500 mt-1">{delivery.driverPhone}</p>
            )}
          </div>
        )}

        {/* Delivery Details */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">Distance</p>
            <p className="text-sm font-semibold text-gray-900">
              {delivery.distance || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">Package</p>
            <p className="text-sm font-semibold text-gray-900">
              {delivery.packageSize || 'Medium'}
            </p>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            delivery.status === 'delivered' ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <p className="text-xs text-gray-500 mb-1">Payout</p>
            <p className={`text-sm font-semibold ${
              delivery.status === 'delivered' ? 'text-green-600' : 'text-gray-500'
            }`}>
              {formatNairaSimple(delivery.payout || delivery.offeredFare || delivery.suggestedFare)}
            </p>
          </div>
        </div>

        {/* Package Description */}
        {delivery.packageDescription && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Package Details</p>
            <p className="text-sm text-gray-700">{delivery.packageDescription}</p>
            {delivery.isFragile && (
              <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                ⚠️ Fragile
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 px-6 pb-16">
      {/* Header */}
      <div>
        <h2 className="text-base md:text-xl font-semibold text-gray-900 tracking- mt-5">View all completed and cancelled deliveries</h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{totalDelivered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{totalCancelled}</p>
            </div>
          </div>
        </div>

        

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500"> Earnings</p>
              <p className="text-2xl font-bold text-green-600">{formatNairaSimple(todayEarnings)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by address, driver, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
           
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Payout</option>
              <option value="lowest">Lowest Payout</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {searchTerm || filterStatus !== 'all' ? (
        <div className="flex items-center justify-between px-4">
          <p className="text-sm text-gray-600">
            Showing {filteredDeliveries.length} of {completedDeliveries.length} deliveries
          </p>
          {(searchTerm || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="text-sm text-[#3A0A21] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : null}

      {/* Deliveries List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No Results Found' : 'No History Yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your filters or search terms'
              : 'Completed deliveries will appear here'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeliveries.map((delivery) => (
            <DeliveryHistoryCard 
              key={delivery.id || delivery.$id} 
              delivery={delivery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryHistory;
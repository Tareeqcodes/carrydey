'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  DollarSign,
  Clock,
  AlertCircle,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

/* ─────────────────────────────────────────────
   Status config — full static Tailwind strings
───────────────────────────────────────────── */
const STATUS_CFG = {
  pending: {
    label: 'Pending',
    pill: 'bg-amber-50 text-amber-600 border-amber-100',
    dot: 'bg-amber-400',
    pulse: true,
    icon: Clock,
  },
  accepted: {
    label: 'Accepted',
    pill: 'bg-sky-50 text-sky-600 border-sky-100',
    dot: 'bg-sky-400',
    pulse: false,
    icon: CheckCircle,
  },
  assigned: {
    label: 'Assigned',
    pill: 'bg-blue-50 text-blue-600 border-blue-100',
    dot: 'bg-blue-500',
    pulse: false,
    icon: Truck,
  },
  picked_up: {
    label: 'Picked Up',
    pill: 'bg-violet-50 text-violet-600 border-violet-100',
    dot: 'bg-violet-500',
    pulse: false,
    icon: Package,
  },
  in_transit: {
    label: 'In Transit',
    pill: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    dot: 'bg-indigo-500',
    pulse: true,
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    pill: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    dot: 'bg-emerald-500',
    pulse: false,
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    pill: 'bg-red-50 text-red-500 border-red-100',
    dot: 'bg-red-400',
    pulse: false,
    icon: AlertCircle,
  },
};

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'in_transit', label: 'In Transit' },
];

function StatusPill({ status }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.pill}`}
    >
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        {cfg.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${cfg.dot}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${cfg.dot}`}
        />
      </span>
      {cfg.label}
    </span>
  );
}

function DeliveryRow({ delivery, onTrack, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.22 }}
      onClick={() => onTrack(delivery)}
      className="group bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-5 hover:border-white/20 hover:shadow-sm cursor-pointer transition-all duration-200"
    >
      {/* Status dot column */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
        <div
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            STATUS_CFG[delivery.status]?.dot ?? 'bg-white/30'
          }`}
        />
      </div>

      {/* Route */}
      <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-6">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-0.5">
            From
          </p>
          <p className="text-sm font-medium text-white truncate">
            {delivery.pickupAddress}
          </p>
        </div>
        <div className="min-w-0">
  <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-0.5">To</p>
  {delivery.isVendorBatch && delivery.mutipledropoff ? (
    <p className="text-sm font-medium text-white truncate">
      {(() => {
        try {
          const s = JSON.parse(delivery.mutipledropoff);
          return `${s.length} stops · ${s[0]?.dropoffAddress || ''}`;
        } catch { return delivery.dropoffAddress; }
      })()}
    </p>
  ) : (
    <p className="text-sm font-medium text-white truncate">{delivery.dropoffAddress}</p>
  )}
</div>
      </div>

      {/* Meta — hidden on small screens */}
      <div className="hidden md:flex items-center gap-6 flex-shrink-0">
        <div className="text-right">
          <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-0.5">
            Fee
          </p>
          <p className="text-sm font-bold text-white tabular-nums">
            {formatNairaSimple(delivery.offeredFare || delivery.suggestedFare)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-0.5">
            Size
          </p>
          <p className="text-sm font-medium text-white/70">
            {delivery.packageSize || 'Standard'}
          </p>
        </div>
      </div>

      {/* Status pill */}
      <div className="flex-shrink-0 hidden sm:block">
        <StatusPill status={delivery.status} />
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/10 group-hover:bg-[#00C896] flex items-center justify-center transition-colors duration-200">
        <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-black transition-colors duration-200" />
      </div>
    </motion.div>
  );
}

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
  const [activeFilter, setActiveFilter] = useState('all');

  const totalSpent = allDeliveries.reduce(
    (sum, d) => sum + (d.offeredFare || d.suggestedFare || 0),
    0
  );

  const filtered = deliveries.filter((d) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'assigned'
        ? ['accepted', 'assigned', 'picked_up'].includes(d.status)
        : d.status === activeFilter);
    const matchesSearch =
      !searchQuery ||
      d.pickupAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.dropoffAddress?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-4xl space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Deliveries
          </h1>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900 tabular-nums">
              {deliveries.length}
            </p>
          </div>
          <p className="text-sm font-semibold text-blue-900">
            Active Deliveries
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-6 border border-emerald-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-emerald-900 tabular-nums">
              {completedDeliveries.length}
            </p>
          </div>
          <p className="text-sm font-semibold text-emerald-900">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-6 border border-purple-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-900 tabular-nums">
              ₦{totalSpent.toLocaleString()}
            </p>
          </div>
          <p className="text-sm font-semibold text-purple-900">Total Spent</p>
        </div>
      </div>

      {/* ── Search + filter row ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by address…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A0A21]/15 focus:border-[#3A0A21]/30 transition-all"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 flex-shrink-0"
        >
          <RefreshCw
            className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-[3px] border-gray-200" />
            <div className="absolute inset-0 rounded-full border-[3px] border-[#3A0A21] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-28 text-center"
        >
          {searchQuery || activeFilter !== 'all' ? (
            <>
              <Search className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-500">
                No deliveries found
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mt-2 text-xs text-[#3A0A21] font-semibold hover:underline"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-base font-bold text-gray-800 mb-1">
                No active deliveries
              </p>
              <p className="text-sm text-gray-400 mb-6 max-w-xs">
                Create a delivery request to get started.
              </p>
              <button
                onClick={onNewDelivery}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3A0A21] text-white rounded-xl font-semibold text-sm hover:bg-[#5A0A31] transition-all"
              >
                <Plus className="w-4 h-4" />
                New Delivery
              </button>
            </>
          )}
        </motion.div>
      ) : (
        <div className="space-y-2">
          {/* Column headers — desktop only */}
          <div className="hidden md:grid grid-cols-[16px_1fr_auto_auto_auto_32px] gap-5 px-5 pb-1">
            <div />
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider col-span-1">
              Route
            </p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
              Fee
            </p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
              Size
            </p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Status
            </p>
            <div />
          </div>

          <AnimatePresence>
            {filtered.map((d, i) => (
              <DeliveryRow
                key={d.$id}
                delivery={d}
                onTrack={onTrackDelivery}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SenderActiveDelivery;

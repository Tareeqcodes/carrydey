'use client';
import React from 'react';
import { Plus, Phone, Wifi, Truck, WifiOff, MoreVertical } from 'lucide-react';

// ─── Status Config ─────────────────────────────────────────────────────────
const getStatusConfig = (status) => {
  const configs = {
    available: {
      label: 'Available',
      dot: '#16A34A',
      bg: '#DCFCE7',
      text: '#15803D',
      border: '#BBF7D0',
      icon: Wifi,
    },
    on_delivery: {
      label: 'On Delivery',
      dot: '#2563EB',
      bg: '#DBEAFE',
      text: '#1D4ED8',
      border: '#BFDBFE',
      icon: Truck,
    },
    offline: {
      label: 'Offline',
      dot: '#9CA3AF',
      bg: '#F3F4F6',
      text: '#6B7280',
      border: '#E5E7EB',
      icon: WifiOff,
    },
  };
  return configs[status] || configs.offline;
};

// ─── Skeleton Card ─────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm overflow-hidden">
    <style>{`
      @keyframes shimmer {
        0%   { background-position: -400px 0; }
        100% { background-position:  400px 0; }
      }
      .skeleton {
        background: linear-gradient(90deg, #F3F4F6 25%, #E9EAEB 50%, #F3F4F6 75%);
        background-size: 400px 100%;
        animation: shimmer 1.4s ease-in-out infinite;
        border-radius: 6px;
      }
    `}</style>
    <div className="flex items-center gap-3 mb-5">
      <div className="skeleton w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-32" />
        <div className="skeleton h-2.5 w-24" />
      </div>
      <div className="skeleton w-6 h-6 rounded-lg" />
    </div>
    <div className="flex items-center justify-between mb-3">
      <div className="skeleton h-2.5 w-12" />
      <div className="skeleton h-6 w-24 rounded-full" />
    </div>
    <div className="flex items-center justify-between mb-5">
      <div className="skeleton h-2.5 w-20" />
      <div className="skeleton h-2.5 w-16" />
    </div>
    <div className="flex gap-2">
      <div className="skeleton h-9 flex-1 rounded-xl" />
      <div className="skeleton h-9 flex-1 rounded-xl" />
    </div>
  </div>
);
const DriverCard = ({
  driver,
  activeDeliveries,
  onToggleStatus,
  onAssignDelivery,
  onEditDriver,
}) => {
  const status = getStatusConfig(driver.status);
  const initial = (driver.name || '?')[0].toUpperCase();

  const handleAssign = () => {
    const pendingDelivery = activeDeliveries?.find(
      (d) => d.status === 'accepted' || d.status === 'pending_assignment'
    );
    if (pendingDelivery) onAssignDelivery(pendingDelivery);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-base font-black text-white flex-shrink-0"
            style={{ background: '#3A0A21' }}
          >
            {initial}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {driver.name}
            </h3>
            <a
              href={`tel:${driver.phone}`}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-blue-600 transition-colors mt-0.5 w-fit"
            >
              <Phone className="w-2.5 h-2.5" />
              {driver.phone}
            </a>
          </div>
          <button
            onClick={() => onEditDriver(driver)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            title="Edit driver"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Info rows */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Status
            </span>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{
                background: status.bg,
                color: status.text,
                border: `1px solid ${status.border}`,
              }}
            >
              {status.label}
            </span>
          </div>

          {driver.vehicleType && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Vehicle
              </span>
              <span className="text-xs font-semibold text-gray-700 capitalize">
                {driver.vehicleType}
              </span>
            </div>
          )}

          {driver.assignedDelivery && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Delivery
              </span>
              <span
                className="text-xs font-bold truncate max-w-[120px]"
                style={{ color: '#3A0A21' }}
              >
                {driver.assignedDelivery}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 mb-4" />

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onToggleStatus(driver.$id, driver.status)}
            disabled={driver.status === 'on_delivery'}
            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all disabled:cursor-not-allowed"
            style={
              driver.status === 'on_delivery'
                ? { background: '#F3F4F6', color: '#9CA3AF' }
                : driver.status === 'available'
                  ? {
                      background: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FECACA',
                    }
                  : {
                      background: '#DCFCE7',
                      color: '#16A34A',
                      border: '1px solid #BBF7D0',
                    }
            }
          >
            {driver.status === 'available'
              ? 'Set Offline'
              : driver.status === 'on_delivery'
                ? 'On Delivery'
                : 'Set Available'}
          </button>

          {driver.status === 'available' && (
            <button
              onClick={handleAssign}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{
                background: '#3A0A21',
                boxShadow: '0 2px 8px rgba(58,10,33,0.25)',
              }}
            >
              Assign Delivery
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DriversPage = ({
  drivers,
  loading,
  error,
  activeDeliveries,
  onAddDriver,
  onToggleStatus,
  onAssignDelivery,
  onEditDriver,
}) => {
  const available =
    drivers?.filter((d) => d.status === 'available').length ?? 0;
  const onDelivery =
    drivers?.filter((d) => d.status === 'on_delivery').length ?? 0;
  const offline = drivers?.filter((d) => d.status === 'offline').length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-lg font-black text-gray-900"
                style={{ letterSpacing: '-0.5px' }}
              >
                Fleet
              </h1>
            </div>
            <button
              onClick={onAddDriver}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{
                background: '#3A0A21',
                boxShadow: '0 2px 8px rgba(58,10,33,0.25)',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Driver
            </button>
          </div>

          {/* Stats row */}
          {!loading && !error && drivers.length > 0 && (
            <div className="flex gap-2 mt-3">
              {[
                { label: 'Available', count: available, dot: '#16A34A' },
                { label: 'On Delivery', count: onDelivery, dot: '#2563EB' },
                { label: 'Offline', count: offline, dot: '#9CA3AF' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: stat.dot }}
                  />
                  <div>
                    <p className="text-base font-black text-gray-900 leading-none">
                      {stat.count}
                    </p>
                    <p className="text-[9px] text-gray-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
            >
              <WifiOff className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Failed to load drivers
            </h3>
            <p className="text-xs text-gray-500 text-center max-w-[200px]">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && drivers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: '#F9F0F3', border: '1px solid #F3D5E1' }}
            >
              <Truck className="w-7 h-7" style={{ color: '#3A0A21' }} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              No Drivers Yet
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Get started by adding your first driver
            </p>
            <button
              onClick={onAddDriver}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{
                background: '#3A0A21',
                boxShadow: '0 2px 8px rgba(58,10,33,0.25)',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Driver
            </button>
          </div>
        )}

        {!loading && !error && drivers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((driver) => (
              <DriverCard
                key={driver.$id}
                driver={driver}
                activeDeliveries={activeDeliveries}
                onToggleStatus={onToggleStatus}
                onAssignDelivery={onAssignDelivery}
                onEditDriver={onEditDriver}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriversPage;

'use client';
import { MapPin, Truck, Wifi, WifiOff, Package } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import so Mapbox doesn't SSR
const TrackingMapbox = dynamic(() => import('./TrackingMapbox'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-3"
          style={{ borderColor: '#2563EB', borderTopColor: 'transparent' }}
        />
        <p className="text-white/60 text-xs font-medium">Loading map…</p>
      </div>
    </div>
  ),
});

function parseStops(raw) {
  if (!raw) return [];
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }
}

const STATUS_DOT = {
  available: '#16A34A',
  on_delivery: '#2563EB',
  offline: '#9CA3AF',
};

const TrackingPage = ({ activeDeliveries, drivers }) => {
  const onDeliveryDrivers = drivers.filter((d) => d.status === 'on_delivery');
  const availableDrivers = drivers.filter((d) => d.status === 'available');
  const offlineDrivers = drivers.filter((d) => d.status === 'offline');

  // Deliveries that are actively moving (have a driver assigned)
  const trackableDeliveries = activeDeliveries.filter((d) =>
    ['assigned', 'picked_up', 'in_transit'].includes(d.status)
  );

  // Drivers with a known location
  const locatedDrivers = onDeliveryDrivers.filter((d) => d.lat && d.lng);
  const unlocatedDrivers = onDeliveryDrivers.filter((d) => !d.lat || !d.lng);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* ── Sticky header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div>
            <h1
              className="text-lg font-black text-black dark:text-white"
              style={{ letterSpacing: '-0.5px' }}
            >
              Live Tracking
            </h1>
            
          </div>
        </div>
      </div>

      {/* ── Map */}
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm"
        style={{ height: 380 }}
      >
        {activeDeliveries.length === 0 && drivers.length === 0 ? (
          // Empty state — no map needed
          <div className="w-full h-full bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-black/30 dark:text-white/30" />
            </div>
            <p className="text-sm font-bold text-black dark:text-white">No active deliveries</p>
            <p className="text-xs text-black/40 dark:text-white/40">Driver locations will appear here</p>
          </div>
        ) : (
          <TrackingMapbox
            drivers={drivers}
            activeDeliveries={activeDeliveries}
          />
        )}
      </div>

      {/* ── Legend */}
      <div className="mx-4 mt-2 flex items-center gap-4 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
        {[
          { color: '#2563EB', label: 'Driver (live)', shape: 'circle' },
          { color: '#16A34A', label: 'Pickup', shape: 'circle' },
          { color: '#DC2626', label: 'Dropoff', shape: 'square' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              style={{
                width: 10, height: 10,
                background: item.color,
                borderRadius: item.shape === 'circle' ? '50%' : 2,
                flexShrink: 0,
              }}
            />
            <span className="text-[10px] font-medium text-black/60 dark:text-white/60">
              {item.label}
            </span>
          </div>
        ))}
        {unlocatedDrivers.length > 0 && (
          <div className="ml-auto flex items-center gap-1 text-[10px] text-amber-600">
            <WifiOff className="w-3 h-3" />
            {unlocatedDrivers.length} no GPS
          </div>
        )}
      </div>

      {/* ── Driver list */}
      {drivers.length > 0 && (
        <div className="mx-4 mt-3 mb-24 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 px-1">
            Fleet Status
          </p>

          {drivers.map((driver) => {
            const id = driver.$id || driver.id;
            const dot = STATUS_DOT[driver.status] || '#9CA3AF';
            const assignedIds = (driver.assignedDelivery || '')
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean);
            const assignedDeliveries = activeDeliveries.filter((d) =>
              assignedIds.includes(d.$id || d.id)
            );
            const hasLocation = driver.lat && driver.lng;

            return (
              <div
                key={id}
                className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-sm"
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ background: dot }}
                >
                  {(driver.name || '?')[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-black dark:text-white truncate">
                      {driver.name}
                    </p>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: `${dot}18`,
                        color: dot,
                      }}
                    >
                      {driver.status === 'on_delivery'
                        ? 'On Delivery'
                        : driver.status === 'available'
                          ? 'Available'
                          : 'Offline'}
                    </span>
                    {/* GPS indicator */}
                    {driver.status === 'on_delivery' && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 flex items-center gap-0.5"
                        style={
                          hasLocation
                            ? { background: '#DCFCE7', color: '#16A34A' }
                            : { background: '#FEF3C7', color: '#D97706' }
                        }
                      >
                        {hasLocation ? (
                          <Wifi className="w-2.5 h-2.5" />
                        ) : (
                          <WifiOff className="w-2.5 h-2.5" />
                        )}
                        {hasLocation ? 'GPS live' : 'No GPS'}
                      </span>
                    )}
                  </div>

                  {/* Assigned deliveries */}
                  {assignedDeliveries.length > 0 ? (
                    <div className="mt-1.5 space-y-1">
                      {assignedDeliveries.map((delivery) => {
                        const isBatch = delivery.isVendorBatch;
                        const stops = isBatch
                          ? parseStops(delivery.mutipledropoff)
                          : [];
                        const currentIdx = delivery.currentStopIdx ?? 0;
                        const currentStop = stops[currentIdx];
                        const dropoffLabel = isBatch && currentStop
                          ? `${currentStop.dropoffAddress?.split(',')[0]} (${currentIdx + 1}/${stops.length})`
                          : delivery.dropoffAddress?.split(',')[0];

                        return (
                          <div
                            key={delivery.$id || delivery.id}
                            className="flex items-center gap-1 min-w-0"
                          >
                            <MapPin className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                            <span className="text-[10px] text-black/60 dark:text-white/60 truncate">
                              {delivery.pickupAddress?.split(',')[0]}
                            </span>
                            <span className="text-[10px] text-black/30 dark:text-white/30 flex-shrink-0">→</span>
                            <MapPin className="w-2.5 h-2.5 text-red-400 flex-shrink-0" />
                            <span className="text-[10px] text-black/60 dark:text-white/60 truncate">
                              {dropoffLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : driver.status === 'on_delivery' ? (
                    <p className="text-[10px] text-black/30 dark:text-white/30 mt-1">
                      Loading delivery details…
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
'use client';
import { MapPin, Truck } from 'lucide-react';

function parseStops(raw) {
  if (!raw) return [];
  try { return typeof raw === 'string' ? JSON.parse(raw) : raw; }
  catch { return []; }
}

const TrackingPage = ({ activeDeliveries, drivers }) => {
  const activeOnes = activeDeliveries.filter(
    (d) => !['delivered', 'pending_assignment'].includes(d.status)
  );

  const activeDrivers = drivers.filter((d) => d.status === 'on_delivery');
  const availableDrivers = drivers.filter((d) => d.status === 'available');

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 sm:p-6 lg:p-8">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
        <div className="px-3 py-3">
          <h1 className="text-base font-bold text-black dark:text-white">Live Tracking</h1>
        </div>
      </div>

      {/* Map Container */}
      <div className="p-2">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Map View */}
          <div className="relative bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 h-[400px] md:h-[500px]">
            {/* Pickup Points (Green) */}
            {activeOnes.map((delivery, index) => {
              const deliveryId =
                delivery.id || delivery.$id || `delivery-${index}`;
              return (
                <div
                  key={`pickup-${deliveryId}`}
                  className="absolute"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 20}%`,
                  }}
                >
                  <MapPin className="w-5 h-5 text-green-600 drop-shadow-md" />
                </div>
              );
            })}

            {/* Dropoff Points (Red) */}
            {activeOnes.map((delivery, index) => {
              const deliveryId =
                delivery.id || delivery.$id || `delivery-${index}`;
              return (
                <div
                  key={`dropoff-${deliveryId}`}
                  className="absolute"
                  style={{
                    left: `${60 + index * 10}%`,
                    top: `${40 + index * 15}%`,
                  }}
                >
                  <MapPin className="w-5 h-5 text-red-600 drop-shadow-md" />
                </div>
              );
            })}

            {/* Active Drivers (Blue - Animated) */}
            {activeDrivers.map((driver, index) => {
              const driverId = driver.id || driver.$id || `driver-${index}`;
              return (
                <div
                  key={`active-${driverId}`}
                  className="absolute"
                  style={{
                    left: `${35 + index * 20}%`,
                    top: `${45 + index * 12}%`,
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                    <div className="relative w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Available Drivers (Green) */}
            {availableDrivers.map((driver, index) => {
              const driverId = driver.id || driver.$id || `driver-${index}`;
              return (
                <div
                  key={`available-${driverId}`}
                  className="absolute"
                  style={{
                    left: `${70 + index * 8}%`,
                    top: `${25 + index * 12}%`,
                  }}
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                    <Truck className="w-3 h-3 text-white" />
                  </div>
                </div>
              );
            })}

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between gap-3 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                  <span className="text-black dark:text-white font-medium">Pickup</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div>
                  <span className="text-black dark:text-white font-medium">Dropoff</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                  <span className="text-black dark:text-white font-medium">On Road</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <span className="text-black dark:text-white font-medium">Available</span>
                </div>
              </div>
            </div>

            {/* Empty State Overlay */}
            {activeOnes.length === 0 && activeDrivers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-black dark:text-white">
                    No Active Deliveries
                  </p>
                  <p className="text-xs text-black dark:text-white mt-1">
                    Tracking will appear here
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Driver Status List */}
          {drivers.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-2 space-y-1 max-h-[260px] overflow-y-auto">
              {drivers.map((driver, index) => {
                const driverId = driver.id || driver.$id || `driver-${index}`;
                const statusColor =
                  driver.status === 'available'
                    ? 'bg-green-500'
                    : driver.status === 'on_delivery'
                      ? 'bg-blue-500'
                      : 'bg-gray-400';

                // Support comma-separated list of delivery IDs
                const assignedIds = driver.assignedDelivery
                  ? driver.assignedDelivery.split(',').filter(Boolean)
                  : [];

                const assignedDeliveries = activeDeliveries.filter((d) =>
                  assignedIds.includes(d.$id || d.id)
                );

                return (
                  <div
                    key={driverId}
                    className="flex flex-col gap-0.5 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {/* Row 1: status dot + name + delivery count badge */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full ${statusColor} flex-shrink-0`}
                      />
                      <span className="text-xs font-medium text-black dark:text-white truncate">
                        {driver.name}
                      </span>
                      {assignedDeliveries.length > 1 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-bold flex-shrink-0">
                          {assignedDeliveries.length} deliveries
                        </span>
                      )}
                    </div>

                    {/* One address row per assigned delivery */}
                    {assignedDeliveries.map((delivery) => {
                      const isBatch = delivery.isVendorBatch;
                      const stops = isBatch
                        ? parseStops(delivery.mutipledropoff)
                        : [];
                      const currentIdx = delivery.currentStopIdx ?? 0;
                      const currentStop = stops[currentIdx];

                      return delivery.pickupAddress ||
                        delivery.dropoffAddress ? (
                        <div
                          key={delivery.$id || delivery.id}
                          className="flex items-center gap-1 pl-4 min-w-0"
                        >
                          <MapPin className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                          <span className="text-[10px] text-black dark:text-white truncate">
                            {delivery.pickupAddress?.split(',')[0]}
                          </span>
                          <span className="text-[10px] text-black dark:text-white flex-shrink-0">
                            →
                          </span>
                          <MapPin className="w-2.5 h-2.5 text-red-400 flex-shrink-0" />
                          <span className="text-[10px] text-black dark:text-white truncate">
                            {isBatch && currentStop
                              ? `${currentStop.dropoffAddress} (${currentIdx + 1}/${stops.length})`
                              : delivery.dropoffAddress?.split(',')[0]}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;

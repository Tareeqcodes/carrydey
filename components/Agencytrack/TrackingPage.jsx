'use client';
import React from 'react';
import { 
  Clock, 
  RefreshCw, 
  MapPin, 
  Phone, 
  Truck 
} from 'lucide-react';

const TrackingPage = ({ activeDeliveries, drivers }) => {
  const activeOnes = activeDeliveries.filter(
    (d) => !['delivered', 'pending_assignment'].includes(d.status)
  );

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Monitor all deliveries in real-time</h2>
          
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 inline mr-2" />
          
          </button>
          
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Live Delivery Map</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Available Drivers
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Active Deliveries
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Dropoff Points
                </span>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl h-[500px] flex items-center justify-center relative">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl"></div>

              {/* Dropoff Points */}
              {activeOnes.map((delivery, index) => (
                <div
                  key={`dropoff-${delivery.id}`}
                  className="absolute"
                  style={{
                    left: `${60 + index * 10}%`,
                    top: `${40 + index * 15}%`,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <MapPin className="w-6 h-6 text-red-600 drop-shadow-lg" />
                    <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                      Drop #{delivery.id}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pickup Points */}
              {activeOnes.map((delivery, index) => (
                <div
                  key={`pickup-${delivery.id}`}
                  className="absolute"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 20}%`,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <MapPin className="w-6 h-6 text-green-600 drop-shadow-lg" />
                    <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                      Pickup #{delivery.id}
                    </div>
                  </div>
                </div>
              ))}

              {/* Active Drivers */}
              {drivers
                .filter((d) => d.status === 'on_delivery')
                .map((driver, index) => {
                  const assignedDelivery = activeDeliveries.find(
                    (d) => d.driverId === driver.id
                  );
                  return (
                    <div
                      key={`driver-${driver.id}`}
                      className="absolute animate-pulse"
                      style={{
                        left: `${30 + index * 20}%`,
                        top: `${50 + index * 10}%`,
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg text-sm mt-2 shadow-lg min-w-[120px]">
                          <p className="font-medium truncate">{driver.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {driver.vehicle}
                          </p>
                          <p className="text-xs text-blue-600 font-medium">
                            Delivery #{assignedDelivery?.id || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* Available Drivers */}
              {drivers
                .filter((d) => d.status === 'available')
                .map((driver, index) => (
                  <div
                    key={`available-${driver.id}`}
                    className="absolute"
                    style={{
                      left: `${70 + index * 5}%`,
                      top: `${20 + index * 10}%`,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                        <Truck className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                        {driver.name.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                ))}

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <h4 className="font-medium mb-2">Live Tracking</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>
                      On Delivery:{' '}
                      {drivers.filter((d) => d.status === 'on_delivery').length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>
                      Available:{' '}
                      {drivers.filter((d) => d.status === 'available').length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Active Deliveries: {activeOnes.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Delivery List */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Active Deliveries</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {activeOnes.map((delivery) => (
                <div
                  key={delivery.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-[#3A0A21] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">#{delivery.id}</h4>
                      <p className="text-sm text-gray-500">{delivery.driver}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          delivery.status === 'assigned'
                            ? 'bg-yellow-100 text-yellow-800'
                            : delivery.status === 'pickup'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {delivery.status === 'assigned'
                          ? 'Assigned'
                          : delivery.status === 'pickup'
                          ? 'Pickup'
                          : 'In Transit'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="truncate">{delivery.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="truncate">{delivery.dropoff}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {delivery.estimatedTime}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const driverPhone = drivers.find(
                          (d) => d.id === delivery.driverId
                        )?.phone;
                        if (driverPhone) {
                          window.location.href = `tel:${driverPhone}`;
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Call Driver"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {activeOnes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No active deliveries</p>
                  <p className="text-sm">
                    All deliveries are completed or pending assignment
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Driver Status Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Driver Status</h3>
            <div className="space-y-3">
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        driver.status === 'available'
                          ? 'bg-green-500'
                          : driver.status === 'on_delivery'
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.vehicle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#3A0A21]">
                      {driver.earningsToday > 0
                        ? `$${driver.earningsToday.toFixed(2)}`
                        : '-'}
                    </p>
                    <p className="text-xs text-gray-500">{driver.lastUpdate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
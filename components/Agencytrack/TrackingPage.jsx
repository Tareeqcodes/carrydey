'use client';
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

  // Debug: Check for undefined IDs
  console.log('Active deliveries:', activeOnes.map(d => ({ id: d.id, $id: d.$id })));

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Monitor all deliveries in real-time</h2>
        </div>
        {/* <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 inline mr-2" />
          </button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-sm">
                <span className="flex text-xs items-center gap-1">
                  <div className="w-3 h-3 text-xs bg-green-500 rounded-full"></div>
                  Available Drivers
                </span>
                <span className="flex text-xs items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Active Deliveries
                </span>
                <span className="flex text-xs items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Dropoff Points
                </span>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl h-[500px] flex items-center justify-center relative">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl"></div>

              {/* Dropoff Points */}
              {activeOnes.map((delivery, index) => {
                // Use a combination of delivery ID and index for unique key
                const deliveryId = delivery.id || delivery.$id || `delivery-${index}`;
                return (
                  <div
                    key={`dropoff-${deliveryId}-${index}`} // Add index to ensure uniqueness
                    className="absolute"
                    style={{
                      left: `${60 + index * 10}%`,
                      top: `${40 + index * 15}%`,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <MapPin className="w-6 h-6 text-red-600 drop-shadow-lg" />
                      <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                        Drop #{delivery.id || delivery.$id || 'N/A'}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pickup Points */}
              {activeOnes.map((delivery, index) => {
                const deliveryId = delivery.id || delivery.$id || `delivery-${index}`;
                return (
                  <div
                    key={`pickup-${deliveryId}-${index}`} // Add index to ensure uniqueness
                    className="absolute"
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 20}%`,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <MapPin className="w-6 h-6 text-green-600 drop-shadow-lg" />
                      <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                        Pickup #{delivery.id || delivery.$id || 'N/A'}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Active Drivers */}
              {drivers
                .filter((d) => d.status === 'on_delivery')
                .map((driver, index) => {
                  const assignedDelivery = activeDeliveries.find(
                    (d) => d.driverId === driver.id
                  );
                  const driverId = driver.id || driver.$id || `driver-${index}`;
                  return (
                    <div
                      key={`driver-${driverId}-${index}`} // Add index for uniqueness
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
                            Delivery #{assignedDelivery?.id || assignedDelivery?.$id || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* Available Drivers */}
              {drivers
                .filter((d) => d.status === 'available')
                .map((driver, index) => {
                  const driverId = driver.id || driver.$id || `driver-${index}`;
                  return (
                    <div
                      key={`available-${driverId}-${index}`} // Add index for uniqueness
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
                          {driver.name?.split(' ')[0] || 'Driver'}
                        </div>
                      </div>
                    </div>
                  );
                })}

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
         

          {/* Driver Status Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Driver Status</h3>
            <div className="space-y-3">
              {drivers.map((driver, index) => {
                const driverId = driver.id || driver.$id || `driver-${index}`;
                return (
                  <div
                    key={driverId} // Use unique ID
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
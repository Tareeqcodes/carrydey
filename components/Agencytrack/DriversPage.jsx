import React from 'react';
import { Plus, Phone, MoreVertical, Wifi, Truck, WifiOff, Loader2 } from 'lucide-react';

const DriversPage = ({ 
  drivers, 
  loading,
  error,
  activeDeliveries, 
  onAddDriver, 
  onToggleStatus, 
  onAssignDelivery 
}) => {
  return (
    <div className="space-y-6 p-6 mb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">Manage your delivery fleet</h2>
        </div>
        <button
          onClick={onAddDriver}
          className="px-4 py-2 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Driver
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#3A0A21]" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">Error loading drivers: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && drivers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Truck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Drivers Yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first driver</p>
          <button
            onClick={onAddDriver}
            className="px-4 py-2 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add First Driver
          </button>
        </div>
      )}

      {/* Drivers Grid */}
      {!loading && !error && drivers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((driver) => (
            <div
              key={driver.$id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{driver.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {driver.phone}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      driver.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : driver.status === 'on_delivery'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {driver.status === 'available' ? (
                      <>
                        <Wifi className="w-3 h-3" />
                        Available
                      </>
                    ) : driver.status === 'on_delivery' ? (
                      <>
                        <Truck className="w-3 h-3" />
                        On Delivery
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3" />
                        Offline
                      </>
                    )}
                  </span>
                </div>
                
                {driver.vehicleType && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Vehicle Type</span>
                    <span className="font-medium capitalize">{driver.vehicleType}</span>
                  </div>
                )}

              
                {driver.assignedDelivery && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Assigned Delivery</span>
                    <span className="font-medium text-[#3A0A21]">
                      {driver.assignedDelivery}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onToggleStatus(driver.$id, driver.status)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                    driver.status === 'available'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  {driver.status === 'available' ? 'Set Offline' : 'Set Available'}
                </button>
                {driver.status === 'available' && (
                  <button
                    onClick={() => {
                      const pendingDelivery = activeDeliveries.find(
                        (d) => d.status === 'accepted'
                      );
                      if (pendingDelivery) {
                        onAssignDelivery(pendingDelivery);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-[#3A0A21] text-white rounded-xl text-sm hover:bg-[#4A0A31] transition-colors"
                  >
                    Assign Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriversPage;
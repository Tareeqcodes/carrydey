'use client';
import React from 'react';
import { Plus, Phone, MoreVertical, Wifi, Truck, WifiOff } from 'lucide-react';

const DriversPage = ({ 
  drivers, 
  activeDeliveries, 
  onAddDriver, 
  onToggleStatus, 
  onAssignDelivery 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-xl font-bold">Manage your delivery fleet</h2>
         
        </div>
        <button
          onClick={onAddDriver}
          className="px-4 py-2 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <div
            key={driver.id}
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
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Vehicle</span>
                <span className="font-medium">{driver.vehicle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Assigned Delivery</span>
                <span
                  className={`font-medium ${
                    driver.assignedDelivery ? 'text-[#3A0A21]' : 'text-gray-400'
                  }`}
                >
                  {driver.assignedDelivery || 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Today's Earnings</span>
                <span className="font-bold text-green-600">
                  ${driver.earningsToday.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Deliveries Today</span>
                <span className="font-medium">{driver.deliveriesToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Last Update</span>
                <span className="text-sm text-gray-600">{driver.lastUpdate}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onToggleStatus(driver.id)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  driver.status === 'available'
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {driver.status === 'available' ? 'Deactivate' : 'Activate'}
              </button>
              {driver.status === 'available' && (
                <button
                  onClick={() => {
                    const pendingDelivery = activeDeliveries.find(
                      (d) => d.status === 'pending_assignment'
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
    </div>
  );
};

export default DriversPage;
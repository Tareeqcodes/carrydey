'use client';
import React from 'react';
import { Navigation, Users, MapPin, Clock, Phone, MoreVertical, Truck } from 'lucide-react';

const ActiveDeliveriesPage = ({ 
  activeDeliveries, 
  onAssign, 
  onUpdateStatus, 
  onNavigateToTracking 
}) => {
  const pendingDeliveries = activeDeliveries.filter((d) => d.status === 'pending_assignment');
  const activeOnes = activeDeliveries.filter((d) => d.status !== 'pending_assignment');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Active Deliveries</h2>
          <p className="text-gray-500">Track and manage ongoing deliveries</p>
        </div>
        <button
          onClick={onNavigateToTracking}
          className="px-4 py-2 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Live Tracking Map
        </button>
      </div>

      {/* Pending Assignments */}
      {pendingDeliveries.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-yellow-800">
            Pending Assignments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white rounded-xl p-4 border border-yellow-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">Delivery #{delivery.id}</h4>
                    <p className="text-sm text-gray-500">
                      Waiting for driver assignment
                    </p>
                  </div>
                  <button
                    onClick={() => onAssign(delivery)}
                    className="px-4 py-2 bg-[#3A0A21] text-white rounded-xl text-sm hover:bg-[#4A0A31] transition-colors flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Assign Now
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Pickup:</span> {delivery.pickup}
                  </p>
                  <p>
                    <span className="font-medium">Dropoff:</span> {delivery.dropoff}
                  </p>
                  <p>
                    <span className="font-medium">Payout:</span> {delivery.payout}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Deliveries List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-6">All Active Deliveries</h3>
        <div className="space-y-4">
          {activeOnes.map((delivery) => (
            <div
              key={delivery.id}
              className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg">Delivery #{delivery.id}</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        delivery.status === 'assigned'
                          ? 'bg-yellow-100 text-yellow-800'
                          : delivery.status === 'pickup'
                          ? 'bg-blue-100 text-blue-800'
                          : delivery.status === 'in_transit'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {delivery.status === 'assigned'
                        ? 'Assigned'
                        : delivery.status === 'pickup'
                        ? 'Pickup in Progress'
                        : delivery.status === 'in_transit'
                        ? 'In Transit'
                        : 'Delivered'}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    <Truck className="w-4 h-4 inline mr-1" />
                    {delivery.driver}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Delivery Progress</span>
                  <span>{delivery.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3A0A21] rounded-full transition-all duration-300"
                    style={{ width: `${delivery.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-gray-500">Pickup</p>
                      <p>{delivery.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="text-gray-500">Dropoff</p>
                      <p>{delivery.dropoff}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Package Size</span>
                    <span className="font-medium">{delivery.packageSize}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Payout</span>
                    <span className="font-bold text-[#3A0A21]">{delivery.payout}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Pickup Code</span>
                    <span className="font-mono font-bold">{delivery.pickupCode}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {delivery.estimatedTime}
                  </p>
                </div>
                <div className="flex gap-2">
                  {delivery.status === 'assigned' && (
                    <button
                      onClick={() => onUpdateStatus(delivery.id, 'pickup')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors"
                    >
                      Mark as Pickup Started
                    </button>
                  )}
                  {delivery.status === 'pickup' && (
                    <button
                      onClick={() => onUpdateStatus(delivery.id, 'in_transit')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-700 transition-colors"
                    >
                      Mark as In Transit
                    </button>
                  )}
                  {delivery.status === 'in_transit' && (
                    <button
                      onClick={() => onUpdateStatus(delivery.id, 'delivered')}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition-colors"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Call Driver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveDeliveriesPage;
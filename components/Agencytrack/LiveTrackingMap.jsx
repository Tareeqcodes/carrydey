'use client';
import React from 'react';
import { Navigation, MapPin, Truck, Users } from 'lucide-react';

const LiveTrackingMap = ({ drivers, activeDeliveries, onViewFullMap }) => {
  const activeDrivers = drivers.filter(d => d.status === 'on_delivery');
  const availableDrivers = drivers.filter(d => d.status === 'available');
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Live Tracking</h3>
        <button 
          onClick={onViewFullMap}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          View Full Map
        </button>
      </div>
      
      <div className="bg-gray-100 rounded-xl h-64 relative overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100"></div>
        
        {/* Active Drivers on Map */}
        {activeDrivers.map((driver, index) => {
          const delivery = activeDeliveries.find(d => d.driverId === driver.$id);
          return (
            <div 
              key={driver.$id}
              className="absolute animate-pulse"
              style={{
                left: `${30 + index * 20}%`,
                top: `${40 + index * 15}%`
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white px-3 py-2 rounded-lg text-sm mt-2 shadow-lg">
                  <p className="font-medium truncate">{driver.name.split(' ')[0]}</p>
                  <p className="text-xs text-blue-600 font-medium">
                    {delivery ? `Delivery #${delivery.$id.slice(-4)}` : 'On Delivery'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Available Drivers */}
        {availableDrivers.map((driver, index) => (
          <div 
            key={driver.$id}
            className="absolute"
            style={{
              left: `${70 + index * 8}%`,
              top: `${20 + index * 12}%`
            }}
          >
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                {driver.name.split(' ')[0]}
              </div>
            </div>
          </div>
        ))}
        
        {/* Dropoff Points */}
        {activeDeliveries
          .filter(d => d.status === 'in_transit')
          .map((delivery, index) => (
            <div 
              key={delivery.$id}
              className="absolute"
              style={{
                left: `${60 + index * 10}%`,
                top: `${60 + index * 10}%`
              }}
            >
              <div className="flex flex-col items-center">
                <MapPin className="w-6 h-6 text-red-600 drop-shadow-lg" />
                <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                  Drop #{delivery.$id.slice(-4)}
                </div>
              </div>
            </div>
          ))}
        
        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <h4 className="font-medium mb-2 text-sm">Live Status</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>On Delivery: {activeDrivers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available: {availableDrivers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Active: {activeDeliveries.length}</span>
            </div>
          </div>
        </div>
        
        {/* Stats Overlay */}
        <div className="absolute top-4 right-4 bg-black/60 text-white rounded-xl p-3">
          <div className="text-center">
            <p className="text-2xl font-bold">{activeDrivers.length}</p>
            <p className="text-xs opacity-80">Active Now</p>
          </div>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-2xl font-bold text-blue-600">{activeDrivers.length}</p>
          <p className="text-sm text-gray-500">On Delivery</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-2xl font-bold text-green-600">{availableDrivers.length}</p>
          <p className="text-sm text-gray-500">Available</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-2xl font-bold text-[#3A0A21]">{activeDeliveries.length}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingMap;
'use client';
import React, { useState } from 'react';
import { X, Users, Truck, MapPin, DollarSign, Clock, AlertCircle } from 'lucide-react';

const AssignmentModal = ({ delivery, drivers, onClose, onAssign }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleAssign = async () => {
    if (!selectedDriver) return;
    
    setLoading(true);
    try {
      await onAssign(delivery.$id, selectedDriver);
      onClose();
    } catch (error) {
      console.error('Error assigning delivery:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Assign Delivery</h3>
              <p className="text-gray-500">Select driver for this delivery</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Delivery Details */}
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <h4 className="font-medium mb-3">Delivery Details</h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Pickup</p>
                  <p className="font-medium">{delivery.pickupAddress?.substring(0, 60)}...</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Dropoff</p>
                  <p className="font-medium">{delivery.dropoffAddress?.substring(0, 60)}...</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <p className="font-medium">{(delivery.distance / 1000).toFixed(1)} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payout</p>
                  <p className="font-bold text-[#3A0A21]">${delivery.offeredFare}</p>
                </div>
              </div>
              
              {delivery.pickupCode && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-700">
                      Pickup Code: <span className="font-bold">{delivery.pickupCode}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Available Drivers */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Available Drivers</h4>
              <span className="text-sm text-gray-500">
                {drivers.length} driver{drivers.length !== 1 ? 's' : ''} available
              </span>
            </div>
            
            {drivers.length > 0 ? (
              <div className="space-y-3">
                {drivers.map((driver) => (
                  <button
                    key={driver.$id}
                    onClick={() => setSelectedDriver(driver.$id)}
                    className={`w-full p-4 border rounded-xl text-left transition-colors ${
                      selectedDriver === driver.$id
                        ? 'border-[#3A0A21] bg-[#3A0A21] bg-opacity-5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            {driver.vehicle}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ${driver.earningsToday?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {driver.deliveriesToday} today
                        </span>
                        {selectedDriver === driver.$id && (
                          <div className="mt-2 text-[#3A0A21]">
                            <div className="w-5 h-5 border-2 border-[#3A0A21] rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-[#3A0A21] rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-gray-200 rounded-xl">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No drivers available</p>
                <p className="text-sm text-gray-400">All drivers are currently busy</p>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedDriver || loading}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                selectedDriver && !loading
                  ? 'bg-[#3A0A21] text-white hover:bg-[#2A0819]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Assigning...' : 'Assign Delivery'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
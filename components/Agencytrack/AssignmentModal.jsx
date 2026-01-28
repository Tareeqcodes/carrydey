'use client';
import React from 'react';
import { XCircle, MapPin, Package, User, CheckCircle, Users, Plus } from 'lucide-react';

const AssignmentModal = ({ 
  isOpen, 
  deliveryDetails, 
  drivers, 
  selectedDriver,
  onSelectDriver,
  onConfirm, 
  onCancel,
  onAddDriver 
}) => {
  if (!isOpen) return null;

  const availableDrivers = drivers.filter((d) => d.status === 'available');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Select available courier</h3>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <p className="font-medium mb-2">Delivery Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>Pickup: {deliveryDetails?.pickupAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>Dropoff: {deliveryDetails?.dropoffAddress}</span>
                </div>
                {deliveryDetails?.payout && (
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <span>Payout: {deliveryDetails.payout}</span>
                  </div>
                )}
                {deliveryDetails?.customerName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span>Customer: {deliveryDetails.customerName}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="font-medium mb-3">Assign courier:</p>
            <div className="space-y-3">
              {availableDrivers.map((driver) => (
                <button
                  key={driver.id}
                  onClick={() => onSelectDriver(driver.id)}
                  className={`w-full p-4 text-[#3A0A21] border rounded-xl text-left transition-colors ${
                    selectedDriver === driver.id
                      ? 'border-[#3A0A21] bg-[#3A0A21] text-white bg-opacity-5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-gray-400">{driver.vehicle}</p>
                      
                    </div>
                    {selectedDriver === driver.id && (
                      <CheckCircle className="w-5 h-5 text-[#3A0A21]" />
                    )}
                  </div>
                </button>
              ))}

              {availableDrivers.length === 0 && (
                <div className="text-center py-6 border border-gray-200 rounded-xl">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No available couriers</p>
                  <p className="text-sm text-gray-400 mt-1">
                    All drivers are currently busy
                  </p>
                  <button
                    onClick={onAddDriver}
                    className="mt-4 px-4 py-2 border border-[#3A0A21] text-[#3A0A21] rounded-xl hover:bg-[#3A0A21] hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add New courier
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!selectedDriver}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                selectedDriver
                  ? 'bg-[#3A0A21] text-white hover:bg-[#4A0A31]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Assign Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;